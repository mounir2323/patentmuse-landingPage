import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  base: './',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: undefined
      }
    }
  }
})
