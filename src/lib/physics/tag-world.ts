import Matter from 'matter-js';
import { gsap } from '@/lib/motion/gsap';
import { listen, type Cleanup } from '@/lib/motion/lifecycle';

const { Bodies, Body, Composite, Constraint, Engine, Sleeping } = Matter;

/**
 * A Matter.js world whose bodies are real DOM elements: the physics runs
 * headless and each tick writes transforms onto the tags. No canvas, so the
 * tags stay real, selectable, accessible HTML.
 */
export interface TagWorld {
  /** Adds the bodies so they fall in. Safe to call more than once. */
  drop(): void;
  /** Pauses the simulation (e.g. while off-screen). */
  setActive(active: boolean): void;
  /** Re-fits walls to the container after a resize. */
  resize(): void;
  destroy(): void;
}

interface Item {
  el: HTMLElement;
  body: Matter.Body;
  w: number;
  h: number;
}

const WALL = 400;
const MAX_STEP_MS = 1000 / 30;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function createTagWorld(container: HTMLElement, tags: HTMLElement[]): TagWorld {
  let width = container.clientWidth;
  let height = container.clientHeight;
  let active = false;
  let dropped = false;

  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.1;

  /* ---- Walls (invisible, just outside the box); rebuilt on resize ---- */
  let walls: Matter.Body[] = [];

  function fitWalls() {
    Composite.remove(engine.world, walls);
    const options = { isStatic: true, friction: 0.6 };
    const span = width * 3;
    const tall = height * 6;
    walls = [
      Bodies.rectangle(width / 2, height + WALL / 2, span, WALL, options), // ground
      // Ceiling far above: tags thrown upward come back down instead of escaping.
      Bodies.rectangle(width / 2, -height * 1.5 - WALL / 2, span, WALL, options),
      Bodies.rectangle(-WALL / 2, height / 2, WALL, tall, options), // left
      Bodies.rectangle(width + WALL / 2, height / 2, WALL, tall, options), // right
    ];
    Composite.add(engine.world, walls);
  }
  fitWalls();

  /* ---- Tag bodies: start above the box, staggered so they rain in ---- */
  const items: Item[] = tags.map((el, i) => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const x = rand(w / 2, Math.max(w / 2, width - w / 2));
    const y = -h - i * (h * 0.9) - rand(0, 40);
    const body = Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: h / 2 },
      angle: rand(-0.35, 0.35),
      restitution: 0.2,
      friction: 0.35,
      frictionAir: 0.012,
      density: 0.0018,
    });
    return { el, body, w, h };
  });
  const byElement = new Map(items.map((item) => [item.el, item]));

  function render() {
    for (const { el, body, w, h } of items) {
      const { x, y } = body.position;
      el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${body.angle}rad)`;
    }
  }
  render();

  /* ---- Loop: piggybacks on GSAP's ticker (same RAF as Lenis) ---- */
  const tick = (_time: number, deltaMs: number) => {
    if (!active) return;
    Engine.update(engine, Math.min(deltaMs, MAX_STEP_MS));
    render();
  };
  gsap.ticker.add(tick);

  /* ---- Dragging with pointer events (works for mouse, pen and touch) ---- */
  let drag: { constraint: Matter.Constraint; item: Item; pointerId: number } | null = null;

  const toLocal = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onDown = (event: PointerEvent) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('[data-skill]');
    const item = el ? byElement.get(el) : undefined;
    if (!item || drag || event.button > 0) return;

    event.preventDefault();
    const point = toLocal(event);
    Sleeping.set(item.body, false);
    const constraint = Constraint.create({
      pointA: point,
      bodyB: item.body,
      pointB: { x: point.x - item.body.position.x, y: point.y - item.body.position.y },
      length: 0,
      stiffness: 0.18,
      damping: 0.08,
    });
    Composite.add(engine.world, constraint);
    item.el.setPointerCapture(event.pointerId);
    item.el.classList.add('is-dragging');
    drag = { constraint, item, pointerId: event.pointerId };
  };

  const onMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.constraint.pointA = toLocal(event);
    Sleeping.set(drag.item.body, false);
  };

  const onUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    Composite.remove(engine.world, drag.constraint);
    drag.item.el.classList.remove('is-dragging');
    if (drag.item.el.hasPointerCapture(event.pointerId)) drag.item.el.releasePointerCapture(event.pointerId);
    drag = null;
  };

  const removers: Cleanup[] = [
    listen(container, 'pointerdown', onDown as EventListener),
    listen(container, 'pointermove', onMove as EventListener),
    listen(container, 'pointerup', onUp as EventListener),
    listen(container, 'pointercancel', onUp as EventListener),
  ];

  return {
    drop() {
      if (dropped) return;
      dropped = true;
      Composite.add(
        engine.world,
        items.map((item) => item.body),
      );
    },
    setActive(value) {
      active = value;
    },
    resize() {
      width = container.clientWidth;
      height = container.clientHeight;
      fitWalls();
      for (const { body, w, h } of items) {
        const x = Math.min(Math.max(body.position.x, w / 2), width - w / 2);
        const y = Math.min(body.position.y, height - h / 2);
        Body.setPosition(body, { x, y });
        Sleeping.set(body, false);
      }
      render();
    },
    destroy() {
      gsap.ticker.remove(tick);
      removers.forEach((remove) => remove());
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      for (const { el } of items) {
        el.style.transform = '';
        el.classList.remove('is-dragging');
      }
    },
  };
}
