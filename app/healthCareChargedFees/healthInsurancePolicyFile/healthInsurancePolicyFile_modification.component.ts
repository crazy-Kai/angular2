import { Component,OnInit,ViewChild,HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import {HealthInsurancePolicyFileModificationService} from './healthInsurancePolicyFile_modification.service';
import { DialogPlugin } from '../common/ug-dialog/dialog';
import {TablePlugin} from '../common/ug-table/table.module';

import {InsuranceDetail,InsuranceModificationDetail} from './dataList';//获取表格数据
declare var UE: any;
@Component({
	selector:'healthInsurancePolicyFile_modification',
	templateUrl:'healthInsurancePolicyFile_modification.component.html',
	styleUrls:['healthInsurancePolicyFile_modification.component.css'],
	providers:[HealthInsurancePolicyFileModificationService]
})
export class HealthInsurancePolicyFileModificationComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	private auditPlan: InsuranceDetail = new InsuranceDetail();
	insuranceModificationDetail:InsuranceModificationDetail = new InsuranceModificationDetail();
	private auditOptions: any = {};
	history: any = window.history;
	policyId:number;	
	TestTitleName:boolean = true;
	TeseTitleSource:boolean = true;
	testNameResult :boolean = true;
	modificationsummary:any;
	modificationsource:any;
	modificationcontent:any;
	modificationativeDate:any;
	modificationativeId:any;
	modificationativecontent:any;
	oDate:any;
	iM:any;
	nDate:any;
	commonTime:any;
	mon:any;
	dayDate:any;
	year:any;
	nowDay:any;
	dayContent:any;
	getFullYear:any;
    getMonth:any;
    getDate:any;
    getHours:any;
    getMinutes:any;
    getSeconds:any;
    info:any;
	day:any;
	currentTime:any;//年月日
	handleType: string;
	
	constructor(
		private healthInsurancePolicyFileModificationService:HealthInsurancePolicyFileModificationService,
		private router: Router,
		private activeRouter: ActivatedRoute
	) { }
	ngOnInit(){
//		let policyId :any = this.activeRouter.params['value'].id;
        this.policyId = this.activeRouter.params['value'].id;
        if (this.policyId) {
            this.getOptRecipe(this.policyId);
        }        
	}
/**
 * 时间控件参数
 */
	minStartDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
	maxEndDate: any;
	minEndDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};        //设定药品核准时间的最大值为今天string;	
	objToDate(oriDate: any) {
        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
        return dateStr;
    }
	setStrartInterval($event: any){
		if($event){
			this.minStartDate = $event;
		}else{
			this.minStartDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
		}
	}
	startIns: any;
	endIns: any;
	toggleEnd(timeIns: any){
		timeIns.toggle();
		if(timeIns.isOpen()){
			this.endIns = timeIns;
		}else{
			this.endIns = null;
		}
	}
	@HostListener('document:click',[])
		onDocumnentClick(){
			if(this.endIns){
				this.endIns.close();
				this.endIns = null;
			}
	 	}
//点击返回按钮,有个提示
     return(){
     	console.log(222222)
     	 this.dialogPlugin.myModule();     	 
     }	
//修改第一步,根据医保政策信息id查询
    getOptRecipe(policyId: number): void {
    	if(this.policyId){
    		this.healthInsurancePolicyFileModificationService.getOptRecipe(this.policyId)
	           .then(auditPlan => {
		        	this.auditPlan = auditPlan.data;
		        	console.log(this.auditPlan)
		        	this.modificationsummary = this.auditPlan.summary;
		        	this.modificationsource = this.auditPlan.source;
		        	this.modificationativeDate = this.auditPlan.ativeDate;
		        	this.nDate = new Date(this.modificationativeDate)
		        	this.mon = this.nDate.getMonth()+1;//月        
		        	this.dayDate = this.nDate.getDate();//天
		        	this.year = this.nDate.getFullYear();//年
		        	this.nowDay = this.year + "-" + (this.mon<10?"0"+this.mon:this.mon) + "-" +(this.dayDate<10?"0"+this.dayDate:this.dayDate);//2015-5-17格式
		        	this.modificationativeId = this.auditPlan.id;
		        	this.modificationativecontent = this.auditPlan.content;
		        	console.log(this.modificationativecontent);
		        	this.setContent(this.modificationativecontent);
	           })
    	}else{
    		this.setContent("");
    	}	        
      } 
      toLocaleString(){
      	  return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + "/ " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
      }
