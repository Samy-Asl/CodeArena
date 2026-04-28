import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: "/CodeArena/",
  plugins: [react()],
  optimizeDeps: {
    include: ['@codemirror/view', '@codemirror/state', '@codemirror/lang-javascript', '@codemirror/lang-python', '@codemirror/theme-one-dark'],
  },
})
