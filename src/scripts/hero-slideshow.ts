const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-hero-slideshow]').forEach((slideshow) => {
  const images = [...slideshow.querySelectorAll<HTMLImageElement>('.slideshow-photo')];
  const hero = slideshow.closest<HTMLElement>('.hero, .opening')!;
  let current = 0;
  let visible = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const canPlay = () => visible && !document.hidden && !reducedMotion.matches;

  const schedule = () => {
    clearTimeout(timer);
    if (!canPlay() || images.length < 2) return;
    const next = (current + 1) % images.length;
    // Prepare the next photo during the display interval, rather than after it.
    images[next].loading = 'eager';
    const ready = images[next].decode().then(() => true, () => false);
    timer = setTimeout(async () => {
      if (await ready && canPlay()) {
        images.forEach((image, index) => {
          image.classList.toggle('is-active', index === next);
          image.setAttribute('aria-hidden', String(index !== next));
        });
        current = next;
      }
      schedule();
    }, 6000);
  };

  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
  observer.observe(hero);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
});
