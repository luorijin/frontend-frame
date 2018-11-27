import compile from './compile';
export default class Vue{
    constructor(options){
        this.$el=options.el;
        this.data=options.data;
        if(this.$el){
            new compile(this.$el,this.data);
        }
    }
}