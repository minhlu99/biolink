import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://bravies-dayoff.pages.dev',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [tailwind()],
});
