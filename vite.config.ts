import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin to serve the teacher dashboard at /teacher/ during dev
function serveTeacherDashboard() {
  return {
    name: 'serve-teacher-dashboard',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/teacher' || req.url === '/teacher/' || req.url === '/teacher/index.html') {
          const file = path.resolve(__dirname, 'teacher/index.html');
          if (existsSync(file)) {
            res.setHeader('Content-Type', 'text/html');
            res.end(readFileSync(file, 'utf-8'));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [serveTeacherDashboard(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  json: {
    stringify: false,
  },
});
