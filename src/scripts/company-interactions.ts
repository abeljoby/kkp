const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hoverAvailable = window.matchMedia('(hover: hover) and (pointer: fine)');
const cards = [...document.querySelectorAll<HTMLElement>('.interactive-company')];
const states = new Map<HTMLElement, {
  pinned: boolean; hovered: boolean; suppressFocus: boolean;
  hoverTimer?: ReturnType<typeof setTimeout>;
}>();
let companyNavigation: AbortController | undefined;

function cancelCompanyNavigation() {
  companyNavigation?.abort();
  companyNavigation = undefined;
}

function waitForCompanyArrival(signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    let frame: number;
    let lastX = window.scrollX;
    let lastY = window.scrollY;
    let lastMovement = performance.now();
    const finish = (arrived: boolean) => {
      cancelAnimationFrame(frame);
      signal.removeEventListener('abort', onAbort);
      resolve(arrived);
    };
    const onAbort = () => finish(false);
    const check = (now: number) => {
      if (window.scrollX !== lastX || window.scrollY !== lastY) {
        lastX = window.scrollX;
        lastY = window.scrollY;
        lastMovement = now;
      }
      // Allow scrolling to settle for 120ms, then pause for 60ms before revealing.
      if (now - lastMovement >= 180) finish(true);
      else frame = requestAnimationFrame(check);
    };
    signal.addEventListener('abort', onAbort, { once: true });
    frame = requestAnimationFrame(check);
  });
}

function setExpanded(card: HTMLElement, expanded: boolean): Promise<void> {
  card.classList.toggle('is-expanded', expanded);
  const reveal = card.querySelector<HTMLElement>('.company-reveal');
  if (reveal) {
    reveal.inert = !expanded;
    reveal.setAttribute('aria-hidden', String(!expanded));
  }
  card.querySelector('[data-company-toggle]')?.setAttribute('aria-expanded', String(expanded));
  return Promise.resolve();
}

function pinCompany(card: HTMLElement, focus = true): Promise<void> {
  cancelCompanyNavigation();
  const shell = card.closest('.site-shell');
  const changes: Promise<void>[] = [];
  cards.forEach((other) => {
    if (other !== card && other.closest('.site-shell') === shell) {
      const state = states.get(other)!;
      clearTimeout(state.hoverTimer);
      state.pinned = false;
      changes.push(setExpanded(other, false));
    }
  });
  const state = states.get(card)!;
  clearTimeout(state.hoverTimer);
  state.pinned = true;
  changes.push(setExpanded(card, true));
  if (focus) card.querySelector<HTMLElement>('[data-company-toggle]')?.focus({ preventScroll: true });
  return Promise.all(changes).then(() => {});
}

cards.forEach((card) => {
  const state: NonNullable<ReturnType<typeof states.get>> = { pinned: card instanceof HTMLDetailsElement && card.open, hovered: false, suppressFocus: false };
  // Measure the hidden portion once per layout change, never on hover.
  const reveal = card.querySelector<HTMLElement>('.company-reveal')!;
  const panel = card.querySelector<HTMLElement>('.company-panel')!;
  const measure = () => {
    if (!card.getClientRects().length) return;
    card.style.setProperty('--company-reveal-height', `${reveal.getBoundingClientRect().height}px`);
    card.style.setProperty('--company-panel-height', `${panel.offsetHeight + 48}px`);
  };
  measure();
  new ResizeObserver(measure).observe(panel);
  card.classList.add('lift-ready');
  setExpanded(card, state.pinned);
  states.set(card, state);
  const toggle = card.querySelector<HTMLElement>('[data-company-toggle]');
  card.addEventListener('pointerenter', () => {
    if (!hoverAvailable.matches) return;
    state.hovered = true;
    if (companyNavigation) return;
    clearTimeout(state.hoverTimer);
    state.hoverTimer = setTimeout(() => setExpanded(card, true), 60);
  });
  card.addEventListener('pointerleave', () => {
    state.hovered = false;
    clearTimeout(state.hoverTimer);
    if (companyNavigation) return;
    state.hoverTimer = setTimeout(() => {
      if (!state.pinned && !card.contains(document.activeElement)) setExpanded(card, false);
    }, 160);
  });
  card.addEventListener('focusin', () => {
    clearTimeout(state.hoverTimer);
    if (!state.suppressFocus && !companyNavigation) setExpanded(card, true);
  });
  card.addEventListener('focusout', (event) => {
    if (!card.contains(event.relatedTarget as Node | null) && !state.pinned && !state.hovered) setExpanded(card, false);
  });
  toggle?.addEventListener('click', (event) => {
    event.preventDefault();
    cancelCompanyNavigation();
    clearTimeout(state.hoverTimer);
    if (state.pinned) {
      state.pinned = false;
      setExpanded(card, false);
    } else pinCompany(card, false);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    cancelCompanyNavigation();
    clearTimeout(state.hoverTimer);
    state.pinned = false;
    state.suppressFocus = true;
    toggle?.focus({ preventScroll: true });
    setExpanded(card, false);
    state.suppressFocus = false;
  });
});

