export class IosScollerFn{
	fn = function(){
    	   	if(navigator.platform == "MacIntel"){
    	   		if(document.getElementById('tableHeadRight')){
    	   			document.getElementById('tableHeadRight').style.paddingRight = "15px";
    	   		}
    	   		if(document.getElementById('tableHead')){
    	   			document.getElementById('tableHead').style.paddingRight = "15px";
    	   		}
    	  		if(document.getElementById('tableFooter')){
    	  			document.getElementById('tableFooter').style.paddingRight = "15px";
    	  		}
    	   }
	}
}
