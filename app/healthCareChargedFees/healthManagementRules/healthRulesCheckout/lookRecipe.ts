//原先的查看处方,现在的就诊记录,搜索框需要传的参数
export class LookRecipeList{
	ruleVersion:number;//规则id
	versionId:number;// 版本id
	mcsId:any = "";//选择疾病 药品 项目 材料 节点
	ruleName:string;//当前节点的名称
	ruleId:number;//分别传疾病，药品等自己的id 诊断疾病 药品 项目 材料  当前节点id
	insuranceId:number;//险种id   		insuranceId
	branch:any = "";// 分支
	startDate:string = "";//开始日期		startDate
	endDate:string = "";//结束时间		endDate
	warningNumber:any = '';//警示信息数
	visitSource:string = "";//就诊方式		visitSource
	sex:string = "";//患者性别		sex
	endAge:string = "";//结束年龄		endAge
	startAge:string = "";//开始年龄		startAge
	isPregnant:string = "";//孕产信息		isPregnant
	ruleType:string = ""; //规则类型
}
/*规则校验表格是数据*/
export class TableListData{
	hospital:any='';//就诊医院
	dept:any='';//就诊科室
	docTitle:any='';//医生职称
	source:any='';//就诊类型
	age:any='';//患者年龄
	sex:any='';//患者性别
	disease:any='';//诊断结果
	message:any='';//警示信息
	opinion:any='';//建议信息
	
	
//	就诊医院	hospital	就诊表
//	就诊科室	dept		处方表
//	医生职称	docTitle	处方表
//	就诊类型	source		就诊表
//	患者年龄	age			就诊表
//	患者性别	sex			就诊表
//	诊断结果	disease		疾病表(逗号隔开)
//	警示信息	message		警示信息表
//	建议信息	opinion 	警示信息表
//	
//	eventNo
//	hospitalNo
}