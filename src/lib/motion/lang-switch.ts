import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { gsap } from './gsap';
import { getLenis } from './lenis';
import { listen, type Cleanup } from './lifecycle';
import type { MotionPrefs } from './prefers';

gsap.registerPlugin(ScrambleTextPlugin);

/**
 * EN ⇄ PT with a ScrambleText transition.
 *
 * Both locales render the same DOM structure, so text can be paired by the
 * element's position in the tree. On click we fetch the other page, scramble
 * every visible text-only element into its translation, then navigate for
 * real (fresh, correct DOM in the new language) and restore the scroll
 * position on the matching section. Without JS it is just a link.
 */

const RESTORE_KEY = 'sc:restore';
const SCRAMBLE_SECONDS = 0.7;

type TextMap = Map<string, string>;

/** "3/0/2" = body.children[3].children[0].children[2] */
function collectTexts(body: Element): TextMap {
  const map: TextMap = new Map();
  const walk = (el: Element, path: string) => {
    if (el.matches('script, style, svg, canvas, template')) return;
    if (el.children.length === 0) {
      const text = el.textContent?.trim();
      if (text) map.set(path, text);
      return;
    }
    [...el.children].forEach((child, i) => walk(child, path ? `${path}/${i}` : String(i)));
  };
  walk(body, '');
  return map;
}

function resolvePath(path: string): Element | null {
  let el: Element | null = document.body;
  for (const index of path.split('/')) {
    el = el?.children[Number(index)] ?? null;
    if (!el) return null;
  }
  return el;
}

async function fetchBody(url: string): Promise<Element> {
  const html = await (await fetch(url, { credentials: 'same-origin' })).text();
  return new DOMParser().parseFromString(html, 'text/html').body;
}

function isOnScreen(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.width > 0 && r.height > 0;
}

/** Remember which section is at the top of the viewport, and how far into it. */
function saveScroll() {
  const header = 64;
  const sections = [...document.querySelectorAll<HTMLElement>('main > section[id]')];
  const current = sections.find((s) => s.getBoundingClientRect().bottom > header) ?? sections[0];
  if (!current) return;
  const offset = header - current.getBoundingClientRect().top;
  try {
    sessionStorage.setItem(RESTORE_KEY, JSON.stringify({ id: current.id, offset }));
  } catch {
    /* storage unavailable: the new page simply starts at the top */
  }
}

/** On load after a language switch: jump back to the same spot. */
export function restoreScroll(): void {
  let saved: { id: string; offset: number } | null = null;
  try {
    const raw = sessionStorage.getItem(RESTORE_KEY);
    sessionStorage.removeItem(RESTORE_KEY);
    saved = raw ? (JSON.parse(raw) as { id: string; offset: number }) : null;
  } catch {
    return;
  }
  if (!saved) return;
  const { id, offset } = saved;
  void document.fonts.ready.then(() => {
    const section = document.getElementById(id);
    if (!section) return;
    const y = section.getBoundingClientRect().top + window.scrollY - 64 + Math.max(0, offset);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  });
}

export function initLangSwitch(prefs: MotionPrefs): Cleanup {
  const toggle = document.querySelector<HTMLAnchorElement>('[data-lang-toggle]');
  if (!toggle) return () => {};
  let switching = false;

  const onClick = async (event: MouseEvent) => {
    // Let modified clicks (new tab, etc.) behave like a normal link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (switching) return;
    switching = true;
    const href = toggle.href;

    try {
      if (prefs.tier !== 'static') {
        const [current, next] = await Promise.all([fetchBody(location.pathname), fetchBody(href)]);
        const from = collectTexts(current);
        const to = collectTexts(next);
        const tweens: gsap.core.Tween[] = [];

        for (const [path, target] of to) {
          const source = from.get(path);
          if (!source || source === target) continue;
          const el = resolvePath(path);
          // Skip elements scripts have changed since render (they no longer hold the source text).
          if (!el || el.children.length > 0 || el.textContent?.trim() !== source || !isOnScreen(el)) continue;
          tweens.push(
            gsap.to(el, {
              duration: SCRAMBLE_SECONDS,
              ease: 'none',
              scrambleText: { text: target, chars: 'lowerCase', speed: 0.9 },
            }),
          );
        }
        await Promise.all(tweens.map((t) => t.then()));
      }
    } catch (error) {
      console.warn('[i18n] scramble skipped', error);
    }

    saveScroll();
    window.location.href = href;
  };

  return listen(toggle, 'click', (e) => void onClick(e as MouseEvent));
}
