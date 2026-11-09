export type Cleanup = () => void;

/**
 * Collects cleanup callbacks (GSAP contexts, ScrollTriggers, Three.js disposal,
 * listeners...) so a feature can be torn down in one call, in reverse order.
 */
export interface Scope {
  add(cleanup: Cleanup | undefined | void): void;
  destroy(): void;
}

export function createScope(): Scope {
  const cleanups: Cleanup[] = [];
  return {
    add(cleanup) {
      if (cleanup) cleanups.push(cleanup);
    },
    destroy() {
      while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        try {
          cleanup?.();
        } catch (error) {
          console.error('[motion] cleanup failed', error);
        }
      }
    },
  };
}

/** Adds an event listener and returns its remover. */
export function listen<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Cleanup;
export function listen(
  target: EventTarget,
  type: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
): Cleanup;
export function listen(
  target: EventTarget,
  type: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
): Cleanup {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * Runs `cleanup` before Astro swaps the document (View Transitions), so nothing
 * leaks across client-side navigations. Harmless on full page loads.
 */
export function onPageTeardown(cleanup: Cleanup): Cleanup {
  return listen(document, 'astro:before-swap', () => cleanup(), { once: true });
}
