import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://justinj03.github.io',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
});
