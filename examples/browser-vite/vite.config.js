import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2020',
    minify: false,
    // disable @rollup/plugin-commonjs https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
    // should be removable with vite 4 https://vitejs.dev/blog/announcing-vite3.html#esbuild-deps-optimization-at-build-time-experimental
    commonjsOptions: {
      include: []
    }
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis'
  },
  optimizeDeps: {
    // enable esbuild dep optimization during build https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109
    // should be removable with vite 4 https://vitejs.dev/blog/announcing-vite3.html#esbuild-deps-optimization-at-build-time-experimental
    disabled: false,

    // target: es2020 added as workaround to make big ints work
    // - should be removable with vite 4
    // https://github.com/vitejs/vite/issues/9062#issuecomment-1182818044
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
