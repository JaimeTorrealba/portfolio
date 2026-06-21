import { fileURLToPath, URL } from 'node:url'
import glsl from 'vite-plugin-glsl'
import compression from 'vite-plugin-compression'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('Tres') && tag !== 'TresCanvas' || tag === 'primitive',
        },
      },
    }),
    glsl(),
    compression({ algorithm: 'brotliCompress' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-tresjs': ['@tresjs/core', '@tresjs/cientos'],
          'vendor-gsap': ['gsap'],
        },
      },
    },
  },
})
