import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';
import pkg from './package.json';

const version = pkg.version;
const revision = execSync('git describe --long --always --dirty=-dirty')
  .toString()
  .trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

console.log(branch);

process.env.VERSION = `v${version}${
  branch === 'main' ? '' : '-dev'
}.${revision}`;

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
