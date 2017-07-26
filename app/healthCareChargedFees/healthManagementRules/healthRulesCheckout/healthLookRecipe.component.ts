import { Component, OnInit, Input, trigger, state, style, transition, animate, ViewChild,EventEmitter, HostListener,Renderer} from '@angular/core';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {RulesLookRecipeService} from './healthLookRecipe.service';
import {LookRecipeList,TableListData} from './lookRecipe';//表格信息
import {IosScollerFn} from '../../common/table_width';//兼容IOS表格的滚动条宽度的方法

@Component({
	selector: 'healthLookRecipe',
	templateUrl:'healthLookRecipe.component.html',
	styleUrls:['healthLookRecipe.component.css'],
	providers:[RulesLookRecipeService]
})
export class HealthLookRecipeComponent implements OnInit {
    @ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;
    @ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
    @ViewChild(TreeComponent)
	private tree: TreeComponent;
    insuranceId:any;//险种ID 
    versionId:any;//版本id
    versionIdNumbber:any;//当前对应的id
    name:any;//当前选择的版本名称
    nodeName:any;//当前节点对应的名称
    nodeId:any;//当前节点对应的id
    type:any;
    private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
    lookRecipeList:LookRecipeList = new LookRecipeList();//获取表格数据
    tableList:TableListData = new TableListData();//表格数据
    private isDiseaseShow:boolean=false;//疾病对话框出现
    private isDrugsShow:boolean=false;//药品对话框出现
    private isProjectsShow:boolean=false;//项目对话框出现
    private isMaterialsShow:boolean=false;//材料对话框出现
    private isTypeShow:boolean=false;//就诊对话框出现
    private isServiceTableShow:boolean=true;//判断四个对话框出现
    drugActiveName:any;//当前药品名称
	drugsActiveId:any;//当前药品id
    projectActiveName:any;//当前项目名称
	projectActiveId:any;//当前项目id
	materialActiveName:any;//当前材料名称
    materialActiveId:any;//当前材料id
    diseaseActiveName:any;//疾病数据
    diseaseActiveId:any;//当前疾病id
    
    startAgeNUmber:any;//患者开始年龄
    endAgeNumber:any;//患者结束年龄
    
    msgList:any;//存储表格数据
    pageInfo: any = {};//新对象	
    OfficeList:any=[];//用来装搜索数据信息
	/*进入规则校验页面需要传入的参数*/	
	drugIdversionId:any;//药品id
	diseaseVersionId:any;//疾病id
	itemIdversionId:any;//项目id
	materialIdversionId:any;//材料id
	nodeType:any;//判断当前节点是否有数据
	ruleType:any;//规则类型 疾病2 药品1
	mcsId:any = "";//选择疾病 药品 项目 材料 节点 规则校验页面选择的id
    
    diseaseArray:any;//查询疾病
    drugDataArray:any;//查询药品    
    projectDataArray:any;//查询项目
    materialDataArray:any;//查询材料
    tableUrl = '/ipharmacare-distributed-yb-web/ruleCheck/checkInfo';	
    
    warningNumberShow:boolean = true;
    warningNumberShows:boolean = false;
    tableData:any;
    
    diseasesHasChildren:any;
    diseasesChildrenName:any;
    drugsHasChildren:any;
    drugsChildrenName:any;
    itemsHasChildren:any;
    itemsChildrenName:any;
    projectsHasChildren:any;
    projectsChildrenName:any;
    
    diseasesIndexName:any;//当前选择的那个name,用于点击确认按钮的时候,将数据渲染在页面上	
    diseasesIndexId:any;//当前选择的那个id,用于点击确认按钮的时候,将数据保存在页面上,好传给后端做保存	
    drugsIndexName:any;//当前选择的那个name,用于点击确认按钮的时候,将数据渲染在页面上	
    drugsIndexId:any;//当前选择的那个id,用于点击确认按钮的时候,将数据保存在页面上,好传给后端做保存	
    projectsIndexName:any;//当前选择的那个name,用于点击确认按钮的时候,将数据渲染在页面上	
    projectsIndexId:any;//当前选择的那个id,用于点击确认按钮的时候,将数据保存在页面上,好传给后端做保存	
    materialsIndexName:any;//当前选择的那个name,用于点击确认按钮的时候,将数据渲染在页面上	
    materialsIndexId:any;//当前选择的那个id,用于点击确认按钮的时候,将数据保存在页面上,好传给后端做保存	
    
