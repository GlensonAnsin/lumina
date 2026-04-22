import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      input: 'resources/js/app.tsx',
    },
  },
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      host: 'localhost',
    },
  },
});
