import { gsap, ScrollTrigger } from './gsap';
import type { Cleanup } from './lifecycle';

/**
 * Fades `[data-reveal]` elements in as they scroll into view.
 * Elements already on screen at load are left untouched, so there is never a
 * flash of hidden content, and nothing is hidden by CSS before JS runs.
 * Opacity only (never visibility): hidden-until-scrolled content must stay in
 * the accessibility tree, or screen-reader users lose headings and text.
 */
export function initReveals(root: ParentNode = document): Cleanup {
  const ctx = gsap.context(() => {
    const targets = gsap.utils
      .toArray<HTMLElement>(root.querySelectorAll('[data-reveal]'))
      .filter((el) => !ScrollTrigger.isInViewport(el, 0.05));

    if (targets.length === 0) return;

    gsap.set(targets, { opacity: 0, y: 24 });
    ScrollTrigger.batch(targets, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, overwrite: true }),
    });
  });

  return () => ctx.revert();
}
