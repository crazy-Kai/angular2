import { Component, OnInit, IterableDiffers, DoCheck, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin, DialogModel } from '../../common/ug-dialog/dialog';
import {HealthVersionAddService} from './healthRulesVersion.service';
import {Addversiondetail} from './dataList';
@Component({
	selector: 'healthRulesVersion',
	templateUrl:'healthRulesVersion.component.html',
	styleUrls:['healthRulesVersion.component.css'],
	providers:[HealthVersionAddService]
})
export class HealthRulesVersionComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	selectedProductList:any;//用来控制当前点击的那个的颜色变化
	private isDrugsShow:boolean=false;//药品出现
	private isDiseaseShow:boolean=false;//疾病出现
	private isMaterialsShow:boolean=false;//材料出现
	private isprojectsShow:boolean=false;//项目对话框出现
	private isDialogShow:boolean=false;//项目对话框出现
	private insuranceId:any;//险种id
	addversiondetail:Addversiondetail = new Addversiondetail();//添加数据传输的保存
	private optRecipeList: Addversiondetail[] = [];//用来装列表数据的
	private drugsSelectList:any;//用来装药品下拉菜单的数据
	private diseaseSelectList:any;//用来装疾病下拉菜单的数据
	private materialsSelectList:any;//用来装材料下拉菜单的数据
	private projectsSelectList:any;//用来装项目下拉菜单的数据
	private currentchangeDrugs:number; //修改药品保存中当前的数据
	private currentChangeDisease:number; //修改疾病保存中当前的数据
	private currentChangeMaterials:number; //修改材料保存中当前的数据
	private currentChangeProjects:number; //修改项目保存中当前的数据
	versionName:any;//版本名称
    versiondescription:any;//版本说明
    drugsversionId:any;//药品id
    diseaseversionId:any;//疾病id
    materialsversionId:any;//材料id
    projectsversionId:any;//项目id
	currentDrugs:any;//当前药品名称
	currentDiseases:any;//当前疾病名称
	currentMaterials:any;//当前材料名称
	currentProjects:any;//当前项目名称
	summaryDrugs:any;//药品名称
	summaryDisease:any;//疾病名称
	summaryMaterials:any;//材料名称
	summaryProjects:any;//项目名称
	history: any = window.history;	
	TestInsuranceName:boolean = false;//版本名称校验
	private isShowBtn:boolean = true;//控制保存按钮的
	handleType: string;
	
	constructor(
		private healthVersionAddService:HealthVersionAddService,
		private router: Router,
		private activeRouter: ActivatedRoute
	){}
	ngOnInit(){
		this.insuranceId = this.activeRouter.params['value'].id;
		if (this.insuranceId) {
	        this.getVersionList(this.insuranceId);
	        this.getVersiondrugsList(this.insuranceId)
	        this.getmaterialdata(this.insuranceId)
	        this.getProjectdata(this.insuranceId)
	    }
	}
