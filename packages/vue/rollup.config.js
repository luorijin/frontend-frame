import path from "path";
import alias from 'rollup-plugin-alias';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import {Banner,plugins} from '../../scripts/rollup.config.base';
import { name, version, author } from './package.json';
const banner=Banner.g(name, version, author);
const resolve = p => path.resolve(__dirname, p)
const config = {
  input: 'src/index.js',
  external: [],
  output: [
    {
      file:'demo/vue.js',
      format: 'umd',
      name:"utils",
      banner,
      globals: {
      }
    }
  ],
  plugins: [
    ...plugins,
    alias({src:resolve('src')}),
    serve('demo'),
    livereload()
  ]
}
export default config;