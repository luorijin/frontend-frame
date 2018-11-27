import {Dep} from './Observer'
let uid = 0;
export default class watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.id = uid++;
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }
        this.value = this.get();
    }
    get() {
        Dep.target = this;
        let value = this.getter.call(this.vm, this.vm.data);
        Dep.target = null;
        return value;
    }
    update() {
        let value = this.get();
        let oldVal = this.value;
        if(value !== oldVal){
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }
    parseGetter(expOrFn) {
        if (/[^\w.$]/.test(expOrFn)) return;
        let exps = expOrFn.split(".");
        return function (obj) {
            exps.forEach(exp => {
                obj = obj[exp];
            });
            return obj;
        }
    }
}