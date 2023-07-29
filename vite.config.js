import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://github.com/vitejs/vite/issues/3817#issuecomment-864450199
export default defineConfig({
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util'
    }
  },
  plugins: [react()],
})
