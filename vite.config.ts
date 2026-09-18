import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  server: {
    // 5174, so this can run at the same time as the main portfolio on 5173.
    port: Number(process.env.PORT) || 5174,
    // Fail loudly rather than drifting to the next free port. The
    // desktop shortcut and the browser both assume 5174 is the mini landing page;
    // a server that quietly moved to 5176 would open the wrong thing.
    strictPort: true,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
