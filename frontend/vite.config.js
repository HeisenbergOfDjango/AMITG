import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose environment variables to the client
  // Variables prefixed with VITE_ are exposed to the client
  envPrefix: 'VITE_',
})
