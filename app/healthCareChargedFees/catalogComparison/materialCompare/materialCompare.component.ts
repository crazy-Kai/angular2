import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { DataTreeService } from './materialCompare.service';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { ChangeCompareData } from "./filedata";

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector: 'materialCompare',
	templateUrl:'materialCompare.component.html',
	styleUrls:['materialCompare.component.css'],
	providers:[DataTreeService]
})


export class MaterialCompareComponent{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	constructor(
		private dataTreeService: DataTreeService,private router: Router,private route : ActivatedRoute
		) { 
		
	}
		/*初始化发送获取险种请求*/
	private insuranceTypeOption : any;
	
//	变量
	insuranceId:any; //请求返回的保险ID
	versionList:any ;//版本集合
	versionId:any; //版本ID
	activeIdx:number = 0;
	materialCatalogue:any; //材料目录列表
	materialRightCatalogue:any=[]; //材料右侧目录列表
	allChecked:boolean = false; //判断是否全选
	isShow:boolean = false; 
	flag:any;//标志位判断
	searchWord:string; //用户搜索关键词
	searchRightWord:string; //右侧用户搜索关键词
	noCompare:boolean =false;
	idArray:any=[];//所有选中id的字符串集合
	hospitalCode:string; //机构代码
	itemType:any; //比对类型
	currentInsuranceId:any;//当前险种ID 
	currentVersionId:any;//当前版本
	changeCompareData: ChangeCompareData = new ChangeCompareData();
	showRight:boolean = false;
	materialTip:any=[]; //初始化判断是否有右侧标准字典
	// self:any = this;
	ngOnInit(){
		/*初始化行为*/
		this.getRouteParam()
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
	* getMaterialCatalogue()
	* 获取材料目录
	*-------------------
	/******************/
	chooseInsurance($event){
		this.showRight = false;
		this.insuranceId = $event.id;
		this.changeCompareData.insuranceId = this.insuranceId;
		this.getVersionId();
	}
//键盘回车事件  左边的
    onEnterData($event){
    	this.search();
    }
//键盘回车事件  右边的   
    onEnterDetailData($event){
    	this.searchRight();
    }
	getVersionId(){
		this.showRight = false;
		this.dataTreeService.getVersion(this.insuranceId)
			.then(res =>{
				if(res.code ==200 && res.data.length !=0){
					this.activeIdx = 0;
					this.versionList = res.data;
					
		  			 if(!this.currentInsuranceId || !this.currentVersionId || !this.getCurrentVersionId(this.currentVersionId)){
		  			 	this.versionId =this.versionList[this.activeIdx].id;
	    				this.changeCompareData.versionId = this.versionId;
		  			 }
					if(this.versionId != undefined){
						this.getMaterialCatalogue(this.hospitalCode,this.insuranceId,this.versionId,this.itemType)
						this.getRightCatalogue(this.versionId)
					}
				}else{
					this.versionList = [];
					this.materialCatalogue=[]; 
					this.materialRightCatalogue=[];
				}
			})
	}
	/*切换版本*/
	optionClick($event){
		this.showRight = false;
		this.versionId =this.versionList[this.activeIdx].id;
		if(this.versionId != undefined){
			this.getMaterialCatalogue(this.hospitalCode,this.insuranceId,this.versionId,this.itemType)
			this.getRightCatalogue(this.versionId)
			this.changeCompareData.versionId = this.versionId;
		}
	}
	
	getRouteParam(){
		this.route.params.subscribe(param =>{
			this.currentInsuranceId = this.route.params['value'].insuranceId;
			this.insuranceTypeOption = {
				width:'495px',
				height:'28px',
				api:'/ipharmacare-distributed-yb-web/insurance',
				currentInsuranceId:this.currentInsuranceId
			};
			this.currentVersionId  = this.route.params['value'].versionId;
			this.hospitalCode = this.route.params['value'].organizationCode;
			
			this.itemType = this.route.params['value'].type;
			this.changeCompareData.type = this.itemType;
		})
	}
	getCurrentVersionId(value){
		if(this.versionList.length && value){
			for(let i =0; i<this.versionList.length;i++){
				if(value == this.versionList[i].id && this.currentInsuranceId && this.currentVersionId && this.currentInsuranceId == this.insuranceId){
					this.activeIdx = i;
					this.versionId = this.versionList[i].id;
					this.changeCompareData.versionId = this.versionId;
					/*如果不是丢失报销分类就清空路由过来的版本和险种仅执行一次*/
				
					this.currentInsuranceId = null;
					this.currentVersionId = null;
					
					return true;
					
				}
			}
			return false;
		}
	}
	getMaterialCatalogue(code?:string,insuranceId?:any,versionId?:any,type?:any){
		this.showRight = false;
		this.dataTreeService.getCompareCatalogue(code,insuranceId,versionId,type)
		.then(res =>{
			console.log(res);
			if(res.code == 200){
				if(res.data){
					this.noCompare=false;
					this.idArray = [];
					this.materialCatalogue = res.data;
					this.noCompare = false;
					for(let i=0;i<this.materialCatalogue.length;i++){
						this.materialCatalogue[i].checked = false;
						this.allChecked =false;
						this.isShow=false;
						this.flag = null;
					}
				}else{
					this.materialCatalogue = [];
				}
			}
		})
	}
	
	/********* 
	*getSearchResult ，search
	*搜索模糊查询功能
	*-------------------
	* autoCompare()
	* 自动比对
	*-------------------
	* getRightCatalogue()
	* 获取右侧目录
	*-------------------
	* getRightsearchResult(),searchRight()
	* 右侧搜索模糊查询功能
	*-------------------
	* showNoCompare($event)
	* 只显示未比对
	*-------------------
	* cancelCompare()
	* 取消比对
	*-------------------
	* comfirmIsChecked()
	* 从选中状态判断是否被全选
	/***************/
	search(){
		if(this.searchWord){
			this.getSearchResult(this.searchWord.replace(/\s+/g,""));
		}else{
			this.getSearchResult(this.searchWord);
		}
	}
	getSearchResult(dictValue?:string){
		this.showRight = false;
		if(!dictValue) dictValue = '';
		this.dataTreeService.getSearchCompareCatalogue(dictValue,this.hospitalCode,this.flag,this.insuranceId,this.versionId,this.itemType)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.materialCatalogue= res.data;
					}else{
						this.materialCatalogue = [];
					} 
				}
			});
		
	}
	autoCompare(){
		this.showRight = false;
		this.dataTreeService.autoCompareCatalogue(this.hospitalCode,this.itemType,this.insuranceId,this.versionId)
			.then(res =>{
				if(res.code ==200){
					this.getMaterialCatalogue(this.hospitalCode,this.insuranceId,this.versionId,this.itemType)
					this.noCompare = false;
					this.flag=null;
				}
			})
	}
	
	getRightCatalogue(versionId?:any){
		this.dataTreeService.getRightCatalogue(versionId)
			.then(res =>{
				if(res.code == 200){
					if(res.data.length){
						this.materialRightCatalogue = res.data;
						this.materialTip = res.data;
					}else{
						this.materialRightCatalogue = [];
						this.materialTip = [];
					}
						
				}
			})
	}
	
	searchRight(){
			if(this.searchRightWord){
				this.getRightsearchResult(this.searchRightWord.replace(/\s+/g,""),this.versionId);
			}else{
				this.getRightsearchResult(this.searchRightWord,this.versionId);
			}
	}
	
	getRightsearchResult(dictValue: string,versionId?:any){
		if(!dictValue) dictValue = "";
		this.dataTreeService.searchRightCatalogue(dictValue,versionId)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.materialRightCatalogue= res.data;
					}else{
						this.materialRightCatalogue = [];
					} 
				}
			});
	}
	showNoCompare($event){
		this.showRight = false;
		if($event.checked == true){
			this.noCompare=true;
			this.flag =1;
			this.dataTreeService.onlyShowNoCompare(this.hospitalCode,this.flag,this.insuranceId,this.versionId,this.itemType)
				.then(res =>{
					if(res.code == 200){
						this.allChecked=false;
						this.isShow = false;
						if(res.data){
							this.materialCatalogue = res.data
						}else{
							this.materialCatalogue = [];
						}
						
					}
				})
			
		}else{
			this.noCompare=false;
			this.flag = null;
			this.dataTreeService.onlyShowNoCompare(this.hospitalCode,this.flag,this.insuranceId,this.versionId,this.itemType)
				.then(res =>{
					if(res.code == 200){
						this.allChecked=false;
						this.isShow = false;
						if(res.data){
							this.materialCatalogue = res.data
						}else{
							this.materialCatalogue = [];
						}
					}
				})
		}
	}
	
	//	从下列列表中的选中状态判断是否全选
	comfirmIsChecked(index){
		this.materialCatalogue[index].checked=!this.materialCatalogue[index].checked;
		for(let i=0;i<this.materialCatalogue.length;i++){
			if(this.materialCatalogue[i].checked == true){
				this.allChecked=true;
			}else{
				this.allChecked=false;
				break;
			}
		}
		
		//循环判断是否显示取消比对
		for(let k=0;k<this.materialCatalogue.length;k++){
			if(this.materialCatalogue[k].checked ==true && this.materialCatalogue[k].iDeptName && this.materialCatalogue[k].deptName){
				this.isShow=true;
				return false
			}else{
				this.isShow=false;
			}
		}
	}
	
	//	从全选状态判断各个选中状态
	isAllChecked(){
		this.allChecked=!this.allChecked;
		if(this.allChecked==true){
			for(let i=0;i<this.materialCatalogue.length;i++){
				this.materialCatalogue[i].checked =true;	
			}
//			循环判断是否显示取消比对
			for(let i=0;i<this.materialCatalogue.length;i++){
			if(this.materialCatalogue[i].checked ==true && this.materialCatalogue[i].iDeptName && this.materialCatalogue[i].deptName){
				this.isShow=true;
				return false
			}else{
				this.isShow=false;
			}
		}
		}else{
			for(let i=0;i<this.materialCatalogue.length;i++){
				this.materialCatalogue[i].checked =false;
				
			}
			this.isShow=false;
		}
	}
	
	//	批量取消选中的以比对的
	cancelAll(){
		this.showRight = false;
		for(let i=0;i<this.materialCatalogue.length;i++){
			if(this.materialCatalogue[i].checked == true){
				if(this.materialCatalogue[i].id){
					this.idArray.push(this.materialCatalogue[i].id);
				}
				
				
			}
		}
		if(this.idArray.join(",")){
			this.dataTreeService.deleteCompareItem(this.idArray.join(","))
			.then(res =>{
				if(res.code == 200){
					this.getMaterialCatalogue(this.hospitalCode,this.insuranceId,this.versionId,this.itemType)
				}
			})
		}
		console.log(this.idArray);
		
	}
	getCompareData(data,index){
		this.materialRightCatalogue = this.materialTip;
		this.searchRightWord = "";
		this.showRight = true;
		this.changeCompareData.id = data.id;
		this.changeCompareData.gmtModified = data.gmtModified;
		this.changeCompareData.gmtCreate = data.gmtCreate;
		this.changeCompareData.hospitalCode = this.hospitalCode;
		this.changeCompareData.comparisonId = data.comparisonId;
		for(let i=0;i<this.materialCatalogue.length;i++){
			this.materialCatalogue[i].activeColor = false;
		}
		this.materialCatalogue[index].activeColor = true;
	}	
	getRightData(data){
		this.changeCompareData.mcsId = data.id;
		// this.changeCompareData.comparisonName = data.summary;
		this.dialogPlugin.confirm('您确定是要建立比对或者是修改比对么？', () => {
						this.dataTreeService.changeCompare(this.changeCompareData)
							.then(res => {
								if (res.code == 200) {
									this.dialogPlugin.tip("比对成功",null,'success');
									this.showRight = true;
									this.getMaterialCatalogue(this.hospitalCode,this.insuranceId,this.versionId,this.itemType)
								
								}
							})
				}, () => { this.showRight = true;})
	}
	
	/*返回*/
	goBack(){
      let link =['healthCareChargedFees/catalogComparison',this.hospitalCode];
      this.router.navigate(link);
	}
}