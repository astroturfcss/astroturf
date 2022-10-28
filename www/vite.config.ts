import mdx from '@mdx-js/rollup';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import astroturf from 'astroturf/vite-plugin.js';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/astroturf',
  plugins: [mdx(), viteCommonjs(), react(), astroturf.default()],
});
