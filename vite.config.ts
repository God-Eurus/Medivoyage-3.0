import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set VITE_PUBLIC_HOST=your-ngrok-domain.ngrok-free.dev when running through ngrok.
// Leave it unset for normal local dev — HMR will work over the default WS port.
const publicHost = process.env.VITE_PUBLIC_HOST;

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // ngrok / tunnel domains can be added here as needed
    allowedHosts: [
      'punctually-unfrizzy-derrick.ngrok-free.dev',
      ...(publicHost ? [publicHost] : []),
    ],
    // Only override HMR when running behind a public HTTPS tunnel (ngrok, Cloudflare, etc.)
    ...(publicHost && {
      hmr: {
        host: publicHost,
        protocol: 'wss',
        clientPort: 443,
      },
    }),
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});