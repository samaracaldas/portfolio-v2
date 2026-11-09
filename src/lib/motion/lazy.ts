import type { Cleanup } from './lifecycle';
import type { MotionPrefs } from './prefers';

/** Contract every lazy-loaded section feature implements. */
export interface Feature {
  mount(root: HTMLElement, prefs: MotionPrefs): Cleanup;
}

/**
 * Loads and mounts a feature only when its root element gets near the
 * viewport, so heavy code (physics, WebGL...) never blocks first paint.
 * Returns a cleanup that also cancels a load still in flight.
 */
export function mountWhenNear(
  selector: string,
  load: () => Promise<Feature>,
  prefs: MotionPrefs,
  rootMargin = '100% 0px',
): Cleanup {
  const root = document.querySelector<HTMLElement>(selector);
  if (!root) return () => {};

  let disposed = false;
  let unmount: Cleanup | undefined;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      load()
        .then((feature) => {
          if (!disposed) unmount = feature.mount(root, prefs);
        })
        .catch((error: unknown) => console.error(`[motion] failed to load ${selector}`, error));
    },
    { rootMargin },
  );
  observer.observe(root);

  return () => {
    disposed = true;
    observer.disconnect();
    unmount?.();
  };
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
