import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // read .env
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // configure plugins
    plugins: [react()],
    server: {
      port: 5173,
      // configure proxy forwarding
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || 'http://127.0.0.1:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});