export default class Observer{
    constructor(data){
        this.observer(data)
    }
    observer(data){
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach((key)=>{
            this.defineReactive(data, key, data[key]);
            this.observer(data[key]); // 深度劫持
        })
    }
    defineReactive(obj,key,value){
        let that=this;
        let dep = new Dep();
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
        this.subs.push(watcher);
        this.watcherId.push(watcher.id);
    }
    notify(){
        this.subs.forEach(watcher => watcher.update());
    }
}