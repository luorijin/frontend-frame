import {def,arrayMethods} from './array'
/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} src
 */

function protoAugment (target, src) {//重写数组方法依赖
    /* eslint-disable no-proto */
    target.__proto__ = src
    /* eslint-enable no-proto */
  }
  
  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * @param {Object|Array} target
   * @param {Object} proto
   */
  
  function copyAugment (target, src, keys) {//重写数组方法依赖
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i]
      def(target, key, src[key])
    }
  }
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)  
export default class Observer{
    constructor(data){
        this.observer(data)
    }
    observer(data){
        if (!data || typeof data !== 'object' ||data.isAbserve) {
            return;
        }
        if(Array.isArray(data)){
            var augment = '__proto__' in {}
            ? protoAugment
            : copyAugment
            augment(data, arrayMethods, arrayKeys)
            this.observeArray(data);
            return;
        }
        Object.keys(data).forEach((key)=>{
            this.defineReactive(data, key, data[key]);
            data.isAbserve=true;
            this.observer(data[key]); // 深度劫持
        })
    }
    observeArray(items){
        for (var i = 0, l = items.length; i < l; i++) {
            this.observer(items[i]);
          }
    }
    defineReactive(obj,key,value){
        let that=this;
        let dep = new Dep();
        //如果是数组，把dep挂载在上面
        if(Array.isArray(value)){def(value, '__dep__', dep)}
        Object.defineProperty(obj,key,{
            enumerable: true,
            configurable: true,
            get(){
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newValue){
                if (newValue !== value) {
                    that.observer(newValue) // 如果是对象继续劫持
                    value = newValue;
                    dep.notify();
                }
            }
        })
    }
}
export class Dep{
    constructor(){
        this.watcherId=[];
        this.subs=[];
    }
    addSub(watcher){
        if(this.watcherId.indexOf(watcher.id)!==-1) return;
        watcher.deps.push(this);
        this.subs.push(watcher);
        this.watcherId.push(watcher.id);
    }
    removeSub(watcher){
        let index = this.subs.indexOf(watcher.id);
        if(index!==-1){
            this.subs.splice(index,1);  
        }
    }
    notify(){
        this.subs.forEach(watcher => watcher.update());
    }
}