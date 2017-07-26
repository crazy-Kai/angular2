import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { DataTreeService } from './officeCompare.service';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { ChangeCompareData} from './officeData';
import { ActivatedRoute, Params } from '@angular/router';

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector: 'officeCompare',
	templateUrl:'officeCompare.component.html',
	styleUrls:['officeCompare.component.css'],
	providers:[DataTreeService]
})


export class OfficeCompareComponent{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	constructor(
		private dataTreeService: DataTreeService,private router: Router,private route : ActivatedRoute
		) { 
		
	}
	ngOnInit(){
		/*初始化行为*/
		
		this.getRightCatalogue();
		this.getRouteParam();
	}	
	
	
	officeCatalogue:any; //科室目录列表
	officeRightCatalogue:any = []; //右侧目录列表
	searchWord:string; //用户搜索关键词
	searchRightWord:string;//右侧搜索关键词
	flag:any; //标志判断位
	allChecked:boolean=false; //判断是否被全选中
	isShow:boolean=false;
	idArray:any=[];//所有选中id的字符串集合
	noCompare:boolean =false;
	hospitalCode:string; //机构代码
	itemType:any; //比对类型
	changeCompareData: ChangeCompareData = new ChangeCompareData();
	showRight:boolean = false;
	officeTip:any=[]; //判断右侧初始化时是否有比对数据
	
	getRouteParam(){
		this.route.params.subscribe(param =>{
			this.hospitalCode = this.route.params['value'].organizationCode;
			this.itemType = this.route.params['value'].type;
			this.changeCompareData.type = this.itemType;
			this.getOfficeCatalogue(this.hospitalCode);
		})
	}
	/********* 
	*getSearchResult ，search
	*搜索模糊查询功能
	*-------------------
	* getOfficeCatalogue()
	* 获取科室目录
	*-------------------
	* autoCompare()
	* 自动比对
	*-------------------
	* getRightCatalogue()
	* 自动比对
	*-------------------
	* getRightsearchResult(),searchRight()
	* 右侧搜索模糊查询功能
	*-------------------
	* showNoCompare($event)
	* 只显示未比对
	*-------------------
	* cancelCompare()
	* 取消比对
	/***************/
	getOfficeCatalogue(code?:string){
		this.showRight = false;
		this.dataTreeService.getCompareCatalogue(code)
		.then(res =>{
			if(res.code == 200){
				if(res.data){
					this.noCompare=false;
					this.officeCatalogue = res.data;
					this.idArray = [];
					for(let i=0;i<this.officeCatalogue.length;i++){
						this.officeCatalogue[i].checked=false;
						this.officeCatalogue[i].activeColor=false;
						this.allChecked =false;
						this.isShow=false;
						this.flag = null;
					}
				}else{
					this.officeCatalogue =[];
				}
			}
		})
	}
//键盘回车事件  左边
    onEnterData($event){
    	this.search();
    }
//键盘回车事件  右边的   
    onEnterDetailData($event){
    	this.searchRight();
    }    
	search(){
			if(this.searchWord){
				this.getSearchResult(this.searchWord.replace(/\s+/g,""));
			}else{
				this.getSearchResult(this.searchWord);
			}
	}
	getSearchResult(dictValue: string){
		this.showRight = false;
		if(!dictValue) dictValue = "";
		this.dataTreeService.getSearchCompareCatalogue(dictValue,this.hospitalCode,this.flag)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.officeCatalogue= res.data;
					}else{
						this.officeCatalogue = [];
					} 
				}
			});
	}
	autoCompare(){
		this.showRight = false;
		this.dataTreeService.autoCompareCatalogue(this.hospitalCode,this.itemType)
			.then(res =>{
				if(res.code == 200){
					this.getOfficeCatalogue(this.hospitalCode);
					this.noCompare = false;
					this.flag=null;
				}
			})
	}
	
	getRightCatalogue(){
		this.dataTreeService.getRightCatalogue()
			.then(res =>{
				if(res.code == 200){
					if(res.data){
						this.officeRightCatalogue = res.data;
						this.officeTip = res.data;
					}else{
						this.officeRightCatalogue = [];
						this.officeTip = [];
					}
						
				}
			})
	}
	
	searchRight(){
			if(this.searchRightWord){
				this.getRightsearchResult(this.searchRightWord.replace(/\s+/g,""));
			}else{
				this.getRightsearchResult(this.searchRightWord);
			}
	}
	getRightsearchResult(dictValue: string){
		if(!dictValue) dictValue = "";
		this.dataTreeService.searchRightCatalogue(dictValue)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.officeRightCatalogue= res.data;
					}else{
						this.officeRightCatalogue = [];
					} 
				}
			});
	}
	showNoCompare($event){
		this.showRight = false;
		if($event.checked == true){
			this.noCompare=true;
			this.flag =1;
			this.dataTreeService.onlyShowNoCompare(this.hospitalCode,this.flag)
				.then(res =>{
					if(res.code == 200){
						this.allChecked=false;
						this.isShow = false;
						if(res.data){
							this.officeCatalogue = res.data;
						}else{
							this.officeCatalogue = [];
						}
						
					}
				})
			
		}else{
			this.noCompare=false;
			this.flag =null;
			this.dataTreeService.onlyShowNoCompare(this.hospitalCode,this.flag)
				.then(res =>{
					if(res.code == 200){
						this.allChecked=false;
						this.isShow = false;
						if(res.data){
							this.officeCatalogue = res.data
						}else{
							this.officeCatalogue = [];
						}
					}
				})
		}
	}
