const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-hero-slideshow]').forEach((slideshow) => {
  const images = [...slideshow.querySelectorAll<HTMLImageElement>('.slideshow-photo')];
  const hero = slideshow.closest<HTMLElement>('.hero, .opening')!;
  let current = 0;
  let visible = false;
  let hovered = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const canPlay = () => visible && !document.hidden && !reducedMotion.matches && !hovered && !hero.contains(document.activeElement);

  const schedule = () => {
    clearTimeout(timer);
    if (!canPlay() || images.length < 2) return;
    timer = setTimeout(async () => {
      const next = (current + 1) % images.length;
      try {
        await images[next].decode();
        if (canPlay()) {
          images.forEach((image, index) => {
            image.classList.toggle('is-active', index === next);
            image.setAttribute('aria-hidden', String(index !== next));
          });
          current = next;
        }
      } catch { /* Keep the current photo if a later asset cannot load. */ }
      schedule();
    }, 6000);
  };

  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
  observer.observe(hero);
  hero.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } });
  hero.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  hero.addEventListener('focusin', schedule);
  hero.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
});
