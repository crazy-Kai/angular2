import { Component,OnInit,ViewChild} from '@angular/core';
import { DataTreeService } from './disease.service';
import { TreeComponent, TreeNode } from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router,ActivatedRoute,Params } from '@angular/router';

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';

import { FileInfo , DataList} from './fileInfo';

@Component({
	selector:'disease-app',
    templateUrl: './disease.component.html',
	styleUrls:['disease.component.css'],
	providers:[DataTreeService]
})


export class DiseaseComponentApp {
	
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	/*初始化发送获取险种请求*/
	private insuranceTypeOption : any;
	
	/*tree配置项*/
 	options = {
		getChildren:this.getChildren.bind(this),
		idField: 'id',
		
	};
	
	constructor(
		private dataTreeService: DataTreeService,private router: Router,private route : ActivatedRoute
		) { 
		
	}

	/*变量*/
	private isShow:boolean = false;
	private isTextShow:boolean = true;
	diseaseTreeData:any;
	dataList: DataList = new DataList();
	isAdd: boolean;						//是否为添加操作
	searchWord: string;					//搜索条件
	curNode: any;						//当前节点。  pCode 判断是否为根节点
	curTreeNode: TreeNode;
	cateType: any = [];						//当前节点的数据类型
	alertMessageTemplate:boolean = false;//警示信息模板
	vId:any;//增加的时候的版本ID
	insuranceId:any;//险种请求返回的保险ID
	versionId:any;//版本ID
	versionName:any;//当前版本名字
	list:any;//版本数据集合
	activeIdx:number = 0;
	reimbursementData:any;//报销分类数据
	reimbursementActiveId:any;//报销分类当前ID
    medicareRules:any;//医保规则
    reimbursementRatio:any;//报销比例
    currentIndex:any = 0;//默认报销分类
    checkedDisease:string = "";//选中的疾病分类
    managementArray:any = [];//管理依据数组
    classification:any = [];//疾病分类
    activeInsuranceId:any;//险种ID
    backResult:any;//选中节点返回数据
    initList:any;//判断是否勾选包销分类后返回的对比数据
    showText:boolean = true;//初始化选择节点提示的显示
    showSearchBtn:boolean = true;//模糊查询按钮
    currentInsuranceId:any;//首页传过来的险种ID
    currentVersionId:any;//首页传过来的版本ID
    defectName:any;//缺失的报销分类的名称
    cautionInformationDialogOptions = {
		'curNodeId': '',
		'dataList':this.dataList,
		'medicareRules':this.medicareRules,
		'versionId':'',
		'insuranceId':''
	};
	reimbursementId:any;//报销分类Id
	/**
	 * 
	 */
	@ViewChild('tree')
	private tree: TreeComponent;

	ngOnInit(){
		/*初始化行为*/
		this.getRouteParam();
	}
	/*获取路由参数*/
	getRouteParam(){
		this.route.params.subscribe(param => {
		   this.currentInsuranceId = this.route.params['value'].insuranceId;
		   this.insuranceTypeOption = {
				width:'100%',
				height:'28px',
				api:'/ipharmacare-distributed-yb-web/insurance',
				currentInsuranceId:this.currentInsuranceId
			};
		   this.currentVersionId = this.route.params['value'].versionId;
		   console.log(this.currentVersionId)
		   this.defectName =this.route.params['value'].summary;
		   
       });
	}


	/********* 业务逻辑
	* 初始化获取目录的默认险种
	* ------------------
	* chooseInsurance($event)
	*  切换险种
	*-------------------
	*getVersionId()
	* 获取目录版本
	*-------------------
	*getDataTree()
	*根据目录版本险种获取第一层的树结构
	*-------------------
	/******************/
	chooseInsurance($event){
		console.log($event.id)
    	this.insuranceId = $event.id;
    	this.cautionInformationDialogOptions.insuranceId = this.insuranceId;
    	this.getVersionId();
    	this.curNode = null;
    	
    }
    /*接受版本ID 并且获取index*/
    getCurrentVersionId(value){
    	if(this.list.length && value){
			for(let i =0; i<this.list.length;i++){
				if(value == this.list[i].id && this.currentInsuranceId && this.currentVersionId && this.currentInsuranceId == this.insuranceId){
					this.activeIdx = i;
					this.versionId = this.list[i].id;
					this.versionName = this.list[i].name;
					/*如果不是丢失报销分类就清空路由过来的版本和险种仅执行一次*/
					if(this.defectName == 'null'){
						this.currentInsuranceId = null;
						this.currentVersionId = null;
					}
					return true;
					
				}
			}
			return false;
		}
	}
  
