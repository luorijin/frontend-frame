import compile from './compile';
function tpToDom(template) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(template, 'text/html');
    // 此处生成的doc是一个包含html和body标签的HTMLDocument
    // 想要的DOM结构被包在body标签里面
    // 所以需要进去body标签找出来
    return doc.querySelector('body').firstChild;
};
class Vue{
    constructor(options){
        let opt={
            el:"#app",
            template:null,
            data:{},
            iSappend:true,
        }
        this.opt = Object.assign({}, opt, options);
        if(this.opt.template){
            this.$el = tpToDom(this.opt.template);
        }else{
            this.$el=typeof this.opt.el ==='string'?document.querySelector(this.opt.el): this.opt.el;
        }
        this.data= this.opt.data;
        this.childrens = Vue.childrens;
        this.iSappend =  this.opt.iSappend;
        this._watchers=[];
        if(this.$el){
            this.initProps();
            new compile(this);
        }
    }
    compileProps(node,propOptions){
        let props = [];
        propOptions.forEach((name) => {
            let prop = {};
            prop.name = name;
            let expression;
            if(expression = node.getAttribute(`:${name}`)){
                prop.dynamic = true;
                prop.expression = expression;
            }else if(expression = node.getAttribute(`${name}`)){
                prop.dynamic = false;
                prop.expression = expression;
            }
            props.push(prop);
        });
        return props;
    }
    initProps(){
        if(!this.opt.isComponent) return;
        let el = this.opt.el;
        if(!this.opt.props) return;
        let props = this.compileProps(el,this.opt.props);
        this.props= props;
    }
    distory(){
        this._watchers.forEach((watcher)=>{
            watcher.deps.forEach((dep)=>{
                dep.removeSub(watcher);
            })
        })
    }
}
Vue.childrens = [];
Vue.extend = function(extendOptions){
    let Super = this;
    let Sub = function vueComponent(options){
        Vue.call(this,Object.assign({}, extendOptions, options))
    }
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    return Sub;
}
Vue.components = function(id,definition){
    this.childrens[id] = definition;
}
export default  Vue;