import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/public/js/react/index.jsx',
      name: 'app',
      fileName: () => 'index.js',
    },
    outDir: 'src/public/js/react/dist',
    emptyOutDir: true,
  },
});
