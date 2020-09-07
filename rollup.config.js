import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.ts', // our source file
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: 'bundle/iife/invokedb.js',
      format: 'iife',
      name: 'invokedb'
    },
    {
      file: 'bundle/iife/invokedb.min.js',
      format: 'iife',
      name: 'invokedbmin',
      plugins: [
        terser()
      ]
    }
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
};
