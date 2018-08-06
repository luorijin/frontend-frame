import nodeResolve from 'rollup-plugin-node-resolve'     // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel'                             // rollup 的 babel 插件，ES6转ES5
import replace from 'rollup-plugin-replace'                       // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import commonjs from 'rollup-plugin-commonjs'              // 将非ES6语法的包转为ES6可用
import uglify from 'rollup-plugin-uglify'
export class Banner{
    static g(name, version, author){
        return `${'/*!\n' + ' * '}${name}.js v${version}\n` +
        ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
        ` * Released under the MIT License.\n` +
        ` */`;
    }
}
const env = process.env.NODE_ENV;
const target = process.env.TARGET
export const plugins=[
    nodeResolve(),
    babel({
        exclude: '**/node_modules/**',
        babelrc: false,
        presets: [ "es2015-rollup" ]
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs()
]
if (env === 'production'&&target==='umd') {
   plugins.push(
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    )
  }