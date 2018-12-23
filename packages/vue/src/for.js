import rvue from './index'
import watcher from './watcher'
import dom from './dom'
let uid=0;
let repeadId=0;
export default class repeat extends dom{
    constructor(el,expr,vm){
        super();
        this.id=`_repeat_${uid++}`;
        this.$parent=vm;
        this.expr = expr;
        this.cacheVm=[];
        el.removeAttribute('v-for');
        this.$el=el;
        this.ref=document.createComment("v-repeat");
        el.childCompile=true;
        this.repalce(el,this.ref);
        this.Gedescriptor();
        this.build();
        new watcher(vm,this.expr,()=>{
            this.build();
        })
    }
    Gedescriptor(){//生成描述
        var inMatch = this.expr.match(/(.*) (?:in|of) (.*)/)
        if (inMatch) {
        var itMatch = inMatch[1].match(/\((.*),(.*)\)/)
        if (itMatch) {
            // v-for="{k,v} in array"的形式,iterator就是'k',别名为v
            this.iterator = itMatch[1].trim()
            this.alias = itMatch[2].trim()
        } else {
            // v-for="ele in array"的形式,别名为ele
            this.alias = inMatch[1].trim()
        }
        this.expr = inMatch[2]
        }
    }
    getScope(data){//生成作用域
        let scope = Object.create(this.$parent.data);
        console.log(scope);
        scope[this.alias] = data;
        return scope;
    }
    build(){
        let data = this.$parent.data[this.expr];
        let newVms = [];
        let oldVms = this.cacheVm;
        for(let i=0;i<data.length;i++){
            let cachevm =data[i][this.id];
            if(!cachevm){
                let scope = this.getScope(data[i]);
                let vm = new rvue({
                    el:this.$el.cloneNode(true),
                    data:scope,
                    iSappend:false,
                });
                newVms.push(vm);
                data[i][this.id] = vm;
                this.before(vm.fragment,this.ref);
            }else{
                cachevm.reused=true;
                this.before(cachevm.fragment,this.ref);
                newVms.push(cachevm); 
            }
        }
        oldVms.forEach((ovm)=>{
            if(ovm.reused){
                ovm.reused =false; 
            }else{
                this.remove(ovm.$el);
                ovm.distory();
            }
        });
        this.cacheVm = newVms;
    }
}