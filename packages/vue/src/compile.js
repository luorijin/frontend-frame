import watcher from './watcher';
import Observer from './Observer';
import repeat from './for';
import vIf from './if';
import dom from './dom';
import parseText from './parse'
export default class compile extends dom{
    constructor(vm) {
        super();
        this.$el = vm.$el;
        this.data = vm.data;
        this.vm = vm;
        this.updateFn = {
            expressGet(path) {
                let body = [];
                this.getVar(path).forEach(name => {
                    body.push(`let ${name} = data.${name};`)
                });
                body.push(` return ${path};`)
                return new Function("data",body.join(''));
            },
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
        
            },
            setVal(data, exp, newVal) {
                
                new Function("data",`data.${exp} ='${newVal}';return true`)(data);
            },
            getval(expr) {
                let get = this.expressGet(expr);
                return get(vm.data);
            },
            setText(node, value){
                node.textContent = value;
            },
            text(node, expr) {
                this.setText(node,this.getval(expr));
                new watcher(vm, expr, (newVal) => {
                    this.setText(node,newVal);
                })
            },
            setModel(node, value){
                node.value = value;
            },
            model(node, expr) {
                this.setModel(node,this.getval(expr));
                node.addEventListener('input', e => {
                    // 获取输入的新值
                    let newValue = e.target.value;
            
                    // 更新到节点
                    this.setVal(vm.data, expr, newValue);
                });
                new watcher(vm, expr, (newVal) => {
                    this.setModel(node,newVal);
                })
            },
            for(node,expr){
                console.log(new repeat(node,expr,vm));
            },
            if(node,expr){
                new vIf(node,expr,vm)
            }
        }
        if(vm.scopeType!=="parent"){
            new Observer(this.data);
        }
        let iSappend = vm.iSappend;//是否append到跟元素
        let fragment = vm.fragment= this.node2fragment(iSappend);
        this.compile(fragment);
        if(iSappend){
            this.$el.appendChild(fragment);
        }
    }
    node2fragment(iSappend) {
        let fragment = document.createDocumentFragment();
        if(iSappend){
            let child;
            while (child = this.$el.firstChild) {
                fragment.appendChild(child);
            }
        }else{
            fragment.append(this.$el);
        }
        return fragment;
    }
    compile(fragment) {
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node => {
            let nodeType=this.isElementNode(node);
            if (nodeType===1) {
                this.compileElement(node)
                if(!node.childCompile){
                    this.compile(node);
                }
            } else if(nodeType===3){
                this.compileText(node, this.data);
            }else{
                return false;
            }
        });
    }
    isDirective(name) {
        return name.startsWith("v-");
    }
    isElementNode(node) { // 判断是否为元素及节点，用于递归遍历节点条件
        return node.nodeType;
    }
    compileElement(node) {
        let attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                let expr = attr.value;
                let [, type] = attrName.split("-");
                if(type=="else") return;
                this.updateFn[type](node, expr);
                
            }
        })
    }
    compileText(node) {
        let expr = node.textContent; //取文本中的内容
        var tokens = parseText(expr);
        if(tokens){
            tokens.forEach((token) => {
                if (token.tag) {
                    // 指令节点
                    let value = token.value;
                    let el = document.createTextNode('');
                    this.before(el, node);
                    this.updateFn.text(el,value);
                } else {
                    // 普通文本节点
                    console.log(token.value);
                    let el = document.createTextNode(token.value);
                    this.before(el, node);
                }
            });
            this.remove(node);
        }
    }
}