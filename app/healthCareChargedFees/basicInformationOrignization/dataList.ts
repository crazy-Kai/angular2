//右边的数据,开关控制
export class RightSearchDetail{
	hospitalId:number;//医院ID
	hospitalCode:string;//医院代码
	isIntervene:string = '';//是否开启医保干预  1代表开启医保干预, 0代表没有开启医保干预
	orgType:string = '';//科室类型   1代表门诊科室, 2,代表住院科室
	orgName:string = '';//科室名称   
}
//保存按钮
export class SaveOriganizationDetail{
	id:any="";// 机构干预配置ID
	gmtCreate:string;
	gmtModified:string;
	hospital:string; // 医院代码
	department:string; // 科室代码
	enable:number;// 是否开启医保干预1,开启 0,关闭
}
export  class OfficeList{
    	enable:boolean;
    	interveneId:string;
}