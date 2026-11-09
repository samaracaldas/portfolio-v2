/**
 * The Three.js part of the hero: floating "code dust" in the background.
 * Split out so three/webgpu is only downloaded when it will actually run
 * (never under reduced motion).
 */
import { OrthographicCamera, Scene } from 'three/webgpu';
import { gsap } from '@/lib/motion/gsap';
import { createScope, listen, type Cleanup } from '@/lib/motion/lifecycle';
import { disposeTree } from '@/lib/webgl/dispose';
import { createGlyphAtlas, GLYPHS } from '@/lib/webgl/glyph-atlas';
import { createRenderer, forceWebGLFromUrl } from '@/lib/webgl/renderer';
import { createCodeParticles, type ParticleData } from '@/lib/webgl/shaders/code-particles';

export interface TierConfig {
  /** Particles per 1000x1000 px of hero, so density is the same on any screen. */
  density: number;
  pixelRatio: number;
}

export const TIERS: Record<'lite' | 'full', TierConfig> = {
  full: { density: 2600, pixelRatio: Math.min(window.devicePixelRatio, 2) },
  lite: { density: 1100, pixelRatio: 1 },
};

/* ------------------------------------------------------------------ */

function buildData(width: number, height: number, density: number): ParticleData {
  const count = Math.max(200, Math.round((width * height * density) / 1_000_000));
  const positions = new Float32Array(count * 4);
  const homes = new Float32Array(count * 4);
  const glyphs = new Float32Array(count * 4);
  const randX = () => (Math.random() - 0.5) * width * 1.1;
  const randY = () => (Math.random() - 0.5) * height * 1.1;

  for (let i = 0; i < count; i++) {
    const o = i * 4;
    const hx = randX();
    const hy = randY();
    homes[o] = hx;
    homes[o + 1] = hy;
    // Start slightly off home so the dust settles in with a gentle drift.
    positions[o] = hx + (Math.random() - 0.5) * 80;
    positions[o + 1] = hy + (Math.random() - 0.5) * 80;
    positions[o + 3] = 1;

    glyphs[o] = Math.floor(Math.random() * GLYPHS.length);
    glyphs[o + 1] = Math.random();
    glyphs[o + 2] = 0.8 + Math.random() * 0.45;
  }
  return { count, positions, homes, glyphs };
}

/* ------------------------------------------------------------------ */

export interface BuildContext {
  hero: HTMLElement;
  stage: HTMLElement;
  config: TierConfig;
  playIntro: boolean;
  isDisposed: () => boolean;
}

export async function build({ hero, stage, config, playIntro, isDisposed }: BuildContext): Promise<Cleanup> {
  const scope = createScope();
  const width = stage.clientWidth;
  const height = stage.clientHeight;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.append(canvas);
  scope.add(() => canvas.remove());

  let handle;
  try {
    handle = await createRenderer({ canvas, pixelRatio: config.pixelRatio, forceWebGL: forceWebGLFromUrl() });
  } catch (error) {
    console.warn('[hero] WebGL/WebGPU unavailable, skipping the code dust.', error);
    scope.destroy();
    return () => {};
  }
  const { renderer } = handle;
  scope.add(() => renderer.dispose());
  if (isDisposed()) {
    scope.destroy();
    return () => {};
  }
  renderer.setSize(width, height, false);
  hero.dataset.renderer = handle.backend;

  // Scene in CSS pixels: 1 world unit = 1px, origin at the centre.
  const camera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -10, 10);
  const scene = new Scene();

  const data = buildData(width, height, config.density);
  const atlas = createGlyphAtlas();
  const particles = createCodeParticles(data, atlas, 13);
  scene.add(particles.mesh);
  scope.add(() => {
    disposeTree(particles.mesh);
    atlas.dispose();
  });

  const u = particles.uniforms;

  /* ---- Loop: GSAP ticker, paused while the hero is off-screen ---- */
  let visible = true;
  const tick = (time: number) => {
    if (!visible) return;
    u.time.value = time;
    renderer.compute(particles.computeUpdate);
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);
  scope.add(() => gsap.ticker.remove(tick));

  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
  });
  io.observe(hero);
  scope.add(() => io.disconnect());

  /* ---- Fade in ---- */
  if (playIntro) {
    gsap.to(u.fade, { value: 1, duration: 1.6, ease: 'power1.out', delay: 0.2 });
  } else {
    u.fade.value = 1;
  }

  /* ---- Cursor (or finger) disperses the particles ---- */
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const onMove = (event: PointerEvent) => {
    if (!visible) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (y < 0 || y > rect.height) return;
    u.mouse.value.set(x - rect.width / 2, rect.height / 2 - y);
    gsap.to(u.mouseStrength, { value: 1, duration: 0.25, overwrite: true });
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => gsap.to(u.mouseStrength, { value: 0, duration: 1.2, overwrite: true }), 600);
  };
  const onLeave = () => gsap.to(u.mouseStrength, { value: 0, duration: 0.8, overwrite: true });

  scope.add(listen(window, 'pointermove', onMove));
  scope.add(listen(document.documentElement, 'pointerleave', onLeave));
  scope.add(() => {
    clearTimeout(idleTimer);
    gsap.killTweensOf([u.mouseStrength, u.fade]);
  });

  return () => scope.destroy();
}

