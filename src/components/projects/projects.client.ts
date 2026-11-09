import { Flip } from 'gsap/Flip';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import type { Feature } from '@/lib/motion/lazy';
import { getLenis } from '@/lib/motion/lenis';
import { createScope, listen, type Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';

gsap.registerPlugin(Flip);

/* ------------------------------------------------------------------ */
/* Expand / collapse with Flip                                         */
/* ------------------------------------------------------------------ */

function initExpand(section: HTMLElement, animate: boolean): Cleanup {
  const scope = createScope();
  const grid = section.querySelector<HTMLElement>('.grid');
  const cards = [...section.querySelectorAll<HTMLElement>('[data-project]')];
  if (!grid) return () => {};

  const setExpanded = (card: HTMLElement, expanded: boolean) => {
    const toggle = card.querySelector<HTMLButtonElement>('[data-project-toggle]');
    card.classList.toggle('is-expanded', expanded);
    card.parentElement?.classList.toggle('is-expanded', expanded);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', (expanded ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? '');
    }
  };

  const toggleCard = (card: HTMLElement) => {
    const willExpand = !card.classList.contains('is-expanded');
    const flipTargets = grid.querySelectorAll('li, .card, [data-visual], .card__body, .card__title');
    const state = animate ? Flip.getState(flipTargets) : null;

    cards.forEach((other) => setExpanded(other, other === card && willExpand));

    const done = () => {
      ScrollTrigger.refresh(); // page height changed: graph, physics... re-measure
      if (willExpand) {
        const top = card.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.4) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(card, { offset: -96, duration: 0.9 });
          else card.scrollIntoView({ block: 'start' });
        }
      }
    };

    if (!state) return done();

    Flip.from(state, { duration: 0.75, ease: 'power3.inOut', nested: true, onComplete: done });
    const details = card.querySelectorAll('[data-project-details]');
    if (willExpand && details.length > 0) {
      gsap.fromTo(details, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, delay: 0.35, duration: 0.5, stagger: 0.12 });
    }
  };

  for (const card of cards) {
    card.classList.add('is-collapsible');
    const toggle = card.querySelector<HTMLButtonElement>('[data-project-toggle]');
    if (toggle) toggle.hidden = false;

    // Button for keyboard / AT; clicking the card itself also toggles (links excluded).
    scope.add(
      listen(card, 'click', (event) => {
        const target = event.target as Element;
        if (target.closest('a')) return;
        toggleCard(card);
      }),
    );
  }

  scope.add(
    listen(document, 'keydown', (event) => {
      if ((event as KeyboardEvent).key !== 'Escape') return;
      const open = cards.find((c) => c.classList.contains('is-expanded'));
      if (open) {
        toggleCard(open);
        open.querySelector<HTMLButtonElement>('[data-project-toggle]')?.focus();
      }
    }),
  );

  scope.add(() => {
    for (const card of cards) {
      setExpanded(card, false);
      card.classList.remove('is-collapsible');
      const toggle = card.querySelector<HTMLButtonElement>('[data-project-toggle]');
      if (toggle) toggle.hidden = true;
    }
  });
  return () => scope.destroy();
}

/* ------------------------------------------------------------------ */
/* Terminal overlay: lines type themselves on hover / focus            */
/* ------------------------------------------------------------------ */

const CHAR_MS = 16;

function initTerminalOverlays(section: HTMLElement): Cleanup {
  const scope = createScope();

  for (const card of section.querySelectorAll<HTMLElement>('[data-project]')) {
    const lines = [...card.querySelectorAll<HTMLElement>('[data-term-line]')];
    const finals = lines.map((l) => l.textContent ?? '');
    let timer: ReturnType<typeof setInterval> | undefined;

    const reset = () => {
      clearInterval(timer);
      lines.forEach((l, i) => {
        l.textContent = finals[i] ?? '';
        l.classList.remove('is-typing');
      });
    };

    const type = () => {
      clearInterval(timer);
      lines.forEach((l) => {
        l.textContent = '';
        l.classList.remove('is-typing');
      });
      let line = 0;
      let char = 0;
      timer = setInterval(() => {
        const el = lines[line];
        const text = finals[line] ?? '';
        if (!el) return clearInterval(timer);
        el.classList.add('is-typing');
        char += 1;
        el.textContent = text.slice(0, char);
        if (char >= text.length) {
          // Keep the caret on the last line once everything is typed.
          if (line < lines.length - 1) el.classList.remove('is-typing');
          line += 1;
          char = 0;
          if (line >= lines.length) clearInterval(timer);
        }
      }, CHAR_MS);
    };

    let inside = false;
    const enter = () => {
      if (inside) return;
      inside = true;
      type();
    };
    const leave = (event: Event) => {
      const next = (event as FocusEvent).relatedTarget as Node | null;
      if (next && card.contains(next)) return; // focus moving inside the card
      inside = false;
      reset();
    };

    scope.add(listen(card, 'pointerenter', enter));
    scope.add(listen(card, 'pointerleave', leave));
    scope.add(listen(card, 'focusin', enter));
    scope.add(listen(card, 'focusout', leave));
    scope.add(reset);
  }
  return () => scope.destroy();
}

/* ------------------------------------------------------------------ */
/* Mount                                                               */
/* ------------------------------------------------------------------ */

export function mount(section: HTMLElement, prefs: MotionPrefs): Cleanup {
  const scope = createScope();
  const animate = prefs.tier !== 'static';

  scope.add(initExpand(section, animate));
  if (animate) {
    // Reduced motion: the overlay still shows on hover (CSS), just without typing.
    scope.add(initTerminalOverlays(section));
  }

  return () => scope.destroy();
}

export default { mount } satisfies Feature;
