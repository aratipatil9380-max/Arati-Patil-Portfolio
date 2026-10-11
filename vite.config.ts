import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vite config for M0. No extra plugins, aliases, or environment
// handling are added until a milestone actually requires them.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
  },
});
