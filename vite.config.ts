import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, options) => {
          if (process.env.VITE_DEV_MODE === 'true') {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('[proxy] proxyReq to', proxyReq.path);
            });
          }
        },
        headers: {
          'X-Forwarded-For': '127.0.0.1',
          'X-Forwarded-Proto': 'http',
          'X-Real-IP': '127.0.0.1'
        },
        timeout: 120000
      },
      '/socket.io': {
        target: 'http://localhost:3004',
        ws: true,
        changeOrigin: true,
        secure: false,
        timeout: 120000
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@themes": path.resolve(__dirname, "./src/themes"),
    },
  },
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
}));