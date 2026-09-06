import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    // Target modern browsers that support native ES modules (smaller bundles)
    target: ['es2020', 'chrome80', 'safari13', 'firefox79'],
    // Split CSS per chunk — only loads CSS that's actually needed
    cssCodeSplit: true,
    // Minify with esbuild (fast) — use 'terser' for smaller output if you install it
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Deterministic chunk naming improves cache hits across deploys
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    // Enable source maps for production debugging (remove if file size matters more)
    sourcemap: false,
    // Report compressed sizes for honest bundle analysis
    reportCompressedSize: true,
  },
})

