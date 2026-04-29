import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/charts': 'http://localhost:3000',
      '/popular': 'http://localhost:3000',
    },
  },
})