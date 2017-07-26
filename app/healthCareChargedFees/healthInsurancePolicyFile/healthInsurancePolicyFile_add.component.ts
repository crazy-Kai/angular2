import { Component,OnInit,ViewChild,HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HealthInsurancePolicyAddFileService} from './healthInsurancePolicyFile_add.service';
import {InsuranceAddDetail} from './dataList';//获取表格数据
import {TablePlugin} from '../common/ug-table/table.module';
import {DialogPlugin} from '../common/ug-dialog/dialog';
declare var UE: any;
@Component({
	selector:'healthInsurancePolicyFile_add',
	templateUrl:'healthInsurancePolicyFile_add.component.html',
	styleUrls:['healthInsurancePolicyFile_add.component.css'],
	providers:[HealthInsurancePolicyAddFileService]
})
export class HealthInsurancePolicyFileAddComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	private isEdit: boolean = false;
	insuranceAddDetail: InsuranceAddDetail = new InsuranceAddDetail();
	docInfo: any = {};
	drugName: string;
	TestTitleName:boolean = false;
	testNameResult :boolean = true;
	TeseTitleSource:boolean = false;
	private isShowBtn:boolean = true;
	handleType: string;
	info:any;
	day:any;
	currentTime:any;//年月日
	setContentData:any=[];
	contentData:any;
	
	constructor(
		private healthInsurancePolicyAddFileService:HealthInsurancePolicyAddFileService,
		private router: Router,
		private activeRouter: ActivatedRoute,
		private route: ActivatedRoute,
	) { }
	
	ngOnInit(){
        this.getDocInfo();
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
	
//获取所有的数据
    getDocInfo(){
    	this.healthInsurancePolicyAddFileService.getHistoryInfo(this.insuranceAddDetail)
    	  .then(docInfo =>{
    	  	console.log(docInfo);
    	  	 if(this.insuranceAddDetail){
    	  	 	  this.docInfo = docInfo.data;
	              for(let i=0;i<docInfo.length;i++){
	              	 this.drugName = docInfo[i].id;
	              }
	              for(let i=0;i<this.docInfo.length;i++){
	              	 this.setContentData.push(this.docInfo[i])
	              }
	              console.log(this.setContentData);
	              for(let i=0;i<this.setContentData.length;i++){
	              	    this.contentData = this.setContentData[i].content;
	              }
	              console.log(this.contentData);
				  this.setContent(this.contentData);
    	  	 }else{
    	  	 	  this.setContent("");
    	  	 }           
    	  })
    }
//点击返回按钮,有个提示
     return(){
     	 this.dialogPlugin.myModule();     	 
     }	
//添加医保政策内容
	saveInsurance(){
		//什么都没填,提示报错
    	if ( !this.checkUserInfoRequired(this.handleType) ) {
			    return;
		}
		 this.getContent();   //从富文本框中取得内容
	     this.info = this.currentTime.year+'/'+this.currentTime.month+'/'+this.currentTime.day;
         this.day = (new Date(this.info)).getTime();  
         this.insuranceAddDetail.ativeDate = this.day;//生效时间
         if(this.testNameResult){
         	this.healthInsurancePolicyAddFileService.getInsuranceData(this.insuranceAddDetail)
					 .then(res => {
		    				if (res.code == 200) {
		    					this.isShowBtn = false;
		                        this.dialogPlugin.tip("保存成功",null,'success');
		                        setTimeout(() => {
		                           this.dialogPlugin.tip("保存成功2",null,'success');
                                   let link:any[] = ['healthCareChargedFees/healthInsurancePolicyFile'];
    							   this.router.navigate(link);  
		                        }, 100);
		                    }
				     })
         }else if(!this.testNameResult){
         	this.dialogPlugin.tip('文件标题不能重名',null,'error')
         }
		
    }
/*检测同名请求*/
    checkName(summary){
      	  this.healthInsurancePolicyAddFileService.checkName(this.insuranceAddDetail.summary)
      	    .then(res=>{
      	    	console.log(res);
      	    	if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
//			   			  this.dialogPlugin.tip('文件标题不能重名',null,'error')
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
    	if(this.insuranceAddDetail.summary!=""&&this.testNameCode(this.insuranceAddDetail.summary)){
    		this.checkName(this.insuranceAddDetail.summary);
    	}
    }
//验证是否输入错误
	testNameCode(value){
		let reg = /^[a-zA-Z0-9\-\.\()\、\。\（）\,\u4e00-\u9fa5]+$/gi
		let result = reg.test(value);
		return result;
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
//              this.setEditorContent(content);
            });
        }
    }
    getContent() {
        this.insuranceAddDetail.content = this.UEditor.getContent().replace("\"http://" + window.location.host + "/api", "\"/api");
    }
//验证提交信息必填项是否完整  点击保存按钮
	private checkUserInfoRequired(handleType: string) : boolean {
		if (!this.insuranceAddDetail.summary) {
			this.dialogPlugin.tip("文件标题不能为空!",null,"error");
			return false;
		}
		if(!this.currentTime){
			this.dialogPlugin.tip("生效时间不能为空!",null,"error");
			return false;
		}
		if (!this.insuranceAddDetail.source) {
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
//精测来源   
    testInsuranceSourceName(value){
//		let reg = /^[a-zA-Z0-9\-\.\u4e00-\u9fa5]+$/gi;
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
