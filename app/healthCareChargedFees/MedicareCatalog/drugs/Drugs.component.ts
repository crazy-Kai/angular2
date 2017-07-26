import { Component,OnInit,ViewChild} from '@angular/core';
import { DataTreeService } from './drugs.service';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router,ActivatedRoute,Params} from '@angular/router';

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';

import { FileInfo , DataList} from './fileInfo';
import { Limt } from '../../common/limit';
@Component({
	selector:'drgus-app',
    templateUrl: 'drugs.component.html',
	styleUrls:['drugs.component.css'],
	providers:[DataTreeService]
})


export class DrgusComponentApp {
	// @ViewChild(UploadPlugin) uploadPlugin: UploadPlugin;
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	@ViewChild(TreeComponent)
	private tree: TreeComponent;
	/*初始化发送获取险种请求*/
	private insuranceTypeOption : any;
	
	/*tree配置项*/
 	options = {
		getChildren: this.getChildren.bind(this),
		idField: 'id',
		actionMapping: {
                mouse: {
                    click: (tree, node, $event) => {
                        this.chooseNode(node);
                        TREE_ACTIONS.FOCUS(tree, node, $event);
                    }
                }
           },
		allowDrag: true
		
	};
	
	constructor(
		private dataTreeService: DataTreeService,private router: Router,private route : ActivatedRoute
		) { 
		
	}

