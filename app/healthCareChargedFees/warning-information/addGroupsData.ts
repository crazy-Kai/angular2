//医生端添加数据
export class AddGroupDetail {
	id:any = "";//自己的id
	insuranceId:number;//关联的保险id	
	category = "D"; // 医生端: D 护士端:
    source:string = '';//所有来源
    ruleType:string = '';//规则类型
    reason:string="";//使用理由
    level:string = '';//显示等级
    action:string = '';//执行操作
    
    //医生端
    isAnalysisBoxShow: boolean = false;//就诊来源
    isRuleTypeShow:boolean = false;//规则类型
    isLeveShow:boolean = false;//警示等级
    //护士端
    doctoryListContent:any = [{name:'全部',value:0},{name:'门诊',value:1},{name:'住院',value:2}];
	doctorTypeContent:any = [{name:'全部',value:0},{name:'项目规则',value:1},{name:'材料规则',value:2},
		  	                  {name:'疾病规则',value:3},{name:'药物规则',value:4},{name:'就诊规则',value:5}];
    doctorlevelContent:any = [{name:'全部'},{name:'0'},{name:'1'},{name:'2'},{name:'3'},
			                   {name:'4'},{name:'5'},{name:'6'},{name:'7'},{name:'8'},{name:'9'}];
}
//护士端传输的数据
export class AddGroupNurseDetail {
	id:any;//自己的id
	insuranceId:number;//关联的保险id	
	category:string; // 医生端: D 护士端:
    source:string;//所有来源
    ruleType:string;//规则类型
    reason:string;//使用理由
    level:string;//显示等级
    action:string;//执行操作
    
    isNurseBoxShow:boolean;//就诊来源
    isNurseTypeShow:boolean;//规则类型
    isNurseLenverShow:boolean;//警示等级
    
    constructor(){
    	this.id = "";//自己的id
    	this.category = "N"; // 医生端: D 护士端:
    	this.source = '';//所有来源
    	this.level= '';//显示等级
    	this.ruleType = '';
    	this.reason= '';//显示等级
    	this.action = '';
    }
    nurseListContent:any = [{name:'全部',value:0},{name:'门诊',value:1},{name:'住院',value:2}];
	nurseTypeContent:any = [{name:'全部',value:0},{name:'项目规则',value:1},{name:'材料规则',value:2},
		  	                  {name:'疾病规则',value:3},{name:'药物规则',value:4},{name:'就诊规则',value:5}];
    nurselevelContent:any = [{name:'全部'},{name:'0'},{name:'1'},{name:'2'},{name:'3'},
			                   {name:'4'},{name:'5'},{name:'6'},{name:'7'},{name:'8'},{name:'9'}];
}

export class SelectData{
	name:any;
	value:any;
//	constructor([{name,value}]){
//		this.name = name;
//		this.value = value;
//	}
	constructor(name,value){
		this.name = name;
		this.value = value;
	}
}
