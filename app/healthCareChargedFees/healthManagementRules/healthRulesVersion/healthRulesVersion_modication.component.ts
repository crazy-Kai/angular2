import { Component, OnInit, Input, trigger, state, style, transition, animate, ViewChild, HostListener,Renderer} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { DialogPlugin, DialogModel } from '../../common/ug-dialog/dialog';
import {HealthVersionModicationService} from './healthRulesVersion_modication.service';

import {VersionmodificationDetail} from './dataList';
@Component({
	selector: 'healthRulesVersion_modication',
	templateUrl:'healthRulesVersion_modication.component.html',
	styleUrls:['healthRulesVersion_modication.component.css'],
	providers:[HealthVersionModicationService]
})
export class HealthRulesVersionModicationComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	private id:number;//当前数据的id
	private infodata:any;//用来双向数据绑定的数据
	TestInsuranceName:boolean = true;//版本名称校验
	insuranceId:any;
	//修改中用于双向数据绑定的值
	modificationName:any;
	modificationDescription:any;
	modificationDiseaseName:any;
	modificationDrugName:any;
	modificationItemName:any;
	modificationMaterialName:any;
    versionmodificationDetail:VersionmodificationDetail = new VersionmodificationDetail();//修改中保存数据需要传入的参数
    history: any = window.history;
    private auditOptions: any = {};//保存中code为200时的参数
    modificationId:any;
    handleType: string;
    
	constructor(
		private healthVersionModicationService: HealthVersionModicationService,
		private router: Router,
		private route : ActivatedRoute,
		private renderer: Renderer
	){}
	ngOnInit(){
		this.getRouteParam();//从规则管理首页获取险种id,版本id,版本名称
	}
//从规则管理首页获取险种id,版本id,版本名称
    getRouteParam(){
     	this.route.params.subscribe(param => {
     		this.insuranceId = this.route.params['value'].insuranceId;
     		this.id = this.route.params['value'].id;
     		if (this.id) {
	            this.getVersionData(this.id);
	        }  
     	})
    }
//返回
    return(){
    	let link =['healthCareChargedFees/healthManagementRules/version-management/' + this.insuranceId];
    	this.router.navigate(link);
    }
//获取值    
	getVersionData(id:number):void{
		this.healthVersionModicationService.getVersionData(id)
		 .then(res=>{
		 	 if(res.code==200){
		 	 	this.infodata=res.data;
	            this.modificationName =  this.infodata.name;
	            this.modificationDescription = this.infodata.description;
	            this.modificationDiseaseName = this.infodata.diseaseName;
	            this.modificationDrugName = this.infodata.drugName;
	            this.modificationItemName = this.infodata.itemName;
	            this.modificationMaterialName = this.infodata.materialName;
	            this.modificationId = this.infodata.id;
		 	 }
		 })
	}
/*检测同名请求*/
    category:any; 
    testNameResult :boolean = true;
    checkName(insuranceId,summary,id){
    	this.healthVersionModicationService.checkName(this.insuranceId,this.modificationName,this.modificationId)
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
    	if(this.modificationName!=""&&this.testNameCode(this.modificationName)){
    		this.checkName(this.insuranceId,this.modificationName,this.modificationId);
    	}
    }
//验证是否输入错误
	testNameCode(value){
//		let reg = /^[a-zA-Z0-9\_\.\u4e00-\u9fa5]{3,10}$/g;
		let reg = /^[_,.!\n\w\u4e00-\u9fa5]{2,10}$/g;
//		let reg = /^[a-z\d_\.\u4e00-\u9fa5]{3,10}/i；
		let result = reg.test(value);
		return result;
	} 
//保存按钮
	saveVersion(){	
           //点击保存的时候,什么都没填,提示
		   if ( !this.checkUserInfoRequired(this.handleType) ) {
			             return;
		      }
		   if(this.TestInsuranceName && this.testNameResult){
		   	  this.versionmodificationDetail.name = this.modificationName;
				this.versionmodificationDetail.description = this.modificationDescription;
				this.versionmodificationDetail.id = this.modificationId;
				this.versionmodificationDetail.insuranceId = this.insuranceId;
				console.log(this.versionmodificationDetail);
				this.healthVersionModicationService.getupdateData(this.versionmodificationDetail)
				  .then(res=>{
	                    if (res.code == 200) {
	                        this.dialogPlugin.tip("保存成功",null,"success");
	                        setTimeout(() => {
	                            this.dialogPlugin.tip("保存成功",null,"success");
	                            let link =['healthCareChargedFees/healthManagementRules/version-management/' + this.insuranceId];
								this.router.navigate(link);
	                        }, 1500);
	                    }else{
	                        this.auditOptions.show = true;
	                        this.dialogPlugin.tip("保存失败",null,'error');
	                    }
				  })
		   }else if(!this.TestInsuranceName){
		   	   this.dialogPlugin.tip("险种名称格式错误",null,"error");
		   }else if(!this.testNameResult){
		   	   this.dialogPlugin.tip("险种名称不能重名",null,"error");
		   }
	}
// 验证提交信息必填项是否完整  点击保存按钮
	private checkUserInfoRequired(handleType: string) : boolean {
		if (!this.modificationName) {
			this.dialogPlugin.tip("版本名称不能为空!");
			return false;
		}
		if (!this.modificationDescription) {
			this.dialogPlugin.tip("版本说明不能为空!");
			return false;
		}
		return true;
	} 
//版本名称
	testInsuranceName(value){
//      let reg = /^[a-zA-Z0-9\.\u4e00-\u9fa5]{2,10}$/g;
        let reg = /^[_,.!\n\w\u4e00-\u9fa5]{2,10}$/g; 
		let result = reg.test(value);
		if(result){
			this.TestInsuranceName = true;
		}else{
			this.dialogPlugin.tip("版本名称格式错误",null,"error");
			this.TestInsuranceName = false;
		}
	} 	
}