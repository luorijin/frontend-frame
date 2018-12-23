import {Dep} from './Observer'
let uid = 0;
export default class watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.vm._watchers.push(this);
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.deps=[];
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
        let value = this.getter.call(this, this.vm.data);
        Dep.target = null;
        return value;
    }
    update() {
        let value = this.get();
        this.cb.call(this.vm, value);
    }
    getVar(code){
        var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
        var SPLIT_RE = /[^\w$]+/g;
        var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
        var BOUNDARY_RE = /^,+|,+$/g;
        var SPLIT2_RE = /^$|,+/;
        return code
        .replace(REMOVE_RE, '')
        .replace(SPLIT_RE, ',')
        .replace(NUMBER_RE, '')
        .replace(BOUNDARY_RE, '')
        .split(SPLIT2_RE);

    }
    parseGetter(expOrFn) {
        console.log(this.getVar(expOrFn))
        let body = [];
        this.getVar(expOrFn).forEach(name => {
            body.push(`let ${name} = data.${name};`)
        });
        body.push(` return ${expOrFn};`)
        return new Function("data",body.join(''));
    }
}