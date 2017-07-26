import { Component,OnInit,ViewChild} from '@angular/core';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { DataTreeService } from './office.service';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import { RemoveClass } from '../../common/removeActiveClassName.ts';
import { NodeObject} from '../../common/fileInfo';
@Component({
	selector:'office-app',
    templateUrl: 'office.component.html',
	styleUrls:['office.component.css'],
	providers:[DataTreeService]
	
})


export class OfficeComponentApp {
	
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	@ViewChild(TreeComponent)
	private tree: TreeComponent;
	/*tree配置项*/
 	options = {
		getChildren: this.getChildren.bind(this),
		idField: 'id',
		actionMapping: {
			mouse: {
				click:(tree,node,$event) => {
					this.chooseNode(node);
					console.log(TREE_ACTIONS);
					TREE_ACTIONS.FOCUS(tree,node,$event);
				}
			}
		},
		// allowDrag: true
	};
	constructor(
		private dataTreeService: DataTreeService,private router: Router
		) { 
		
	}
	/*变量*/
	private removeclassname:RemoveClass = new RemoveClass(); //去除class公用
	officeTreeData:any;
	isAdd: boolean;						//是否为添加操作
	searchWord: string;					//搜索条件
	curNode: any;						//当前节点。  pCode 判断是否为根节点
	curTreeNode: TreeNode;
	cateType: any = {};						//当前节点的数据类型
	addlevel:any;//新增层级
	dragData:any = {};//拖拽的节点
    testNameResult :boolean = true;
    Namecode:boolean = true; //节点名称校验
    Itemcode:boolean = true; //项目名称校验
    isLeaf:number; //新增节点类型
	/**
	 * 
	 */
	
	ngOnInit(){
		/*初始化行为*/
		this.getDataTree();
	}

	/********* 业务逻辑
	*getDataTree()
	*根据目录版本险种获取第一层的树结构
	*-------------------
	/******************/
	getDataTree(){
		this.dataTreeService.getOfficeTree()
			.then(res => {
				if(res.code == 200){
					this.deleteTreeModelexpandedNodeIds();
					if(res.data.length != 0){
						this.officeTreeData = res.data;
						this.deleteTreeModelexpandedNodeIds();
					}else{
						this.officeTreeData = [];
					}
				}
			});
	}
	/********* 左侧目录树功能逻辑
	*getSearchResult ，search
	*搜索模糊查询功能
	*-------------------
	* getChildren($event)
	* 点击倒三角获取子节点
	*-------------------
	*chooseNode()
	* 点击节点获取节点详情并可修改
	*-------------------
	*add()
	*点击节点的加号创建子集或同级目录,里面是一些请求所带的参数
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
	* -------------------
	* onMoveNode，dragWarning
	* 拖拽方法和拖拽错误提示
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
		this.dataTreeService.getOfficeSearchTree(dictValue)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						 if (dictValue !="") {
						 		this.setExpanded(res.data,true);
						 }else{
						 	this.deleteTreeModelexpandedNodeIds();
						 }
						this.officeTreeData= res.data;
					}else{
						this.officeTreeData = [];
					} 
				}

			});
	}

	getChildren(node: any): any {
		return this.dataTreeService.getChildrenByNode(node.data);
	}
	chooseNode($event: any){
		// this.addlevel = "";
		this.Itemcode = true;
		this.testNameResult = true;
		this.curTreeNode = $event;
		this.curNode = this.curTreeNode.data;
		this.dataTreeService.getData(this.curNode.id)
		.then(res => {
			if(res.code == 200){
				 	this.cateType = res.data;
					this.isAdd = false;
			}
		})
	}

	add(node:any,$event){
		$event.stopPropagation();
		this.isLeaf = null;
		this.addlevel = null;
		this.isAdd = true;
		this.cateType = {};
		this.cateType.description = "";
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


	/*点击外层添加按钮*/
	addAll(){
		this.isAdd = true;
		this.cateType = {};
		this.curNode = null;
		this.isLeaf = null;
		this.addlevel = null;
		// this.removeclassname.toggleClassTest();
	}
	private save(): void {
		if(this.isAdd){
			 this.addData()
		}else{
			this.updateData();
			
		}
	}

