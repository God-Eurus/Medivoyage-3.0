import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Add this to allow your ngrok domain
    allowedHosts: [
      'punctually-unfrizzy-derrick.ngrok-free.dev'
    ]
  }
});