	/*变量*/
	importTreeUrl = "/ipharmacare-distributed-yb-web/drug/excel";/*导入*/
	private isShow:boolean = false;
	private isTextShow:boolean = true;
	drugsTreeData:any;
	dataList: DataList = new DataList();
	isAdd: boolean;						//是否为添加操作
	searchWord: string;					//搜索条件
	curNode: any;						//当前节点。  pCode 判断是否为根节点
	curTreeNode: TreeNode;
	cateType: any = {};						//当前节点的数据类型
	addlevel:any;//新增层级
	dragData:any = {};//拖拽的节点
	execlFile :any;
	isShowDownLoad:boolean = false;
	alertMessageTemplate:boolean = false;//警示信息模板
	addDrugsTemplate:boolean = false;//添加药品模板
	modifyDrugsTemplate:boolean = false;//修改模板
	choosePropVlaueTemplate:boolean = false;//选择字典模版
	addDrugsData:any;//获取新增药品的信息
	addDrugsParameter:any = [];//保存添加药品的数组
	addDrugsParameterObject :any = {};//保存添加药品的对象
	mytree :boolean = false;
	showTree :boolean = false;
	vId:any;//增加的时候的版本ID
	insuranceId:any;//险种请求返回的保险ID
	versionId:any;//版本ID
	versionName:any;//当前版本名字
	list:any;//版本数据集合
	activeIdx:number = 0;
	reimbursementData:any;//报销分类数据
	reimbursementActiveId:any;//报销分类当前ID
	propObject :any; //属性分类
	aboutTreeData :any;//字典值
    selectedName:string ;/*显示选中的名字*/
    medicareRules:any = [];//医保规则
    currentIndex:any = 0;//默认报销分类
    limit:Limt = new Limt();/*工具类*/
    pId:any = [];//选中的字典ID
    pName:any = [];//选中的字典name
    managementArray:any = [];//管理依据数组
    testNameResult :boolean = true;
    activeId:any;
    YBcode:boolean = true; //医保校验
    Namecode:boolean = true; //节点名称校验
	drugType:string;//药品类型,新增必传参数
	cautionInformationDialogOptions = {
		'curNodeId': '',
		'dataList':this.dataList,
		'medicareRules':this.medicareRules,
		'versionId':'',
		'insuranceId':''
	};
	oldDrugName:any;//修改药品保存前的药品名
	newDrugName:any = '';//新name
	drugOptions ={
		nodeId:'',//当前版本ID
    	nodeDrugCode:'',//当前节点ID
    	versionId:'',//当前节点的drugCode
    	drugType:'',
    	type:""//区分增加和修改
	};//添加药品参数配置项啊
	currentInsuranceId:any;//当前险种ID 
	currentVersionId:any;//当前版本
	reimbursementId:any;//当前的报销分类ID
	templateUrl :any = "/ipharmacare-distributed-yb-web/template/download?filename=药品目录模版.xlsx";
	isLeaf:any;//分类层级啊
	showSearchBtn:boolean = true;//模糊查询按钮
	defectName:any;//缺失的报销分类的名称
	dictionariesOptions = {
		nodes:[]
	};//关联属性字典
	ngOnInit(){
		this.getRouteParam();
		/*初始化行为*/
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
		   this.defectName =this.route.params['value'].summary;
       });
	}
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
    chooseInsurance($event){
    	console.log($event.id)
    	this.insuranceId = $event.id;
    	this.cautionInformationDialogOptions.insuranceId = this.insuranceId;
    	this.getVersionId();
    	this.curNode = null;
    	this.isAdd = false;
    	
    }
    changeDetail(){
    	this.isShow=true;
    	this.isTextShow=false;
    }
    
    getVersionId(){
    	this.dataTreeService.getVersion(this.insuranceId)
    	.then( res=>{
    		if(res.code == 200){
    			if(res.data.length){
    				this.showSearchBtn = true;
	    			this.list = res.data;
    				this.activeIdx = 0;
		  			 if(!this.currentInsuranceId || !this.currentVersionId || !this.getCurrentVersionId(this.currentVersionId)){
		  			 	this.versionId =this.list[this.activeIdx].id;
	    				this.versionName = this.list[this.activeIdx].name;
		  			 }
	    			this.cautionInformationDialogOptions.versionId = this.versionId;

	    			if(this.versionId != undefined){
	    				this.getDataTree(null,this.versionId);
	    				
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
    				this.showSearchBtn = false;
    				this.isShow = false;
    				this.isTextShow = true;
    				this.cautionInformationDialogOptions.versionId = this.versionId = "";
    				this.list=[];
    				this.drugsTreeData = [];
    				this.versionName="";
    			}
    		}
    	})
    }
	getDataTree(dictValue?: string,versionId?:string){
		this.dataTreeService.getDrugsTree(dictValue,versionId)
			.then(res => {
				if(res.code == 200){
					if(res.data.length !=0){
						this.drugsTreeData = res.data;
						this.deleteTreeModelexpandedNodeIds();
					}else{this.drugsTreeData = [];}
					// this.curNode = null;
				}
				
			});
	}
	 /*版本管理*/
    versionControl(){
    	
    	let link:any= ['healthCareChargedFees/medicareCatalog/drugs/all_version_management/Drug_version_management/'+this.insuranceId];
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
	* uploadFile()
	* 上传文书的方法
	* -------------------
	* makeFileRequest()
	* 将文书导入目录树的方法
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
		this.dataTreeService.getDrugsSearchTree(dictValue,this.versionId)
			.then(res => {
				if(res.code == 200){
					if(this.defectName)  this.defectName = 'null';
					if(this.currentInsuranceId) this.currentInsuranceId = null;
					if(this.currentVersionId) this.currentVersionId = null;
					if (res.data != "") {
						 if (dictValue !="") {
						 		this.setExpanded(res.data,true);
						 }else{
						 	this.deleteTreeModelexpandedNodeIds();
						 }
						this.drugsTreeData= res.data;
						/*清空路由获取到的报销分类的节点名称使查询方法只执行一次*/
						
					}else{
					
						this.drugsTreeData = [];
					} 
				}
			});
	}

	getChildren(node:any,versionId:any): any {
		return this.dataTreeService.getChildrenByNode(node.data,this.versionId);
	}
	
	addPropsOption = {
		getChildren:this.getPropsTreeChildren.bind(this),
		idField: 'id'
	}
	getPropsTreeChildren(node:any):any{
		return this.dataTreeService.getPropChildren(this.cateType.attributeKey,node.data.id);
	}

	chooseNode($event: any){
		/*把验证变量设置成默认值*/
		this.addlevel = "";
		this.isLeaf = "";
		this.Namecode = true;
		this.YBcode = true;
		this.testNameResult = true;
		this.curTreeNode = $event;
		this.curNode = this.curTreeNode.data;
		//清空版本ID 和drugType
		this.vId = "";
		this.drugType = "";
		this.activeId = this.curNode.id;
		this.dataTreeService.getData(this.curNode.id,this.versionId)
		.then(res => {
			if(res.code == 200){
				 	 this.cateType = res.data.drug;
				 	 this.vId = this.cateType.versionId;
				 	 this.drugType = this.cateType.drugType;
				 	 this.drugOptions.nodeId = this.activeId;
				 	 this.drugOptions.nodeDrugCode = this.cateType.drugCode;
				 	 this.drugOptions.versionId = this.cateType.versionId;
				 	 this.drugOptions.drugType = this.cateType.drugType;
					 if(this.cateType.attributeKey){
					 	this.getPropsValue(this.cateType.attributeKey);
					 }
					this.isAdd = false;
					this.selectedName=res.data.drugNames;
					
					this.getreimbursementData();
					this.getProps();
			}
		})
	}

	add(node:any,$event){
		$event.stopPropagation();
		/*把验证变量设置成默认值*/
		this.YBcode = true;
		this.isLeaf = null;
		this.addlevel = null;
		this.isAdd = true;
		this.cateType = {};
		this.cateType.attributeKey="";
		this.selectedName = "";
	}

	delData(node: any) {
		if(this.curNode.type !=1){
				this.deletePrompt.call(this,'此操作会删除所有子目录您确定要删除吗？',node,this.versionId);
		}else{
				this.deletePrompt.call(this,'您确定要删除吗？',node,this.versionId);
		}
	}
	deletePrompt(message:any,node:any,dId:any){
		this.dialogPlugin.confirm(message, () => {
						this.dataTreeService.delData(node.data.id,dId)
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
		if(this.cateType.isReimbursement && this.cateType.isReimbursement ==1){
			this.cateType.reimbursementId = this.reimbursementId;
		}else{
			this.cateType.reimbursementId = '';
		}
		let newData: any;
		newData = this.cateType;
		newData.versionId = this.vId;
		
		newData.drugType = this.drugType;
		/*同级*/
		if(this.addlevel == 1 && this.curTreeNode.data.type !== 2 ){
			newData.parentId = this.curTreeNode.parent.data.id;
		}else{
			newData.parentId = this.curTreeNode.data.id;	
		}
		let parentNode = this.tree.treeModel.getNodeById(newData.parentId);
		newData.isLeaf = this.isLeaf;
		if(newData.summary && this.testNameResult &&this.Namecode && this.YBcode && this.addlevel && this.isLeaf){
			
			 this.publicSaveData.call(this,this.addUpdateData,newData,parentNode);
		}else if(!this.addlevel){
			this.dialogPlugin.tip("请选择目录位置",null,"error");
		}else if(!this.isLeaf){
			this.dialogPlugin.tip("请选择目录类型",null,"error");
		}else if(!newData.summary){
			this.dialogPlugin.tip("请填写目录名称",null,"error");
		}else if(!this.testNameResult){
			this.dialogPlugin.tip("目录名称不能同名",null,"error");
		}else if(!this.Namecode){
			this.dialogPlugin.tip("目录名称输入有误",null,"error");
		}else if(!this.YBcode){
			this.dialogPlugin.tip("医保代码输入有误",null,"error");
		}
	}

	private updateData(): void {
	 	if(this.newDrugName != ''){
			this.cateType.summary = this.newDrugName;
		}
	 	let modifyData: any;
		if(this.cateType.isReimbursement && this.cateType.isReimbursement ==1){
			this.cateType.reimbursementId = this.reimbursementId;
		}
	 	modifyData = this.cateType;
	  
	 	if(modifyData.summary && this.testNameResult && this.Namecode && this.YBcode){
	 		
	 		 this.publicSaveData.call(this,this.saveUpdateData,modifyData);
	 	}else if(!modifyData.summary){
	 		this.dialogPlugin.tip("请填写目录名称",null,"error")
	 	}else if(!this.testNameResult){
	 		this.dialogPlugin.tip("目录名称不能同名",null,"error")
	 	}else if(!this.Namecode){
	 		this.dialogPlugin.tip("目录名称输入有误",null,"error");
	 	}else if(!this.YBcode){
	 		this.dialogPlugin.tip("医保代码输入有误",null,"error");
	 	}
	 }
	/*保存操作的公用代码*/
	publicSaveData(fn?:any,data?:any,parentNode?:any){
			 this.dataTreeService.testIsSave('3',this.versionId)
			 .then( res =>{
			 		if(res.code == 200){
			 			if(res.data == '2'){
							parentNode?fn.call(this,data,parentNode):fn.call(this,data);
			 			}else if(res.data == '1'){
			 				this.dialogPlugin.confirm('当前目录正在使用，更改后会影响部份规则的正常使用，是否保存?',() =>{
	 		 				parentNode?fn.call(this,data,parentNode):fn.call(this,data);		
	 		 				},() =>{})
			 			}else{
			 				this.dialogPlugin.confirm("此版本被激活的规则中使用",()=>{},()=>{},false,'无法保存')
			 			}
			 		}
			 })
	} 
	 /*发送修改后的保存请求*/
	saveUpdateData(modifyData){
		this.dataTreeService.updateData(modifyData,this.curNode.id )   
		 	.then(res => {
		 		if(res.code == 200) {
		 		this.dialogPlugin.tip("保存成功",null,"success");
		 		/*把修改后的name 值和父级节点的名字*/
					this.curTreeNode.data.name = res.data.summary;
					this.curTreeNode.data.orgxtType = res.data.isReimbursement;
					this.updateNode(res.data);
				}
		 	})
	}
	/*增加节点后的保存请求*/
	addUpdateData(newData,parentNode){
		this.dataTreeService.addData(newData)
			.then(res => {
				if (res.code == 200) {
			 		this.dialogPlugin.tip("保存成功",null,"success");
			 		res.data.name = res.data.summary;
			 		res.data.type = res.data.isLeaf;
			 		res.data.pid = res.data.parentId + '';
			 		res.data.id = res.data.id + '';
			 		res.data.orgxtType = res.data.isReimbursement;
			 		/*更新tree*/
			 		this.addNode(res.data,parentNode);
					this.cateType.summary = "";	
				}
			})
	}

    uploadFile(file: any) {
   	
        let uploadfile = file.files[0];
        this.makeFileRequest(uploadfile);
		/*清空file文件 避免相同文件不可导入*/
		file.value ="";
    }

	makeFileRequest(file: File) {
        let formData: FormData = new FormData(),
            xhr: XMLHttpRequest = new XMLHttpRequest(),
            fileData = new FileInfo();
        fileData.fileName = file.name;
        formData.append("file", file);
        formData.append("versionId", this.versionId);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let body = JSON.parse(xhr.response);
                    if (body.code  == 200) { 
                       this.dialogPlugin.tip('导入成功',null,"success");
                       this.getDataTree(null,this.versionId);
                       this.curNode = null;
                       this.isAdd = false;
                    }else {	
                	 if(body.code == 402){
                         	this.dialogPlugin.tip(body.message,null,"error",true);
                         	window.setTimeout(()=>{
                         		location.reload();
                         	},3000)
                         }else{
							this.dialogPlugin.tip(body.message,null,"error",true);
                       }
                
                    }
                    
                } else {
                }
            }
        };
       
        xhr.open('POST', this.importTreeUrl, true);
        xhr.send(formData);
    }

    onMoveNode($event){
		this.dragData.id = $event.node.id;
		if($event.to.node.data.name){
			
			this.dragData.parentId  =  $event.to.node.data.id;

		}else{
			this.dragData.parentId = '';
		}
		this.dragData.versionId = this.versionId;
	   if($event.node.type != 2  && $event.node.type != 1 && $event.to.node.data.type!= 1 && $event.to.node.data.type != 3 && $event.to.node.data.name){	
   			this.dialogPlugin.confirm('此操作将拖动整个分类包括子节点,您确定保存当前的操作吗？', () => {
   					
					let parentNode:any;
					if($event.node.pid){
						 parentNode = this.tree.treeModel.getNodeById($event.node.pid);
					}
			
					if(parentNode && parentNode.data.children.length == 0 && parentNode.data.hasChildren == true){
						parentNode.data.hasChildren = false;
						this.tree.treeModel.update();
					}
   				/*判断是否是最外层即包含根节点的数组*/
					if($event.to.node.data.name){
						$event.node.pid = $event.to.node.data.id;
					}else{
						$event.node.pid = "";
					}
					if($event.to.node.data.name){
						/*拖拽到的目标节点后只有一个节点的时候，才会发送请求获取有可能存在的其它节点，否则就代表已经手动加载了子节点*/
						if($event.to.node.data.children.length == 1){
							this.dataTreeService.getChildrenByNode($event.to.node.data,this.versionId).then(res=>{
								/*concat方法IE下有兼容性问题，请注意*/
							
								if(res &&  $event.to.node.data.hasChildren == true){
							 		let  childrenArray = $event.to.node.data.children.concat(res);
							 		$event.to.node.data.children =  childrenArray;
							 		this.tree.treeModel.update();
								}
							 	this.tree.treeModel.expandedNodeIds[$event.to.node.data.id] = true;
							})
						}else{
							this.tree.treeModel.expandedNodeIds[$event.to.node.data.id] = true;
						}
					}
					this.tree.treeModel.update();
					this.dataTreeService.postData(this.dragData)
					.then(res => {
						if(res.code == 200){
							this.dragData = {};
							this.dialogPlugin.tip("保存成功",null,"success");
						}
					})
			}, () => { this.resetTree.call(this,$event)},true,"如果不保存,将重置" )
	   }else if($event.node.type == 2){
	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);
	   }else if($event.to.node.data.type == 1){
	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);
	   }else if($event.to.node.data.type == 3){
	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);
	   }else if($event.node.type == 1){
	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);
	   }else if(!$event.to.node.data.name){
	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);
	   }else{
	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);
	   }
	}
	dragWarning(innerHtml,message?:string,node?:any){
		this.dialogPlugin.confirm(innerHtml, () => {
		this.resetTree.call(this,node);
	  }, () => { },false,message)
	}

	/*重置树结构代码*/
	resetTree(node){
		if(node.node.pid){
				let parentNode  = this.tree.treeModel.getNodeById(node.node.pid),
					parentNodeChilds = parentNode.data.children;
					/*把移动的节点放入未移动前的节点中*/
					console.log(1)
					parentNodeChilds.push(node.node);
					this.tree.treeModel.update();
			
			}else if(!node.node.pid){
				console.log(2)
				this.drugsTreeData.push(node.node);
				this.tree.treeModel.update();
			}
			if(node.to.node.data.name ){	
				/*移入的目标节点*/
				console.log(3)
				let toParentNode = this.tree.treeModel.getNodeById(node.to.node.data.id),
					toParentNodeChilds = toParentNode.data.children;
					toParentNodeChilds.splice(node.to.index,1);
					if(toParentNode.data.children && !toParentNode.data.children.length){
						toParentNode.data.children = '';
					}
					
					this.tree.treeModel.update();
			}else if (!node.to.node.data.name) {
				console.log(4)
				this.drugsTreeData.splice(node.to.index,1);
				this.tree.treeModel.update();
			}
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
	* onMouseenter， onMoseleave
	* 显示模版下载和导入功能按钮
	/***************/
	
    onMouseenter($event){
    	this.isShowDownLoad = true;
    }
   
    onMoseleave($event){
    	this.isShowDownLoad = false;
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

	addNode(node: any,parentNode:any) {
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
		if(this.addlevel != 1){
				this.openDddNode.call(this)
		}
		this.tree.treeModel.update();
	}

	/********* 右侧展示页面的功能
	*addDrugs
	*添加药品弹出框
	*-------------------
	* getDrugs($event)
	* 获取添加药品的数据
	*-------------------
	*addDrugsnode()
	* 新增药品后更新树
	*-------------------
	* saveAddData()
	* 保存新增选中的药品
	*-------------------
	*modifyDrugs，modifycancelfn，savemodifyData
	*修改药品
	*-------------------------
	*setMessage，getMessageData，saveMessage
	*警示信息逻辑方法
	*-------------------------
	/***************/
	
	addDrugs(){
		this.drugOptions.type = "";
		this.addDrugsTemplate = true;
		this.dialogPlugin.myModule();
	  }
	 /*增加节点自动展开功能*/
	openDddNode(){
		let currentAddParentId = this.curNode.id;
				if(!this.curNode.children){
					this.dataTreeService.getChildrenByNode(this.curNode,this.versionId).then( res => {
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
	addDrugsnode(node:any){
		console.log(this.curTreeNode.data.hasChildren)
		if(this.curTreeNode && this.curTreeNode.data.children ){
			for( let i = 0 ;i < node.length;i++){
				this.curTreeNode.data.children.push(node[i])
			}
		}else{
			if(this.curTreeNode && !this.curTreeNode.data.hasChildren){
				this.curTreeNode.data.hasChildren = true;
				this.curTreeNode.data.children = new Array<any>();
				for( let i = 0 ;i < node.length;i++){
					this.curTreeNode.data.children.push(node[i])
				}
			}
		}
		this.openDddNode.call(this);
		
		this.tree.treeModel.update();
	}
	/*组件中输出的addDrugsParameter*/
	onChecked($event){
		this.addDrugsParameter = $event;
	}
    saveAddData(){
    	/*清空对象*/
    	this.addDrugsParameterObject = {};
    	this.addDrugsParameterObject['list'] = this.addDrugsParameter;
    	if(this.addDrugsParameterObject.list.length){
	    	this.cancelfn();
	    	this.dataTreeService.postSaveDrugsData(this.addDrugsParameterObject)
	    	.then( res =>{
	    		if(res.code == 200){
	    			for( let i = 0; i<res.data.length;i++){
	    				res.data[i].name = res.data[i].summary;
	    				res.data[i].type = res.data[i].isLeaf;
	    				res.data[i].pid = res.data[i].parentId + '';
						res.data[i].id = res.data[i].id + '';
	    				res.data[i].orgxtType = 0;
	    			}
	    			this.addDrugsnode(res.data);
	    			this.dialogPlugin.tip("保存成功",null,"success");
	    			/*清空数组*/
	    			this.addDrugsParameter = [];
	    		}
	    	})
    	}else{
    		this.dialogPlugin.tip('请选择药品',null,'error')
    	}

    }
    /*取消事件*/
    cancelfn(){
    	this.addDrugsTemplate = false;
		this.dialogPlugin.onClose();
    }
  	modifyDrugs(){
  		this.drugOptions.type = '修改';
	  	this.modifyDrugsTemplate = true;
	  	this.newDrugName = '';
	  	this.oldDrugName = this.cateType.summary;
	  	this.dialogPlugin.myModule();
  	}
	modifycancelfn(){
		this.cateType.summary = this.oldDrugName;
		this.modifyDrugsTemplate = false;
		this.dialogPlugin.onClose();
	}
	savemodifyData(){
	  	this.modifyDrugsTemplate = false;
		this.dialogPlugin.onClose();
	}
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
  	this.dataList.nodeType = "YP";
  	this.getmedicareRulesGroup();
  	let code :any = this.dataList; 
  	this.dataTreeService.saveMessage(code)
  	.then(res => {
  		if(res.code == 200){
  			this.cancelMessage();
  			this.dialogPlugin.tip('保存成功',null,'success')
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
   
   
    /*组件返回的单选框事件*/
    radioChange($event){
    	this.cateType.drugCode = $event.code;
    	this.drugOptions.nodeDrugCode = $event.code;
    	this.cateType.summary = $event.name;
    	this.newDrugName = $event.name;
    }
    /*获取报销分类数据*/
    getreimbursementData(){
    	this.dataTreeService.getreimbursement(this.insuranceId)
    	.then(res=>{
    		if(res.code == 200 ){
    			if(res.data.length){
		    		this.reimbursementData = res.data;
		    		if(this.cateType.reimbursementId == ''){
		    			this.reimbursementId = this.reimbursementData[0].id;
		    		}else{
		    			this.reimbursementId = this.cateType.reimbursementId;
		    		}
    			}else{
    				
    				this.reimbursementData = [];
    			}
    		
    		}
    	})
    }
    /*切换版本*/
    optionClick($event){
    	console.log(666)
    	this.versionId = this.list[this.activeIdx].id;
    	this.versionName = this.list[this.activeIdx].name;
    	if( this.versionId  != undefined){
    		this.getDataTree(null,this.versionId);
    		this.curNode = null;
    		this.isAdd = false;
    	}
    	this.cautionInformationDialogOptions.versionId = this.versionId;
    }
    /*获取属性分类*/
    getProps(){
    	this.dataTreeService.getProp()
    	.then(res=>{
    		if(res.code == 200){
	    		if(res.data.length){
	    			this.propObject = res.data;
	    		}
    		}
    	})
    }
    /*获取属性值*/
    getPropsValue(code?:any){
    	this.dataTreeService.getPropValue(code)
    	.then(res=>{
    		if(res.code == 200){
	    		if(res.data.length){
	    			this.aboutTreeData = res.data;
	    			// this.dictionariesOptions.nodes = this.aboutTreeData;
	    			
	    		}else{
	    			this.aboutTreeData = [];
	    			
	    			// this.dictionariesOptions.nodes = [];
	    			this.selectedName= " ";
	    		}
    		}
    	})
    }
    /*选择属性值*/
    choosePropVlaue($event){
    	if(this.cateType.attributeKey == "" ){
    		this.aboutTreeData = [];
    		this.dialogPlugin.tip("请先选择属性",null,'error');
    	}else{
    		if(this.aboutTreeData.length ){
	    		this.choosePropVlaueTemplate = true;
	    		// this.mytree = true;
				this.dialogPlugin.myModule();
    		}else{
    			this.dialogPlugin.tip('没有相关字典值',null,'error')
    		}
    	}
    }
    /*勾选属性值*/
    propsValueChange($event,name,code,node){
    	let target:any = $event.target.checked;
    	this.serialize(this.pId,code,target);
    	this.serialize(this.pName,name,target);
    }
    /*切换关联属性*/
  selectedChange($event){
  	if($event != ""){
  		this.getPropsValue($event)
  	}
  	/*清空右侧选中的值*/
  	this.selectedName = ""; 
  }
    /*序列化属性参数*/
    serialize(array?:any,code?:any,checked?:any){
    	if(checked){
    		if(array.length != 0){
    			if(!this.limit.contains(array,code).result){
    		 		array.push(code)
    		 	}
    		}else{
    			array.push(code)
    		}
    	}else{
    		if(this.limit.contains(array,code).result){
    			array.splice(this.limit.contains(array,code).index,1)
    		}
    	}
    }
    /*保存属性值*/
    saveProps(){
    	if(this.pId.length != 0 || this.pName.length != 0){
				this.cateType.attributeValue = this.pId.join(",");
				this.selectedName = this.pName.join(",");
				this.modifyDrugsTemplate = false;
				this.dialogPlugin.onClose();
    	}else{
    		this.selectedName="";
    		this.dialogPlugin.tip("请勾选属性",null,'error')
    	}
    	this.pId = [];
		this.pName = [];
    }
    /*取消选择字典*/
	choosePropCancelfn(){
	  	this.pId = [];
		this.pName = [];
	  	this.choosePropVlaueTemplate = false;
	  	this.dialogPlugin.onClose();
	}
 
  
 /*检测同名请求*/
checkName(name,id,pid,vid){
	this.dataTreeService.checkName(name,id,pid,vid)
		.then( res =>{
		   if(res.code == 200){
		   		if(res.data == false){
		   			 this.testNameResult = false;
		   			 // this.dialogPlugin.tip('目录名称不能同名',null,'error')
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
	if(this.cateType.summary != "" && this.testNameCode(this.cateType.summary)){
			if(this.isAdd){
				if(this.addlevel == 1 && this.curNode.type != 2){
					/*通过输入验证后再确定是否发送同名检测请求*/
					this.checkName(this.cateType.summary,null,this.curNode.pid,this.versionId)
				}else{
					this.checkName(this.cateType.summary,null,this.curNode.id,this.versionId)
				}
			}else{
				this.checkName(this.cateType.summary,this.curNode.id,this.curNode.pid,this.versionId)
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
	//	节点名称校验
	testIptName(value){	
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g;
			let result = reg.test(value);
			if(!value){
				this.dialogPlugin.tip('请填写目录名称',null,'error');
				return;	
			}
			if(result){
				this.Namecode = true;
				
			}else{
				this.dialogPlugin.tip('目录名称输入有误',null,'error');
				this.Namecode = false;
			}
	}
	//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g,
		result = reg.test(value);
		return result;
	}
	//	医保代码校验
	testIptYBCode(value){
		if(value){	
			let reg1 = /^[a-zA-Z0-9\,\-\.]+$/g;
			let result1 = reg1.test(value);
			if(result1){
				this.YBcode = true;
			}else{
				this.dialogPlugin.tip('医保代码输入有误',null,'error');
				this.YBcode = false;
			}
		}else{
			this.YBcode = true;
		}
	}

}