import { WebGPURenderer } from 'three/webgpu';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  pixelRatio: number;
  /** Skip WebGPU and go straight to the WebGL 2 backend. */
  forceWebGL?: boolean;
}

export interface RendererHandle {
  renderer: WebGPURenderer;
  backend: 'webgpu' | 'webgl2';
}

/**
 * WebGPURenderer picks WebGPU when available and falls back to WebGL 2 on
 * its own. Throws if neither works; callers then keep the HTML-only version.
 */
export async function createRenderer({ canvas, pixelRatio, forceWebGL = false }: RendererOptions): Promise<RendererHandle> {
  const renderer = new WebGPURenderer({
    canvas,
    alpha: true,
    antialias: false,
    forceWebGL,
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);
  await renderer.init();

  const isWebGPU = (renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend === true;
  return { renderer, backend: isWebGPU ? 'webgpu' : 'webgl2' };
}

/** Dev only: `?gl=webgl` forces the WebGL 2 fallback for testing. */
export function forceWebGLFromUrl(): boolean {
  return import.meta.env.DEV && new URLSearchParams(location.search).get('gl') === 'webgl';
}
