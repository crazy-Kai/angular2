import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../common/ug-dialog/dialog';
import { DialogModel } from '../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import {HealthManagementRulesService} from './healthManagementRules.service';
import {AddRulesData} from './dataList';//新增规则
@Component({
	selector: 'healthManagementRules',
	templateUrl:'healthManagementRules.component.html',
	styleUrls:['healthManagementRules.component.css'],
	providers:[HealthManagementRulesService]
})
export class HealthManagementRules  {
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	@ViewChild(TreeComponent)
	private tree: TreeComponent;//树
	
	private isOperatorDefaultTreeShow:boolean = true;//疾病树的那个三角形一开始默认出现
	private isOperatorTreeShow:boolean = false;//疾病树那个三角形后面出现
	private isOperatorDrugsTreeShow:boolean = false;//药品树那个三角形后面出现
	private isOperatorItemsTreeShow:boolean = false;//项目树那个三角形后面出现
	private isOperatorMaterialsTreeShow:boolean = false;//材料树那个三角形后面出现
	private isOperatorVisitsTreeShow:boolean = false;//就诊树那个三角形后面出现
	
	private isDiseaseDefaultTitleShow:boolean = true;//疾病框一开始默认出现,点击别的他消失
	private isDiseasesTitleShow:boolean = false;//疾病框正式出现出现
	
	private isDiseaseDefaultTreeShow:boolean = true;//疾病树一开始默认出现,点击其他 的他消失
	private isDiseasesTreeShow:boolean = false;//疾病正式出现出现
	
	private isDrugsTitleTreeShow:boolean = true;//药品框树出现
	private isDrugsTreeShow:boolean = false;//药品树出现
	
	private isItemsTreeShow:boolean = false;//项目树出现
	
	private isMaterialsTreeShow:boolean = false;//材料树出现
	
	private isVisitsTreeShow:boolean = false;//就诊树出现
	
	private isAddRulesShow:boolean = true;//判断是否能添加规则
	private isDialogShow:boolean = true;//判断对话框是否出现
	private isDeleteShow:boolean = false;//判断删除框是否出现
	private isShow:boolean = false;//添加规则 就诊
	private isRulesShow:boolean = true;//规则维护流程出现
	TestClassifyName:boolean = false;//报销分类名称
	private selectList:any;//用来装下拉菜单的数据
	activeIdx:number = 0;//下拉列表默认选中的那个
	private type:any = "疾病";//判断是哪个类型  默认为疾病
	handleType: number = 0;	//切换规则
	insuranceId:number;//险种id
	insuranceName:any;//险种名称
	versionName:any;//版本名称
	versionId:number;//版本id
	name:string;//版本名称
	id:any;//规则ID
    diseaseVersionId:any;//疾病id
    diseaseVersionName:any;//疾病名称
	drugIdversionId:any;//药品id
	drugIdversionName:any;//药品名称
	itemIdversionId:any;//项目id
	itemIdversionName:any;//项目名称
	materialIdversionId:any;//材料id
	materialIdversionName:any;//材料名称
	nodeName:any;//节点名称
	private editorRulesURL = 'http://10.1.1.191:8082/yibao/designer/editor.action';
	diseaseTreeData:any;//疾病树
    drugsTreeData:any;//药品树
	ItemsTreeData:any;//项目树
    MaterialTreeData:any;//材料树
    selectDataList:any;//就诊数据
	private isShowBtn:boolean=true;//点击下一步  新增规则
    addRulesData :AddRulesData = new AddRulesData();//新增规则
	diseaseCount:any;//疾病规则个数
	drugCount:any;//药品规则个数
	itemCount:any;//项目规则个数
	materialCount:any;//材料规则个数
	visitCount:any;//就诊规则个数
	getVisitingDataArray:any;//就诊详情  数据
	versionData:any;
	itemId:any;//删除就诊数据的id
	insuranceNameAny:any;
	testNameResult :boolean = true;
	nodeNames:any;
	
	constructor(
		private healthManagementRulesService:HealthManagementRulesService,
		private router: Router
	) { } 
    ngOnInit() {
    	console.log(this.tree);
    }
	
