import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    allowedHosts: [
      'punctually-unfrizzy-derrick.ngrok-free.dev'
    ],
    // Add this if your app stops auto-reloading when you save files
    hmr: {
      clientPort: 443 
    }
  }
});