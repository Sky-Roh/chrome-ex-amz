import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Set the project root directory
  build: {
    rollupOptions: {
      input: {
        main: './index.html' // Adjust this if your HTML file has a different name
      },
      output: {
        format: 'esm',
        dir: 'dist',
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
});
