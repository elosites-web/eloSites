import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

import type { Plugin } from 'vite';

function cartaoFallbackPlugin(): Plugin {
  return {
    name: 'cartao-html-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0];
        if (pathname === '/cartao' || pathname === '/cartao/') {
          const search = rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '';
          req.url = '/cartao/index.html' + search;
        } else if (pathname === '/404' || pathname === '/404/' || pathname === '/404.html') {
          const filePath = path.resolve(__dirname, 'public/404.html');
          if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf-8');
            _res.setHeader('Content-Type', 'text/html; charset=utf-8');
            _res.statusCode = 404;
            _res.end(html);
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0];
        if (pathname === '/cartao' || pathname === '/cartao/') {
          const search = rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '';
          req.url = '/cartao/index.html' + search;
        } else if (pathname === '/404' || pathname === '/404/' || pathname === '/404.html') {
          const filePath = path.resolve(__dirname, 'public/404.html');
          if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf-8');
            _res.setHeader('Content-Type', 'text/html; charset=utf-8');
            _res.statusCode = 404;
            _res.end(html);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cartaoFallbackPlugin()],
    build: {
      target: 'es2019',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'motion/react',
        'lucide-react',
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
