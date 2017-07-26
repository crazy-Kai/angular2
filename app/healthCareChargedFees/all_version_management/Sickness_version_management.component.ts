import 'rxjs/add/operator/switchMap';
import { Component,OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Params } from '@angular/router';
import { SicknessVersionManagementService } from './Sickness_version_management.service';
import { DialogPlugin, DialogModel } from '../common/ug-dialog/dialog';
import {AddManagementDetail,SicenessAddDetail,VersionManagementmodification} from './version_management_detail';
@Component({
	selector:'Sickness_version_management',
	templateUrl:'Sickness_version_management.component.html',
	styleUrls:['Drug_version_management.component.css'],
	providers:[SicknessVersionManagementService]
})
export class SicknessVersionManagementComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
    private optRecipeList:any;
	private selectList:any;//用来装下拉菜单的数据
	private name:any;
    private insuranceId:any;
    private id:any;
    private summary:any;
    activeIdx:number = 0;//下拉菜单默认选中第一个
	private info:any;
    sicenessAddDetail:SicenessAddDetail = new SicenessAddDetail();
    versionManagementmodification:VersionManagementmodification = new VersionManagementmodification();
	private isTextShow:boolean = false;
	private isShow:boolean = true;
	private isChangeHide:boolean = false;
	private isChangeShow:boolean = true;
	private currentIndex:number; //修改保存中当前的数据
	modificationsummary:any;
	modificationdescription:any;
	modificationId:any;
	description:any;
    summarydata:any;
    TestInsuranceName:boolean = true;//版本名称校验
    /*检测同名请求*/
    category:any; 
    testNameResult :boolean = true;
    testNameResultmodi:boolean = true;
    
	constructor(
		private sicknessVersionManagementService:SicknessVersionManagementService,
		private router: Router,
		private route: ActivatedRoute,
		private activeRouter: ActivatedRoute
	) {}

    ngOnInit() { 
         this.insuranceId = this.activeRouter.params['value'].id;
         if (this.insuranceId) {
            this.getVersionManagementList(this.insuranceId);
         }
    }
    
 //获取药品管理下拉列表信息数据
	getVersionManagementList(insuranceId:number):void{
		this.sicknessVersionManagementService.getVersionManagementList(insuranceId)
		   .then(res=>{
		   	  if(res.code==200){
			   	  	this.optRecipeList = [];	   	   	
			     	for(let item of res.data){
	              	   this.optRecipeList.push(item);    
	                } 
		   	  }
	   } )
    }	
//修改
     choose(data,i):void{
     	this.isShow=false;
    	this.isTextShow=false;
    	this.isChangeHide=true;
     	this.dialogPlugin.myModule();
     	this.currentIndex = i;
     	this.modificationsummary = this.optRecipeList[i].summary;
     	this.modificationdescription = this.optRecipeList[i].description;
     	this.modificationId = this.optRecipeList[i].id;
     }
