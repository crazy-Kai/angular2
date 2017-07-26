import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DetailDataService } from './interferenceAnalysis.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector:'interferenceAnalysis',
    templateUrl:'interferenceAnalysis.component.html',
	styleUrls:['interferenceAnalysis.component.css'],
	providers:[ DetailDataService ]
})
export class  InterferenceAnalysis{
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
	isControl:boolean = false;
	docTitle:any;//医生职称
	
	eventNo:any;
	hospitalNo:any;
	
	idType:any;
    idNo:any;
	
	constructor(
		private detailDataService: DetailDataService,
		private router: Router,
		private route : ActivatedRoute
	) {}
	ngOnInit(){
		this.getRouteParam();
	}
/*从上个页面传的值*/	
	getRouteParam(){
		this.route.params.subscribe(param => {
		    this.eventNo = this.route.params['value'].eventNo;
		    this.hospitalNo = this.route.params['value'].hospitalNo;
		    this.getCurrentData(this.eventNo,this.hospitalNo);/*本次就诊*/
//		    this.getOldDataList(this.idType,this.idNo);/*历史就诊*/
       });
	}
/*获取本次就诊信息*/
	getCurrentData(eventNo?:any,hospitalNo?:any){
		 this.detailDataService.getInitDetailsData(this.eventNo,this.hospitalNo)
		    .then(res=>{
		    	if(res.code == 200){
		    		if(res.data.length!=0){
		    			this.visitInfo = res.data.prescriptionInfo;
		    			console.log(this.visitInfo);
		    			this.idType = this.visitInfo.idType;
		    			this.idNo = this.visitInfo.idNo;
		    			console.log(this.idType,this.idNo);
		    			this.getOldDataList(this.idType,this.idNo);/*历史就诊*/
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
	getOldDataList(idType?:any,idNo?:any){
		this.detailDataService.getOldDetailsData(this.idType,this.idNo)
		   .then(res=>{
		   	    console.log(res);
			    if(res.code == 200){
				   if(res.data){
					   this.oldDataList = res.data;
					   this.serializeData(this.oldDataList);
				    }
			    }
		   })
	}
//序列化返回数据
	serializeData(data?:any){
		for(let i = 0;i<data.length;i++){
			data[i].currentType = "drug";
			data[i].isShow = false;
			if(i == 0){
				data[i].isShow = true;
			}
		}
	}
//点击切换展开状态
	switchState(obj?:any){
		obj.isShow = !obj.isShow;
		obj.currentType = "drug";
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
}