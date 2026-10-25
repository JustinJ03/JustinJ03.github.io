import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://justinj03.github.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
