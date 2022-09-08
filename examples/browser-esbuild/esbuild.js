import { build } from 'esbuild'

build({
  entryPoints: ['./src/index.js'],
  outfile: './dist/index.js',
  sourcemap: 'external',
  minify: true,
  bundle: true,
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis'
  }
})
  .catch(() => process.exit(1))