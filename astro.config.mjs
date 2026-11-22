import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://codesheet.io',
  // "/" on a custom domain; "/Codesheet" when served from <owner>.github.io/Codesheet/
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
