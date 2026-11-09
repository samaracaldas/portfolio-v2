import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { EXPERIENCES, type Experience, type ExperienceId } from '@/content/shared/experience';
import { gsap } from '@/lib/motion/gsap';
import { debounce, type Feature } from '@/lib/motion/lazy';
import type { Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';

gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin);

const SVG_NS = 'http://www.w3.org/2000/svg';
const SCRAMBLE_CHARS = '01<>/{}[]_#=+';
/** Vertical px a branch-off / merge curve takes. */
const CURVE = 56;

interface CommitPoint {
  y: number;
  /** Left edge of the commit text, where the connector ends. */
  textX: number;
  row: HTMLElement;
}

interface Branch {
  exp: Experience;
  x: number;
  color: string;
  startY: number;
  role: HTMLElement;
  commits: CommitPoint[];
  /** y of the last commit (or startY when there are none). */
  endY: number;
}

/** One animated piece, placed on a timeline where 1 unit = 1px of scroll. */
interface Step {
  at: number;
  add(tl: gsap.core.Timeline, at: number): void;
}

/* ------------------------------------------------------------------ */
/* Measuring                                                           */
/* ------------------------------------------------------------------ */

function laneX(lane: number, rootWidth: number): number {
  const lanes = rootWidth < 640 ? [11, 30] : [18, 44];
  return lanes[lane] ?? lanes[0] ?? 18;
}

function measure(root: HTMLElement): Map<ExperienceId, Branch> {
  const rootRect = root.getBoundingClientRect();
  const relY = (r: DOMRect) => r.top + r.height / 2 - rootRect.top;
  const branches = new Map<ExperienceId, Branch>();

  for (const exp of EXPERIENCES) {
    const article = root.querySelector<HTMLElement>(`[data-experience="${exp.id}"]`);
    const role = article?.querySelector<HTMLElement>('[data-role]');
    if (!article || !role) continue;

    const commits = [...article.querySelectorAll<HTMLElement>('[data-commit]')].map((row) => {
      const firstLine = row.querySelector('.log__hash') ?? row;
      return {
        y: relY(firstLine.getBoundingClientRect()),
        textX: row.getBoundingClientRect().left - rootRect.left,
        row,
      };
    });

    const startY = relY(role.getBoundingClientRect());
    branches.set(exp.id, {
      exp,
      x: laneX(exp.lane, rootRect.width),
      color: `var(--lane-${exp.branch.split('/')[0]})`,
      startY,
      role,
      commits,
      endY: commits.at(-1)?.y ?? startY,
    });
  }
  return branches;
}

/* ------------------------------------------------------------------ */
/* SVG helpers                                                         */
/* ------------------------------------------------------------------ */

function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent?: Element,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  parent?.append(node);
  return node;
}

const vertical = (x: number, y0: number, y1: number) => `M${x} ${y0}V${y1}`;

/** Leaves (x0,y0) sideways right away, then runs straight down to y1. */
const branchOff = (x0: number, y0: number, x1: number, y1: number) =>
  `M${x0} ${y0}C${x0} ${y0 + CURVE / 2} ${x1} ${y0 + CURVE / 2} ${x1} ${y0 + CURVE}V${y1}`;

/** Runs straight down, then bends into (x1,y1) at the end. */
const mergeIn = (x0: number, y0: number, x1: number, y1: number) =>
  `M${x0} ${y0}V${y1 - CURVE}C${x0} ${y1 - CURVE / 2} ${x1} ${y1 - CURVE / 2} ${x1} ${y1}`;

/* ------------------------------------------------------------------ */
/* Role swap (Junior → Pleno)                                          */
/* ------------------------------------------------------------------ */

interface RoleSwap {
  target: HTMLElement;
  from: string;
  to: string;
  restore: Cleanup;
}

/**
 * Splits the role heading into an unchanged prefix and an animated suffix,
 * keeping the real text for screen readers in a visually-hidden span.
 */
