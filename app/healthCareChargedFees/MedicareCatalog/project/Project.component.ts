import { Component,OnInit,OnChanges,ViewChild} from '@angular/core';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { DataTreeService } from './project.service';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import { FileInfo , DataList, NodeObject} from '../../common/fileInfo';
@Component({
	selector:'project-app',
    templateUrl: 'project.component.html',
	styleUrls:['project.component.css'],
	providers:[DataTreeService]
	
})
export class ProjectComponentApp implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	@ViewChild(TreeComponent)
	private tree: TreeComponent;
	/*初始化发送获取险种请求*/
	private insuranceTypeOption : any;
	/*报销分类option*/
	private ReimbursementOption :any = {
		width:'100%',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/reimbursement'
	}	
	/*tree配置项*/
 	options = {
		getChildren: this.getChildren.bind(this),
		idField: 'id',
		actionMapping:{
			mouse:{
				click: (tree,node,$event) =>{

					this.chooseNode(node);
					TREE_ACTIONS.FOCUS(tree,node,$event);
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
	importTreeUrl = "/ipharmacare-distributed-yb-web/item/excel";/*导入*/
	private isShow:boolean = false;
	private isTextShow:boolean = true;
	itemTreeData:any;
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
	vId:any;//增加的时候的版本ID
	insuranceId:any;//险种请求返回的保险ID
	versionId:any;//版本ID
	versionName:any;//当前版本名字
	list:any;//版本数据集合
	activeIdx:number = 0;
	reimbursementData:any;//报销分类数据
	reimbursementActiveId:any;//报销分类当前ID
    medicareRules:any;//医保规则
    selectedMessage:any;//active医保规则
    analysis:any;//分析类型
    promptmessage:any;//提示信息
    currentIndex:any = 0;//默认报销分类
    managementArray:any = [];//管理依据数组
    testNameResult :boolean = true;
    YBcode:boolean = true; //医保校验
    SScode:boolean = true; //手术校验
    Namecode:boolean = true; //节点名称校验
    Calccode:boolean = true; //计数校验
    Itemcode:boolean = true; //项目名称校验
    isLeaf:number; 
    cautionInformationDialogOptions = {
		'curNodeId': '',
		'dataList':this.dataList,
		'medicareRules':this.medicareRules,
		'versionId':'',
		'insuranceId':''
	};
	currentInsuranceId:any;//当前险种ID 
	currentVersionId:any;//当前版本
	reimbursementId:any;//当前的报销分类ID
	templateUrl :any = "/ipharmacare-distributed-yb-web/template/download?filename=医保项目目录导入模版.xlsx";
	showSearchBtn:boolean = true;//模糊查询按钮
	defectName:any;//缺失的报销分类的名称

	ngOnInit(){
		/*初始化行为*/
		this.getRouteParam();
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
    	this.insuranceId = $event.id;
    	this.cautionInformationDialogOptions.insuranceId = this.insuranceId;
    	this.getVersionId();
    	this.curNode = null;
    	this.isAdd = false;
    	
    }
    getVersionId(){
    	this.dataTreeService.getVersion(this.insuranceId)
    	.then( res=>{
    		if(res.code == 200 && res.data.length != 0){
    			this.showSearchBtn = true;
    			this.activeIdx = 0;
    			this.list = res.data;
				if(!this.currentInsuranceId || !this.currentVersionId || !this.getCurrentVersionId(this.currentVersionId)){
		  			 	this.versionId =this.list[this.activeIdx].id;
	    				this.versionName = this.list[this.activeIdx].name;
		  		}
    			this.cautionInformationDialogOptions.versionId = this.versionId;
    			if(this.versionId != undefined){
    				this.getDataTree(null,this.versionId)
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
    			this.versionName="";
  				this.itemTreeData = [];
    		}
    	})
    }
	getDataTree(dictValue?: string,versionId?:string){
		this.dataTreeService.getItemTree(dictValue,versionId)
			.then(res => {
				if(res.code == 200){
					this.deleteTreeModelexpandedNodeIds();
					if(res.data.length != 0){
						this.itemTreeData = res.data;
						this.deleteTreeModelexpandedNodeIds();
					}else{
						this.itemTreeData = [];
					}
				}
			});
	}
	 /*版本管理*/
    versionControl(){
    	let link:any= ['healthCareChargedFees/medicareCatalog/project/all_version_management/Project_version_management/'+this.insuranceId];
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
						this.itemTreeData= res.data;
					}else{
						this.itemTreeData = [];
					} 
				}

			});
	}

	getChildren(node: any,versionId:any): any {
		
		return this.dataTreeService.getChildrenByNode(node.data,this.insuranceId,this.versionId);
	}
	chooseNode($event: any){
		/*把验证变量设置成默认值*/
		this.Namecode = true;
		this.Calccode = true;
		this.YBcode = true;
		this.SScode = true;
		this.testNameResult = true;
		this.curTreeNode = $event;
		this.curNode = this.curTreeNode.data;
		this.vId = "";
		this.dataTreeService.getData(this.curNode.id,this.versionId)
		.then(res => {
			if(res.code == 200){
				 	this.cateType = res.data;
				 	this.vId = this.cateType.versionId;
					this.isAdd = false;
					this.getreimbursementData();	
			}
			
		})
	}
	/*是否物理诊疗*/
	isPhysical($event){
		if($event.checked == true){
			this.cateType.isPhysicalDiagnosis = 1;
		}else{
			this.cateType.isPhysicalDiagnosis = 0;
		}
	}
	add(node:any,$event){
		$event.stopPropagation();
		/*把验证变量设置成默认值*/
		this.Calccode = true;
		this.YBcode = true;
		this.SScode = true;
		this.isAdd = true;
		this.addlevel = null;
		this.isLeaf = null;
		this.cateType = {};
		this.cateType.code ="";
		this.cateType.description = "";
		this.cateType.unit = "";
		this.cateType.isPhysicalDiagnosis = 0;
		this.cateType.ssicd = "";
		this.cateType.isReimbursement="";
		this.cateType.reimbursementId="";
	}

	delData(node: any) {
		if(this.curNode.type !=1){
			this.deletePrompt.call(this,'此操作会删除所有子目录您确定要删除吗？',node,this.versionId)
		}else{
			this.deletePrompt.call(this,'您确定要删除吗？',node,this.versionId)
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
		/*同级*/
		if(this.addlevel == 1  ){
			/*pid必须是字符串类型*/
			newData.parentId = this.curTreeNode.data.pid;
		}else{
			newData.parentId = this.curTreeNode.data.id;
		}
		let parentNode = this.tree.treeModel.getNodeById(newData.parentId);
		newData.isLeaf = this.isLeaf;
		if(newData.summary && this.testNameResult && this.Namecode && this.SScode && this.Calccode && this.YBcode && this.addlevel && this.isLeaf){
			this.publicSaveData.call(this,this.addUpdateData,newData,parentNode);
		}else if(!this.addlevel){
			this.dialogPlugin.tip("请选择节点层级",null,"error");
		}else if(!this.isLeaf){
			this.dialogPlugin.tip("请填写节点类型",null,"error");
		}else if(!newData.summary){
			this.dialogPlugin.tip("请填写节点名称",null,"error");
		}else if(!this.testNameResult){
			this.dialogPlugin.tip("节点名称不能同名",null,"error");
		}else if(!this.Namecode){
			this.dialogPlugin.tip("节点名称输入有误",null,"error");
		}else if(!this.YBcode){
			this.dialogPlugin.tip("医保代码输入有误",null,"error");
		}else if(!this.SScode){
			this.dialogPlugin.tip("手术代码输入有误",null,"error");
		}else if(!this.Calccode){
	 		this.dialogPlugin.tip("计数单位输入有误",null,"error");
	 	}
	   
	}

	private updateData(): void {
	 	let modifyData: any;
	 	if(this.cateType.isReimbursement && this.cateType.isReimbursement ==1){
			this.cateType.reimbursementId = this.reimbursementId;
		}else{
			this.cateType.reimbursementId = '';
		}
	 	modifyData = this.cateType;
	 	if(modifyData.summary && this.testNameResult && this.Namecode && this.Calccode && this.YBcode && this.SScode){
		 	this.publicSaveData.call(this,this.saveUpdateData,modifyData);
	 	}else if(!modifyData.summary){
	 		this.dialogPlugin.tip("请填写项目名称",null,"error")
	 	}else if(!this.testNameResult){
	 		this.dialogPlugin.tip("目录名称不能同名",null,"error")
	 	}else if(!this.Namecode){
	 		this.dialogPlugin.tip("项目名称输入有误",null,"error");
	 	}else if(!this.Calccode){
	 		this.dialogPlugin.tip("计数单位输入有误",null,"error");
	 	}else if(!this.YBcode){
	 		this.dialogPlugin.tip("医保代码输入有误",null,"error");
	 	}else if(!this.SScode){
	 		this.dialogPlugin.tip("手术代码输入有误",null,"error");
	 	}
	 }
	 /*保存操作的公用代码*/
	publicSaveData(fn?:any,data?:any,parentNode?:any){
			 this.dataTreeService.testIsSave('4',this.versionId)
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
                       this.dialogPlugin.tip("导入成功",null,"success");
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
    	console.log($event.to.node.data,$event.to.node)
		this.dragData.id = $event.node.id;
		if($event.to.node.data.name){
			this.dragData.parentId =  $event.to.node.data.id;
		}else{
			this.dragData.parentId = '';
		}
		this.dragData.versionId = this.versionId;

	   if($event.node.type != 2  && $event.node.type !=1 &&  $event.to.node.data.type!=1 && $event.to.node.data.type != 3){
			this.dialogPlugin.confirm('此操作将拖动整个分类包括子节点,您确定保存当前的操作吗？', () => {
				
				let parentNode:any;
				if($event.node.pid){
					 parentNode = this.tree.treeModel.getNodeById($event.node.pid);
					 console.log(parentNode)
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
							this.dataTreeService.getChildrenByNode($event.to.node.data,this.insuranceId,this.versionId).then(res=>{
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
			}, () => {  this.resetTree.call(this,$event) },true,"如果不保存,将重置" )
	   }else if($event.node.type == 2){

	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);

	   }else if($event.to.node.data.type==1){

	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);

	   }else if($event.to.node.data.type==3){

	   			this.dragWarning('无法进行此操作！','当前操作将被重置',$event);

	   }else if($event.node.type == 1){

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
				console.log(1,node)
				let parentNode  = this.tree.treeModel.getNodeById(node.node.pid),
					parentNodeChilds = parentNode.data.children;
					console.log(parentNode,parentNodeChilds)
					/*把移动的节点放入未移动前的节点中*/
					parentNodeChilds.push(node.node);
					console.log(parentNodeChilds)
					this.tree.treeModel.update();
			
			}else if(!node.node.pid){
				console.log(2)
				this.itemTreeData.push(node.node);
				this.tree.treeModel.update();
			}
			if(node.to.node.data.name ){	

				/*移入的目标节点*/
				console.log(3,node)
				let toParentNode = this.tree.treeModel.getNodeById(node.to.node.data.id),
					toParentNodeChilds = toParentNode.data.children;		
					toParentNodeChilds.splice(node.to.index,1);
					if(toParentNode.data.children && !toParentNode.data.children.length){
							toParentNode.data.children = '';
					};
					this.tree.treeModel.update();
			}else if (!node.to.node.data.name) {
				console.log(4)
				this.itemTreeData.splice(node.to.index,1);
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
			if(this.addlevel != 1){
					let currentAddParentId = this.curNode.id;
					
					if(!this.curNode.children){
						this.dataTreeService.getChildrenByNode(this.curNode,this.insuranceId,this.versionId).then( res => {
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
		 }
	}

   /* 添加同级根目录type为0的节点逻辑*/
   addRootDirectory(node){
   		let nodeObject = new NodeObject(); //树结构对象
	 	nodeObject.id = node.id+'';
	 	nodeObject.name = node.name;
	 	nodeObject.type = node.type;
	 	this.itemTreeData.push(nodeObject);
	 	this.tree.treeModel.update();
	 	
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
  	this.dataList.nodeType = "XM";
  	this.getmedicareRulesGroup();
  	let code :any = this.dataList; 
  	this.dataTreeService.saveMessage(code)
  	.then(res => {
  		if( res.code == 200){
  			this.dialogPlugin.tip("保存成功",null,"success");
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
    			if(res.data.length){
    				this.reimbursementData = res.data;
    				if(this.cateType.reimbursementId == ''){
		    			this.reimbursementId = this.reimbursementData[0].id;

		    		}else{
		    			this.reimbursementId = this.cateType.reimbursementId;
		    		}
    			}
    		}
    		
    		
    	})
    }
   
    /*切换版本*/
    optionClick($event){
    	this.versionId = this.list[this.activeIdx].id;
    	this.versionName = this.list[this.activeIdx].name;
    	if( this.versionId  != undefined){
    		this.getDataTree(null,this.versionId);
    		this.curNode = null;
    		this.isAdd = false;
    	}
    	this.cautionInformationDialogOptions.versionId = this.versionId;
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
	if(this.cateType.summary !=""  && this.testNameCode(this.cateType.summary)){
			if(this.isAdd){
				if(this.addlevel == 1){
					this.checkName(this.cateType.summary,null,"",this.versionId)
				}else{
					this.checkName(this.cateType.summary,null,this.curNode.id,this.versionId)
				}
				
			}else{
				this.checkName(this.cateType.summary,this.curNode.id,this.curNode.pid,this.versionId)
			}
	}
}
//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g,
		result = reg.test(value);
		return result;
	}

 /*新增的时候检测层级是否勾选*/
	// testCatalog(){
	// 	if(this.isAdd){
	// 		if(!this.addlevel){
	// 			this.dialogPlugin.tip('请选择节点层级',null,'error')
	// 		}
	// 		if(this.isLeaf !=1){
	// 			if(this.isLeaf ===null){
	// 				this.dialogPlugin.tip('请选择节点类型',null,'error')
	// 			}
	// 		}
	// 	}
	// }
  
  /*删除展开属性*/
	deleteTreeModelexpandedNodeIds(){
		for(var prop in this.tree.treeModel.expandedNodeIds){
			if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
				delete this.tree.treeModel.expandedNodeIds[prop];
			}
		}
	}

	testIptName(value,type){	
		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g;
			let result = reg.test(value);
			if(!value){
				if(type == 'object'){
					this.dialogPlugin.tip('请填写项目名称',null,'error');
				}else{
					this.dialogPlugin.tip('请填写节点名称',null,'error');
				}
				return;
			}
			if(result){
				this.Namecode = true;
				
			}else{
				if(type == 'object'){
					this.dialogPlugin.tip('项目名称输入有误',null,'error');
				}else{
					this.dialogPlugin.tip('节点名称输入有误',null,'error');
				}
				this.Namecode = false;
			}
	}

	testIptUnit(value){
		if(value){
			let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/g;
			let result = reg.test(value);
			if(result){
				this.Calccode = true;
				
			}else{
				this.dialogPlugin.tip('计数单位输入有误',null,'error');
				this.Calccode = false;
			}
		}else{
			this.Calccode = true;
		}
			
	}

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

	testIptSSCode(value){
		if(value){
			let reg1 = /^[a-zA-Z0-9\-\.]+$/g;
			let result1 = reg1.test(value);
			if(result1){
				this.SScode = true;
			}else{
				this.dialogPlugin.tip('手术代码输入有误',null,'error');
				this.SScode = false;
			}
		}else{
			this.SScode = true;
		}
		
	}
 
}
