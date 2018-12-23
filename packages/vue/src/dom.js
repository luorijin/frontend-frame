export default class dom{
    repalce(target,el){
        let parent = target.parentNode;
        parent.insertBefore(el, target);
        parent.removeChild(target);
    }
    before(el,target){
        target.parentNode.insertBefore(el, target);
    }
    after(el,target){
        if (target.nextSibling) {
            this.before(el, target.nextSibling);
        } else {
            target.parentNode.appendChild(el);
        }
    }
    remove(el){
        el.parentNode.removeChild(el);
    }
}