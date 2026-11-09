import { Flip } from 'gsap/Flip';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { gsap } from '@/lib/motion/gsap';
import type { Feature } from '@/lib/motion/lazy';
import { createScope, type Cleanup } from '@/lib/motion/lifecycle';
import type { MotionPrefs } from '@/lib/motion/prefers';

gsap.registerPlugin(Flip, ScrambleTextPlugin);

/**
 * Abstract demo of the Reviewers approval flow (fictional data): the proposal
 * card travels register → review → approved with Flip, tags fly in and stick
 * during review, the status scrambles at each step. Loops while visible.
 * Reduced motion keeps the static end state rendered by the HTML.
 */

type StepId = 'register' | 'review' | 'approved';

const STEPS: StepId[] = ['register', 'review', 'approved'];
const CHARS = 'abcdefghijklmnopqrstuvwxyz';

export function mount(section: HTMLElement, prefs: MotionPrefs): Cleanup {
  if (prefs.tier === 'static') return () => {};

  const card = section.querySelector<HTMLElement>('[data-proposal-card]');
  const statusText = section.querySelector<HTMLElement>('[data-status-text]');
  const statusIcon = section.querySelector<HTMLElement>('[data-status-icon]');
  const tags = [...section.querySelectorAll<HTMLElement>('[data-proposal-tags] > li')];
  const columns = new Map(STEPS.map((id) => [id, section.querySelector<HTMLElement>(`[data-step="${id}"]`)]));
  const slot = (id: StepId) => columns.get(id)?.querySelector<HTMLElement>('[data-slot]') ?? null;
  if (!card || !statusText || !statusIcon || !slot('approved')) return () => {};

  const statuses = JSON.parse(card.dataset.statuses ?? '{}') as Record<StepId, string>;
  const scope = createScope();

  // Reserve the card's height in every column so the page never jumps as it travels
  // (columns stack vertically on mobile).
  const slots = STEPS.map(slot).filter((s): s is HTMLElement => s !== null);
  const cardHeight = card.offsetHeight;
  slots.forEach((s) => (s.style.minHeight = `${cardHeight}px`));
  scope.add(() => slots.forEach((s) => (s.style.minHeight = '')));
  const originalStatus = statusText.textContent ?? '';
  let running = false;
  let visible = false;
  let disposed = false;

  // Promise wrapper around a delayed call; tracked so cleanup can kill it.
  const pending = new Set<gsap.core.Tween>();
  const pause = (seconds: number) =>
    new Promise<void>((resolve) => {
      const call = gsap.delayedCall(seconds, () => {
        pending.delete(call);
        resolve();
      });
      pending.add(call);
    });
  const play = (animation: gsap.core.Animation) => new Promise<void>((resolve) => void animation.then(() => resolve()));

  const setActive = (step: StepId | null) => {
    for (const [id, column] of columns) column?.classList.toggle('is-active', id === step);
  };

  const setStatus = (step: StepId) =>
    play(gsap.to(statusText, { duration: 0.6, scrambleText: { text: statuses[step] ?? '', chars: CHARS, speed: 0.6 } }));

  const moveTo = async (step: StepId) => {
    const target = slot(step);
    if (!target) return;
    const state = Flip.getState(card);
    target.append(card);
    setActive(step);
    await play(Flip.from(state, { duration: 0.85, ease: 'power3.inOut' }));
  };

  const cycle = async () => {
    // Reset: card appears in "register", no tags, no check.
    slot('register')?.append(card);
    setActive('register');
    gsap.set(tags, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 });
    gsap.set(statusIcon, { opacity: 0, width: 0 });
    statusText.textContent = statuses.register ?? '';
    await play(gsap.fromTo(card, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }));
    await pause(1.1);
    if (disposed) return;

    // Review: move, change status, tags fly in and stick.
    await moveTo('review');
    void setStatus('review');
    await play(
      gsap.fromTo(
        tags,
        {
          opacity: 0,
          x: () => gsap.utils.random(-180, 180),
          y: () => gsap.utils.random(-140, -70),
          rotation: () => gsap.utils.random(-50, 50),
          scale: 1.5,
        },
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.28 },
      ),
    );
    await play(gsap.fromTo(card, { scale: 1 }, { scale: 1.03, duration: 0.12, yoyo: true, repeat: 1 }));
    await pause(1);
    if (disposed) return;

    // Approved.
    await moveTo('approved');
    await setStatus('approved');
    await play(gsap.to(statusIcon, { opacity: 1, width: 'auto', duration: 0.35, ease: 'back.out(3)' }));
    await pause(2.4);
    if (disposed) return;
    await play(gsap.to(card, { opacity: 0, y: 12, duration: 0.4 }));
  };

  const loop = async () => {
    if (running) return;
    running = true;
    while (visible && !disposed) await cycle();
    running = false;
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) void loop();
    },
    { threshold: 0.35 },
  );
  io.observe(section);
  scope.add(() => io.disconnect());

  scope.add(() => {
    disposed = true;
    gsap.killTweensOf([card, statusText, statusIcon, ...tags]);
    pending.forEach((call) => call.kill());
    pending.clear();
    // Back to the static end state.
    slot('approved')?.append(card);
    setActive(null);
    statusText.textContent = originalStatus;
    gsap.set([card, statusIcon, ...tags], { clearProps: 'all' });
  });

  return () => scope.destroy();
}

export default { mount } satisfies Feature;