//返回列表页
    return(){
    	let link = ['healthCareChargedFees/healthManagementRules/version-management/' + this.insuranceId];
    	this.router.navigate(link);
    }
 /*检测同名请求*/
    category:any; 
    testNameResult :boolean = true;
    checkName(insuranceId,summary){
    	this.healthVersionAddService.checkName(this.insuranceId,this.addversiondetail.name)
    	  .then(res=>{
    	  	  if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
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
    testName(){
    	if(this.addversiondetail.name!=""&&this.testNameCode(this.addversiondetail.name)){
    		this.checkName(this.insuranceId,this.addversiondetail.name);
    	}
    }
//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\.\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		return result;
	}      
//添加版本管理中的保存    保存   
    addversionsave():void {
    	 //点击保存的时候,什么都没填,提示
		   if ( !this.checkUserInfoRequired(this.handleType) ) {
			             return;
		      }
    	if(this.TestInsuranceName && this.summaryDrugs && this.summaryDisease && this.summaryMaterials && this.summaryProjects && this.testNameResult){
    		    this.versionName = this.addversiondetail.name;
		    	this.versiondescription = this.addversiondetail.description;
		//药品中
		    	this.drugsversionId=this.currentchangeDrugs;
		    	this.addversiondetail.drugVersionId = this.drugsversionId;
		//疾病中
		        this.diseaseversionId=this.currentChangeDisease;
		        this.addversiondetail.diseaseVersionId = this.diseaseversionId;
		//材料中
		        this.materialsversionId=this.currentChangeMaterials;
		    	this.addversiondetail.materialVersionId = this.materialsversionId;
		//项目中
		        this.projectsversionId=this.currentChangeProjects;
		        this.addversiondetail.itemVersionId = this.projectsversionId;
		//险种id
		        this.addversiondetail.insuranceId = this.insuranceId;
		    	this.healthVersionAddService.getaddversiondata(this.addversiondetail)
		    	    .then(res=>{
	                    if (res.code == 200) {
	                    	this.isShowBtn = false;
	                        this.dialogPlugin.tip("保存成功",null,'success');
	                        setTimeout(() => {
	                            this.isShowBtn = false;
	                            this.dialogPlugin.tip("保存成功",null,"success");
								let link = ['healthCareChargedFees/healthManagementRules/version-management/' + this.insuranceId];
    							this.router.navigate(link);
	                        }, 1500);
	                    }else if(res.code == 400){
//				            this.dialogPlugin.tip(res.message,null,'error');
//				            setTimeout(() => {
//				            }, 1500);
	                    }else{
	                         this.isShowBtn = true;
	                         this.dialogPlugin.tip("保存失败",null,'error');
	                         setTimeout(() => {
	                            this.isShowBtn = true;
	                            this.dialogPlugin.tip("保存失败",null,'error');
	                         }, 1500);
	                    }
		    	   })
    	}else if(!this.TestInsuranceName){
    		this.dialogPlugin.tip("版本名格式错误",null,"error");
    	}else if(!this.summaryDisease){
    		this.dialogPlugin.tip("疾病目录版本未输入",null,"error");
    	}else if(!this.summaryDrugs){
    		this.dialogPlugin.tip("药品目录版本未输入",null,"error");
    	}else if(!this.summaryProjects){
    		this.dialogPlugin.tip("项目目录版本未输入",null,"error");
    	}else if(!this.summaryMaterials){
    		this.dialogPlugin.tip("材料目录版本未输入",null,"error");
    	}else  if(!this.testNameResult){
    		this.dialogPlugin.tip("版本名称不能重名",null,"error");
    	}
    }	
//获取药品下拉列表的数据
     getVersionList(insuranceId:number):void{
     	this.healthVersionAddService.getdieasedata(insuranceId)
     	 .then(res=>{
     	 	if(res.code==200){
     	 		if(res.data.length!=0){
     	 			this.drugsSelectList = res.data;
     	 		}else{
     	 			this.drugsSelectList = [];
     	 		}
     	 	}
     	 })
     }
//下拉列表当前点击的那个值     
      listdataClick($event,data,name){
     	 this.currentchangeDrugs=data;
     	 this.currentDrugs=name;
     	 this.summaryDrugs=this.currentDrugs;
      } 
//点击确定时候     
      suredrugs(){
      	 this.isDrugsShow =false;
      	 this.dialogPlugin.onClose();
      }
 //获取疾病下拉列表的数据
	 getVersiondrugsList(insuranceId:number):void{
	 	this.healthVersionAddService.getdrugdata(insuranceId)
	 	 .then(res=>{
	 	 	   this.diseaseSelectList = res.data;
	 	    })
	     }
//下拉列表当前点击的那个值     疾病
      listdataClick2($event,data,name){
     	 this.currentChangeDisease=data;
     	 this.currentDiseases=name;
     	 this.summaryDisease=this.currentDiseases;
      } 
//点击确定时候     
      suredisease(){
      	 this.isDiseaseShow =false;
      	this.dialogPlugin.onClose();
      }
//获取材料下拉列表的数据
	 getmaterialdata(insuranceId:number):void{
	 	this.healthVersionAddService.getmaterialdata(insuranceId)
	 	 .then(res=>{
		 	 	if(res.code==200){
		 	 	   this.materialsSelectList = res.data;
		 	 	}
	 	    })
	     }
//下拉列表当前点击的那个值     
      listdataClick3($event,data,name){
     	 this.currentChangeMaterials=data;
     	 this.currentMaterials=name;
     	 this.summaryMaterials=this.currentMaterials;
      } 
//点击确定时候     
      sureMaterials(){
      	 this.isMaterialsShow =false;
      	 this.dialogPlugin.onClose();
      }
//获取项目下拉列表的数据
	 getProjectdata(insuranceId:number):void{
	 	this.healthVersionAddService.getProjectdata(insuranceId)
	 	 .then(res=>{
	 	 	  if(res.code==200){
	 	 	  	 this.projectsSelectList = res.data;
	 	 	  }
	 	 })
	 }
//下拉列表当前点击的那个值
      listdataClick4($event,data,name){
     	 this.currentChangeProjects=data;
     	 this.currentProjects=name;
     	 this.summaryProjects=this.currentProjects;
      } 
//点击确定时候     
      sureProjects(){
      	 this.isprojectsShow =false;
      	 this.dialogPlugin.onClose();
      }
//取消对话框
      sureAddVersion(){
      	 this.isDrugsShow =false;
      	 this.isDiseaseShow =false;
      	 this.isMaterialsShow =false;
      	 this.isprojectsShow =false;
    	 this.isDialogShow=false;
    	 this.dialogPlugin.onClose();
      }
//选择版本
    choosedrugs(){
    	if(this.drugsSelectList.length!=0){
    		this.isDrugsShow =true;
    		this.isDialogShow=false;
    	}else if(this.drugsSelectList.length==0){
    		this.isDrugsShow =false;
    		this.isDialogShow=true;
    	}
//  	this.isDrugsShow =true;
    	this.dialogPlugin.myModule();   	
    }
    choosedisease(){
    	if(this.diseaseSelectList.length!=0){
    		this.isDiseaseShow =true;
    		this.isDialogShow=false;
    	}else if(this.diseaseSelectList.length==0){
    		this.isDiseaseShow =false;
    		this.isDialogShow=true;
    	}
    	this.dialogPlugin.myModule();
    }
    chooseMaterials(){
    	if(this.materialsSelectList.length!=0){
    		this.isMaterialsShow =true;
    		this.isDialogShow=false;
    	}else if(this.materialsSelectList.length==0){
    		this.isMaterialsShow =false;
    		this.isDialogShow=true;
    	}
//  	this.isMaterialsShow =true;
    	this.dialogPlugin.myModule();
    }
    chooseProjects(){
    	if(this.projectsSelectList.length!=0){
    		this.isprojectsShow =true;
    		this.isDialogShow=false;
    	}else if(this.projectsSelectList.length==0){
    		this.isprojectsShow =false;
    		this.isDialogShow=true;
    	}
//  	this.isprojectsShow =true;
    	this.dialogPlugin.myModule();
    }
    canceldrugs(){
      	this.isDrugsShow =false;
      	this.dialogPlugin.onClose();
    }
    canceldisease(){
      	this.isDiseaseShow =false;
      	this.dialogPlugin.onClose();
    }
    cancelMaterials(){
      	this.isMaterialsShow =false;
      	this.dialogPlugin.onClose();
    }
    cancelProjects(){
      	this.isprojectsShow =false;
      	this.dialogPlugin.onClose();
    }	 
//输入框校验 版本名称
	testInsuranceName(value){
		let reg = /^[a-zA-Z0-9\.\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		if(result){
			this.TestInsuranceName = true;
		}else{
			this.dialogPlugin.tip("版本名称输入有误",null,"error");
			this.TestInsuranceName = false;
		}
	} 
//验证提交信息必填项是否完整  点击保存按钮
	private checkUserInfoRequired(handleType: string) : boolean {
		if (!this.addversiondetail.name) {
			this.dialogPlugin.tip("版本名称不能为空!");
			return false;
		}
		if (!this.addversiondetail.description) {
			this.dialogPlugin.tip("版本说明不能为空!");
			return false;
		}
		return true;
	} 
}