	diseaseNodeId:any;
	diseaseNodeName:any;
    open(diseaseNodeId,diseaseNodeName){
    	this.diseaseNodeId = diseaseNodeId;
    	this.diseaseNodeName = diseaseNodeName;
    	let _this = this;
    	_this.insuranceId = this.insuranceId;
    	_this.diseaseVersionName = this.diseaseVersionName;
    	_this.diseaseVersionId = this.diseaseVersionId;
    	_this.versionData = encodeURIComponent(this.insuranceId + "&&" + this.id);
    	window.open(_this.editorRulesURL+"?ruleType="+7+"&version="+_this.versionData+"&token="+123+"&insuranceId="+_this.insuranceId+"&insuranceName="+_this.insuranceNameAny+"&insuranceRuleVersionId="+_this.id+"&&insuranceRuleVersionName="+_this.name+"&targetVersionId="+_this.diseaseVersionId+"&targetVersionName="+_this.diseaseVersionName+"&targetId="+_this.diseaseNodeId+"&targetName="+this.diseaseNodeName+'');
    }
    drugsNodeId:any;
    drugsBodeName:any;
	openDrugs(drugsNodeId,drugsBodeName){
		this.drugsNodeId = drugsNodeId;
		this.drugsBodeName = drugsBodeName;
		let _this = this;
    	_this.insuranceId = this.insuranceId;
    	_this.drugIdversionName = this.drugIdversionName;
    	_this.drugIdversionId = this.drugIdversionId;
    	this.versionData = encodeURIComponent(this.insuranceId + "&&" + this.id);
    	window.open(_this.editorRulesURL+"?ruleType="+4+"&version="+_this.versionData+"&token="+123+"&insuranceId="+_this.insuranceId+"&insuranceName="+_this.insuranceNameAny+"&insuranceRuleVersionId="+_this.id+"&&insuranceRuleVersionName="+_this.name+"&targetVersionId="+_this.drugIdversionId+"&targetVersionName="+_this.drugIdversionName+"&targetId="+_this.drugsNodeId+"&targetName="+this.drugsBodeName+'');
	}
	itemsNodeId:any;
	itemNodeName:any;
	openItems(itemsNodeId,itemNodeName){
		this.itemsNodeId = itemsNodeId;
		this.itemNodeName = itemNodeName;
		let _this = this;
    	_this.insuranceId = this.insuranceId;
    	_this.itemIdversionName = this.itemIdversionName;
    	_this.itemIdversionId = this.itemIdversionId;
    	this.versionData = encodeURIComponent(this.insuranceId + "&&" + this.id);
    	window.open(_this.editorRulesURL+"?ruleType="+6+"&version="+_this.versionData+"&token="+123+"&insuranceId="+_this.insuranceId+"&insuranceName="+_this.insuranceNameAny+"&insuranceRuleVersionId="+_this.id+"&&insuranceRuleVersionName="+_this.name+"&targetVersionId="+_this.itemIdversionId+"&targetVersionName="+_this.itemIdversionName+"&targetId="+_this.itemsNodeId+"&targetName="+this.itemNodeName+'');
	}
	materialNodeId:any;
	materialNodeName:any;
	openMaterials(materialNodeId,materialNodeName){
		this.materialNodeId = materialNodeId;
		this.materialNodeName = materialNodeName;
		let _this = this;
    	_this.insuranceId = this.insuranceId;
    	_this.materialIdversionName = this.materialIdversionName;
    	_this.materialIdversionId = this.materialIdversionId;
    	this.versionData = encodeURIComponent(this.insuranceId + "&&" + this.id);
    	window.open(_this.editorRulesURL+"?ruleType="+5+"&version="+_this.versionData+"&token="+123+"&insuranceId="+_this.insuranceId+"&insuranceName="+_this.insuranceNameAny+"&insuranceRuleVersionId="+_this.id+"&&insuranceRuleVersionName="+_this.name+"&targetVersionId="+_this.materialIdversionId+"&targetVersionName="+_this.materialIdversionName+"&targetId="+_this.materialNodeId+"&targetName="+this.materialNodeName+'');
	}
	visitNodeId:any;
	visitNodeName:any;
	openVisits(visitNodeId,visitNodeName){
		this.visitNodeId = visitNodeId;
		this.visitNodeName = visitNodeName;
		let _this = this;
    	_this.insuranceId = this.insuranceId;
    	this.versionData = encodeURIComponent(this.insuranceId + "&&" + this.id);
    	window.open(_this.editorRulesURL+"?ruleType="+3+"&version="+_this.versionData+"&token="+123+"&insuranceId="+_this.insuranceId+"&insuranceName="+_this.insuranceNameAny+"&insuranceRuleVersionId="+_this.id+"&&insuranceRuleVersionName="+"就诊数据"+"&targetVersionId="+1+"&targetVersionName="+"就诊数据"+"&targetId="+_this.visitNodeId+"&targetName="+this.visitNodeName+'');
	}
/*初始化发送获取险种请求*/
	private insuranceTypeOption : any = {
		width:'280px',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/insurance'
	};
/*切换险种 下拉列表查询数据*/
	chooseInsurance($event){
		if($event){
			this.insuranceId = $event.id;//险种id
	    	this.insuranceName = $event.name;//险种名称
	    	this.insuranceNameAny = encodeURIComponent(this.insuranceName);
		}
    	this.getVersionData(this.insuranceId);//获取版本下拉框数据
    }
/*对话框出现*/
	sureAddVersion(){
		this.isDialogShow=false;
		this.isDeleteShow = false;
		this.dialogPlugin.onClose(); 
	}
/*树的配置项*/
    diseaseOptions = {
		getChildren:this.getDiseaseChildren.bind(this),
		idField: 'id',
	};
    drugOptions = {
		getChildren:this.getDrugsChildren.bind(this),
		idField: 'id',
	}; 
	itemOptions = {
		getChildren:this.getItemsChildren.bind(this),
		idField: 'id',
	}; 
   	materialOptions = {
		getChildren:this.getMaterialChildren.bind(this),
		idField: 'id',
	}; 
    diseaseDefaultShow(){
    	this.isRulesShow = true;
    	this.isShow = false;
    	this.isShowBtn = true;
    	
    	this.isDiseaseDefaultTitleShow=false;
    	this.isDiseaseDefaultTreeShow = false;
    	this.isDiseasesTitleShow = true;
    	
    	this.isDiseasesTreeShow = true;
    	this.isDrugsTreeShow = false;
    	this.isItemsTreeShow = false;
    	this.isMaterialsTreeShow = false;
    	
    	this.isOperatorDefaultTreeShow = true;
    	this.isOperatorDrugsTreeShow = false;
    	this.isOperatorItemsTreeShow = false;
    	this.isOperatorMaterialsTreeShow = false;
    	this.isOperatorVisitsTreeShow = false;
    }
    diseaseShow(){
    	this.isRulesShow = true;
    	this.isShow = false;
    	this.isShowBtn = true;
    	
    	this.isDiseaseDefaultTitleShow=false;
    	this.isDiseasesTitleShow = true;
    	
    	this.isDiseaseDefaultTreeShow = false;
    	
    	this.isDiseasesTreeShow = true;
    	this.isDrugsTreeShow = false;
    	this.isItemsTreeShow = false;
    	this.isMaterialsTreeShow = false;
    	this.isVisitsTreeShow = false;
    	
    	this.isOperatorDefaultTreeShow = true;
    	this.isOperatorDrugsTreeShow = false;
    	this.isOperatorItemsTreeShow = false;
    	this.isOperatorMaterialsTreeShow = false;
    	this.isOperatorVisitsTreeShow = false;
    }
    drugsShow(){
    	this.isRulesShow = true;
    	this.isShow = false;
    	this.isShowBtn = true;
    	
    	this.isDiseaseDefaultTitleShow=false;
    	this.isDiseasesTitleShow = true;
    	
    	this.isDiseaseDefaultTreeShow = false;
    	this.isDiseasesTreeShow = false;
    	this.isDrugsTreeShow = true;
    	this.isItemsTreeShow = false;
    	this.isMaterialsTreeShow = false;
    	this.isVisitsTreeShow = false;
    	
    	this.isOperatorDefaultTreeShow = false;
    	this.isOperatorDrugsTreeShow = true;
    	this.isOperatorItemsTreeShow = false;
    	this.isOperatorMaterialsTreeShow = false;
    	this.isOperatorVisitsTreeShow = false;
    }
    itemsShow(){
    	this.isRulesShow = true;
    	this.isShow = false;
    	this.isShowBtn = true;
    	
    	this.isDiseaseDefaultTitleShow=false;
    	this.isDiseasesTitleShow = true;
    	
    	this.isDiseaseDefaultTreeShow = false;
    	this.isDiseasesTreeShow = false;
    	this.isDrugsTreeShow = false;
    	this.isItemsTreeShow = true;
    	this.isMaterialsTreeShow = false;
    	this.isVisitsTreeShow = false;
    	
    	this.isOperatorDefaultTreeShow = false;
    	this.isOperatorDrugsTreeShow = false;
    	this.isOperatorItemsTreeShow = true;
    	this.isOperatorMaterialsTreeShow = false;
    	this.isOperatorVisitsTreeShow = false;
    }
    materialsShow(){
    	this.isRulesShow = true;
    	this.isShow = false;
    	this.isShowBtn = true;
    	
    	this.isDiseaseDefaultTitleShow=false;
    	this.isDiseasesTitleShow = true;
    	
    	this.isDiseaseDefaultTreeShow = false;
    	this.isDiseasesTreeShow = false;
    	this.isDrugsTreeShow = false;
    	this.isItemsTreeShow = false;
    	this.isMaterialsTreeShow = true;
    	this.isVisitsTreeShow = false;
    	
    	this.isOperatorDefaultTreeShow = false;
    	this.isOperatorDrugsTreeShow = false;
    	this.isOperatorItemsTreeShow = false;
    	this.isOperatorMaterialsTreeShow = true;
    	this.isOperatorVisitsTreeShow = false;
    }
    visitShow(){
    	this.isRulesShow = true;
    	this.isShow = false;
    	this.isShowBtn = true;
    	
    	this.isDiseaseDefaultTitleShow=false;
    	this.isDiseasesTitleShow = true;
    	
    	this.isDiseaseDefaultTreeShow = false;
    	this.isDiseasesTreeShow = false;
    	this.isDrugsTreeShow = false;
    	this.isItemsTreeShow = false;
    	this.isMaterialsTreeShow = false;
    	this.isVisitsTreeShow = true;
    	
    	this.isOperatorDefaultTreeShow = false;
    	this.isOperatorDrugsTreeShow = false;
    	this.isOperatorItemsTreeShow = false;
    	this.isOperatorMaterialsTreeShow = false;
    	this.isOperatorVisitsTreeShow = true;
    }
/*删除就诊规则的数据*/
    delData(node){
    	this.itemId = node.id;
    	this.isDialogShow = false;
    	this.isDeleteShow = true;
    	this.dialogPlugin.myModule();  
    }
/*就诊数据中确认是否要删除   对话框 */
    sure(){
    	this.healthManagementRulesService.del(this.itemId,this.insuranceId,this.id)
    	  .then(res=>{
    	  	   if(res.code == 200){
    	  	   	   this.dialogPlugin.onClose(); 
    	  	   	   this.getVisitingData(this.insuranceId,this.id)//就诊数据
    	  	   	   this.getRulesDataList(this.insuranceId,this.id);//规则个数
    	  	   }else{
    	  	   	   this.dialogPlugin.myModule();  
    	  	   	   this.getVisitingData(this.insuranceId,this.id)//就诊数据
    	  	   	   this.getRulesDataList(this.insuranceId,this.id);//规则个数
    	  	   	   this.getVisitingDataArray = [];
    	  	   }
    	  })
    }
/*获取版本下拉框数据*/
    getVersionData(insuranceId:number):void{
    	this.healthManagementRulesService.getversionData(insuranceId)
    	  .then(res=>{
    	  	   if(res.code == 200){
    	  	   		if(res.data.length!=0){
	  	   			    this.activeIdx = 0;//重置版本的默认选择
	    	  	   	   	this.selectList = res.data;
		    			/*版本ID*/
						this.diseaseVersionName = this.selectList[this.activeIdx].diseaseName;
		    	  	    this.drugIdversionName = this.selectList[this.activeIdx].drugName;
		    	  	    this.itemIdversionName = this.selectList[this.activeIdx].itemName;
		    	  	    this.materialIdversionName = this.selectList[this.activeIdx].materialName;
		    	  	    
		    	  	    this.diseaseVersionName = encodeURIComponent(this.diseaseVersionName);
		    	  	    this.drugIdversionName = encodeURIComponent(this.drugIdversionName);
		    	  	    this.itemIdversionName = encodeURIComponent(this.itemIdversionName);
		    	  	    this.materialIdversionName = encodeURIComponent(this.materialIdversionName);
		    			
		    	  	    this.diseaseVersionId = this.selectList[this.activeIdx].diseaseId;
		    	  	    this.drugIdversionId = this.selectList[this.activeIdx].drugId;
		    	  	    this.itemIdversionId = this.selectList[this.activeIdx].itemId;
		    	  	    this.materialIdversionId = this.selectList[this.activeIdx].materialId;
		    	  	    /*规则ID*/
		    	  	    this.id = this.selectList[this.activeIdx].id;
		    	  	    this.name = this.selectList[this.activeIdx].name;
		    	  	    this.name = encodeURIComponent(this.name);
			    	  	/*获取树和就诊数据*/ 
	    	  	   	    if(this.id){
	    	  	   	    	this.getDrugsDataTree(this.drugIdversionId,this.insuranceId,this.id)//药品树
	    	  	   	    	this.getDiseaseDataTree(this.diseaseVersionId,this.insuranceId,this.id)//疾病树
		    	  	   	    this.getItemsDataTree(this.itemIdversionId,this.insuranceId,this.id)//项目树
		    	  	   	    this.getmaterialDataTree(this.materialIdversionId,this.insuranceId,this.id)//材料树
	    	  	   	        this.getRulesDataList(this.insuranceId,this.id);//就诊规则个数
	    	  	   	    }
	    	  	   	    this.getVisitingData(this.insuranceId,this.id)//就诊数据
			    	  	this.isAddRulesShow=true;  
    	  	   		}else{
			    		this.diseaseCount=0;
				    	this.drugCount=0;
				    	this.itemCount=0;
				    	this.materialCount=0;
				    	this.visitCount=0;
				    	this.isAddRulesShow=false;
				    	this.isDialogShow=true;
				    	this.isDeleteShow = false;
				    	this.dialogPlugin.myModule();       
	    	  	   		this.diseaseTreeData = [];//疾病树
		    	  	   	this.drugsTreeData = [];//药品树
		    	  	   	this.ItemsTreeData = [];//项目树
		    	  	   	this.MaterialTreeData = [];//材料树
		    	  	   	this.getVisitingDataArray = [];//就诊详情
		    	  	    this.selectList = [];//规则版本下拉数据
    	  	   		}
    	  	    } 	  	  
    	  })
    }    
//获取疾病树
    getDiseaseDataTree(versionId?: number,insuranceId?:number,diseaseId?:any){
    	this.healthManagementRulesService.getDiseaseDataTree(this.diseaseVersionId,this.insuranceId,this.id)
    	  .then(res=>{
    	  	   if(res.code == 200){
					if(res.data.length !=0){
						this.diseaseTreeData = res.data;
					    this.deleteTreeModelexpandedNodeIds();
					}else{
						this.diseaseTreeData = [];
					}
				}
    	  })
   } 
//获取疾病树 点击倒三角获取子节点
    getDiseaseChildren(node: any): any {
		return this.healthManagementRulesService.getDiseaseChildrenByNode(node.data,this.diseaseVersionId,this.insuranceId,this.id);
	}
//获取药品树
    getDrugsDataTree(versionId?: number,insuranceId?:number,drugId?:any){
    	this.healthManagementRulesService.getDrugsDataTree(this.drugIdversionId,this.insuranceId,this.id)
    	  .then(res=>{
    	  	   if(res.code == 200){
					if(res.data.length !=0){
						this.drugsTreeData = res.data;
						this.deleteTreeModelexpandedNodeIds();
					}else{
						this.drugsTreeData = [];
					}
				}
    	  })
   }  
//获取药品树 点击倒三角获取子节点
    getDrugsChildren(node: any): any {
		return this.healthManagementRulesService.getDrugsChildrenByNode(node.data,this.drugIdversionId,this.insuranceId,this.id);
	}
//项目树
 	getItemsDataTree(itemIdversionId?: number,insuranceId?:any,itemId?:any){
    	this.healthManagementRulesService.getItemsDataTree(itemIdversionId,insuranceId,this.id)
    	  .then(res=>{
    	  	   if(res.code == 200){
					if(res.data.length !=0){
						this.ItemsTreeData = res.data;
						this.deleteTreeModelexpandedNodeIds();
					}else{
						this.ItemsTreeData = [];
					}
				}
    	  })
    }     
//获取项目树 点击倒三角获取子节点
    getItemsChildren(node: any): any {
		return this.healthManagementRulesService.getItemsChildrenByNode(node.data,this.itemIdversionId,this.insuranceId,this.id);
	}
//材料树
	getmaterialDataTree(materialIdversionId?: number,insuranceId?:any,materialId?:any){
	    	this.healthManagementRulesService.getmaterlalDataTree(materialIdversionId,insuranceId,this.id)
	    	  .then(res=>{
	    	  	   if(res.code == 200){
						if(res.data.length !=0){
							this.MaterialTreeData = res.data;
							this.deleteTreeModelexpandedNodeIds();
						}else{
							this.MaterialTreeData = [];
						}
					}
	    	  })
	} 
//获取材料树 点击倒三角获取子节点
    getMaterialChildren(node: any): any {
		return this.healthManagementRulesService.getMaterialChildrenByNode(node.data,this.materialIdversionId,this.insuranceId,this.id);
	}
//就诊数据  
	getVisitingData(insuranceId?:number,id?:any){
		this.healthManagementRulesService.getVisitingData(insuranceId,id)
		  .then(res=>{
		  	  if(res.code==200){
		  	  	if(res.data.length){
		  	  	  	this.getVisitingDataArray = res.data;
		  	  	}else{
		  	  		this.getVisitingDataArray = [];
		  	  	}
		  	  }
		  })
	}
//获取规则个数
	getRulesDataList(insuranceId?:number,id?:number){
    	this.healthManagementRulesService.getRulesDataList(insuranceId,id)
    	   .then(res=>{
    	   	   if(res.code==200){
    	   	   	 if(res.data.length!=0){
    	   	   	 	 this.selectDataList = res.data;
    	   	   	 	 if(this.selectList.length!=0){
    	   	   	 	 	 this.diseaseCount = this.selectDataList.diseaseCount;//疾病数据
		    	  		 this.drugCount = this.selectDataList.drugCount;//疾病数据
		    	  		 this.itemCount = this.selectDataList.itemCount;//疾病数据
		    	  		 this.materialCount = this.selectDataList.materialCount;//疾病数据
		    	  		 this.visitCount = this.selectDataList.visitCount;//疾病数据
    	   	   	 	 }
    	   	   	 }
    	   	   }
    	   })
    }
/*select的change事件*/
    optionClick($event){
	/*规则版本*/
    	this.id = this.selectList[this.activeIdx].id;/*规则版本id*/
    	this.name = this.selectList[this.activeIdx].name;
    /*目录版本*/
        this.diseaseVersionName = this.selectList[this.activeIdx].diseaseName;
  	    this.drugIdversionName = this.selectList[this.activeIdx].drugName;
  	    this.itemIdversionName = this.selectList[this.activeIdx].itemName;
  	    this.materialIdversionName = this.selectList[this.activeIdx].materialName;
  	    
  	    this.diseaseVersionName = encodeURIComponent(this.diseaseVersionName);
  	    this.drugIdversionName = encodeURIComponent(this.drugIdversionName);
  	    this.itemIdversionName = encodeURIComponent(this.itemIdversionName);
  	    this.materialIdversionName = encodeURIComponent(this.materialIdversionName);
   
    	this.diseaseVersionId = this.selectList[this.activeIdx].diseaseId;
	    this.drugIdversionId = this.selectList[this.activeIdx].drugId;
	    this.itemIdversionId = this.selectList[this.activeIdx].itemId;
	    this.materialIdversionId = this.selectList[this.activeIdx].materialId;
  	/*重新获取数据*/
	    if(this.id != undefined){
	    	this.getDrugsDataTree(this.drugIdversionId,this.insuranceId,this.id)//药品树
	    	this.getDiseaseDataTree(this.diseaseVersionId,this.insuranceId,this.id)//疾病树
	   	    this.getItemsDataTree(this.itemIdversionId,this.insuranceId,this.id)//项目树
	   	    this.getmaterialDataTree(this.materialIdversionId,this.insuranceId,this.id)//材料树
	   	    this.getRulesDataList(this.insuranceId,this.id);//获取总共有几个规则
            this.getVisitingData(this.insuranceId,this.id)//就诊数据
	    }
    } 
//添加规则
    addRules(){
    	this.isRulesShow=false;
    	this.isShow=true;
    	this.addRulesData.name = "";
    }
/*检测就诊  同名请求*/
    checkName(insuranceId,name,ruleVersion){
    	this.healthManagementRulesService.checkName(this.insuranceId,this.addRulesData.name,this.id)
    	  .then(res=>{
    	  	  if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
			   		}else{
			   			this.testNameResult = true;
			   		}
			  }else{
					if(res.code == 402){
		                    this.dialogPlugin.tip(res.message,null,"error",true);
		                    window.setTimeout(()=>{
		                    	location.reload();
	                		},3000)
	                }else{
							this.dialogPlugin.tip(res.message,null,"error",true);
                    }
	        }    
    	  })
    } 
    testName(){
    	if(this.addRulesData.name!=""&&this.testNameCode(this.addRulesData.name)){
    		this.checkName(this.insuranceId,this.addRulesData.name,this.id);
    	}
    }
