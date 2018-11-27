import watcher from './watcher';
import Observer from './Observer';
export default class compile {
    constructor(el, data) {
        this.$el = document.querySelector(el);
        this.data = data;
        this.updateFn = {
            expressGet(path) {
                path = path.split('.');
                let boby = 'if (o !=null';
                let pathString = 'o';
                let key;
                for (let i = 0; i < path.length - 1; i++) {
                    key = path[i];
                    pathString += `.${key}`;
                    boby += ` && ${pathString} != null`;
                }
                key = path[path.length - 1];
                pathString += `.${key}`;
                boby += `) return ${pathString}`;
                return new Function('o', boby);
            },
            setVal(data, exp, newVal) {
                exp = exp.split(".");
                return exp.reduce((prev, next, currentIndex) => {
                    // 如果当前归并的为数组的最后一项，则将新值设置到该属性
                    if(currentIndex === exp.length - 1) {
                        return prev[next] = newVal
                    }
            
                    // 继续归并
                    return prev[next];
                }, data);
            },
            getval(data, expr) {
                let get = this.expressGet(expr);
                return get(data);
            },
            text(node, value) {
                node.textContent = value;
            },
            model(node, value,modelbind) {
                node.value = value;
                if(modelbind){
                    node.addEventListener('input', e => {
                        // 获取输入的新值
                        let newValue = e.target.value;
                
                        // 更新到节点
                        this.setVal(modelbind.data, modelbind.expr, newValue);
                    });
                }
            }
        }
        new Observer(this.data);
        let fragment = this.node2fragment();
        this.compile(fragment);
        this.$el.appendChild(fragment);
    }
    node2fragment() {
        let fragment = document.createDocumentFragment();
        let child;
        while (child = this.$el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
    compile(fragment) {
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElementNode(node)) {
                this.compileElement(node)
                this.compile(node);
            } else {
                this.compileText(node, this.data);
            }
        });
    }
    isDirective(name) {
        return name.startsWith("v-");
    }
    isElementNode(node) { // 判断是否为元素及节点，用于递归遍历节点条件
        return node.nodeType === 1;
    }
    compileElement(node) {
        let attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                let expr = attr.value;
                let [, type] = attrName.split("-");
                let value = this.updateFn.getval(this.data, expr);
                this.updateFn[type](node, value,{data:this.data,expr});
                new watcher(this, expr, (newVal) => {
                    this.updateFn[type](node, newVal);
                })
            }
        })
    }
    compileText(node, data) {
        let expr = node.textContent; //取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g;
        let val = expr.replace(reg, (...args) => {
            expr=args[1];
            new watcher(this, args[1], (newVal) => {
                this.updateFn.text(node, newVal);
            })
            return this.updateFn.getval(data, args[1]);
        })
        this.updateFn.text(node, val);
    }
}