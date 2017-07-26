import { Component,OnInit,ViewChild} from '@angular/core';
import { DataTreeService } from './ruleAnalyzeType.service';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NodeObject } from '../../common/fileInfo';

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector:'ruleAnalyzeType-app',
    templateUrl:'ruleAnalyzeType.component.html',
	styleUrls:['ruleAnalyzeType.component.css','../../../app.component.css'],
	providers:[DataTreeService]
})


export class RuleAnalyzeTypeComponentApp {
	// @ViewChild(UploadPlugin) uploadPlugin: UploadPlugin;
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	@ViewChild(TreeComponent)
	private tree: TreeComponent;
	/*初始化发送获取险种请求*/
	private insuranceTypeOption : any = {
		width:'100%',
		height:'30px',
		api:'/ipharmacare-distributed-yb-web/insurance'
	};
	/*报销分类option*/
	private ReimbursementOption :any = {
		width:'100%',
		height:'30px',
		api:'/ipharmacare-distributed-yb-web/reimbursement'
	}
	
	/*tree配置项*/
 	options = {
 		getChildren:this.getChildren.bind(this),
		idField: 'id',
		actionMapping: {
                mouse: {
                    click: (tree, node, $event) => {
                        this.chooseNode(node);
                        TREE_ACTIONS.FOCUS(tree, node, $event);
                    }
                }
           }
	};
	

	constructor(
		private dataTreeService: DataTreeService,private router: Router
		) { 
		
	}

	/*变量*/
	isHint:boolean = true;
	Namecode:boolean = true;
	rulesAnalysisData:any;
	rulesAnalysis:any;//类别
	// dataList: DataList = new DataList();
	isAdd: boolean;						//是否为添加操作
	searchWord: string;					//搜索条件
	curNode: any;						//当前节点。  pCode 判断是否为根节点
	curTreeNode: TreeNode;
    backCurrentData:any = {};						//返回当前节点的数据类型
    testNameResult :boolean = true;
    swicthCategory :any;
	/**
	 * 
	 */
	
	ngOnInit(){
		/*初始化行为*/
		this.getDataTree(null);
	}
	getDataTree(dictValue?: string){
		this.dataTreeService.getDrugsTree(dictValue)
			.then(res => {
				if(res.code == 200){
					if(res.data.length !=0){
					
						this.setExpanded(res.data,false)
						this.rulesAnalysisData = res.data;
					}else{this.rulesAnalysisData = [];}
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
	getChildren(node: any): any {
		return this.dataTreeService.getChildrenByNode(node.data);
	}
	getSearchResult(dictValue: string){
		if(!dictValue) dictValue = "";
		this.dataTreeService.getDrugsSearchTree(dictValue)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						 if (dictValue !="") {
						 	this.setExpanded(res.data,true);
						 }else{
						 	this.deleteTreeModelexpandedNodeIds()
						 }
						 
						this.rulesAnalysisData = res.data;
					}else{
						this.rulesAnalysisData = [];
					} 
				}
			});
	}

	chooseNode($event: any){
		this.Namecode = true;
		this.rulesAnalysis = "";
		this.testNameResult = true;
		this.Namecode = true;
		this.curTreeNode = $event;
		this.curNode = this.curTreeNode.data;
		this.dataTreeService.getData(this.curNode.id)
		.then(res => {
			if(res.code == 200){
				 	this.backCurrentData = res.data;
					this.isAdd = false;
				
			}
		})
	}

	add($event){
		$event.stopPropagation();
		this.isAdd = true;
		this.backCurrentData = {};
		/*添加提示类型*/
		this.swicthCategory = true;
	}
	addAnalysis(){
		this.rulesAnalysis = '';
		this.isAdd = true;
		this.backCurrentData = {};
		/*添加分析类型*/
		this.swicthCategory = false;
	}

	delData(node: any) {
		if(this.curNode.type !=1){
			this.deletePrompt.call(this,'此操作会删除所有子目录您确定要删除吗？',node)
		}else{
			this.deletePrompt.call(this,'您确定要删除吗？',node)
		}
		
	}