//验证就诊数据  是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\.\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		return result;
	}  
//验证就诊数据 	
	testClassifyName(value){
		if(value){
			let reg = /^[a-zA-Z0-9\.\u4e00-\u9fa5]{2,10}$/g;
			let result = reg.test(value);
			if(result){
				this.TestClassifyName = true;
			}else{
				this.dialogPlugin.tip("规则名称格式错误",null,"error");
				this.TestClassifyName = false;
			}
		}else{
			this.dialogPlugin.tip("报销分类名不能为空",null,"error");
			this.TestClassifyName = false;
		}
	}
//点击下一步  新增规则
	addRulesDataStepy(){
		this.addRulesData.insuranceId = this.insuranceId;
		this.addRulesData.ruleVersion = this.id;
		if(this.testNameResult&&this.TestClassifyName){
			this.healthManagementRulesService.getAddRulesData(this.addRulesData)
			  .then(res=>{
				  	if(res.code==200){
				  		if(res.data.length!=0){
				  			this.isRulesShow=true;
				  		    this.isShow=false;
				  			/*把新增的数据丢入数组*/
				 	 		this.getVisitingDataArray.push(res.data);
				 	 		/*清空input*/
				 	 		this.addRulesData.name = "";
				  			this.dialogPlugin.tip("保存成功",null,"success");
				  			this.getRulesDataList(this.insuranceId,this.id);//就诊规则个数
				  			this.getVisitingData(this.insuranceId,this.id)//就诊数据
				  		}
				  	}else if(res.code==400){
				  		this.isRulesShow=false;
				  		this.isShow=true;
				  	}
			  })
		}else if(!this.testNameResult){
			this.dialogPlugin.tip("规则名称不能重名",null,'error');
		}else if(!this.TestClassifyName){
			this.dialogPlugin.tip("规则名称格式错误",null,'error');
		}
	}
