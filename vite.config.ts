import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createServer } from './server/index.ts';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-backend',
      configureServer: async (viteServer) => {
        const app = await createServer();
        viteServer.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/api')) {
            app(req, res);
          } else {
            next();
          }
        });
      },
      configurePreviewServer: async (previewServer) => {
        const app = await createServer();
        previewServer.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/api')) {
            app(req, res);
          } else {
            next();
          }
        });
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
