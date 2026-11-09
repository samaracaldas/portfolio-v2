import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import type { Cleanup } from './lifecycle';

let instance: Lenis | null = null;

/** The active Lenis instance, or null when smooth scroll is off (reduced motion). */
export function getLenis(): Lenis | null {
  return instance;
}

function headerOffset(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  return -(parseFloat(value) || 4) * 16;
}

/**
 * Lenis driven by GSAP's ticker (single RAF loop) and feeding ScrollTrigger,
 * so pinned/scrubbed animations stay in sync with the smoothed scroll.
 */
export function startSmoothScroll(): Cleanup {
  if (instance) return stopSmoothScroll;

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    anchors: { offset: headerOffset() },
  });
  instance = lenis;

  const onScroll = () => ScrollTrigger.update();
  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', onScroll);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return stopSmoothScroll;

  function stopSmoothScroll() {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.off('scroll', onScroll);
    lenis.destroy();
    if (instance === lenis) instance = null;
  }
}
