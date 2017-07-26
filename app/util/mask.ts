export class Mask{
	private interval: any;

	show(){
		let  ele = document.getElementById('masks');
			 
		if(ele){
			ele.style.display = 'block';
		}else{
			ele = this.createMaskEle();
			let tip = this.createMaskTip();
			ele.appendChild(tip);
			let time = 1,
				doc = 'Loading';
			tip.innerHTML = doc;
			this.interval = setInterval(function(){
				//删除之前加上的'.'
				if(time < 4){
					tip.innerHTML += '.';
					time++;
				}else{
					time = 1;
					tip.innerHTML = doc;
				}
			},200);

			document.body.appendChild(ele);
		}
	}

	createMaskEle(){

		let ele = document.createElement('div');
		ele.id = "masks";
		ele.style.display = 'block';
	    ele.style.background = 'none';
	    ele.style.position = 'fixed';
	    ele.style.left = '0';
	    ele.style.top = '0';
	    ele.style.bottom = '0';
	    ele.style.right = '0';
    	ele.style.zIndex = '9999';
    	
	    return ele;
	}

	createMaskTip(){

		let tip = document.createElement('div');
    	tip.id = "maskChildren";
    	tip.style.display = 'block';
		tip.style.color = '#000';
	    tip.style.background = '#fff';
	    tip.style.padding = '10px 20px';
	    tip.style.position = 'fixed';
	    tip.style.left = '50%';
	    tip.style.top = '50%';
	    tip.style.borderRadius = '4px';
	    tip.style.width = '300px';
	    tip.style.height = '50px';
	    tip.style.lineHeight = '30px';
	    tip.style.textAlign = 'center';
	    tip.style.fontSize = '26px';
	    tip.style.marginLeft = '-150px';
    	tip.style.marginTop = '-25px';
    	tip.style.letterSpacing = '2px';
    	tip.style.fontWeight = 'bold';
    	tip.style.border = '2px solid #ccc';
    	tip.style.boxShadow = '0 0 12px #ccc';
    	return tip;
	}

	close(){
		let el = document.getElementById('masks');
		//删除定时器
		clearInterval(this.interval);
		if(el){
			/*删除loading图*/
			document.body.removeChild(el);
		}
	}
}