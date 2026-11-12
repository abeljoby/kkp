const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hoverAvailable = window.matchMedia('(hover: hover) and (pointer: fine)');
const cards = [...document.querySelectorAll<HTMLElement>('.interactive-company')];
const states = new Map<HTMLElement, { pinned: boolean; hovered: boolean; suppressFocus: boolean }>();

function setExpanded(card: HTMLElement, expanded: boolean) {
  card.classList.toggle('is-expanded', expanded);
  if (card instanceof HTMLDetailsElement) card.open = expanded;
  else {
    const reveal = card.querySelector<HTMLElement>('.company-reveal');
    if (reveal) reveal.hidden = !expanded;
    card.querySelector('[data-company-toggle]')?.setAttribute('aria-expanded', String(expanded));
  }
}

function pinCompany(card: HTMLElement, focus = true) {
  const shell = card.closest('.site-shell');
  cards.forEach((other) => {
    if (other !== card && other.closest('.site-shell') === shell) {
      states.get(other)!.pinned = false;
      setExpanded(other, false);
    }
  });
  states.get(card)!.pinned = true;
  setExpanded(card, true);
  if (focus) card.querySelector<HTMLElement>('[data-company-toggle]')?.focus({ preventScroll: true });
}

cards.forEach((card) => {
  const state = { pinned: card instanceof HTMLDetailsElement && card.open, hovered: false, suppressFocus: false };
  states.set(card, state);
  const toggle = card.querySelector<HTMLElement>('[data-company-toggle]');
  card.addEventListener('pointerenter', () => {
    if (!hoverAvailable.matches) return;
    state.hovered = true;
    setExpanded(card, true);
  });
  card.addEventListener('pointerleave', () => {
    state.hovered = false;
    if (!state.pinned && !card.contains(document.activeElement)) setExpanded(card, false);
  });
  card.addEventListener('focusin', () => {
    if (!state.suppressFocus) setExpanded(card, true);
  });
  card.addEventListener('focusout', (event) => {
    if (!card.contains(event.relatedTarget as Node | null) && !state.pinned && !state.hovered) setExpanded(card, false);
  });
  toggle?.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.pinned) {
      state.pinned = false;
      setExpanded(card, false);
    } else pinCompany(card, false);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
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
  pinCompany(target);
  history.replaceState(null, '', link.hash);
  // Wait until the newly expanded card has its final height before scrolling.
  requestAnimationFrame(() => target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' }));
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