//版本管理
    versionManagementTitle(){
    	let link:any = ['healthCareChargedFees/healthManagementRules/version-management/' + this.insuranceId];
    	this.router.navigate(link);
    }
//规则校验
    RulesCheckTitle(nodeName,nodeId,nodeType,type){
    	if(this.isDiseasesTreeShow==true||this.isDiseaseDefaultTreeShow == true){
    		type="disease";
    	}
    	if(this.isDrugsTreeShow==true){
    		type="drugs";
    	}
    	if(this.isItemsTreeShow==true){
    		type="projects";
    	}
    	if(this.isMaterialsTreeShow==true){
    		type="materials";
    	}
    	if(this.isVisitsTreeShow==true){
    		type="seeDoctor";
    	}
    	this.nodeName = nodeName.replace(/\([^\)]*\)/g,""); 
    	this.nodeNames = encodeURIComponent(this.nodeName);
        let link = ['healthCareChargedFees/healthManagementRules/rulesCheckout/healthRulesCheckout/healthLookRecipe',this.insuranceId,this.id,this.nodeName,nodeId,nodeType,type,this.drugIdversionId,this.diseaseVersionId,this.itemIdversionId,this.materialIdversionId];
    	this.router.navigate(link);
    }
//校验历史  跳转页面
    checkHistory(){
  	    let link =['healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/rulesCheckoutHistory'];
  	    this.router.navigate(link);
    }
/*删除展开属性*/
	deleteTreeModelexpandedNodeIds(){
		for(var prop in this.tree.treeModel.expandedNodeIds){
			if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
				delete this.tree.treeModel.expandedNodeIds[prop];
			}
		}
	}  
	setExpanded(arr: any[],flag?:any) {
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].open && arr[i].hasChildren){
				this.tree.treeModel.expandedNodeIds[arr[i].id] = flag;
				
			}
			
			if (arr[i].hasChildren && arr[i].children){
				this.setExpanded(arr[i].children,flag);
			}

		}
	}    
}



