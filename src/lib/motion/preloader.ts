import { gsap } from './gsap';
import { getLenis } from './lenis';

let resolveDone: () => void = () => {};

/** Resolves when the preloader has left the screen (or was never shown). */
export const preloaderDone = new Promise<void>((resolve) => {
  resolveDone = resolve;
});

const MAX_WAIT_MS = 3500;

function pageReady(): Promise<void> {
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  return Promise.race([Promise.all([loaded, document.fonts.ready]).then(() => undefined), timeout]);
}

/**
 * Counts 0 → 90 while the page loads, waits for fonts + load (capped),
 * finishes to 100, prints "build complete" and wipes upward.
 */
export async function runPreloader(): Promise<void> {
  const el = document.querySelector<HTMLElement>('[data-preloader]');
  if (!el || getComputedStyle(el).display === 'none') {
    el?.remove();
    resolveDone();
    return;
  }

  const count = el.querySelector<HTMLElement>('[data-preloader-count]');
  const fill = el.querySelector<HTMLElement>('[data-preloader-fill]');
  const done = el.querySelector<HTMLElement>('[data-preloader-done]');
  const lines = [...el.querySelectorAll<HTMLElement>('[data-preloader-line]')];
  const progress = { value: 0 };

  const render = () => {
    const v = Math.round(progress.value);
    if (count) count.textContent = String(v);
    if (fill) fill.style.transform = `scaleX(${progress.value / 100})`;
    lines.forEach((line, i) => line.classList.toggle('is-done', v >= (i / lines.length) * 90));
  };

  getLenis()?.stop();
  try {
    await Promise.all([
      gsap.to(progress, { value: 90, duration: 1.3, ease: 'power2.inOut', onUpdate: render }).then(),
      pageReady(),
    ]);
    await gsap.to(progress, { value: 100, duration: 0.35, ease: 'power1.out', onUpdate: render }).then();
    if (done) await gsap.to(done, { opacity: 1, duration: 0.2 }).then();
    await gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'power4.inOut', delay: 0.25 }).then();
  } finally {
    el.remove();
    getLenis()?.start();
    resolveDone();
  }
}

/** Called when the preloader is skipped (reduced motion, language switch). */
export function skipPreloader(): void {
  document.querySelector('[data-preloader]')?.remove();
  resolveDone();
}