// Handles both the moving strip and the requirement explorer's company links.
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target?.matches('.interactive-company')) return;
  event.preventDefault();
  cancelCompanyNavigation();
  const navigation = new AbortController();
  companyNavigation = navigation;
  const { signal } = navigation;
  cards.forEach((card) => {
    clearTimeout(states.get(card)!.hoverTimer);
    if (card.closest('.site-shell') === target.closest('.site-shell')) {
      states.get(card)!.pinned = false;
      setExpanded(card, false);
    }
  });
  // New input cancels the pending reveal instead of opening a card later unexpectedly.
  document.addEventListener('pointerdown', cancelCompanyNavigation, { capture: true, signal });
  document.addEventListener('keydown', cancelCompanyNavigation, { capture: true, signal });
  document.addEventListener('wheel', cancelCompanyNavigation, { passive: true, signal });
  document.addEventListener('touchstart', cancelCompanyNavigation, { passive: true, signal });
  history.replaceState(null, '', link.hash);
  target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
  void waitForCompanyArrival(signal).then((arrived) => {
    if (!arrived || companyNavigation !== navigation) return;
    cancelCompanyNavigation();
    if (target.getClientRects().length) pinCompany(target);
  });
});

function openHashCompany() {
  const card = document.getElementById(location.hash.slice(1));
  if (card?.matches('.interactive-company') && card.getClientRects().length) pinCompany(card, false);
}
window.addEventListener('hashchange', openHashCompany);
openHashCompany();

document.querySelectorAll<HTMLElement>('[data-service-strip]').forEach((strip) => {
  const viewport = strip.querySelector<HTMLElement>('.service-viewport');
  strip.classList.add('is-enhanced');
  // Keyboard navigation switches to an ordinary scrollable row with no duplicate links.
  strip.querySelector('.service-track')?.addEventListener('focusin', (event) => {
    const link = (event.target as Element).closest<HTMLElement>('[data-service-link]');
    if (link && viewport && link.matches(':focus-visible')) requestAnimationFrame(() => {
      const rect = link.getBoundingClientRect();
      const bounds = viewport.getBoundingClientRect();
      if (rect.left < bounds.left) viewport.scrollLeft -= bounds.left - rect.left + 12;
      else if (rect.right > bounds.right) viewport.scrollLeft += rect.right - bounds.right + 12;
    });
  });
  strip.querySelector('.service-track')?.addEventListener('focusout', (event) => {
    if (!strip.querySelector('.service-track')?.contains(event.relatedTarget as Node | null) && viewport) viewport.scrollLeft = 0;
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => strip.classList.toggle('is-offscreen', !entry.isIntersecting));
    observer.observe(strip);
  }
});

const dialog = document.querySelector<HTMLDialogElement>('.company-preview');
const previewContent = dialog?.querySelector<HTMLElement>('.preview-content');
let previewTrigger: HTMLButtonElement | null = null;
document.querySelectorAll<HTMLButtonElement>('[data-view-company]').forEach((button) => {
  button.addEventListener('click', () => {
    const template = document.querySelector<HTMLTemplateElement>(`template[data-company-preview="${button.dataset.viewCompany}"]`);
    const shell = button.closest<HTMLElement>('.site-shell');
    if (!dialog || !previewContent || !template || !shell) return;
    previewContent.replaceChildren(template.content.cloneNode(true));
    previewTrigger = button;
    const card = button.closest<HTMLElement>('.interactive-company');
    if (card) pinCompany(card, false);
    dialog.dataset.design = shell.classList.contains('hybrid-shell') ? 'heritage' : shell.dataset.design;
    dialog.showModal();
  });
});
dialog?.querySelector('.preview-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => previewTrigger?.focus({ preventScroll: true }));
