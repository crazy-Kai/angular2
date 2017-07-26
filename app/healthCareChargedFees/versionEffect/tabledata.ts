//表格的数据
export class TableDataDetail {
	isActive:number;
	ruleVersionId:number; // 规则版本id
	insuranceId:number; // 保险ID
	diseaseVersionId:number;// 疾病版本id,
	drugVersionId:number;// 药品版本ID
	itemVersionId:number; // 项目版本ID
	materialVersionId:number; // 材料版本ID
	gmtModified:string;// 修改时间
	gmtCreate:string; // 创建时间
	ruleVersionName:string; // 规则版本名称
	ruleVersionDescription:string;//  规则版本描述
	diseaseVersionName:string;// 疾病版本名称
	diseaseVersionDescription:string;// 疾病版本描述
    drugVersionName:string; // 药品版本名称
    drugVersionDescription:string; // 药品版本描述
    materialVersionName:string;// 项目版本名称
    materialVersionDescription:string;// 项目版本描述
    itemVersionName:string; // 材料版本名称
    itemVersionDescription:string; // 材料版本描述
}
//定时生效需要传入的参数
export class EffectiveTimeDetail {
	id:any=''; // 版本生效设置对象ID 
	insuranceId:number; // 保险ID
	gmtCreate:any=''; // 创建时间
	gmtModified:any='';// 修改时间
	ruleVersion:any;// 规则版本ID   下拉框选择版本的时候,从该版本中取得的ID
	activeDate:string; // 生效时间
	activeMode:number; // 生效方式
	isActive:any=''; // 是否生效：
}