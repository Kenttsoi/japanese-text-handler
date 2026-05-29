import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // read .env
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // configure plugins
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      // configure proxy forwarding
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://127.0.0.1:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mantine/core',
      ],
      exclude: ['@tabler/icons-react']
    }
  };
});