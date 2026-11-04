import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Compatível com hospedagem estática, inclusive GitHub Pages.
});
