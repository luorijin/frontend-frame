import path from "path";
import alias from 'rollup-plugin-alias';
import {Banner,plugins} from '../../scripts/rollup.config.base';
import { name, version, author } from './package.json';
const banner=Banner.g(name, version, author);
const resolve = p => path.resolve(__dirname, p)
const config = {
  input: 'src/index.js',
  external: [],
  output: {
    file:'index.js',
    format: 'es',
    banner,
    globals: {
    }
  },
  plugins: [
    ...plugins,
    alias({src:resolve('src')})
  ]
}
export default config;