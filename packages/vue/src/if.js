import rvue from './index'
import dom from './dom';
import watcher from './watcher';
let uid =0 ;
export default class vIf extends dom{
    constructor(el,expr,vm){
        super();
        this.$el = el;
        this.expr = expr;
        this.$parent = vm;
        el.removeAttribute('v-if');
        this.ifCondicition =[{block:el,expr}];
        this.ref = document.createComment(`if_${uid++}`);
        el.childCompile=true;
        this.getElse(this.$el.nextElementSibling);
        this.repalce(el,this.ref);
        this.render();
    }
    getElse(nextElem){
        if(!nextElem) return;
        if(nextElem.hasAttribute("v-else-if")){
            let expr = nextElem.getAttribute("v-else-if");
            nextElem.removeAttribute("v-else-if");
            this.ifCondicition.push({block:nextElem,expr})
            let NnextElem = nextElem.nextElementSibling;
            this.remove(nextElem);
            this.getElse(NnextElem);
            nextElem.childCompile=true;
        }else if(nextElem.hasAttribute("v-else")){
            nextElem.removeAttribute("v-else");
            nextElem.childCompile=true;
            this.hasElse={block:nextElem};
            this.remove(nextElem);
        }else{

        }
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
    expressGet(path) {
        let body = [];
        this.getVar(path).forEach(name => {
            body.push(`let ${name} = data.${name};`)
        });
        body.push(` return ${path};`)
        return new Function("data",body.join(''));
    }
    render(){
        let data = this.$parent.data;
        let ifCondicition = this.ifCondicition;
        let oldVm = this.vm;
        let ifDes = {Condicition:false};

        if(oldVm){
            this.remove(oldVm.$el);
            oldVm.distory();
         }
        for(let i=0;i<ifCondicition.length;i++){
            if(this.expressGet(ifCondicition[i].expr)(data)){
                ifDes.Condicition = ifCondicition[i];
               break;
            }
        }
        if(!ifDes.Condicition&&this.hasElse){
            ifDes.Condicition = this.hasElse;
        }
        if(ifDes.Condicition){
            let vm = new rvue({
                data:data,
                scopeType:"parent",
                el:ifDes.Condicition.block.cloneNode(true),
                iSappend:false,
            });
            this.before(vm.fragment,this.ref);
            this.vm = vm;
            new watcher(vm,ifCondicition[0].expr,()=>{
                this.render();
            })
        }
        return;
    }
}