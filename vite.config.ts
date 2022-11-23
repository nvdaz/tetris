import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';
import pkg from './package.json';

const version = pkg.version;
const revision = execSync('git describe --long --always --dirty=-dirty')
  .toString()
  .trim();

process.env.VERSION = `v${version}.${revision}`;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'sw.ts',
      workbox: {
        swDest: 'sw.js',
      },
    }),
  ],
  envPrefix: ['VERSION'],
});