	private addData(): void {
		let newData: any,
			self = this;
		newData = this.cateType;
		/*区分大的添加和小添加的区别*/
		if(this.curNode){
			newData.parentId = this.curTreeNode.data.id;

		}else{
			newData.parentId = "";
		}
		let parentNode = this.tree.treeModel.getNodeById(newData.parentId);
		
		newData.isLeaf = this.isLeaf;
	  	console.log(this.isLeaf,this.addlevel);
		if(newData.summary && this.testNameResult && this.Itemcode && this.addlevel && this.isLeaf){
			this.dataTreeService.addData(newData)
			.then(res => {
				if (res.code == 200) {
			 		this.dialogPlugin.tip("保存成功",null,"success");
			 		res.data.name = res.data.summary;
			 		res.data.pid = res.data.parentId + '';
			 		res.data.id = res.data.id + '';
			 		res.data.type = res.data.isLeaf;
			 		/*更新tree*/
			 		if(this.curNode){
			 		
			 			this.addNode(res.data,parentNode);
						this.cateType.summary = "";
			 		}else{
			 			 this.addRootDirectory.call(self,res.data);
			 			 this.cateType.summary = "";
			 		}
				}
			})
		}else if(!this.addlevel || !this.isLeaf){
			this.dialogPlugin.tip("请选择节点层级",null,"error");
		}else if(!newData.summary){
			this.dialogPlugin.tip("请填写科室名称",null,"error");
		}else if(!this.testNameResult){
			this.dialogPlugin.tip("科室名称不能同名",null,"error");
		}else if(!this.Itemcode){
			this.dialogPlugin.tip("科室名称输入有误",null,"error");
		}
	   
	}


	private updateData(): void {
	 	let modifyData: any;
	 	modifyData = this.cateType;
	 	if(modifyData.summary && this.testNameResult && this.Itemcode){
			
		 	this.dataTreeService.updateData(modifyData,this.curNode.id )
		 	.then(res => {
		 		
		 		if(res.code == 200) {
		 			
		 		this.dialogPlugin.tip("保存成功",null,"success");
		 		/*把修改后的name 值和父级节点的名字*/
					this.curTreeNode.data.name = res.data.summary;
					this.updateNode(res.data);
					
				}
		 	})
	 	}else if(!modifyData.summary){
	 		this.dialogPlugin.tip("请填写科室名称",null,"error")
	 	}else if(!this.testNameResult){
	 		this.dialogPlugin.tip("科室名称不能同名",null,"error")
	 	}else if(!this.Itemcode){
	 		this.dialogPlugin.tip("科室名称输入有误",null,"error");
	 	}
	 }

 
	dragWarning(innerHtml,message?:string){
		this.dialogPlugin.confirm(innerHtml, () => {
	    this.getDataTree()
	  }, () => { },false,message)
	}
  	/********* 增删改查操作后更新目录树的逻辑
	*updateNode()
	*修改操作后更新树
	*-------------------
	* deleteNode($event)
	* 删除节点后更新树
	*-------------------
	*addNode()
	* 新增节后更新树
	*-------------------
	*setExpanded()
	*更新树后展开或者关闭树的方法
	*-------------------
	/***************/
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

	addNode(node: any,parentNode:any) {
		
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
			if(this.curNode){
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
	 }
		
		
	}
	 /* 添加同级根目录type为0的节点逻辑*/
   addRootDirectory(node?:any){
   		let nodeObject = new NodeObject();
	 	nodeObject.id = node.id+'';
	 	nodeObject.name = node.summary;
	 	nodeObject.type = node.isLeaf;
	 	this.officeTreeData.push(nodeObject);
	 	this.tree.treeModel.update();	
   }
   	/*检测同名请求*/
	checkName(name,id){
		this.dataTreeService.checkName(name,id)
			.then( res =>{
			   if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
			   			 // this.dialogPlugin.tip('科室名称不能同名',null,'error')
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
	if(this.cateType.summary !="" && this.testNameCode(this.cateType.summary)){
			if(this.curNode && !this.isAdd){
				console.log('查询同名检测')
				this.checkName(this.cateType.summary,this.curNode.id)
			}else{
				console.log('新增同名检测')
				this.checkName(this.cateType.summary,"")
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
//输入框校验
	testIptItem(value){	
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g;
			let result = reg.test(value);
			if(!value){
				this.dialogPlugin.tip('请填写科室名称',null,'error');
				return;
			}
			if(result){
				this.Itemcode = true;
				
			}else{
				this.dialogPlugin.tip('科室名称输入有误',null,'error');
				this.Itemcode = false;
			}
	}
	//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g,
		result = reg.test(value);
		return result;
	}
}
