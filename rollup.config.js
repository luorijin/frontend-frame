import path  from 'path';
import alias from 'rollup-plugin-alias';
import {Banner,plugins} from './scripts/rollup.config.base';
import { name, version, author } from './package.json';
const resolve = p => path.resolve(__dirname, p)
const banner=Banner.g(name, version, author);
const config = {
  input: 'src/index.js',
  external: [],
  output: {
    file:'dist/Flibrary.js',
    format: 'umd',
    name: 'Flibrary',
    banner,
    globals: {
    }
  },
  plugins: [
    ...plugins,
    alias({
        packages:resolve('packages')
    })
  ]
}
export default config;