function prepareRoleSwap(heading: HTMLElement, fromRole: string): RoleSwap {
  const original = heading.textContent ?? '';
  let common = 0;
  while (common < original.length && original[common] === fromRole[common]) common++;

  const srOnly = document.createElement('span');
  srOnly.className = 'visually-hidden';
  srOnly.textContent = original;

  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  const target = document.createElement('span');
  target.textContent = fromRole.slice(common);
  visual.append(original.slice(0, common), target);

  heading.replaceChildren(srOnly, visual);

  return {
    target,
    from: fromRole.slice(common),
    to: original.slice(common),
    restore: () => {
      heading.textContent = original;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

function roleHeading(root: HTMLElement, id: ExperienceId | undefined): HTMLElement | null {
  return id ? root.querySelector<HTMLElement>(`[data-experience="${id}"] [data-role]`) : null;
}

function build(root: HTMLElement, prefs: MotionPrefs): Cleanup {
  const animate = prefs.tier !== 'static';
  const cleanups: Cleanup[] = [];

  // Promotion = the branch that merges into another one.
  const promoted = EXPERIENCES.find((e) => e.mergesInto);
  const fromHeading = roleHeading(root, promoted?.id);
  const toHeading = roleHeading(root, promoted?.mergesInto);
  // Swap the text before measuring: it can change how the heading wraps.
  const swap = animate && fromHeading && toHeading ? prepareRoleSwap(toHeading, fromHeading.textContent ?? '') : null;
  if (swap) cleanups.push(swap.restore);

  root.classList.add('has-graph'); // adds the gutter before measuring
  const branches = measure(root);
  const width = root.clientWidth;
  const height = root.clientHeight;

  const graph = svg('svg', {
    class: 'git-graph',
    viewBox: `0 0 ${width} ${height}`,
    'aria-hidden': 'true',
    focusable: 'false',
  });
  const linesLayer = svg('g', {}, graph);
  const nodesLayer = svg('g', {}, graph);
  const flashBand = document.createElement('div');
  flashBand.className = 'git-flash';
  root.append(graph, flashBand);

  const steps: Step[] = [];

  const drawStep = (el: SVGPathElement, y0: number, y1: number) =>
    steps.push({
      at: y0,
      add: (tl, at) => tl.fromTo(el, { drawSVG: '0%' }, { drawSVG: '100%', duration: Math.max(1, y1 - y0) }, at),
    });
  const popStep = (el: SVGElement, y: number) =>
    steps.push({
      at: y - 10,
      add: (tl, at) => tl.fromTo(el, { scale: 0 }, { scale: 1, duration: 24, ease: 'back.out(3)' }, at),
    });

  for (const branch of branches.values()) {
    const { exp, x, color, startY, endY, commits } = branch;
    const stroke = { stroke: color };

    // Incoming curve: checked out from another branch.
    const source = exp.branchesFrom ? branches.get(exp.branchesFrom) : undefined;
    if (source) {
      const d = branchOff(source.x, source.endY, x, startY);
      drawStep(svg('path', { d, style: `stroke:${color}` }, linesLayer), source.endY, startY);
    }

    // The branch's own line.
    if (endY > startY) {
      drawStep(svg('path', { d: vertical(x, startY, endY), style: `stroke:${color}` }, linesLayer), startY, endY);
    }

    // Outgoing merge into the next branch (the promotion).
    const target = exp.mergesInto ? branches.get(exp.mergesInto) : undefined;
    if (target) {
      const d = mergeIn(x, endY, target.x, target.startY);
      drawStep(svg('path', { d, style: `stroke:${color}` }, linesLayer), endY, target.startY);
    }

    // Ongoing branch: dashed tail down to the end of the timeline.
    if (exp.end === null) {
      const tail = svg('path', { class: 'g-tail', d: vertical(x, endY + 10, height - 8), style: `stroke:${color}` }, linesLayer);
      steps.push({ at: endY, add: (tl, at) => tl.fromTo(tail, { opacity: 0 }, { opacity: 0.6, duration: 60 }, at) });
    }

    // Branch-start node; it becomes the merge node when something merges in.
    const isMergeTarget = EXPERIENCES.some((e) => e.mergesInto === exp.id);
    popStep(svg('circle', { cx: x, cy: startY, r: isMergeTarget ? 7 : 5, style: `fill:${color}` }, nodesLayer), startY);

    // Commits: node + dotted connector to the text, and the row lights up.
    for (const commit of commits) {
      const connector = svg(
        'path',
        { class: 'g-connector', d: `M${x + 8} ${commit.y}H${Math.max(x + 8, commit.textX - 10)}` },
        linesLayer,
      );
      steps.push({
        at: commit.y - 12,
        add: (tl, at) => tl.fromTo(connector, { drawSVG: '0%' }, { drawSVG: '100%', duration: 24 }, at),
      });
      popStep(svg('circle', { class: 'g-commit', cx: x, cy: commit.y, r: 4.5, ...stroke }, nodesLayer), commit.y);
    }
  }

  // The promotion: flash of light + role scramble (Junior → Pleno).
  const mergeTarget = promoted?.mergesInto ? branches.get(promoted.mergesInto) : undefined;
  if (swap && mergeTarget) {
    const { x, startY } = mergeTarget;
    const flash = svg('circle', { class: 'g-flash', cx: x, cy: startY, r: 0 }, nodesLayer);
    flashBand.style.top = `${startY}px`;

    steps.push({
      at: startY - 8,
      add: (tl, at) =>
        tl
          .fromTo(flash, { attr: { r: 4 }, opacity: 0.95 }, { attr: { r: 90 }, opacity: 0, duration: 180, ease: 'power2.out' }, at)
          .fromTo(flashBand, { opacity: 0 }, { opacity: 1, duration: 30, ease: 'power2.out' }, at)
          .to(flashBand, { opacity: 0, duration: 160, ease: 'power1.in' }, at + 30)
          // Starts from the junior text set by prepareRoleSwap; reverses back to it.
          .to(swap.target, { scrambleText: { text: swap.to, chars: SCRAMBLE_CHARS, speed: 0.5 }, duration: 120 }, at),
    });
  }

  const ctx = gsap.context(() => {
    if (!animate) return; // reduced motion: the graph is simply drawn, complete.

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      // scrub: true follows the (already Lenis-smoothed) scroll directly; a numeric
      // scrub would stack a second delay on top and make the graph lag behind.
      scrollTrigger: { trigger: root, start: 'top 65%', end: 'bottom 65%', scrub: true },
    });
    for (const step of steps.sort((a, b) => a.at - b.at)) step.add(tl, Math.max(0, step.at));
    tl.set({}, {}, height); // 1 timeline unit = 1px of the timeline's height
  });

  return () => {
    ctx.revert();
    cleanups.forEach((fn) => fn());
    graph.remove();
    flashBand.remove();
    root.classList.remove('has-graph');
  };
}

/* ------------------------------------------------------------------ */
/* Mount                                                               */
/* ------------------------------------------------------------------ */

export function mount(root: HTMLElement, prefs: MotionPrefs): Cleanup {
  let disposed = false;
  let unbuild: Cleanup | null = null;
  let lastWidth = 0;

  const rebuild = () => {
    if (disposed) return;
    unbuild?.();
    unbuild = build(root, prefs);
  };

  // Only width changes reflow the entries; height changes during the role
  // scramble must not trigger a rebuild loop.
  const onResize = debounce(() => {
    if (root.clientWidth === lastWidth) return;
    lastWidth = root.clientWidth;
    rebuild();
  }, 150);
  const observer = new ResizeObserver(onResize);

  // Measure only once fonts are in, otherwise every y is off.
  void document.fonts.ready.then(() => {
    if (disposed) return;
    lastWidth = root.clientWidth;
    rebuild();
    observer.observe(root);
  });

  return () => {
    disposed = true;
    onResize.cancel();
    observer.disconnect();
    unbuild?.();
    unbuild = null;
  };
}

export default { mount } satisfies Feature;