	constructor( 
		private rulesLookRecipeService:RulesLookRecipeService,
		private router: Router,
		private route : ActivatedRoute,
		private renderer: Renderer
	){}
    ngOnInit(){ 
         this.getRouteParam();//从规则管理首页获取险种id,版本id,版本名称
         this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
         this.getMsgList(this.tableUrl + '?sign=' +  this.tableData + '&pageNo=1'+'&pageSize=20');//获取表格数据
    }
/*从规则管理首页获取险种id,版本id,版本名称*/
    getRouteParam(){
     	this.route.params.subscribe(param => {
     		this.insuranceId = this.route.params['value'].insuranceId;//险种id
     		this.versionId = this.route.params['value'].versionId;//版本id
     		this.name = this.route.params['value'].name;//版本名称
     		this.nodeName = this.route.params['value'].nodeName;//节点name
     		this.nodeId = this.route.params['value'].nodeId;//节点id
     		this.nodeType = this.route.params['value'].nodeType;//节点类型
     		this.drugIdversionId = this.route.params['value'].drugIdversionId;//药品id
     		this.diseaseVersionId = this.route.params['value'].diseaseVersionId;//疾病id
     		this.itemIdversionId = this.route.params['value'].itemIdversionId;//项目id
     		this.materialIdversionId = this.route.params['value'].materialIdversionId;//材料id
     		this.type = this.route.params['value'].type;//自己加 的判断到底是药品还是疾病等类型
     		if(this.type == "disease"){
     			this.type="疾病"; 
     			this.ruleType = 2;
     			this.versionIdNumbber = this.diseaseVersionId;
     			this.getDiseaseDataList(this.insuranceId,this.diseaseVersionId,this.versionId,this.nodeId);//获取疾病数据
     		}
     		if(this.type == "drugs"){
     			this.type="药品"; 
     			this.ruleType = 3;
     			this.versionIdNumbber = this.drugIdversionId;
     			this.getDrugDataList(this.drugIdversionId,this.nodeId,this.ruleType,this.versionId,this.insuranceId);
     		}
     		if(this.type == "projects"){
     			this.type="项目"; 
     			this.ruleType = 4;
     			this.versionIdNumbber = this.itemIdversionId;
     			this.getProjectDataList(this.itemIdversionId,this.nodeId,this.ruleType,this.versionId,this.insuranceId);//获取项目数据
     		}
     		if(this.type == "materials"){
     			this.type="材料"; 
     			this.ruleType = 5;
     			this.versionIdNumbber = this.materialIdversionId ;
     			this.getMaterialDataList(this.materialIdversionId,this.nodeId,this.ruleType,this.versionId,this.insuranceId);//获取材料数据
     		}
     		if(this.type == "seeDoctor"){
     			this.type="就诊";
     			this.ruleType = 1;
     			this.versionIdNumbber = 0;
     			this.isTypeShow=true;
     		}
     	})
    }
/*获取搜索信息数据*/
    getSearchData():void{
    	if(this.startDate && this.endDate){
		 	 this.lookRecipeList.startDate = this.startDate.year +'-'+this.startDate.month+'-'+this.startDate.day;
		  	 this.lookRecipeList.endDate =this.endDate.year +'-' + this.endDate.month + '-' + this.endDate.day;
		}
    	this.lookRecipeList.endAge = this.endAgeNumber;//结束年龄	
    	this.lookRecipeList.startAge = this.startAgeNUmber;//开始年龄
    	this.lookRecipeList.mcsId = this.mcsId;//当前节点id
    	this.lookRecipeList.ruleName = this.nodeName;//当前节点名称
    	this.lookRecipeList.ruleId = this.nodeId;//当前节点id
    	this.lookRecipeList.ruleType = this.ruleType;//规则类型
    	this.lookRecipeList.insuranceId = this.insuranceId;//险种id  
    	this.lookRecipeList.versionId = this.versionIdNumbber;//版本id  
    	this.lookRecipeList.ruleVersion = this.versionId;//版本id
    	/*警示信息数*/
    	if(this.lookRecipeList.warningNumber==''){
    		this.lookRecipeList.warningNumber = 50;
    		this.warningNumberShow = false;
    		this.warningNumberShows=true;
    	}
    	this.rulesLookRecipeService.getSearchData(this.lookRecipeList)
    	  .then(res=>{
    	  	   if(res.code==200 && res.data){
    	  	   	  this.tableData = res.data;
    	  	   	  this.getMsgList(this.tableUrl + '?sign=' +  this.tableData + '&pageNo=1'+'&pageSize=20');//获取表格数据
    	  	   	  
     	  	  	  this.pageInfo = new Object(); 
     	  	  	  this.pageInfo.currentPage = res.data.currentPage;
     	  	  	  this.pageInfo.totalPageCount = res.data.pageCount;
     	  	  	  this.pageInfo.pageSize = res.data.pageSize;
     	  	  	  this.pageInfo.recordCount = res.data.recordCount;
     	  	  	  this.OfficeList = res.data.recordList || [];
     	  	  	  this.lookRecipeList.startDate = "";
                  this.lookRecipeList.endDate = "";
                  this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
     	  	  }
    	  })
    }
 /*获取表格数据*/
     getMsgList(Api: string){
     	let query: string = Api;
	    for(let attr in this.tableList){
            if (this.tableList[attr]) {
				query += `&${attr}=${this.tableList[attr]}`;
			}
        }
		this.rulesLookRecipeService.getTableList(query)
		  .then(res=>{
		  	  if(res.code == 200 && res.data){
		  	  	 this.pageInfo = new Object();
                 this.pageInfo.currentPage = res.data.currentPage;
                 this.pageInfo.totalPageCount = res.data.pageCount;
                 this.pageInfo.pageSize = res.data.pageSize;
                 this.pageInfo.recordCount = res.data.recordCount;
                 this.msgList = res.data.recordList || [];
                 this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
		  	  }else{
		  	  	 this.msgList = [];
		  	  }
		  })
     }
/*规则校验搜索按钮*/
    search(){
    	this.getSearchData()//获取搜索数据
    }
/*树的配置项*/
    diseasesOptions = {
		getChildren:this.getDiseaseChildren.bind(this),
		idField: 'id',
	};
    drugsOptions = {
		getChildren:this.getDrugsChildren.bind(this),
		idField: 'id',
	};
	projectsOptions = {
		getChildren:this.getProjectsChildren.bind(this),
		idField: 'id',
	}
	materialsOptions = {
		getChildren:this.getMaterialsChildren.bind(this),
		idField: 'id',
	}
/*获取疾病数据*/
    getDiseaseDataList(insuranceId?:number,versionId?:number,ruleVersion?:any,code?:any){
    	this.rulesLookRecipeService.getDiseaseDataList(insuranceId,versionId,ruleVersion,code)
    	  .then(res=>{
    	  	   if(res.code==200){
    	  	   	   if(res.data.length!=0){
    	  	   	   	    this.diseaseArray = res.data;
    	  	   	   	    for(let i=0;i<this.diseaseArray.length;i++){
    	  	   	   	    	 this.diseasesHasChildren = this.diseaseArray[0].hasChildren;
    	  	   	   	    	 this.diseasesChildrenName = this.diseaseArray[0].name;
    	  	   	   	    	 if(this.diseasesHasChildren==true){
                                this.diseasesChildrenName = '';
    	  	   	   	    	 }else if(this.diseasesHasChildren==false){
    	  	   	   	    	 	this.diseasesChildrenName = this.diseasesChildrenName;
    	  	   	   	    	 	this.isDrugsShow=false;
    	  	   	   	    	 	this.dialogPlugin.onClose();  
    	  	   	   	    	 }
    	  	   	   	    }
    	  	   	   }else{
    	  	   	   	    this.diseaseArray = [];
    	  	   	   }
    	  	   }
    	  })
    } 
    diseasesClick($event,diseaseActiveName,diseaseActiveId){
    	this.diseaseActiveName = diseaseActiveName;//当前药品名称
    	this.diseaseActiveId = diseaseActiveId;//当前药品id
    	if(this.diseaseActiveId){
    		this.mcsId = this.diseaseActiveId;
    	}
    }
/*获取疾病数据  点击倒三角获取子节点*/
    getDiseaseChildren(node: any): any {
		return this.rulesLookRecipeService.getDiseaseChildrenByNode(this.insuranceId,this.diseaseVersionId,this.versionId,node.data);
	}
	checkdiseases($event){
		if(this.diseasesHasChildren==true){
   	    	this.dialogPlugin.myModule(); 
   	    	this.isDiseaseShow=true;
   	    }else if(this.diseasesHasChildren==false){
   	    	this.dialogPlugin.onClose();  
   	    	this.isDiseaseShow=false;
   	    	this.dialogPlugin.tip("已经是最小节点",null,'error');
   	    }
	}
	surediseases(){
		this.isDiseaseShow=true;
		this.diseasesIndexName = this.diseaseActiveName;
		this.diseasesIndexId = this.diseaseActiveId;
    	this.dialogPlugin.onClose();    
    }    
/*获取药品数据*/
    getDrugDataList(versionId?:number,nodeId?:any,ruleType?:any,ruleVersion?:any,insuranceId?:any){
    	this.rulesLookRecipeService.getDrugDataList(versionId,nodeId,ruleType,ruleVersion,insuranceId)
    	  .then(res=>{
    	  	   if(res.code==200){
    	  	   	   if(res.data.length!=0){
    	  	   	   	    this.drugDataArray = res.data;
    	  	   	   	    for(let i=0;i<this.drugDataArray.length;i++){
    	  	   	   	    	 this.drugsHasChildren = this.drugDataArray[0].hasChildren;
    	  	   	   	    	 this.drugsChildrenName = this.drugDataArray[0].name;
    	  	   	   	    	 if(this.drugsHasChildren==true){
                                this.drugsChildrenName = '';
    	  	   	   	    	 }else if(this.drugsHasChildren==false){
    	  	   	   	    	 	this.drugsChildrenName = this.drugsChildrenName;
    	  	   	   	    	 	this.isDrugsShow=false;
    	  	   	   	    	 	this.dialogPlugin.onClose();  
    	  	   	   	    	 }
    	  	   	   	    }
    	  	   	   }else{
    	  	   	   	    this.drugDataArray = [];
    	  	   	   }
    	  	   }
    	  })
    } 
    drugsClick($event,drugActiveName,drugsActiveId){
    	this.drugActiveName = drugActiveName;//当前药品名称
    	this.drugsActiveId = drugsActiveId;//当前药品id
    	this.mcsId = this.drugsActiveId;
    }
/*获取药品数据  点击倒三角获取子节点*/
    getDrugsChildren(node: any): any {
		return this.rulesLookRecipeService.getdrugsChildrenByNode(this.drugIdversionId,node.data,this.ruleType,this.versionId,this.insuranceId);
	}
	checkdrugs($event){
		if(this.drugsHasChildren==true){
   	    	this.dialogPlugin.myModule(); 
   	    	this.isDrugsShow=true;
   	    }else if(this.drugsHasChildren==false){
   	    	this.dialogPlugin.onClose();  
   	    	this.isDrugsShow=false;
   	    	this.dialogPlugin.tip("已经是最小节点",null,'error');
   	    }
	}
	sureDrugs(){
		this.isDrugsShow=true;
		this.drugsIndexName = this.drugActiveName;
		this.drugsIndexId = this.drugsActiveId;
    	this.dialogPlugin.onClose();    
    }
/*获取树 更新树后展开或者关闭树的方法*/
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
/*获取项目树数据*/
    getProjectDataList(versionId?:number,nodeId?:any,ruleType?:any,ruleVersion?:any,insuranceId?:any){
    	this.rulesLookRecipeService.getProjectDataList(versionId,nodeId,ruleType,ruleVersion,insuranceId)
    	  .then(res=>{
    	  	   if(res.code==200){
    	  	   	   if(res.data.length!=0){
    	  	   	   	    this.projectDataArray = res.data;
    	  	   	   	    for(let i=0;i<this.projectDataArray.length;i++){
    	  	   	   	    	 this.itemsHasChildren = this.projectDataArray[0].hasChildren;
    	  	   	   	    	 this.itemsChildrenName = this.projectDataArray[0].name;
    	  	   	   	    	 if(this.itemsHasChildren==true){
                                this.itemsChildrenName = '';
                                
    	  	   	   	    	 }else if(this.itemsHasChildren==false){
    	  	   	   	    	 	this.itemsChildrenName = this.itemsChildrenName;
    	  	   	   	    	 	this.isProjectsShow=false;
    	  	   	   	    	 	this.dialogPlugin.onClose();  
    	  	   	   	    	 }
    	  	   	   	    }
    	  	   	   }else{
    	  	   	   	    this.projectDataArray = [];
    	  	   	   }
    	  	   }
    	  })
    } 
/*当前节点给点击事件,需要传给后端*/
    projectsClick($event,projectActiveName,projectActiveId){
    	this.projectActiveName = projectActiveName;
    	this.projectActiveId = projectActiveId;
    	this.mcsId = this.projectActiveId;
    }
/*获取项目数据  点击倒三角获取子节点 */
    getProjectsChildren(node: any): any {
		return this.rulesLookRecipeService.getProjectsChildrenByNode(this.itemIdversionId,node.data,this.ruleType,this.versionId,this.insuranceId);
	}
	checkprojects(){
		if(this.itemsHasChildren==true){
   	    	this.dialogPlugin.myModule(); 
   	    	this.isProjectsShow=true;
   	    }else if(this.itemsHasChildren==false){
   	    	this.dialogPlugin.onClose();  
   	    	this.isProjectsShow=false;
   	    	this.dialogPlugin.tip("已经是最小节点",null,'error');
   	    }
	}
	sureProjects(){
		this.isProjectsShow=true;
		this.projectsIndexName = this.projectActiveName;
		this.projectsIndexId = this.projectActiveId;
    	this.dialogPlugin.onClose();    
    }
/*获取材料树数据*/
    getMaterialDataList(versionId?:number,nodeId?:any,ruleType?:any,ruleVersion?:any,insuranceId?:any){
    	this.rulesLookRecipeService.getMaterailsDataList(versionId,nodeId,ruleType,ruleVersion,insuranceId)
    	  .then(res=>{
    	  	   if(res.code==200){
    	  	   	   if(res.data.length!=0){
    	  	   	   	    this.materialDataArray = res.data;
    	  	   	   	    for(let i=0;i<this.materialDataArray.length;i++){
    	  	   	   	    	 this.projectsHasChildren = this.materialDataArray[0].hasChildren;
    	  	   	   	    	 this.projectsChildrenName = this.materialDataArray[0].name;
    	  	   	   	    	 if(this.projectsHasChildren==true){
                                this.projectsChildrenName = '';
    	  	   	   	    	 }else if(this.projectsHasChildren==false){
    	  	   	   	    	 	this.projectsChildrenName = this.projectsChildrenName;
    	  	   	   	    	 	this.isProjectsShow=false;
    	  	   	   	    	 	this.dialogPlugin.onClose();  
    	  	   	   	    	 }
    	  	   	   	    }
    	  	   	   }else{
    	  	   	   	    this.materialDataArray = [];
    	  	   	   }
    	  	   }
    	  })
    } 
    materialsClick($event,materialActiveName,materialActiveId){
    	this.materialActiveName = materialActiveName;
    	this.materialActiveId = materialActiveId;
    	this.mcsId = this.materialActiveId ;
    }
/*获取材料数据  点击倒三角获取子节点*/  	
    getMaterialsChildren(node: any): any {
		return this.rulesLookRecipeService.getMaterailsChildrenByNode(this.materialIdversionId,node.data,this.ruleType,this.versionId,this.insuranceId);
	}
	checkMaterials(){
		if(this.projectsHasChildren==true){
   	    	this.dialogPlugin.myModule(); 
   	    	this.isMaterialsShow=true;
   	    }else if(this.projectsHasChildren==false){
   	    	this.dialogPlugin.onClose();  
   	    	this.isMaterialsShow=false;
   	    	this.dialogPlugin.tip("已经是最小节点",null,'error');
   	    }
	}
	sureMaterials(){
		this.isMaterialsShow=true;
		this.materialsIndexName = this.materialActiveName;
		this.materialsIndexId = this.materialActiveId;
    	this.dialogPlugin.onClose();    
    }
/*校验历史  跳转页面*/
    checkHistory(){
  	    let link =['healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/rulesCheckoutHistory'];
  	    this.router.navigate(link);
    }
/*下一步  跳转页面*/
    RulesCheckoutNextStep(){
    	let link =['healthCareChargedFees/healthManagementRules/rulesCheckout/healthRulesCheckout/healthLookRecipe'];
    	this.router.navigate(link);
    }
/*时间控件参数 前一个时间必须大于后面选的时间*/
	startDate: any;
	endDate: any;
	minStartDate: any;
	maxStartDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
	minEndDate: any;
	maxEndDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};        //设定药品核准时间的最大值为今天string;
	objToDate(oriDate: any) {
        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
        return dateStr;
    }
	setEndInterval($event: any){
		if($event){
			this.minEndDate = $event;
		}else{
			this.minEndDate = null;
		}
	}
	setStrartInterval($event: any){
		if($event){
			this.maxStartDate = $event;
		}else{
			this.maxStartDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
		}
	}
