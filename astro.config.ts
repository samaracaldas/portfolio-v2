import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/content/shared/links';

// Static output: Vercel serves the /dist folder with zero config, no adapter needed.
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', pt: 'pt-BR' } },
    }),
  ],
  // ~20 kB of CSS in total: inlining removes the render-blocking request.
  build: { inlineStylesheets: 'always' },
  prefetch: false,
  vite: {
    // three/webgpu is one ~800 kB chunk by design; it is lazy-loaded only
    // when the hero particles run, never on the critical path.
    build: { chunkSizeWarningLimit: 900 },
  },
});
