import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': 'http://localhost:3001',
      '/event-types': 'http://localhost:3001',
      '/bookings': 'http://localhost:3001',
    },
  },
})
