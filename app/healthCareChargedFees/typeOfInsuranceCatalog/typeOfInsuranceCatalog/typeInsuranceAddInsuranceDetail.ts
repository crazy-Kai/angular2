//报销分类下面的参数
export class AddInsuranceDesignation {
	  id:number;//id
      summary: string; // 类别名称  
      rate: number;//比例
      description:string;//描述
      insuranceId:any = ""; //险种名称    
      isEnableModify:number;//是否可以编辑
      isShow:boolean = true; 
      gmtCreate:number;
      gmtModified:number;
}
//投保人员类别下面的参数
export class AddInsurancePersonCategory {
	  id:number;//id      
      gmtCreate:number;
      gmtModified:number;
      classify:string;
      insuranceId:any = '';
}
//险种中的参数
export class AddInsuranceDetail {
    id:number;//id
	gmtCreate: string;// 创建时间  单位:ms
	gmtModified:number;// 修改时间  单位:ms
	name: string; //险种名称，必填666666
	description: string;// 保险简介
	drugNumbers: number;// 复方位数
	payType:string;
    reimbursements:AddInsuranceDesignation[] = [];  
    personClassifies:AddInsurancePersonCategory[] = [];// 投保人员类别
}
//险种
export class TypeOfInsurance {
    id: number; 
    name: string = ''; 
}
//报销分类下面的参数
export class TestDatail {
      summary: string; // 类别名称  
}