    getVersionId(){
    	this.dataTreeService.getVersion(this.insuranceId)
    	.then( res=>{
    		if(res.code == 200 ){
    			if(res.data.length){
    				this.showText = true;
	    			this.showSearchBtn = true;
    				this.activeIdx = 0;
	    			this.list = res.data;
	    			 if(!this.currentInsuranceId || !this.currentVersionId || !this.getCurrentVersionId(this.currentVersionId)){
		  			 	this.versionId =this.list[this.activeIdx].id;
	    				this.versionName = this.list[this.activeIdx].name;
		  			 }
	    			this.cautionInformationDialogOptions.versionId = this.versionId;
	    			if(this.versionId != undefined){
	    				this.getDataTree();
			  			 if(this.defectName != 'null'  && this.currentInsuranceId && this.currentVersionId){
					   		window.setTimeout(()=>{
					   			this.searchWord = this.defectName;
					   			this.search();

					   		},100);
			   			}else{
							this.searchWord = '';
			   			}
	    			}
    			}else{
    				this.list=[];
    				this.cautionInformationDialogOptions.versionId = this.versionId = "";
    				this.versionName="";
    				this.diseaseTreeData = [];
    				this.showText = false;
    				this.showSearchBtn = false;
    				this.isShow = false;
    				this.isTextShow = true;
    			}
    		}
    	})
    }
   
	getDataTree(){
		this.dataTreeService.getDrugsTree(this.insuranceId,this.versionId)
			.then(res => {
				if(res.code == 200){
					if(res.data.length !=0){
						this.deleteTreeModelexpandedNodeIds();
						this.diseaseTreeData = res.data;
						
					}else{
						this.diseaseTreeData = [];
					}
				}
			});
	}
	 /*版本管理*/
    versionControl(){
    	let link:any= ['healthCareChargedFees/medicareCatalog/disease/Sickness_version_management/'+this.insuranceId];
    	this.router.navigate(link);
    }
  
    
	/********* 左侧目录树功能逻辑
	*getSearchResult ，search
	*搜索模糊查询功能
	*-------------------
	* getChildren($event)
	* 点击倒三角获取子节点
	*-------------------
	*chooseNode()
	* 点击节点获取节点详情并可修改（根节点除外）
	*-------------------
	*save()
	*右侧保存按钮的逻辑
	*--------------------
	*updateData()
	*更新修改后的保存逻辑
	/***************/
	search(){
		if(this.searchWord){
			this.getSearchResult(this.searchWord.replace(/\s+/g,""));
		}else{
			this.getSearchResult(this.searchWord);
		}
	}

	getSearchResult(dictValue:string){
		if(!dictValue) {
			dictValue = ""
		}
		this.dataTreeService.getSearchTree(dictValue,this.insuranceId,this.versionId)
			.then(res => {
				if(this.defectName)  this.defectName = 'null';
				if(this.currentInsuranceId) this.currentInsuranceId = null;
				if(this.currentVersionId) this.currentVersionId = null;
				if (res != "") {
					if(!dictValue){
						this.deleteTreeModelexpandedNodeIds();
					}else{
						this.deleteTreeModelexpandedNodeIds();
						this.setExpanded(res,true);
					}
					this.diseaseTreeData= res;
				}else{
					this.diseaseTreeData = [];
				} 
			});
	}

	getChildren(node: any): any {
		return this.dataTreeService.getChildrenByNode(node.data,this.insuranceId,this.versionId);
	}

	chooseNode($event: any){
		this.backResult = false;
		this.curTreeNode = $event.node;
		this.curNode = this.curTreeNode.data;
		this.dataTreeService.getData(this.curNode.id,this.versionId,this.insuranceId)
		.then(res => {
			if(res){
				this.backResult = true;
				this.cateType = res;
				this.getreimbursementData();
			}
		})
	}

	/*保存接口*/
	private save(): void {
		this.getCategoryGroup();
		let modifyData:any = {};
	    let newData:any = [];
	    if(this.cateType[0].isReimbursement && this.cateType[0].isReimbursement ==1){
			this.cateType[0].reimbursementId = this.reimbursementId;
		}else{
			this.cateType[0].reimbursementId = '';
		}
	    /*新对象*/
		for(let i = 0;i<this.cateType.length;i++){
				  let newObject :any = {};
				  newObject.category = this.cateType[i].category;
				  newObject.diseaseCode = this.cateType[i].diseaseCode;
				  newObject.gmtCreate = this.cateType[i].gmtCreate;
				  newObject.gmtModified = this.cateType[i].gmtModified;
				  newObject.id = this.cateType[i].id +'';
				  newObject.insuranceId = this.cateType[i].insuranceId;
				  newObject.isReimbursement = this.cateType[i].isReimbursement;
				  newObject.reimbursementId = this.cateType[i].reimbursementId;
				  newObject.versionId = this.cateType[i].versionId;
				  newData.push(newObject);
		}
		modifyData['list'] = newData;
		this.updateData(modifyData);

	}

