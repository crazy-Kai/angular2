/*药物组*/
import { Component,OnInit,ViewChild,ViewChildren} from '@angular/core';
import { DataTreeService } from './druggroupdirectory.service';
import { TreeNode, TreeComponent, TREE_ACTIONS, KEYS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { RemoveClass } from '../../common/removeActiveClassName.ts';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';

import { FileInfo , DataList} from './fileInfo';
import { Limt } from '../../common/limit';
@Component({
	selector:'druggroupdirectory-app',
    templateUrl:'druggroupdirectory.component.html',
	styleUrls:['druggroupdirectory.component.css'],
	providers:[DataTreeService]
})

export class DruggroupdirectoryComponentApp implements OnInit{
	/*变量*/
	private removeclassname:RemoveClass = new RemoveClass(); //去除class公用
	nodes:any;//修改药品的数据
	medicineGroup:any;//医保药物组数据
	isAdd: boolean;						//是否为添加操作
	searchWord: string;					//搜索条件
	curNode: any;						//当前节点。  pCode 判断是否为根节点
	curTreeNode: TreeNode;
	activeIdNodeData: any = {};						//当前节点的数据类型
	vId:any;//增加的时候的版本ID
	insuranceId:any;//险种请求返回的保险ID
	versionId:any;//版本ID
	versionName:any;//当前版本名字
	list:any;//版本数据集合
	activeIdx:number = 0;
    limit:Limt = new Limt();/*工具类*/
    testNameResult :boolean = true;
    Namecode:boolean = true;
    relevanceDrugsTemplate : boolean = false;//关联药品模版
    // isDrugsShow:boolean = true;
    creatArray : any; /*code 副本*/
    drugsArray:any = [];/*code 数组副本*/
   	// odlName :string;
   	drugNodes :any;//修改药品树的数据
   	isTextShow:boolean = true;
   	isShow:boolean = false;
   	addButton:boolean = false;
   	showSearchBtn:boolean = true;//模糊查询按钮
  	drugUrl = '/ipharmacare-distributed-yb-web/drugGroup/ztree';/*获取药品的请求地址*/
	/*tree配置项*/
	 	options = {
			idField: 'id',
			actionMapping: {
				mouse: {
					click:(tree,node,$event) => {
						this.chooseNode(node);
						console.log(TREE_ACTIONS)
						TREE_ACTIONS.FOCUS(tree,node,$event)
					}
				}
			}
		}

	/*初始化发送获取险种请求*/
	private insuranceTypeOption : any = {
		width:'323px',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/insurance'
	};
		
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;

	@ViewChild(TreeComponent)
	private tree: TreeComponent;
	@ViewChildren(TreeComponent) elements:any;
	ngAfterViewInit() {
		console.log(this.tree);
		console.log(this.elements);
	}
	constructor(
		private dataTreeService: DataTreeService,private router: Router
		) { 
		
	}
	
	ngOnInit(){
		/*初始化行为*/
		// this.getDataTree(null);
	}

	chooseInsurance($event){
    	this.insuranceId = $event.id;
    	// this.cautionInformationDialogOptions.insuranceId = this.insuranceId;
    	this.getVersionId();
    	this.curNode = null;
    	this.isAdd = false;
    	
    }

    getVersionId(){
    	this.dataTreeService.getVersion(this.insuranceId)
    	.then( res=>{
    		if(res.code == 200){
    			if(res.data.length){
    				this.showSearchBtn = true;
    				this.addButton = true;
    				this.activeIdx = 0;
	    			this.list = res.data;
	    			this.versionId =this.list[0].id;
	    			// this.cautionInformationDialogOptions.versionId = this.versionId;
	    			this.versionName = this.list[0].name;
	    			if(this.versionId != undefined){
	    				this.drugUrl = '/ipharmacare-distributed-yb-web/drugGroup/ztree'+ '/'+ this.versionId;
	    				this.getDataTree(null,this.insuranceId,this.versionId)
	    			}
    			}else{
    				this.showSearchBtn = false;
    				// this.cautionInformationDialogOptions.versionId = this.versionId = "";
    				this.list = [];
    				this.medicineGroup = [];
    				this.versionName = "";
    				this.addButton = false;
    				this.isShow = false;
    				this.isTextShow = true;
    			}
    		}
    	})
    }

	getDataTree(dictValue?: string,insuranceId?:any,versionId?:any){
		this.dataTreeService.getDrugsTree(dictValue,insuranceId,versionId)
			.then(res => {
				if(res.code == 200){
					if(res.data.length !=0){
						this.setExpanded(res.data,false)
						this.medicineGroup = res.data;
						
					}else{
						this.medicineGroup = [];
						
					}
					this.curNode = null;
    				this.isAdd = false;
				}
				
			});
	}
	
	/********* 左侧目录树功能逻辑
	*getSearchResult ，search
	*搜索模糊查询功能
	*-------------------
	*chooseNode()
	* 点击节点获取节点详情并可修改（根节点除外）
	*-------------------
	*add()
	*点击节点的加号创建子集或同级目录
	*-------------------
	*delData()
	*点击左侧节点删除按钮删除节点
	*-------------------
	*save()
	*右侧保存按钮的逻辑
	*--------------------
	*addData()
	*新增保存的逻辑
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
	getSearchResult(dictValue: string){
		if(!dictValue) dictValue = "";
		this.dataTreeService.getDrugsSearchTree(dictValue,this.insuranceId,this.versionId)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.deleteTreeModelexpandedNodeIds()
						this.medicineGroup = res.data;
					}else{
						this.medicineGroup = [];
					} 
				}
			});
	}

	chooseNode($event: any){
		this.Namecode = true;
		this.testNameResult = true;
		this.curTreeNode = $event;
		this.curNode = this.curTreeNode.data;
		this.dataTreeService.getData(this.curNode.id,this.versionId)
		.then(res => {
			if(res.code == 200){
				 	this.activeIdNodeData = res.data;
				 	// this.odlName = this.activeIdNodeData.summary
				    this.creatArray = this.activeIdNodeData.drugCode;
				    this.drugsArray = this.activeIdNodeData.drugs.slice(0,this.activeIdNodeData.drugs.length);
					this.isAdd = false;
					
			}
		})
	}
	/*获取修改药品数据*/
	getModefilyData(drugCode?:any,versionId?:any){
		this.dataTreeService.getDrugsData(drugCode,versionId)
		.then(res =>{
						if(res.code == 200){
							if(res.data.length){
								this.drugNodes = res.data;
							}
						}
					})
	}
	add(node:any){
		// this.odlName= null;
		this.curNode = null;
		this.isAdd = true;
		this.activeIdNodeData = {};
		this.activeIdNodeData.drugs = [];
	}

	delData(node: any) {
		this.dialogPlugin.confirm('您确定要删除吗？', () => {
				this.dataTreeService.delData(node.data.id)
					.then(res => {
						if (res.code == 200) {
							this.dialogPlugin.tip("删除成功",null,'success');
							this.deleteNode(node);
							this.curNode = null;
						}
					})
		}, () => { })
	}

	private save(): void {
		if(this.isAdd){
			 this.addData()
		}else{
			this.updateData();
		}
	}

	private addData(): void {
		let newData: any ={};
		this.creatObject.call(this,newData);
			newData.drugCode = this.activeIdNodeData.drugCode;
			newData.versionId = this.versionId;
			newData.insuranceId = this.insuranceId;
		if(this.activeIdNodeData.summary && this.testNameResult && this.Namecode && this.activeIdNodeData.drugsName){
			this.dataTreeService.postData(newData)
			.then(res => {
				if (res.code == 200) {
			 		this.dialogPlugin.tip("保存成功",null,"success");
			 		/*更新tree*/
			 		this.getDataTree(null,this.insuranceId,this.versionId);
			 		this.curNode = null;
			 		this.isAdd = false;	
				}
			})
		}else if(!newData.summary){
			this.dialogPlugin.tip("请填写标题名称",null,"error");
		}else if(!this.testNameResult){
			this.dialogPlugin.tip("同级标题名称不能同名",null,"error");
		}else if(!this.Namecode){
	 		this.dialogPlugin.tip('标题输入有误',null,'error');
	 	}else if(!this.activeIdNodeData.drugsName){
	 		this.dialogPlugin.tip('无法保存,请选择药品',null,'error');
	 	}
	   
	}
	
	//关联药品
	modifyDrugsFn(){
		this.dialogPlugin.myModule();
	    this.relevanceDrugsTemplate = true;
	}

	/*保存新增数据*/
	saveAddData(){

		let codeArray =[],
			nameArray = [];
		if(this.activeIdNodeData.drugs.length !=0){
			for(let i = 0;i<this.activeIdNodeData.drugs.length;i++){
				
				codeArray.push(this.activeIdNodeData.drugs[i].id);
				nameArray.push(this.activeIdNodeData.drugs[i].summary);
			}
			
			this.activeIdNodeData.drugCode = codeArray.join(",");

			this.activeIdNodeData.drugsName = nameArray.join(";");
		}else{
			this.activeIdNodeData.drugCode = "";
			this.activeIdNodeData.drugsName ="";
		}
		this.drugsArray = this.activeIdNodeData.drugs.slice(0,this.activeIdNodeData.drugs.length);
		this.dialogPlugin.onClose();
	 	this.relevanceDrugsTemplate = false;
	}

 	//取消
	cancelfn(){
	 	this.dialogPlugin.onClose();
	 	this.relevanceDrugsTemplate = false;
	 	this.activeIdNodeData.drugs = [] = this.drugsArray.slice(0,this.drugsArray.length);
	 
	}

	creatObject(data){
		data.description = this.activeIdNodeData.description;
	 	data.drugCode = this.activeIdNodeData.drugCode;
	 	data.gmtCreate = this.activeIdNodeData.gmtCreate;
	 	data.gmtModified = this.activeIdNodeData.gmtModified;
	 	data.id = this.activeIdNodeData.id;
	 	data.summary = this.activeIdNodeData.summary;
	 	data.groupCode = this.activeIdNodeData.groupCode;
	}

	private updateData(): void {
	 	let modifyData: any ={};
	 	this.creatObject.call(this,modifyData);
	 	modifyData.versionId = this.versionId;
	 	modifyData.insuranceId = this.insuranceId;
	 	if(this.activeIdNodeData.summary && this.testNameResult && this.Namecode && this.activeIdNodeData.drugsName){
		 	this.dataTreeService.updateData(modifyData)
		 	.then(res => {
		 		if(res.code == 200) {
		 		  this.dialogPlugin.tip("保存成功",null,"success");
		 		/*把修改后的name 值和父级节点的名字*/
				  this.tree.treeModel.getNodeById(this.curTreeNode.data.id).data.name = this.activeIdNodeData.summary;
				}
		 	})
	 	}else if(!modifyData.summary){
	 		this.dialogPlugin.tip("请填写标题名称",null,"error")
	 	}else if(!this.testNameResult){
	 		this.dialogPlugin.tip("同级标题名称不能同名",null,"error")
	 	}else if(!this.Namecode){
	 		this.dialogPlugin.tip('标题输入有误',null,'error');
	 	}else if(!this.activeIdNodeData.drugsName){
	 		this.dialogPlugin.tip('无法保存,请选择药品',null,'error');
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

	private updateNode(node: any): boolean {
		let parentNode = this.curTreeNode.parent;
		if (!parentNode.children) {
			console.error("There is no child in this parentNode");
			return;
		}
		let curIdx = parentNode.data.children.indexOf(this.curTreeNode.data);
		parentNode.data.children[curIdx] = this.curTreeNode.data;
		this.tree.treeModel.update();
	}
	
	private deleteNode(node: any): boolean {
		let parentNode = this.curTreeNode.parent;
		if (!parentNode.children) {
			console.error("There is no child in this parentNode");
			return;
		}
		parentNode.data.children.splice(parentNode.data.children.indexOf(node.data), 1);
		if (parentNode.data.children.length == 0)
			parentNode.data.hasChildren = false;
		this.tree.treeModel.update();
		return true;
	}
 /*检测同名请求*/
	checkName(name,id,versionId){
		this.dataTreeService.checkName(name,id,versionId)
			.then( res =>{
			   if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
			   			 // this.dialogPlugin.tip('标题不能同名',null,'error')
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

/*检测同名*/
	testName(){
		if(this.activeIdNodeData.summary !="" && this.testNameCode(this.activeIdNodeData.summary)){
					if(this.curNode){
						this.checkName(this.activeIdNodeData.summary,this.curNode.id,this.versionId)
					}else{
						this.checkName(this.activeIdNodeData.summary,'',this.versionId)
					}	
		}
	}
	//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g,
		result = reg.test(value);
		return result;
	}

	/*检测标题*/
	testIptName(value){	
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g;
			let result = reg.test(value);
			if(!value){
				this.dialogPlugin.tip('请填写标题',null,'error');
				return;
			}
			if(this.activeIdNodeData.summary && result ){
				this.Namecode = true;
				
			}else{
				if(this.activeIdNodeData.summary && !result){
					this.Namecode = false;
					this.dialogPlugin.tip('标题输入有误',null,'error');
				}
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
	
	 /*切换版本*/
    optionClick($event){
    	this.versionId = this.list[this.activeIdx].id;
    	this.versionName = this.list[this.activeIdx].name;
    	if( this.versionId  != undefined){
    		this.drugUrl = '/ipharmacare-distributed-yb-web/drugGroup/ztree'+ '/'+ this.versionId;
    		this.getDataTree(null,this.insuranceId,this.versionId);
    		
    	}
    	// this.cautionInformationDialogOptions.versionId = this.versionId;
    }
    /*获取选中药品然后的pid*/

    onActivate($event){
    	this.activeIdNodeData.groupCode = $event; 
    }
}
