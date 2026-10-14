import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/main.js'),
      formats: ['es'],
      fileName: () => 'orbita-solar.js',
      cssFileName: 'orbita-solar',
    },
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
