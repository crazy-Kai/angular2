//版本管理  修改中保存按钮传输的数据
export class Addversiondetail{
    name:string; //新增版本名称
    description:string; //新增版本说明
    diseaseVersionId:number; //疾病目录版本id
    drugVersionId:number;//应药品目录版本id
    itemVersionId:number;//项目目录版本id
    materialVersionId:number; //材料目录版本id
    insuranceId:number;
}
//修改中保存按钮传输的数据
export class VersionmodificationDetail{
    id:number;//要修改规则版本id
    name:string;//修改后版本名称
    insuranceId:any;
    description:string; //修改后版本说明
    diseaseId:number; //疾病目录版本id
    drugId:number;//应药品目录版本id
    itemId:number;//项目目录版本id
    materialId:number; //材料目录版本id
}