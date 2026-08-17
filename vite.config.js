import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // O site mora na raiz do domínio. Caminhos absolutos evitam que o navegador
  // peça o bundle em um lugar que o servidor não serve.
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 2048,
    sourcemap: false,
    emptyOutDir: true,
  },
  server: { host: true, port: 5179 },
  preview: { host: true, port: 4179 },
})
