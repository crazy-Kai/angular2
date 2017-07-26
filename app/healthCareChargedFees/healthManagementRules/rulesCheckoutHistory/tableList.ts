//原先的查看处方,现在的就诊记录,搜索框需要传的参数
export class TableList{
	insuranceId:any = "";//险种id
	ruleVersion:any = "";//规则版本id
	ruleName:string = "";//规则名称
	pageNo:number;//页码			pageNo
	pageSize:number;//显示个数		pageSize
}