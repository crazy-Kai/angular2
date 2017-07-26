//存数据,传输数据
export class DataList{
	summary:string;
	source:string;
	ativeDate:string;
	gmtCreate:string;
	gmtModified:string;
}
//修改数据
export class InsuranceModificationDetail{
	   id:number; 
	   summary:string;
	   source:string;
	   content:string;
	   ativeDate:number;
       constructor() { }
}
//保存数据
export class InsuranceDetail{
	   id:number; 
	   summary:string;
	   source:string;
	   content:string;
	   ativeDate:number;
       constructor() { }
}
//添加传数据
export class InsuranceAddDetail{
	   id:string; 
	   summary:string;
	   source:string;
	   content:string;//文件描述
	   ativeDate:number;
       constructor() { }
}

