import { gsap } from '@/lib/motion/gsap';
import { debounce, type Feature } from '@/lib/motion/lazy';
import { createScope, listen, type Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';

/**
 * "How I work with AI": three review agents (points of light) scan the code
 * line by line, stop on a problem, leave their review comment, and the last
 * one applies the fix. Without motion the section simply shows the end state
 * (all comments + the diff), which is also what the HTML renders.
 */

interface LineGeom {
  y: number;
  x0: number;
  x1: number;
  el: HTMLElement;
}

const SCAN_SPEED = 1100; // px per second

function measureLines(pre: HTMLElement): LineGeom[] {
  const preRect = pre.getBoundingClientRect();
  const range = document.createRange();
  return [...pre.querySelectorAll<HTMLElement>('[data-line]')].map((el) => {
    const text = el.querySelector<HTMLElement>('.code__text') ?? el;
    range.selectNodeContents(text);
    const textRect = range.getBoundingClientRect();
    const lineRect = el.getBoundingClientRect();
    const x0 = textRect.left - preRect.left + pre.scrollLeft;
    return {
      el,
      y: lineRect.top - preRect.top + lineRect.height / 2 + pre.scrollTop,
      x0,
      x1: x0 + Math.max(textRect.width, 24),
    };
  });
}

function buildTimeline(root: HTMLElement): { tl: gsap.core.Timeline; cleanup: Cleanup } | null {
  const figure = root.querySelector<HTMLElement>('.code');
  const pre = root.querySelector<HTMLElement>('[data-ai-code]');
  const reviews = [...root.querySelectorAll<HTMLElement>('[data-review-line]')];
  const del = root.querySelector<HTMLElement>('[data-fix-before]');
  const ins = root.querySelector<HTMLElement>('[data-fix-after]');
  if (!figure || !pre || reviews.length === 0) return null;

  figure.classList.add('is-live');
  const lines = measureLines(pre);
  const created: HTMLElement[] = [];

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });

  reviews.forEach((review, i) => {
    const targetLine = Number(review.dataset.reviewLine);
    const color = getComputedStyle(review).getPropertyValue('--agent').trim();
    const start = i * 0.45;

    const agent = document.createElement('span');
    agent.className = 'ai-agent';
    agent.setAttribute('aria-hidden', 'true');
    agent.style.setProperty('--agent', color);
    pre.append(agent);
    created.push(agent);

    const first = lines[0];
    if (!first) return;
    tl.fromTo(agent, { x: first.x0 - 14, y: first.y, autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, start);

    // Scan every line down to the one this agent cares about.
    let at = start + 0.3;
    for (const line of lines.slice(0, targetLine)) {
      tl.to(agent, { x: line.x0, y: line.y, duration: 0.16 }, at);
      at += 0.16;
      const sweep = (line.x1 - line.x0) / SCAN_SPEED;
      tl.to(agent, { x: line.x1, duration: sweep, ease: 'none' }, at);
      at += sweep;
    }

    // Found it: hop back to the middle of the line, pulse, flash the line.
    const target = lines[targetLine - 1];
    if (!target) return;
    const flash = document.createElement('span');
    flash.className = 'ai-flash';
    flash.style.setProperty('--agent', color);
    target.el.append(flash);
    created.push(flash);

    tl.to(agent, { x: (target.x0 + target.x1) / 2, duration: 0.25 }, at)
      .to(agent, { scale: 1.9, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at + 0.25)
      .fromTo(flash, { opacity: 0 }, { opacity: 0.16, duration: 0.15, yoyo: true, repeat: 1 }, at + 0.25);

    // The comments are always on screen and readable; the agent just lights
    // up its own comment when it finds the problem.
    tl.fromTo(
      review,
      // box-shadow only: it has no base style, so the comment's own border and
      // background are never touched (before, during or after the pulse).
      { boxShadow: `inset 0 0 0 1px rgba(0,0,0,0), 0 0 0px 0px rgba(0,0,0,0)` },
      {
        boxShadow: `inset 0 0 0 1px ${color}, 0 0 18px 0px ${color}`,
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
      },
      at + 0.25,
    );
    at += 0.75;

    // The agent that reviewed the fixable line also fixes it.
    const fixText = ins?.querySelector<HTMLElement>('[data-fix-text]') ?? ins;
    const isFixer = del !== null && ins !== null && fixText !== null && target.el.contains(del);
    if (isFixer) {
      tl.to(del, { color: '#ef6f6c', textDecorationColor: 'rgba(239,111,108,0.6)', backgroundColor: 'rgba(239,111,108,0.07)', duration: 0.3 }, at)
        .set(ins, { display: 'block' }, at + 0.2)
        .fromTo(ins, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, at + 0.2)
        .to(agent, { y: target.y + (ins.getBoundingClientRect().height || target.el.getBoundingClientRect().height / 2), duration: 0.3 }, at + 0.2);
      at += 0.7;
    }

    // Done: drift off to the right and fade.
    tl.to(agent, { x: '+=40', autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, at);
  });

  return {
    tl,
    cleanup: () => {
      tl.revert();
      created.forEach((el) => el.remove());
      figure.classList.remove('is-live');
    },
  };
}

export function mount(root: HTMLElement, prefs: MotionPrefs): Cleanup {
  // Reduced motion: the static HTML already is the end state.
  if (prefs.tier === 'static') return () => {};

  const scope = createScope();
  const replay = root.querySelector<HTMLButtonElement>('[data-ai-replay]');
  const code = root.querySelector<HTMLElement>('.code');
  let current: ReturnType<typeof buildTimeline> = null;
  let played = false;
  let lastWidth = root.clientWidth;

  const rebuild = () => {
    current?.cleanup();
    current = buildTimeline(root);
    if (played) current?.tl.progress(1); // after a resize, keep showing the end state
  };
  rebuild();

  // Play once when the code block is well into view.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting || played) return;
      played = true;
      current?.tl.play();
      if (replay) replay.hidden = false;
    },
    { threshold: 0.3 },
  );
  if (code) io.observe(code);
  scope.add(() => io.disconnect());

  if (replay) {
    scope.add(listen(replay, 'click', () => current?.tl.restart()));
    scope.add(() => {
      replay.hidden = true;
    });
  }

  const onResize = debounce(() => {
    if (root.clientWidth === lastWidth) return;
    lastWidth = root.clientWidth;
    rebuild();
  }, 200);
  const ro = new ResizeObserver(onResize);
  ro.observe(root);
  scope.add(() => {
    ro.disconnect();
    onResize.cancel();
  });

  scope.add(() => {
    current?.cleanup();
    current = null;
  });
  return () => scope.destroy();
}

export default { mount } satisfies Feature;
