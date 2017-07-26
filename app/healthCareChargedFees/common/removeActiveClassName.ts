export class RemoveClass{
	hasClass = function(ele?:any, cls?:any){
        return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }
    removeClass = function(ele, cls){
         if (this.hasClass(ele, cls)){
            let  reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    }
    toggleClass = function(ele, cls){
         if(this.hasClass(ele,cls)){ 
            this.removeClass(ele, cls); 
        }
    }
    toggleClassTest = function(){ 
        // let ele = document.getElementsByClassName('tree-node-active')[0]; 
        let eles = document.getElementsByClassName('tree-node-focused')[0];
        // this.toggleClass(ele,"tree-node-active"); 
        this.toggleClass(eles,'tree-node-focused');
    }

}
