export default {
  build: {
    target: 'esnext'
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis'
  }
}