/*时间插件  切换逻辑*/
    startIns: any;/*时间插件  切换逻辑*/
	endIns: any;
	toggleStart(timeIns: any){
		timeIns.toggle();
		if(timeIns.isOpen()){
			this.startIns = timeIns;
			if(this.endIns){
				this.endIns.close();
				this.endIns = null;
			}
		}else{
			this.startIns = null;
		}
	}
	toggleEnd(timeIns: any){
		timeIns.toggle();
		if(timeIns.isOpen()){
			this.endIns = timeIns;
			if(this.startIns){
				this.startIns.close();
				this.startIns = null;
			}
		}else{
			this.endIns = null;
		}
	}
	@HostListener('document:click',[])
	onDocumnentClick(){
		if(this.endIns){
			this.endIns.close();
			this.endIns = null;
		}
		if(this.startIns){
			this.startIns.close();
			this.startIns = null;
		}
	}
/*分页器切换当前页*/
    setPage($event: any){
        this.pageInfo.currentPage = $event;
        this.getMsgWithPageInfo(this.pageInfo);
    }
    setPageSize($event: any){
        this.pageInfo.pageSize = $event;
        this.getMsgWithPageInfo(this.pageInfo);
    }
    getMsgWithPageInfo(pageInfo: any){
		this.getSearchData()//获取搜索数据
    }
/*患者年龄中前者不能大于后者*/
   checkNumber($event){
   	  this.startAgeNUmber = $event;
   }
   checkOverCount($event){
   	  if(parseInt($event)<parseInt(this.startAgeNUmber)){
   	  	 $event=parseInt(this.startAgeNUmber)+1;
   	  	 this.endAgeNumber = $event;
   	  }
   }
}


