import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Proxy
  server: {
    proxy: {
      '/rest': 'https://bwwtoionbsosagwqllro.supabase.co',
    },
  }
})