/*检测同名请求*/
    checkName(insuranceId,summary,category){
    	this.category = 'JB';
    	this.sicknessVersionManagementService.checkName(this.insuranceId,this.sicenessAddDetail.summary,this.category)
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
    checkNamemod(insuranceId,summary,category,id){
    	this.category = 'JB';
    	this.modificationId = this.modificationId;
    	this.sicknessVersionManagementService.checkNamemodi(this.insuranceId,this.modificationsummary,this.category,this.modificationId)
    	  .then(res=>{
    	  	  if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResultmodi = false;
			   		}else{
			   			this.testNameResultmodi = true;
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
    	if(this.sicenessAddDetail.summary!=""&&this.testNameCode(this.sicenessAddDetail.summary)){
    		this.checkName(this.insuranceId,this.sicenessAddDetail.summary,this.category);
    	}
    }
    testNameChange(){
    	if(this.modificationsummary!=""&&this.testNameCode(this.modificationsummary)){
    		this.checkNamemod(this.insuranceId,this.modificationsummary,this.category,this.modificationId);
    	}
    }
//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\.\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		return result;
	}         
//修改中的保存
    modificationSave():void{
    	this.versionManagementmodification.summary = this.modificationsummary;
    	this.versionManagementmodification.description = this.modificationdescription;
    	this.versionManagementmodification.id = this.modificationId;
    	this.versionManagementmodification.insuranceId = this.insuranceId;
    	this.versionManagementmodification.category = 'JB';
    	if(this.testNameResultmodi&&this.TestInsuranceName){
	    	this.sicknessVersionManagementService.getmodificationdata(this.versionManagementmodification)
	    	  .then(data =>{ 
	                if(data.code == 200){
	                	this.optRecipeList[this.currentIndex].summary = this.modificationsummary;
	                	this.optRecipeList[this.currentIndex].description = this.modificationdescription;
	                	this.dialogPlugin.tip("保存成功",null,'success');
	                    this.isChangeShow=false;
	                    this.isChangeHide=true;
	                	this.dialogPlugin.onClose(); 
	                	this.getVersionManagementList(this.insuranceId);
	                }else{
	                	this.dialogPlugin.onClose(); 
	                	this.dialogPlugin.tip("保存失败",null,'error');
	                }
	            }) 
	    }else if(!this.testNameResultmodi){
	    	this.dialogPlugin.myModule();
    		this.isChangeShow=true;
            this.isChangeHide=true;
    		this.dialogPlugin.tip("版本名称不能重名",null,'error');
	    }else if(!this.TestInsuranceName){
	    	this.dialogPlugin.myModule();
    		this.isChangeShow=true;
            this.isChangeHide=true;
    		this.dialogPlugin.tip("版本名称格式错误",null,'error');
	    }
    }
//获取下拉列表
    getVersionList(insuranceId:number):void{
        this.sicknessVersionManagementService.getVersionManagementcommomList(insuranceId)
            .then(res => {  
            	if(res.code == 200){
            		if(res.data.length != 0){
            			    this.activeIdx = 0;
            				this.selectList = res.data;
    						this.id = this.selectList[this.activeIdx].id;
            		}else{
            			this.selectList = [];
            			this.activeIdx=null;
            		}
            	
            	}          	
            })
    } 
    optionClick($event){
    	this.id = this.selectList[this.activeIdx].id;
    }
//点击 添加版本按钮管理数据
     addVersionManagement(){
 		if(this.insuranceId){
 			this.isShow=true;
     		this.isTextShow=false;
     		this.isChangeHide=false;
     		this.dialogPlugin.myModule();
     		this.getVersionList(this.insuranceId);
     		this.sicenessAddDetail.summary = "";
     		this.sicenessAddDetail.description = "";
 	    }
     }    
//添加版本点击确认
    sureAddVersion(){
    	this.isShow=false;
 		this.isTextShow=true;
 		this.isChangeHide=false;
    	if(this.id){
    		this.sicknessVersionManagementService.getOptRecipe(this.id)
         	  .then(res =>{
	         	  	this.info = res.data;
	                this.description = this.info.description;
         	   })
    	}    
    }    
//点击添加版本按钮保存版本
    saveVersion():void{
	     	this.sicenessAddDetail.oldId = this.id;
	     	this.sicenessAddDetail.insuranceId = this.insuranceId;
	     	this.sicenessAddDetail.category = 'JB';
	     	if(this.testNameResult&&this.TestInsuranceName&&this.sicenessAddDetail.summary!=""){
	         	this.sicknessVersionManagementService.addVersionManagement(this.sicenessAddDetail)
	         	  .then(data =>{
	         		if(data.code == 200){
	         			this.dialogPlugin.tip("保存成功",null,'success');
				 	  	this.isShow=false;
				 	  	this.isTextShow=false;
	         			this.dialogPlugin.onClose();
	                    this.getVersionManagementList(this.insuranceId);
	                }else{
	                	this.dialogPlugin.tip("保存失败",null,'error');
	                	this.dialogPlugin.onClose();
	                }
	            }) 
	        }else if(!this.testNameResult){
	        	this.dialogPlugin.myModule();
	 	  		this.isTextShow=true;
	 	  		this.isChangeHide=false;
	 	  		this.isShow=false;
	 	  		this.dialogPlugin.tip("版本名称不能重名",null,'error');
	        }else if(!this.TestInsuranceName){
	        	this.dialogPlugin.myModule();
	 	  		this.isTextShow=true;
	 	  		this.isChangeHide=false;
	 	  		this.isShow=false;
	 	  		this.dialogPlugin.tip("版本名称格式错误",null,'error');
	        }else if(this.sicenessAddDetail.summary==""){
	        	this.dialogPlugin.myModule();
	 	  		this.isTextShow=true;
	 	  		this.isChangeHide=false;
	 	  		this.isShow=false;
	 	  		this.dialogPlugin.tip("版本名称不能为空",null,'error');
	        }
       }
/*版本名称正则判断*/          
    testInsuranceName(value){
        let reg = /^[_,.!\n\w\u4e00-\u9fa5]{3,10}$/g; 
		let result = reg.test(value);
		if(result){
			this.TestInsuranceName = true;
		}else{
//			this.dialogPlugin.tip("版本名称格式错误",null,"error");
			this.TestInsuranceName = false;
		}
	} 	
}

