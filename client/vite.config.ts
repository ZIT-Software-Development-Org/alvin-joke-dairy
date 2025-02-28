import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 4000, // Specify the desired port
    host: true, // Make the server accessible from the network
    strictPort: true, // Fail if the port is not available
   
  },
});



