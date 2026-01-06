import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: './',
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: 'dist',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    emptyOutDir: false, // Don't clear dist so plugin.js isn't deleted if built in parallel
  },
});