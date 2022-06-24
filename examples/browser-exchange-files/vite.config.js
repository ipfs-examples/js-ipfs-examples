export default {
  build: {
    target: 'esnext',
    minify: false
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis'
  }
}
