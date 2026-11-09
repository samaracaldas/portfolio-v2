import { listen, type Cleanup } from './lifecycle';

/**
 * - `static`: prefers-reduced-motion. No Lenis, no WebGL, no physics, no reveals.
 * - `lite`:   touch / small / low-power devices. Light effects, fewer particles, no expensive shaders.
 * - `full`:   everything.
 */
export type MotionTier = 'static' | 'lite' | 'full';

export interface MotionPrefs {
  tier: MotionTier;
  reducedMotion: boolean;
  coarsePointer: boolean;
  smallScreen: boolean;
  lowPower: boolean;
}

const QUERIES = {
  reduced: '(prefers-reduced-motion: reduce)',
  coarse: '(pointer: coarse)',
  small: '(max-width: 47.99rem)',
} as const;

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function isLowPower(): boolean {
  const nav = navigator as Navigator & NavigatorHints;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const saveData = nav.connection?.saveData === true;
  return saveData || (fewCores && lowMemory);
}

export function getMotionPrefs(): MotionPrefs {
  const reducedMotion = matchMedia(QUERIES.reduced).matches;
  const coarsePointer = matchMedia(QUERIES.coarse).matches;
  const smallScreen = matchMedia(QUERIES.small).matches;
  const lowPower = isLowPower();

  let tier: MotionTier = 'full';
  if (reducedMotion) tier = 'static';
  else if (coarsePointer || smallScreen || lowPower) tier = 'lite';

  // Dev only: force a tier with ?motion=static|lite|full to test fallbacks.
  if (import.meta.env.DEV) {
    const forced = new URLSearchParams(location.search).get('motion');
    if (forced === 'static' || forced === 'lite' || forced === 'full') tier = forced;
  }

  return { tier, reducedMotion, coarsePointer, smallScreen, lowPower };
}

/** Fires when the user toggles reduced motion at the OS level while the page is open. */
export function onReducedMotionChange(callback: (reduced: boolean) => void): Cleanup {
  const mql = matchMedia(QUERIES.reduced);
  return listen(mql, 'change', (event) => callback((event as MediaQueryListEvent).matches));
}
