import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['leaflet', 'leaflet-contextmenu'],
    },
  },
  server: {
    port: 9000,
    host: 'localhost',
    open: '/'
  }
});