	deletePrompt(message:any,node:any){
		this.dialogPlugin.confirm(message, () => {
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

		let newData: any = {};
		newData = this.backCurrentData;
		newData.category = this.rulesAnalysis;
		if(this.rulesAnalysis){

			if(this.rulesAnalysis == 'FX'){
				newData.typeId = '';
				console.log(111);
			}else{
				console.log(222);
				newData.typeId = this.curTreeNode.data.id;
			}
		}
		let parentNode = this.tree.treeModel.getNodeById(newData.typeId);
		if(newData.summary && this.testNameResult && this.rulesAnalysis && this.Namecode ){
			this.dataTreeService.postData(newData)
			.then(res => {
				if (res.code == 200) {
			 		this.dialogPlugin.tip("保存成功",null,"success");
			 		res.data.name = res.data.summary;
			 		res.data.id = res.data.id + '';
			 		res.data.typeId = res.data.typeId + '';
			 		if(this.rulesAnalysis == 'FX'){
			 			res.data.type = 0;

			 		}else{
			 			res.data.type = 1;
			 		}
			 		// 更新tree
			 		this.addNode(res.data,parentNode);	
			 		this.backCurrentData.summary = "";
				}
			})
		}else if(!newData.summary){
			this.dialogPlugin.tip("请填写目录名称",null,"error");
		}else if(!this.testNameResult){
			this.dialogPlugin.tip("同级目录名称不能同名",null,"error");
		}else if(!this.rulesAnalysis){
			this.dialogPlugin.tip("请选择类型名称",null,"error");
		}else if(!this.Namecode){
			this.dialogPlugin.tip("目录名称请输入有误",null,"error");
		}
	   
	}

	private updateData(): void {
		this.testIptName(this.backCurrentData.summary);
		console.log(this.Namecode)
	 	let modifyData: any;
	 	modifyData = this.backCurrentData;
	 	if(modifyData.summary && this.testNameResult && this.Namecode){
		 	this.dataTreeService.updateData(modifyData)
		 	.then(res => {
		 		if(res.code == 200) {
		 		this.dialogPlugin.tip("保存成功",null,"success");
		 		/*把修改后的name 值和父级节点的名字*/
		 			this.tree.treeModel.getNodeById(this.curTreeNode.data.id +'').data.name = this.backCurrentData.summary;
				}
		 	})
	 	}else if(!modifyData.summary){
	 		this.dialogPlugin.tip("请填写目录名称",null,"error")
	 	}else if(!this.testNameResult){
	 		this.dialogPlugin.tip("同级目录名称不能同名",null,"error")
	 	}else if(!this.Namecode){
	 		this.dialogPlugin.tip("目录名称请输入有误",null,"error")
	 	}
	 }

	setExpanded(arr: any[],flag?:any) {
		for(let i = 0; i < arr.length; i++) {
				this.tree.treeModel.expandedNodeIds[arr[i].id] = flag;
			if (arr[i].children && arr[i].open){
				this.setExpanded(arr[i].children);
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

	addNode(node: any,parentNode:any) {
			/*提示类型有父级，分析类型无父级*/
			 if(parentNode){
			 	 let parentData = parentNode.data;
			 	if (parentData.children)
					parentData.children.push(node);//children已经加载出来
				else {
					if (!parentData.hasChildren) {
						parentData.hasChildren = true;
						parentData.children = new Array<any>();
						parentData.children.push(node);
					}
				}
				/*如果是增加子级的时候添加成功后自动展开*/
				if(this.rulesAnalysis && this.rulesAnalysis != 'FX'  ){
						let currentAddParentId = this.curNode.id;
						if(!this.curNode.children){
							this.dataTreeService.getChildrenByNode(this.curNode).then( res => {
								if(res.length != 0){
									/*赋值获取到的子级数据*/
									this.curNode.children = res;
									if(this.curNode.children && this.curNode.children.length){
										this.tree.treeModel.expandedNodeIds[currentAddParentId] = true;
									}
									this.tree.treeModel.update();
								}
							});
						}else{
							this.tree.treeModel.expandedNodeIds[currentAddParentId] = true;
						}
					
				}
				this.tree.treeModel.update();
			}else{
			
				this.addRootDirectory.call(this,node);
			 	this.curNode = null;
			 	this.isAdd = false;
			}
	}

	 /* 添加同级根目录type为0的节点逻辑*/
   addRootDirectory(node?:any){
   		let nodeObject = new NodeObject();
	 	nodeObject.id = node.id+'';
	 	nodeObject.name = node.summary;
	 	nodeObject.type = 0;
	 	this.rulesAnalysisData.push(nodeObject);
	 	this.tree.treeModel.update();
   }

	
 /*检测同名请求*/
	checkName(name,id){
		this.dataTreeService.checkName(name,id)
			.then( res =>{
			   if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
			   			 // this.dialogPlugin.tip('同级目录名称不能同名',null,'error')
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
		if(this.backCurrentData.summary !="" && this.testObjectName(this.backCurrentData.summary)){
			
			if(!this.isAdd){
						this.checkName(this.backCurrentData.summary,this.curNode.id)
					}else{
						this.checkName(this.backCurrentData.summary,'')
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
	//验证输入是否正确
	testObjectName(value){
		let reg = /^(([\u4e00-\u9fa5]{1,10}))$/;
		let result = reg.test(value);
		return result;
	}

	//	节点名称校验
	testIptName(value){	
		if(!value){
			this.dialogPlugin.tip('请选择目录名称',null,'error');
			return;
		}
		let reg = /^(([\u4e00-\u9fa5]{1,10}))$/;
			let result = reg.test(value);
			if(result){
				this.Namecode = true;
				
			}else{
				
				this.dialogPlugin.tip('目录名称输入有误',null,'error');
				this.Namecode = false;
			}
	}	
}
