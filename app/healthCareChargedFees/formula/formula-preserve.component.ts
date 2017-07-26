import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { DataTreeService } from './formula-preserve.service';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../common/ug-dialog/dialog';
import { DialogModel } from '../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector: 'formula-preserve',
	templateUrl:'formula-preserve.component.html',
	styleUrls:['formula-preserve.component.css'],
	providers:[DataTreeService]
})
export class FormulaPreserveComponent{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	@ViewChild(TreeComponent)
	private tree: TreeComponent;
	drugsTreeData:any;
	curNode: any;						//当前节点。  pCode 判断是否为根节点
	curTreeNode: TreeNode;
	cateType: any = {};						//当前节点的数据类型
	insuranceId:any;//险种请求返回的保险ID
	activeIdx:number = 0;
    activeId:any;
    
/*初始化发送获取险种请求*/
	private insuranceTypeOption : any = {
		width:'323px',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/insurance'
	};
/*tree配置项*/
 	options = {
		idField: 'id',
		allowDrag: false,
		isExpandedField: 'open'
	};
	constructor(
		private dataTreeService: DataTreeService,private router: Router
	) { }
	ngOnInit(){}

	/********* 业务逻辑
	* 初始化获取目录的默认险种
	* ------------------
	* chooseInsurance($event)
	*  切换险种
	*-------------------
	*getDataTree()
	*根据目录版本险种获取第一层的树结构
	*-------------------
	/******************/
    chooseInsurance($event){	
    	this.insuranceId = $event.id;
    	this.curNode = null;
    	this.getDataTree(null,this.insuranceId)
    	
    }
    getDataTree(dictValue?: string,insuranceId?:string){
		this.dataTreeService.getCalcTree(dictValue,insuranceId)
			.then(res => {
				if(res.code == 200){
					this.deleteTreeModelexpandedNodeIds();
					if(res.data.length !=0){
						this.drugsTreeData = res.data;
					}else{this.drugsTreeData = [];}

				}
			});
	}
	/********* 左侧目录树功能逻辑
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
	chooseNode($event: any){
		this.curTreeNode = $event.node;
		this.curNode = this.curTreeNode.data;
		this.activeId = this.curNode.id;
		this.dataTreeService.getData(this.curNode.id)
		.then(res => {
			if(res.code == 200){
				 	this.cateType = res.data;
			}
		})
	}
	save():void{
		let modifyData: any;
	 	modifyData = this.cateType;
	 	this.dataTreeService.updateData(modifyData)
	 	.then(res =>{
	 		if(res.code == 200){
	 			this.dialogPlugin.tip("保存成功",null,"success");
	 		}
	 	})
	}
	
  /***********************************************************************
  *以下是获取下拉框数据，和关联属性树的方法
  ************************************************************************/
   /*获取分析类型*/	
	/*删除展开属性*/
	deleteTreeModelexpandedNodeIds(){
		for(var prop in this.tree.treeModel.expandedNodeIds){
			if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
				delete this.tree.treeModel.expandedNodeIds[prop];
			}
		}
	}
	//  判断选中把数据存起来
	saveCheckSource(arr,index,current){
		if(current.checked == true){
			for(let i=0;i<arr.length;i++){
				arr[i].isDefault=0;
			}
			arr[index].isDefault=1;
		}
	}
}