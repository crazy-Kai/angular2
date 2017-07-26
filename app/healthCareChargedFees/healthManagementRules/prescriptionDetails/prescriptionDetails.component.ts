import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { PrescriptionDetailsService } from './prescriptionDetails.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
declare var echarts: any;
@Component({
	selector:'prescriptionDetails',
    templateUrl:'prescriptionDetails.component.html',
	styleUrls:['prescriptionDetails.component.css'],
	providers:[ PrescriptionDetailsService ]
})

export class  PrescriptionDetails{
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;
/*变量*/
	 private information:any = {};
	 visitId:any;
	 type:any = 'drug';
	 visitInfo:any = {};//就诊详情
	 diseaseInfo:any =[];//疾病详情
	 drugInfo:any=[];//药品详情
	 itemInfo:any=[];//项目详情
	 materialInfo:any=[];//材料详情
	 patientNumber:any;//患者id
	 oldDataList:any = [];//历史就诊处方信息
	 clinicType:any = 'current';
	 
   constructor(
		private prescriptionDetailsService: PrescriptionDetailsService,
		private router: Router,
		private route : ActivatedRoute
	) {}
	ngOnInit(){
//		this.getRouteParam();
		this.getCurrentData();//获取本次就诊信息
	}
	getRouteParam(){
		this.route.params.subscribe(param => {
		    this.visitId = this.route.params['value'].visitId;
		    this.patientNumber = this.route.params['value'].patientNumber;
//		    this.getCurrentData(this.visitId);
//		    this.getOldDataList(this.patientNumber);
       });
	}
/*获取本次就诊信息*/
docTitle:any;
	getCurrentData(){
		 this.prescriptionDetailsService.getInitDetailsData().then(res=>{
		 	 console.log(res);
		    	if(res.code == 200){
		    		if(res.data.length!=0){
		    			this.visitInfo = res.data.prescriptionInfo;
		    			this.diseaseInfo = res.data.prescriptionInfoDisease;
		    			this.drugInfo = res.data.prescriptionInfoDrug;
		    			for(let i of this.drugInfo){
		    				this.docTitle = i.docTitle;
		    			}
		    			this.itemInfo = res.data.prescriptionInfoItem;
		    			this.materialInfo = res.data.prescriptionInfoMaterial;
		    		}
		    	}
		  })
	}
	/*获取历史就诊信息*/
	getOldDataList(patientNumber?:any){
		this.prescriptionDetailsService.getOldDetailsData(patientNumber).then(res=>{
			if(res.code == 200){
				if(res.data){
					this.oldDataList = res.data;
					this.serializeData(this.oldDataList);
				}
			}else{
				this.dialogPlugins.tip(res.message,null,'error',true)
			}
		})
	}
	序列化返回数据
	serializeData(data?:any){
		for(let i = 0;i<data.length;i++){
			data[i].currentType = "drug";
			data[i].isShow = false;
			if(i == 0){
				data[i].isShow = true;
			}
		}
	}
	/**
	 * 时间控件参数
	 */
	startDate: any;
	endDate: any;
	minStartDate: any;
	maxStartDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
	minEndDate: any;
	maxEndDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};        //设定药品核准时间的最大值为今天string;
	objToDate(oriDate: any) {
        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
        return dateStr;
    }
	setEndInterval($event: any){
		if($event){
			this.minEndDate = $event;
		}else{
			this.minEndDate = null;
		}
	}
	setStrartInterval($event: any){
		if($event){
			this.maxStartDate = $event;
		}else{
			this.maxStartDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
		}
	}
	//点击切换展开状态
	switchState(obj?:any){
		obj.isShow = !obj.isShow;
		obj.currentType = "drug";
	}
	跳转页面
	goToDetail(){
		
	}

	/*返回*/
	goBack(){
      let link =['healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/waringInformation/waringInformation'];
      this.router.navigate(link);
	}
}