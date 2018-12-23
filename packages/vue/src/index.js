import compile from './compile';
export default class Vue{
    constructor(options){
        let opt={
            el:"#app",
            data:[],
            iSappend:true,
        }
        this.extend(opt,options)
        this.$el=typeof opt.el ==='string'?document.querySelector(opt.el):opt.el;
        this.data=opt.data;
        this.iSappend = opt.iSappend;
        this._watchers=[];
        if(this.$el){
            new compile(this);
        }
    }
    extend(to,from){
        for (let key in from) {
            to[key] = from[key];
        }
    }
    distory(){
        this._watchers.forEach((watcher)=>{
            watcher.deps.forEach((dep)=>{
                dep.removeSub(watcher);
            })
        })
    }
}