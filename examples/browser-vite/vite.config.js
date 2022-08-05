export default {
  build: {
    target: 'esnext',
    minify: false
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis'
  },
  optimizeDeps: {
    // target: es2020 added as workaround to make big ints work
    // https://github.com/vitejs/vite/issues/9062#issuecomment-1182818044
    esbuildOptions: {
      target: 'es2020',
    },
  }
}
