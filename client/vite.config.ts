import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/alerts': 'http://localhost:3000',
      '/weather': 'http://localhost:3000',
    },
  },
});

//  test: {
//     globals: true,
//     environment: 'jsdom',
//   },