import { debounce, type Feature } from '@/lib/motion/lazy';
import type { Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';
import { mountHeroName } from './hero-name';

/* ------------------------------------------------------------------ */

export function mount(hero: HTMLElement, prefs: MotionPrefs): Cleanup {
  // Reduced motion: no WebGL and no name animation, the HTML heading stays.
  const { tier } = prefs;
  if (tier === 'static') return () => {};

  const stage = hero.querySelector<HTMLElement>('[data-hero-stage]');
  const nameEl = hero.querySelector<HTMLElement>('[data-hero-name]');
  if (!stage || !nameEl) return () => {};

  // The name: HTML + GSAP only (compile intro + variable-weight hover).
  const unmountName = mountHeroName(hero, nameEl);

  let disposed = false;
  let unbuild: Cleanup | null = null;
  let generation = 0;
  let lastWidth = 0;

  const rebuild = async (playIntro: boolean) => {
    const id = ++generation;
    unbuild?.();
    unbuild = null;
    const { build, TIERS } = await import('./hero-particles');
    if (disposed || id !== generation) return;
    const cleanup = await build({
      hero,
      stage,
      config: TIERS[tier],
      playIntro,
      isDisposed: () => disposed || id !== generation,
    });
    if (disposed || id !== generation) cleanup();
    else unbuild = cleanup;
  };

  // Redistribute the dust when the width changes.
  const onResize = debounce(() => {
    if (stage.clientWidth === lastWidth) return;
    lastWidth = stage.clientWidth;
    void rebuild(false);
  }, 200);
  const observer = new ResizeObserver(onResize);

  const fontsReady = Promise.all([
    document.fonts.load('700 100px "Geist Variable"'),
    document.fonts.load('600 46px "Geist Mono Variable"'),
  ]).then(() => document.fonts.ready);

  // Wait for fonts, then for an idle moment so WebGL setup never competes
  // with first paint / input.
  const idle = () =>
    new Promise<void>((resolve) =>
      'requestIdleCallback' in window ? requestIdleCallback(() => resolve(), { timeout: 900 }) : setTimeout(resolve, 200),
    );

  void fontsReady.then(idle).then(async () => {
    if (disposed) return;
    lastWidth = stage.clientWidth;
    await rebuild(true);
    if (!disposed) observer.observe(stage);
  });

  return () => {
    disposed = true;
    unmountName();
    onResize.cancel();
    observer.disconnect();
    unbuild?.();
    unbuild = null;
  };
}

export default { mount } satisfies Feature;
