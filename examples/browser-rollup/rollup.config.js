import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy'

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  context: 'globalThis',
  plugins: [
    copy({
      targets: [
        { src: './index.html', dest: 'dist/' },
        { src: './favicon.ico', dest: 'dist/' },
        { src: 'public/**/*', dest: 'dist/public/' }
      ]
    }),
    nodePolyfills(),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json(),
  ]
};

export default config;