//	从下列列表中的选中状态判断是否全选
	comfirmIsChecked(index){
		this.officeCatalogue[index].checked=!this.officeCatalogue[index].checked;
		for(let i=0;i<this.officeCatalogue.length;i++){
			if(this.officeCatalogue[i].checked == true){
				this.allChecked=true;
			}else{
				this.allChecked=false;
				break;
			}
		}
		
		//循环判断是否显示取消比对
		for(let k=0;k<this.officeCatalogue.length;k++){
			if(this.officeCatalogue[k].checked ==true && this.officeCatalogue[k].iDeptName && this.officeCatalogue[k].deptName){
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
			for(let i=0;i<this.officeCatalogue.length;i++){
				this.officeCatalogue[i].checked =true;	
			}
//			循环判断是否显示取消比对
			for(let i=0;i<this.officeCatalogue.length;i++){
			if(this.officeCatalogue[i].checked ==true && this.officeCatalogue[i].iDeptName && this.officeCatalogue[i].deptName){
				this.isShow=true;
				return false
			}else{
				this.isShow=false;
			}
		}
		}else{
			for(let i=0;i<this.officeCatalogue.length;i++){
				this.officeCatalogue[i].checked =false;
				
			}
			this.isShow=false;
		}
	}
//	批量取消选中的以比对的
	cancelAll(){
		this.showRight = false;
		for(let i=0;i<this.officeCatalogue.length;i++){
			if(this.officeCatalogue[i].checked == true){
				if(this.officeCatalogue[i].id){
					this.idArray.push(this.officeCatalogue[i].id);
				}
				
				
			}
		}
		if(this.idArray.join(",")){
			this.dataTreeService.deleteCompareItem(this.idArray.join(","))
			.then(res =>{
				if(res.code == 200){
					this.getOfficeCatalogue(this.hospitalCode);
				}
			})
		}
		
	}
	
	getCompareData(data,index){
		this.officeRightCatalogue = this.officeTip;
		this.searchRightWord = "";
		this.showRight = true;
		this.changeCompareData.id = data.id;
		this.changeCompareData.gmtModified = data.gmtModified;
		this.changeCompareData.gmtCreate = data.gmtCreate;
		this.changeCompareData.hospitalCode = this.hospitalCode;
		this.changeCompareData.comparisonId = data.comparisonId;
		for(let i=0;i<this.officeCatalogue.length;i++){
			this.officeCatalogue[i].activeColor = false;
		}
		this.officeCatalogue[index].activeColor = true;
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
									this.getOfficeCatalogue(this.hospitalCode);
								
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