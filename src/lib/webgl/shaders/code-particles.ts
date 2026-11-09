import { Color, Sprite, SpriteNodeMaterial, Vector2, type Texture } from 'three/webgpu';
import {
  Fn,
  cos,
  float,
  hash,
  instanceIndex,
  instancedArray,
  length,
  max,
  mix,
  sin,
  smoothstep,
  step,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl';
import { ATLAS_COLS, ATLAS_ROWS } from '../glyph-atlas';

/**
 * GPU "code dust" for the hero background:
 * - storage buffers hold position / velocity / home per particle;
 * - a compute shader integrates a soft pull home, idle drift and cursor
 *   repulsion every frame (WebGPU compute, or transform feedback on the
 *   WebGL 2 fallback);
 * - instanced sprites sample a glyph atlas, so every particle is a code char.
 *
 * Buffers are vec4 to avoid vec3 alignment differences between backends.
 */

export interface ParticleData {
  count: number;
  /** x, y, z, w — current position. */
  positions: Float32Array;
  /** x, y, z, w — where each particle drifts around. */
  homes: Float32Array;
  /** glyphIndex, colourSeed, sizeJitter, 0. */
  glyphs: Float32Array;
}

export function createCodeParticles(data: ParticleData, atlas: Texture, size: number) {
  const positions = instancedArray(data.positions, 'vec4');
  const velocities = instancedArray(data.count, 'vec4');
  const homes = instancedArray(data.homes, 'vec4');
  const glyphs = instancedArray(data.glyphs, 'vec4');

  const uniforms = {
    time: uniform(0),
    fade: uniform(0),
    opacity: uniform(0.36),
    mouse: uniform(new Vector2(99999, 99999)),
    mouseStrength: uniform(0),
    radius: uniform(150),
    force: uniform(2.2),
    damping: uniform(0.88),
    colorFg: uniform(new Color('#ededed')),
    colorAccent: uniform(new Color('#00b5b5')),
  };
  const u = uniforms;

  /* ---------------- Compute: one step of the simulation ---------------- */

  const update = Fn(() => {
    const pos = positions.element(instanceIndex);
    const vel = velocities.element(instanceIndex);
    const home = homes.element(instanceIndex);

    // Weak spring home, so pushed particles always drift back.
    const acc = home.xyz.sub(pos.xyz).mul(0.0025).toVar();

    // Idle wobble, unique per particle.
    const phase = hash(instanceIndex).mul(6.2831);
    acc.addAssign(vec3(sin(u.time.mul(0.7).add(phase)), cos(u.time.mul(0.55).add(phase.mul(1.3))), 0).mul(0.05));

    // Cursor repulsion with a soft falloff.
    const away = pos.xy.sub(u.mouse);
    const dist = max(length(away), 0.001);
    const falloff = float(1).sub(smoothstep(0, u.radius, dist));
    acc.addAssign(vec3(away.div(dist).mul(falloff.mul(falloff)).mul(u.mouseStrength).mul(u.force), 0));

    const newVel = vel.xyz.add(acc).mul(u.damping);
    vel.assign(vec4(newVel, 0));
    pos.assign(vec4(pos.xyz.add(newVel), 1));
  });
  const computeUpdate = update().compute(data.count);

  /* ---------------- Render: instanced glyph sprites ---------------- */

  const material = new SpriteNodeMaterial({ transparent: true, depthWrite: false, depthTest: false });
  const glyphAttr = glyphs.toAttribute();

  material.positionNode = positions.toAttribute().xyz;
  material.scaleNode = float(size).mul(glyphAttr.z);

  // Atlas lookup: row 0 is the top of the canvas (texture is flipped on upload).
  const cell = glyphAttr.x;
  const col = cell.mod(ATLAS_COLS);
  const row = cell.div(ATLAS_COLS).floor();
  const atlasUv = vec2(uv().x.add(col).div(ATLAS_COLS), uv().y.add(float(ATLAS_ROWS - 1).sub(row)).div(ATLAS_ROWS));
  const alpha = texture(atlas, atlasUv).a;

  // ~25% of the dust in the accent colour.
  const color = mix(u.colorFg, u.colorAccent, step(0.75, glyphAttr.y));
  material.colorNode = vec4(color, alpha.mul(u.opacity).mul(u.fade));

  const mesh = new Sprite(material);
  mesh.count = data.count;
  mesh.frustumCulled = false;

  return { mesh, material, computeUpdate, uniforms };
}

export type CodeParticles = ReturnType<typeof createCodeParticles>;
