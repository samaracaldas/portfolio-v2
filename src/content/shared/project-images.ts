import type { ImageMetadata } from 'astro';
import caramelo from '@/assets/projects/caramelo.jpg';
import bendita from '@/assets/projects/bendita.jpg';
import theDive from '@/assets/projects/the-dive.jpg';
import type { ProjectId } from './projects';

/**
 * Screenshots of each live project (1280×800 viewport, saved at 800×500).
 * Used as <img> and, on capable devices, as the texture of the hover shader.
 * Replace with higher-resolution captures any time; keep the 16:10 ratio.
 */
export const PROJECT_IMAGES: Record<ProjectId, ImageMetadata> = {
  caramelo,
  bendita,
  'the-dive': theDive,
};
