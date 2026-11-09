import { ScrollTrigger } from './gsap';
import { initLangSwitch, restoreScroll } from './lang-switch';
import { mountWhenNear } from './lazy';
import { startSmoothScroll } from './lenis';
import { createScope, onPageTeardown, type Scope } from './lifecycle';
import { getMotionPrefs, onReducedMotionChange, type MotionPrefs } from './prefers';
import { initReveals } from './reveal';

export { getMotionPrefs, type MotionPrefs } from './prefers';

let current: Scope | null = null;
let restored = false;

function start(prefs: MotionPrefs): Scope {
  const scope = createScope();
  document.documentElement.dataset.motion = prefs.tier;

  if (prefs.tier !== 'static') {
    scope.add(startSmoothScroll());
    scope.add(initReveals());
  }
  scope.add(initLangSwitch(prefs));

  // Section features get the prefs and decide themselves how much to do
  // (e.g. the git graph is drawn statically under reduced motion).
  scope.add(mountWhenNear('[data-hero]', () => import('@/components/hero/hero.client'), prefs));
  scope.add(mountWhenNear('[data-projects]', () => import('@/components/projects/projects.client'), prefs));
  scope.add(mountWhenNear('[data-git-graph]', () => import('@/components/experience/git-graph.client'), prefs));
  scope.add(mountWhenNear('[data-ai]', () => import('@/components/ai/ai.client'), prefs));
  scope.add(mountWhenNear('[data-approval]', () => import('@/components/approval/approval.client'), prefs));
  scope.add(mountWhenNear('[data-contact]', () => import('@/components/contact/terminal.client'), prefs));
  scope.add(mountWhenNear('[data-skills]', () => import('@/components/skills/skills.client'), prefs));

  ScrollTrigger.refresh();
  return scope;
}

/** Entry point, called once per page from BaseLayout. */
export function boot(): void {
  current?.destroy();
  const prefs = getMotionPrefs();
  current = start(prefs);

  // Once per page load: after a language switch, jump back to where the visitor was.
  if (!restored) {
    restored = true;
    restoreScroll();
  }

  // If the OS setting flips while the page is open, rebuild with the new tier.
  const stopWatching = onReducedMotionChange(() => {
    current?.destroy();
    current = start(getMotionPrefs());
  });

  onPageTeardown(() => {
    stopWatching();
    current?.destroy();
    current = null;
  });
}
