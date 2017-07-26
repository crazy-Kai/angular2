//药品中表格数据
export class AddManagementDetail {
	  id:number;								//该值用于修改
    gmtCreate: number;	
    gmtModified: number;				//最后修改时间
    summary: string; //药品目录版本名称，必填666666
    description:string;				//说明
    mrvName: string;				//对应规则版
	  constructor() { }
}
export class VersionManagementmodification{
	  id:number;
	  summary:string;
	  description:string;
	  insuranceId:any;
		category:any;
    constructor() { }
}
//疾病中的保存
export class SicenessAddDetail{
	  category:"JB";
	  insuranceId:number;
      summary: string='';
      description:string='';
      oldId:string;
      constructor() { }
}
export class ProjectVersionManagementSave{
	   category:"XM";
	   insuranceId:number;
     summary: string='';
     description:string='';
     oldId:string;
     constructor() { }
}
export class MaterialVersionManagementSave{
	  category:"CL";
	  insuranceId:number;
    summary: string='';
    description:string='';
    oldId:string;
    constructor() { }
}
export class VersionManagementSave{
	  category:"YP";
	  insuranceId:number;
    summary: string="";
    description:string='';
    oldId:string;
    constructor() { }
}

   
