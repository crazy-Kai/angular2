//export class VersionDecideFn{
//	fn = function(){
//		testInsuranceName(value){
//	        let reg = /^[_,.!\n\w\u4e00-\u9fa5]{3,10}$/g; 
//			let result = reg.test(value);
//			if(result){
//				this.TestInsuranceName = true;
//			}else{
//				this.dialogPlugin.tip("版本名称格式错误",null,"error");
//				this.TestInsuranceName = false;
//			}
//		} 	
//	}
//}

export class VersionDecideFn{
	fn = function(value){
	        let reg = /^[_,.!\n\w\u4e00-\u9fa5]{3,10}$/g; 
			let result = reg.test(value);
			if(result){
				this.TestInsuranceName = true;
			}else{
				this.dialogPlugin.tip("版本名称格式错误",null,"error");
				this.TestInsuranceName = false;
			}
	}
}