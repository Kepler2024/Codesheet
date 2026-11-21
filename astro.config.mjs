import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://codesheet.org',
  base: '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
