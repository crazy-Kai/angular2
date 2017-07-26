//修改中的参数
export class InsuranceModificationListDetail{
     id:any = '';
     summary:string;
     rate:number;
     description:string;
     insuranceId:number;
     isEnableModify:number;//是否可以编辑
     gmtCreate:any = '';
     gmtModified:any = '';
     isShow:boolean = true;
     isTextShow:boolean = true;
}
//投保人员类别下面的参数
export class ChangeInsurancePersonCategory {
	    id:any = '';//id      
      gmtCreate:any ='';
      gmtModified:any ='';
      classify:string = '';
      insuranceId:number;
}
//总共的数据信息,除了报销分类
export class InsuranceModificationDetail{
     id:any = '';//id
     insuranceId:number;
     name:string;//险种名称
     gmtModified:any = '';//修改时间
     drugNumbers:number=5;//复方位数
     gmtCreate:any = '';//创建时间
     description:string;//描述
     payType:string;
     reimbursements:InsuranceModificationListDetail[] =[];//报销分类
     personClassifies:ChangeInsurancePersonCategory[] = [];// 投保人员类别
}
//投保人员类别
export class PersonCategoryArray {
    personCategory:string = "";
    constructor() { }
}
//报销分类下面的参数
export class Test {
      summary: string; // 类别名称  
}
