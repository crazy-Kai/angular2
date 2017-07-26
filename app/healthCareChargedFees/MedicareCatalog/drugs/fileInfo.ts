export class FileInfo {
    id: string;
    fileName: string;
    fileVersion: any;
    filePath: string;
}

export class DataList{
	isEnable: any ="";//是否启用
	managementBasis: string ="";//管理依据
	scope: string ="";//适用范围
	promptMessage: string;//提示信息
	isNeedReason: any = "";//是否需要使用理由
	status: string = "";//警示状态
	promptType: string ="";//提示类型
	processingOpinion: string;//处理意见
	nodeId: number;//节点id
	level: any ="";//警示等级
	analysisType: string ="";//分析类型
	versionId: number;//版本id
	insuranceId: number;//险种id
	nodeType: string;//节点类型
}