import { defineConfig, type Connect } from 'vite';
import react from '@vitejs/plugin-react';
import { createBackend } from './backend.js';

/**
 * Mounts the OpenWorkflow backend as Vite dev middleware so `pnpm dev` serves
 * both the API (`/workflow/*`, `/catalog`) and the React app from one process.
 */
function openworkflowApi() {
  return {
    name: 'openworkflow-api',
    configureServer(server: { middlewares: Connect.Server }) {
      const { catalog, httpHandler, seedId } = createBackend();
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (url.startsWith('/catalog')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(catalog));
          return;
        }
        if (url === '/seed') {
          res.setHeader('Content-Type', 'application/json');
          void Promise.resolve(seedId).then((id) => res.end(JSON.stringify({ workflowId: id })));
          return;
        }
        if (url.startsWith('/workflow')) {
          httpHandler(req as never, res as never);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), openworkflowApi()],
  server: { port: 5173 },
});
