import { environments } from '../data/environments';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-environment-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-environment-slide]')];
  const choices = [...carousel.querySelectorAll<HTMLButtonElement>('[data-environment-choice]')];
  const playback = carousel.querySelector<HTMLButtonElement>('[data-environment-playback]')!;
  const status = carousel.querySelector<HTMLElement>('.environment-status')!;
  let current = 0;
  let visible = false;
  let paused = false;
  let moving = false;
  let queued: { index: number; manual: boolean } | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let scheduleVersion = 0;
  let finishTimer: ReturnType<typeof setTimeout> | undefined;
  const canPlay = () => visible && !paused && !document.hidden && !reducedMotion.matches && !choices.some((choice) => choice === document.activeElement);

  const schedule = () => {
    const version = ++scheduleVersion;
    clearTimeout(timer);
    carousel.classList.remove('is-playing');
    if (!canPlay()) return;
    void carousel.offsetWidth;
    carousel.classList.add('is-playing');
    const next = (current + 1) % slides.length;
    const image = slides[next].querySelector('img')!;
    image.loading = 'eager';
    const ready = image.decode().then(() => true, () => false);
    timer = setTimeout(async () => {
      const loaded = await ready;
      if (version !== scheduleVersion) return;
      if (loaded && canPlay()) showSlide(next);
      else schedule();
    }, 6000);
  };

  const showSlide = (index: number, manual = false) => {
    if (moving) { queued = { index, manual }; return; }
    if (index === current) { schedule(); return; }
    clearTimeout(timer);
    carousel.classList.remove('is-playing');
    const previous = slides[current];
    slides.forEach((slide) => slide.classList.remove('is-exiting'));
    previous.classList.remove('is-active');
    previous.classList.add('is-exiting');
    previous.setAttribute('aria-hidden', 'true');
    slides[index].classList.add('is-active');
    slides[index].removeAttribute('aria-hidden');
    current = index;
    choices.forEach((choice, i) => {
      choice.setAttribute('aria-selected', String(i === current));
      choice.tabIndex = i === current ? 0 : -1;
    });
    if (manual) status.textContent = `${environments[index].name}: ${environments[index].detail}`;
    moving = true;
    clearTimeout(finishTimer);
    finishTimer = setTimeout(() => {
      previous.classList.remove('is-exiting');
      moving = false;
      if (queued) {
        const next = queued;
        queued = undefined;
        showSlide(next.index, next.manual);
      }
    }, reducedMotion.matches ? 0 : 700);
    schedule();
  };

  choices.forEach((choice, index) => {
    choice.disabled = false;
    choice.addEventListener('click', () => showSlide(index, true));
    choice.addEventListener('keydown', (event) => {
      let next: number;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % choices.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + choices.length) % choices.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = choices.length - 1;
      else return;
      event.preventDefault();
      choices[next].focus({ preventScroll: true });
      showSlide(next, true);
    });
  });
  playback.hidden = reducedMotion.matches;
  playback.addEventListener('click', () => {
    paused = !paused;
    playback.textContent = paused ? 'Play' : 'Pause';
    playback.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} environment slideshow`);
    schedule();
  });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { playback.hidden = reducedMotion.matches; schedule(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .15 }).observe(carousel);
  carousel.classList.add('is-enhanced');
});
