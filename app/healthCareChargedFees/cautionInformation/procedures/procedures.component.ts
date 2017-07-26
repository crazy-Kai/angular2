import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DetailDataService } from './procedures.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
declare var echarts: any;
@Component({
	selector:'proceduresPage',
    templateUrl:'procedures.component.html',
	styleUrls:['procedures.component.css'],
	providers:[ DetailDataService ]
})

export class  ProceduresComponent{
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;

	constructor(
		private detailDataService: DetailDataService,private router: Router,private route : ActivatedRoute
	) {}
	private information:any = {};
	  visitId:any;
	  linkType:any;  //从上个页面跳转过来的页面类型
	  link:any;
	  insuranceId:any;
	  settingId:any;
	  type:any = 'drug';
	  visitInfo:any = {};//就诊详情
	  diseaseInfo:any =[];//疾病详情
	  drugInfo:any=[];//药品详情
	  itemInfo:any=[];//项目详情
	  materialInfo:any=[];//材料详情
	  patientNumber:any;//患者id
	  oldDataList:any = [];//历史就诊处方信息
	  clinicType:any = 'current';
	  hospitalNo:any;//医院
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


	ngOnInit(){
		this.getRouteParam();
	}
	getRouteParam(){
		this.route.params.subscribe(param => {
		    this.visitId = this.route.params['value'].visitId;
		    this.patientNumber = this.route.params['value'].patientNumber;
		    this.hospitalNo = this.route.params['value'].hospitalNo;
		    this.linkType = this.route.params['value'].type;
		    this.insuranceId = this.route.params['value'].insuranceId;
		    this.settingId = this.route.params['value'].settingId;
		    this.getCurrentData(this.visitId);
		    
       });
	}
	//获取本次就诊信息
	getCurrentData(visitId?:any){
		 this.detailDataService.getInitDetailsData(visitId).then(res=>{
				    	if(res.code == 200){
				    		if(res.data){
				    			this.visitInfo = res.data.visitInfo;
				    			this.diseaseInfo = res.data.DiseaseInfo;
				    			this.drugInfo = res.data.DrugInfo;
				    			this.itemInfo = res.data.ItemInfo;
				    			this.materialInfo = res.data.MaterialInfo;
				    			this.getOldDataList.call(this,this.visitInfo.idType,this.visitInfo.idNo);
				    		}
				    	}
		  })
	}
	/*获取历史就诊信息*/
	getOldDataList(idType?:any,idNo?:any){
		this.detailDataService.getOldDetailsData(idType,idNo).then(res=>{
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
	//跳转页面
	goToDetail(){
		
	}

	/*返回*/
	goBack(){
		switch(this.linkType){
			case '5': this.link = ['healthCareChargedFees/cautionInformation/materialWarningInformationDetails/materialWarningInformationDetails-component/',this.settingId,this.linkType,this.hospitalNo,this.insuranceId];
			break;
			case '4': this.link = ['healthCareChargedFees/cautionInformation/objectWarningInformationDetails/objectWarningInformationDetails-component/',this.settingId,this.linkType,this.hospitalNo,this.insuranceId];
			break;
			case '1': this.link = ['healthCareChargedFees/cautionInformation/visitingWarningInformationDetails/visitingWarningInformationDetails-component/',this.settingId,this.linkType,this.hospitalNo,this.insuranceId];
			break;
			case '3': this.link = ['healthCareChargedFees/cautionInformation/drugWarningInformationDetails/drugWarningInformationDetails-component/',this.settingId,this.linkType,this.hospitalNo,this.insuranceId];
			break;
			case '2': this.link = ['healthCareChargedFees/cautionInformation/diseaseWarningInformationDetails/diseaseWarningInformationDetails-component/',this.settingId,this.linkType,this.hospitalNo,this.insuranceId];
			break;
		}	
		this.router.navigate(this.link)
	}
}