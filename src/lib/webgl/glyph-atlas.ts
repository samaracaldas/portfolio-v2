import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three/webgpu';

/** Code glyphs the hero particles are made of. */
export const GLYPHS = ['{', '}', ';', '=>', '</>', '()', '[]', '<', '>', '/', '*', '=', '+', '_', '0', '1'] as const;
export const ATLAS_COLS = 8;
export const ATLAS_ROWS = 2;
const CELL = 64;

/**
 * White glyphs on transparent, one per cell, row 0 at the top of the canvas.
 * Call after fonts are loaded so Geist Mono is used.
 */
export function createGlyphAtlas(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_COLS * CELL;
  canvas.height = ATLAS_ROWS * CELL;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  GLYPHS.forEach((glyph, i) => {
    const col = i % ATLAS_COLS;
    const row = Math.floor(i / ATLAS_COLS);
    // Shrink longer glyphs ("</>") so they fit their cell.
    let size = 46;
    ctx.font = `600 ${size}px "Geist Mono Variable", ui-monospace, monospace`;
    const width = ctx.measureText(glyph).width;
    if (width > CELL * 0.86) {
      size = Math.floor((size * CELL * 0.86) / width);
      ctx.font = `600 ${size}px "Geist Mono Variable", ui-monospace, monospace`;
    }
    ctx.fillText(glyph, col * CELL + CELL / 2, row * CELL + CELL / 2 + 2);
  });

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
