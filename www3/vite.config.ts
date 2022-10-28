import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mdx(), react()],

  // resolve: {
  //   alias: {
  //     'react/jsx-runtime': 'react/jsx-runtime.js',
  //   },
  // },
});