	/*获取每个险种的备选中的疾病分类*/
	getCategoryGroup(){
		for(let i = 0;i<this.cateType.length;i++){
			this.cateType[i].category="";
			let newArr:any = [];
			
			for(let j =0;j<this.cateType[i].categorys.length;j++){
				if(this.cateType[i].categorys[j].checked == true){
					newArr.push(this.cateType[i].categorys[j].id);
					
				}
			}
			this.cateType[i].category = newArr.join(",");
			
		}
	}
	private updateData(data:any): void {
		 this.dataTreeService.testIsSave('2',this.versionId)
			 .then( res =>{
			 		if(res.code == 200){
			 			if(res.data == '2'){
							this.saveDataFn.call(this,data);
			 			}else if(res.data == '1'){
			 				this.dialogPlugin.confirm('当前目录正在使用，更改后会影响部份规则的正常使用，是否保存?',() =>{
	 		 				this.saveDataFn.call(this,data);
	 		 				},() =>{})
			 			}else{
			 				this.dialogPlugin.confirm("此版本被激活的规则中使用",()=>{},()=>{},false,'无法保存')
			 			}
			 		}
			 })
	 	
	 	
	 }

	saveDataFn(data){
		this.dataTreeService.diseaseSave(data)
		 	.then(res=>{
		 		if(res.code == 200){
		 			if(res.data.length != 0){
		 				this.cateType[0].id = res.data[0].id;
		 				
		 				this.tree.treeModel.getNodeById(this.curTreeNode.data.id).data.orgxtType = res.data[0].isReimbursement;
		 			}
					this.dialogPlugin.tip("保存成功",null,'success')
				}
		})
	}
  	/********* 增删改查操作后更新目录树的逻辑
	*updateNode()
	*修改操作后更新树
	*setExpanded()
	*更新树后展开或者关闭树的方法
	*-------------------
	/***************/
	
	setExpanded(arr: any[],flag?:any) {
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].open && arr[i].hasChildren ){
				this.tree.treeModel.expandedNodeIds[arr[i].id] = flag;
			}
			
			if (arr[i].hasChildren && arr[i].children){
				this.setExpanded(arr[i].children,flag);
			}

		}
	}

	
	/********* 右侧展示页面的功能
	*-------------------------
	*setMessage，getMessageData，saveMessage
	*警示信息逻辑方法
	*-------------------------
	/***************/
	
   setMessage(curNodeId?:any){
   		if(this.versionId != ""){
		    this.cautionInformationDialogOptions.curNodeId = curNodeId?curNodeId.id:"";
		   	this.alertMessageTemplate = true;
		   	this.dialogPlugin.myModule();
	   	}else{
	   		this.dialogPlugin.tip('该险种下无版本，不可设置警示信息',null,'error',true)
	  }
   }
	
  
  /*接收组件中返回的警示信息数据*/
  getDataList($event){
  	this.dataList = $event;
  }
  /*接收规则*/
  getMedicareRules($event){
  	this.medicareRules = $event;
  }
  saveMessage(){
  	this.dataList.versionId = this.versionId;
    this.dataList.insuranceId=this.insuranceId;
  	this.dataList.nodeType = "JB";
  	this.getmedicareRulesGroup();
  	let code :any = this.dataList; 
  	
  	this.dataTreeService.saveMessage(code)
  	.then(res => {
  		if(res.code == 200){
	  		this.dialogPlugin.tip("保存成功",null,'success')
	  		this.cancelMessage();
  		}
  	})
  }
   /*取消警示信息设置*/
    cancelMessage(){
    	this.alertMessageTemplate =false;
    	this.dialogPlugin.onClose();
    }
 
   /*获取勾选的管理依据数据*/
getmedicareRulesGroup(){
	let data:any = this.medicareRules;
	this.dataList.managementBasis = "";
	this.managementArray = [];
	for(let i = 0;i<data.length;i++){
		if(data[i].checked == true){
			this.managementArray.push(data[i].id);
		}
	};
	this.dataList.managementBasis = this.managementArray.join(",");

}
  /***********************************************************************
  *以下是获取下拉框数据，和关联属性树的方法
  ************************************************************************/
  
   
    /*获取报销分类数据*/
    getreimbursementData(){
    	this.dataTreeService.getreimbursement(this.insuranceId)
    	.then(res=>{
    		if(res.code == 200){
    			if(res.data.length !=0 ){
    				this.reimbursementData = res.data;
    				if(this.cateType[0].reimbursementId == ''){
		    			this.reimbursementId = this.reimbursementData[0].id;
		    		}else{
		    			this.reimbursementId = this.cateType[0].reimbursementId;
		    		}
    			}else{
    				
    				this.reimbursementData = [];
    			}
    		}
    	})
    }
    /*切换版本*/
    optionClick($event){
    	this.versionId = this.list[this.activeIdx].id;
    	this.versionName = this.list[this.activeIdx].name;
    	if( this.versionId  != undefined){
    		this.getDataTree();
    		this.curNode = null;
    	}
		this.cautionInformationDialogOptions.versionId = this.versionId;
    }
  
 
  /*勾选疾病分类*/
  classify(checked,g,i){
  	if (checked) {
			this.cateType[i].categorys[g].checked = true;
		} else {
			this.cateType[i].categorys[g].checked = false;
		}
  }
 
  
  	/*删除展开属性*/
	deleteTreeModelexpandedNodeIds(){
		for(var prop in this.tree.treeModel.expandedNodeIds){
			if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
				delete this.tree.treeModel.expandedNodeIds[prop];
			}
		}
	}
 
}
