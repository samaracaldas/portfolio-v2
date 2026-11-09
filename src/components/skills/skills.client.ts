import { debounce, type Feature } from '@/lib/motion/lazy';
import { createScope, listen, type Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';

const MATCH_CLASS = 'is-skill-match';

/**
 * Hover (or focus) a skill: light up the projects/experiences that use it
 * and show them in the readout. Works in every motion tier.
 */
function initHighlight(root: HTMLElement): Cleanup {
  const readout = root.querySelector<HTMLElement>('[data-skills-readout-value]');
  const defaultText = readout?.textContent ?? '';
  let current: HTMLElement | null = null;
  let matches: Element[] = [];

  const clear = () => {
    matches.forEach((el) => el.classList.remove(MATCH_CLASS));
    matches = [];
    current?.classList.remove('is-active');
    current = null;
    if (readout) readout.textContent = defaultText;
  };

  const show = (tag: HTMLElement) => {
    if (tag === current) return;
    clear();
    current = tag;
    tag.classList.add('is-active');
    const ids = (tag.dataset.usedIn ?? '').split(' ').filter(Boolean);
    matches = ids.flatMap((id) => [...document.querySelectorAll(`[data-project="${id}"], [data-experience="${id}"]`)]);
    matches.forEach((el) => el.classList.add(MATCH_CLASS));
    if (readout) readout.textContent = tag.dataset.usedInLabel ?? '';
  };

  const tagFrom = (event: Event) => (event.target as Element | null)?.closest<HTMLElement>('[data-skill]') ?? null;

  const onOver = (event: Event) => {
    const tag = tagFrom(event);
    if (tag) show(tag);
  };
  const onOut = (event: Event) => {
    const related = (event as PointerEvent | FocusEvent).relatedTarget as Element | null;
    if (!related?.closest('[data-skill]')) clear();
  };

  const removers = [
    listen(root, 'pointerover', onOver),
    listen(root, 'pointerout', onOut),
    listen(root, 'focusin', onOver),
    listen(root, 'focusout', onOut),
  ];
  return () => {
    removers.forEach((remove) => remove());
    clear();
  };
}

/** Turns the grouped lists into a physics pit. Not used under reduced motion. */
async function initPhysics(root: HTMLElement, isDisposed: () => boolean): Promise<Cleanup> {
  const pit = root.querySelector<HTMLElement>('[data-skills-pit]');
  if (!pit) return () => {};

  const { createTagWorld } = await import('@/lib/physics/tag-world');
  if (isDisposed()) return () => {};

  const tags = [...pit.querySelectorAll<HTMLElement>('[data-skill]')];
  pit.classList.add('is-physics'); // switch layout first so tags are measured at their physics size
  const world = createTagWorld(pit, tags);

  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.12) world.drop();
      world.setActive(entry.isIntersecting);
    },
    { threshold: [0, 0.12] },
  );
  visibility.observe(pit);

  const onResize = debounce(() => world.resize(), 150);
  const resizer = new ResizeObserver(onResize);
  resizer.observe(pit);

  return () => {
    visibility.disconnect();
    resizer.disconnect();
    onResize.cancel();
    world.destroy();
    pit.classList.remove('is-physics');
  };
}

export function mount(root: HTMLElement, prefs: MotionPrefs): Cleanup {
  const scope = createScope();
  let disposed = false;

  scope.add(initHighlight(root));

  if (prefs.tier !== 'static') {
    void initPhysics(root, () => disposed).then((cleanup) => {
      if (disposed) cleanup();
      else scope.add(cleanup);
    });
  }

  return () => {
    disposed = true;
    scope.destroy();
  };
}

export default { mount } satisfies Feature;
