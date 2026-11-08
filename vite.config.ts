import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/** Keeps AI Studio leftovers and duplicate image folders out of the published site. */
function excludeLeftovers(): Plugin {
  return {
    name: 'exclude-leftovers',
    apply: 'build',
    closeBundle() {
      for (const folder of ['assets/aistudio', 'images', 'src']) {
        fs.rmSync(path.resolve(__dirname, 'dist', folder), {recursive: true, force: true});
      }
    },
  };
}

export default defineConfig(() => {
  return {
    // GitHub Pages serves the site under /digital-boomer/. Locally (npm run dev) it stays at /.
    base: process.env.GITHUB_ACTIONS ? '/digital-boomer/' : '/',
    plugins: [react(), tailwindcss(), excludeLeftovers()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
