// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://alfredbateman.github.io/portfolio-v3/
// Using a custom domain later? Set `site` to it and remove `base` (and update public/robots.txt).
export default defineConfig({
  site: 'https://alfredbateman.github.io',
  base: '/portfolio-v3',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
});