/*检测同名请求*/
    checkName(summary,policyId){
    	console.log(this.policyId)
      	  this.healthInsurancePolicyFileModificationService.checkName(this.modificationsummary,this.policyId)
      	    .then(res=>{
      	    	console.log(res);
      	    	if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
//			   			 this.dialogPlugin.tip('文件标题不能重名',null,'error')
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
    	if(this.modificationsummary!=""&&this.testNameCode(this.modificationsummary)){
    		this.checkName(this.modificationsummary,this.policyId);
    	}
    }
//修改中的保存 
    save(){
//  	if(this.TestTitleName){
    		this.getContent();//从富文本框中取得内容
	        //什么都没填,报错
	    	if ( !this.checkUserInfoRequired(this.handleType) ) {
				    return;
			 }
	    	this.insuranceModificationDetail.summary = this.modificationsummary;
	    	this.insuranceModificationDetail.source = this.modificationsource;   	
	    	this.insuranceModificationDetail.id = this.modificationativeId;
	        if(this.currentTime){
	        	 this.info = this.currentTime.year+'-'+this.currentTime.month+'-'+this.currentTime.day;//当前选择的时间 2015-5-8格式
		     	 this.info = new Date(this.info).getTime();
		     	 this.insuranceModificationDetail.ativeDate = this.info;//赋值
	        }else{
	        	 this.nowDay = new Date(this.nowDay).getTime();
	        	 this.insuranceModificationDetail.ativeDate = this.nowDay;//赋值       
	        }
	    if(this.testNameResult){    
	        console.log(this.insuranceModificationDetail);
	        this.healthInsurancePolicyFileModificationService.save(this.insuranceModificationDetail)
	         .then(res =>{
		         	if (res.code == 200) {
		                this.dialogPlugin.tip("保存成功",null,'success');
			            setTimeout(() => {
			                this.dialogPlugin.tip("保存成功",null,'success');
							let link:any[] = ['healthCareChargedFees/healthInsurancePolicyFile'];
			    			this.router.navigate(link);  
			            }, 100);
		            }else {
//		            	this.insuranceModificationDetail.ativeDate = this.nowDay;//赋值   
//		                this.dialogPlugin.tip("保存失败",null,'error');
//		                setTimeout(() => {
//		                    this.auditOptions.show = false;
//		                     this.dialogPlugin.tip("保存失败",null,'error');
//		                }, 100);
		            }
	         })
    	}else if(!this.testNameResult){
    		this.dialogPlugin.tip("文件名称不能同名",null,"error")
    	}
    }   
 /*************富文本****************
    * 功能：点击获取富文本
    *      设置富文本内容
    *      获取符文本内容
    */
    UEditor: any;
    private setEditorContent(content: string) {    	
        this.UEditor.setContent(content.replace(/\"\/api/g, "\"http://" + window.location.host + "/api"));
    }
    setContent(content: string) {
        if (this.UEditor) {
            this.setEditorContent(content);
        } else {
            this.UEditor = new UE.ui.Editor({ initialFrameWidth: 100 + '%' });
            this.UEditor.render('ueInstructions');

            this.UEditor.addListener('ready', () => {
                this.UEditor.setHeight(400);
                this.setEditorContent(content);
            });
        }
    }
    getContent() {
        this.insuranceModificationDetail.content = this.UEditor.getContent().replace("\"http://" + window.location.host + "/api", "\"/api");
    }
//验证提交信息必填项是否完整  点击保存按钮
	private checkUserInfoRequired(handleType: string) : boolean {
		if (!this.modificationsummary) {
			this.dialogPlugin.tip("文件标题不能为空!",null,"error");
			return false;
		}
		if (!this.modificationsource) {
			this.dialogPlugin.tip("来源不能为空!",null,"error");
			return false;
		}
		if(!this.TestTitleName){
			this.dialogPlugin.tip("文章标题输入有误!",null,"error");
			return false;
		}
		if(!this.TeseTitleSource){
			this.dialogPlugin.tip("来源输入有误!",null,"error");
			return false;
		}
		return true;
	} 
//校验文章标题
    testInsuranceName(value){
//		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/gi
		let reg = /^[a-zA-Z0-9\-\.\()\、\。\（）\,\u4e00-\u9fa5]+$/gi
		let result = reg.test(value);
		if(result){
			this.TestTitleName = true;
		}else{
			this.dialogPlugin.tip("文章标题输入有误!",null,"error");
			this.TestTitleName = false;
		}
	}
//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\-\.\()\、\。\（）\,\u4e00-\u9fa5]+$/gi
		let result = reg.test(value);
		return result;
	}   
//精测来源   
    testInsuranceSourceName(value){
//		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/gi
		let reg = /^[a-zA-Z0-9\-\.\()\、\。\（）\,\u4e00-\u9fa5]+$/gi
		let result = reg.test(value);
		if(result){
			this.TeseTitleSource = true;
		}else{
//			this.dialogPlugin.tip("来源输入有误!",null,"error");
			this.TeseTitleSource = false;
		}
	}
}
