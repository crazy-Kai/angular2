export class AddManagementDetail {
    id:number;	
    name:string;//规则版本
    description:string;//版本说明
    diseaseName: string; //对应疾病目录版本
	  drugName: string; //对应药品目录版本
	  itemName: string; //规则版本对应项目版本
	  materialName: string; //规则版本对应材料版本
}
//就诊中新增规则需要传的参数
export class AddRulesData {
    insuranceId:any = "";
    name:any = "";
    ruleVersion:any = "";
}
   
