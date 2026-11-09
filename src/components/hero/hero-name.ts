import { SplitText } from 'gsap/SplitText';
import { gsap } from '@/lib/motion/gsap';
import { createScope, listen, type Cleanup } from '@/lib/motion/lifecycle';
import { preloaderDone } from '@/lib/motion/preloader';

gsap.registerPlugin(SplitText);

/**
 * The hero name, in two acts (HTML + GSAP, no WebGL):
 *
 * 1. Decode intro: every letter starts as a code character ({ } ; 0 1 …),
 *    cycles, and locks into the right letter from left to right.
 * 2. Variable weight: Geist is a variable font, so letters near the pointer
 *    get bolder and the far ones thinner. Fine pointers only.
 *
 * The letters are split once and shared by both acts. Screen readers get a
 * visually-hidden copy of the name; the split letters are hidden from them.
 */

const GLYPHS = '{}[]<>/;=_01*+';
const FIRST_LOCK_MS = 250;
const LOCK_STEP_MS = 70;
/** How long before locking a glyph turns from grey to the accent colour. */
const HEAT_MS = 200;
const REST_WEIGHT = 700;
const MIN_WEIGHT = 380;
const MAX_WEIGHT = 900;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '0';

/* ------------------------------------------------------------------ */
/* Act 1: decode                                                       */
/* ------------------------------------------------------------------ */

interface Decoder {
  play(): Promise<void>;
  cleanup: Cleanup;
}

function createDecoder(chars: HTMLElement[]): Decoder {
  const finals = chars.map((c) => c.textContent ?? '');
  const letters = chars.filter((_, i) => (finals[i] ?? '').trim() !== '');

  // Lock each letter's width to its final glyph, so the name never jitters
  // while narrower/wider code characters cycle through.
  chars.forEach((c) => {
    c.style.width = `${c.getBoundingClientRect().width}px`;
    c.style.textAlign = 'center';
  });

  const scramble = (c: HTMLElement, heat: boolean) => {
    c.textContent = randomGlyph();
    c.style.color = heat ? 'var(--c-accent)' : 'var(--c-faint)';
  };
  // Initial state (behind the preloader): pure code.
  letters.forEach((c) => scramble(c, false));

  let lastSwap = 0;
  const total = FIRST_LOCK_MS + letters.length * LOCK_STEP_MS;
  const state = { t: 0 };
  let tween: gsap.core.Tween | null = null;

  const restore = () => {
    chars.forEach((c, i) => {
      c.textContent = finals[i] ?? '';
      c.style.color = '';
      c.style.width = '';
      c.style.textAlign = '';
    });
  };

  return {
    play: () =>
      new Promise<void>((resolve) => {
        tween = gsap.to(state, {
          t: total,
          duration: total / 1000,
          ease: 'none',
          onUpdate: () => {
            // Swap glyphs at ~22 fps: fast enough to read as "decoding", not a blur.
            const now = performance.now();
            const swap = now - lastSwap > 45;
            if (swap) lastSwap = now;
            letters.forEach((c, i) => {
              const lockAt = FIRST_LOCK_MS + i * LOCK_STEP_MS;
              if (state.t >= lockAt) {
                if (c.style.color) {
                  c.textContent = finals[chars.indexOf(c)] ?? '';
                  c.style.color = '';
                }
              } else if (swap) {
                scramble(c, state.t > lockAt - HEAT_MS);
              }
            });
          },
          onComplete: () => {
            restore();
            resolve();
          },
        });
      }),
    cleanup: () => {
      tween?.kill();
      restore();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Act 2: variable weight follows the pointer                          */
/* ------------------------------------------------------------------ */

function initWeightHover(hero: HTMLElement, chars: HTMLElement[]): Cleanup {
  if (!matchMedia('(pointer: fine)').matches) return () => {};

  const scope = createScope();
  const setters = chars.map((c) => gsap.quickTo(c, 'fontWeight', { duration: 0.45, ease: 'power3.out' }));
  let pointer: { x: number; y: number } | null = null;
  let active = false;

  const tick = () => {
    if (!pointer) return;
    const radius = gsap.utils.clamp(140, 280, window.innerWidth * 0.17);
    const { x, y } = pointer;
    chars.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const t = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
      setters[i]?.(MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * t);
    });
    pointer = null; // only recompute when the pointer moves again
  };
  gsap.ticker.add(tick);

  const rest = () => setters.forEach((set) => set(REST_WEIGHT));
  const onMove = (event: PointerEvent) => {
    const rect = hero.getBoundingClientRect();
    if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
      active = true;
      pointer = { x: event.clientX, y: event.clientY };
    } else if (active) {
      active = false;
      rest();
    }
  };

  scope.add(listen(window, 'pointermove', onMove));
  scope.add(
    listen(document.documentElement, 'pointerleave', () => {
      active = false;
      pointer = null;
      rest();
    }),
  );
  scope.add(() => {
    gsap.ticker.remove(tick);
    gsap.killTweensOf(chars);
    gsap.set(chars, { clearProps: 'fontWeight' });
  });
  return () => scope.destroy();
}

/* ------------------------------------------------------------------ */

export function mountHeroName(hero: HTMLElement, nameEl: HTMLElement): Cleanup {
  const scope = createScope();
  let disposed = false;

  // Screen readers get one clean copy; the split letters are hidden from them.
  const label = document.createElement('span');
  label.className = 'visually-hidden';
  label.textContent = nameEl.textContent ?? '';
  nameEl.before(label);
  nameEl.setAttribute('aria-hidden', 'true');

  const split = SplitText.create(nameEl, { type: 'chars', aria: 'none' });
  const chars = split.chars as HTMLElement[];
  scope.add(() => {
    split.revert();
    nameEl.removeAttribute('aria-hidden');
    label.remove();
  });

  // Coming back from a language switch: the name was already on screen, no intro.
  const skipIntro = document.documentElement.classList.contains('skip-preloader');
  let intro: Promise<void> = Promise.resolve();
  if (!skipIntro) {
    // Widths are measured per letter, so wait for the real font first.
    intro = document.fonts.ready.then(() => {
      if (disposed) return undefined;
      const decoder = createDecoder(chars);
      scope.add(decoder.cleanup);
      return preloaderDone.then(() => (disposed ? undefined : decoder.play()));
    });
  }

  void intro.then(() => {
    if (!disposed) scope.add(initWeightHover(hero, chars));
  });

  return () => {
    disposed = true;
    scope.destroy();
  };
}
