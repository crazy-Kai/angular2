import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { DataTreeService } from './personCompare.service';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { ChangeCompareData } from "./filedata";
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector: 'personCompare',
	templateUrl:'personCompare.component.html',
	styleUrls:['personCompare.component.css'],
	providers:[DataTreeService]
})


export class PersonCompareComponent{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	constructor(
		private dataTreeService: DataTreeService,private router: Router,private route : ActivatedRoute
		) { 
		
	}
		/*初始化发送获取险种请求*/
	private insuranceTypeOption : any;
	
//	变量
	insuranceId:any; //请求返回的保险ID
	personCatalogue:any; //人员比对
	personRightCatalogue:any=[]; //人员比对右侧目录列表
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
	changeCompareData: ChangeCompareData = new ChangeCompareData();
	showRight:boolean = false;
	personTip:any=[];//判断初始化时右侧是否有标准人员比对数据
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
	* getPersonlCatalogue()
	* 获取材料目录
	*-------------------
	/******************/
	chooseInsurance($event){
		this.showRight = false;
		this.insuranceId = $event.id;
		this.changeCompareData.insuranceId = this.insuranceId;
		this.getPersonCatalogue(this.hospitalCode,this.insuranceId,this.itemType)
		this.getRightCatalogue();
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
			this.hospitalCode = this.route.params['value'].organizationCode;
			this.itemType = this.route.params['value'].type;
			this.changeCompareData.type = this.itemType;
		})
	}
	getPersonCatalogue(code?:string,insuranceId?:any,type?:any){
		this.showRight = false;
		this.dataTreeService.getCompareCatalogue(code,insuranceId,type)
		.then(res =>{
			console.log(res);
			if(res.code == 200){
				if(res.data){
					this.idArray = [];
					this.personCatalogue = res.data;
					this.noCompare = false;
					for(let i=0;i<this.personCatalogue.length;i++){
						this.personCatalogue[i].checked = false;
						this.allChecked =false;
						this.isShow=false;
						this.flag = null;
					}
				}else{
					this.personCatalogue = [];
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
	
//键盘回车事件  左边的
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
	getSearchResult(dictValue?:string){
		this.showRight = false;
		if(!dictValue) dictValue = '';
		this.dataTreeService.getSearchCompareCatalogue(dictValue,this.hospitalCode,this.flag,this.insuranceId,this.itemType)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.personCatalogue= res.data;
					}else{
						this.personCatalogue = [];
					} 
				}
			});
		
	}
	autoCompare(){
		this.showRight = false;
		this.dataTreeService.autoCompareCatalogue(this.hospitalCode,this.itemType,this.insuranceId)
			.then(res =>{
				if(res.code ==200){
					this.getPersonCatalogue(this.hospitalCode,this.insuranceId,this.itemType)
					this.noCompare = false;
					this.flag=null;
				}
			})
	}
	
	getRightCatalogue(){
		this.dataTreeService.getRightCatalogue(this.insuranceId)
			.then(res =>{
				if(res.code == 200){
					if(res.data.length){
						this.personRightCatalogue = res.data;
						this.personTip = res.data;
					}else{
						this.personRightCatalogue = [];
						this.personTip = [];
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
		this.dataTreeService.searchRightCatalogue(dictValue,this.insuranceId)
			.then(res => {
				if(res.code == 200){
					if (res.data != "") {
						this.personRightCatalogue= res.data;
					}else{
						this.personRightCatalogue = [];
					} 
				}
			});
	}
	showNoCompare($event){
		this.showRight = false;
		if($event.checked == true){
			this.noCompare=true;
			this.flag =1;
			this.dataTreeService.onlyShowNoCompare(this.hospitalCode,this.flag,this.insuranceId,this.itemType)
				.then(res =>{
					if(res.code == 200){
						this.allChecked=false;
						this.isShow = false;
						if(res.data){
							this.personCatalogue = res.data
						}else{
							this.personCatalogue = [];
						}
						
					}
				})
			
		}else{
			this.noCompare=false;
			this.flag = null;
			this.dataTreeService.onlyShowNoCompare(this.hospitalCode,this.flag,this.insuranceId,this.itemType)
				.then(res =>{
					if(res.code == 200){
						this.allChecked=false;
						this.isShow = false;
						if(res.data){
							this.personCatalogue = res.data
						}else{
							this.personCatalogue = [];
						}
					}
				})
		}
	}
	
	//	从下列列表中的选中状态判断是否全选
	comfirmIsChecked(index){
		this.personCatalogue[index].checked=!this.personCatalogue[index].checked;
		for(let i=0;i<this.personCatalogue.length;i++){
			if(this.personCatalogue[i].checked == true){
				this.allChecked=true;
			}else{
				this.allChecked=false;
				break;
			}
		}
		
		//循环判断是否显示取消比对
		for(let k=0;k<this.personCatalogue.length;k++){
			if(this.personCatalogue[k].checked ==true && this.personCatalogue[k].iDeptName && this.personCatalogue[k].deptName){
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
			for(let i=0;i<this.personCatalogue.length;i++){
				this.personCatalogue[i].checked =true;	
			}
//			循环判断是否显示取消比对
			for(let i=0;i<this.personCatalogue.length;i++){
			if(this.personCatalogue[i].checked ==true && this.personCatalogue[i].iDeptName && this.personCatalogue[i].deptName){
				this.isShow=true;
				return false
			}else{
				this.isShow=false;
			}
		}
		}else{
			for(let i=0;i<this.personCatalogue.length;i++){
				this.personCatalogue[i].checked =false;
				
			}
			this.isShow=false;
		}
	}
	
	//	批量取消选中的以比对的
	cancelAll(){
		this.showRight = false;
		for(let i=0;i<this.personCatalogue.length;i++){
			if(this.personCatalogue[i].checked == true){
				if(this.personCatalogue[i].id){
					this.idArray.push(this.personCatalogue[i].id);
				}
				
				
			}
		}
		if(this.idArray.join(",")){
			this.dataTreeService.deleteCompareItem(this.idArray.join(","))
			.then(res =>{
				if(res.code == 200){
					this.getPersonCatalogue(this.hospitalCode,this.insuranceId,this.itemType)
				}
			})
		}
		
	}
	getCompareData(data,index){
		this.personRightCatalogue = this.personTip;
		this.searchRightWord = "";
		this.showRight = true;
		this.changeCompareData.id = data.id;
		this.changeCompareData.gmtModified = data.gmtModified;
		this.changeCompareData.gmtCreate = data.gmtCreate;
		this.changeCompareData.hospitalCode = this.hospitalCode;
		this.changeCompareData.comparisonId = data.comparisonId;
		for(let i=0;i<this.personCatalogue.length;i++){
			this.personCatalogue[i].activeColor = false;
		}
		this.personCatalogue[index].activeColor = true;
	}
	
	getRightData(data){
		this.changeCompareData.mcsId = data.id;
		// this.changeCompareData.comparisonName = data.classify;
		this.dialogPlugin.confirm('您确定是要建立比对或者是修改比对么？', () => {
						this.dataTreeService.changeCompare(this.changeCompareData)
							.then(res => {
								if (res.code == 200) {
									this.dialogPlugin.tip("比对成功",null,'success');
									this.showRight = true;
									this.getPersonCatalogue(this.hospitalCode,this.insuranceId,this.itemType)
								
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