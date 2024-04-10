import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.BIRTHDAYS_SERVER_HOST || '0.0.0.0',
    port: Number(process.env.BIRTHDAYS_SERVER_PORT) || 4123,
  },
})
