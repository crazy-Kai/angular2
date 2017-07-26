import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DetailDataService } from './doctorAdviceDetails.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
declare var echarts: any;
@Component({
	selector:'doctorAdviceDetails',
    templateUrl:'doctorAdviceDetails.component.html',
	styleUrls:['doctorAdviceDetails.component.css'],
	providers:[ DetailDataService ]
})

export class  DoctorAdviceDetails{
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;

	constructor(
		private detailDataService: DetailDataService,private router: Router,private route : ActivatedRoute
	) {}
	private information:any = {};
//	  visitId:any;
	  type:any = 'drug';
	  visitInfo:any = {};//住院详情
	  diseaseInfo:any =[];//疾病详情
	  drugInfo:any=[];//药品详情
	  itemInfo:any=[];//项目详情
	  materialInfo:any=[];//材料详情
	ngOnInit(){
//		this.getRouteParam();
		this.getCurrentData()
	}
//	getRouteParam(){
//		this.route.params.subscribe(param => {
////	    this.visitId = this.route.params['value'].id;
////		this.getCurrentData(this.visitId)
//
//     });
//	}
	获取本次就诊信息
	getCurrentData(){
		 this.detailDataService.getVisitorInfomation().then(res=>{
				    	if(res.code == 200){
				    		if(res.data){
				    			console.log(res)
				    			this.visitInfo = res.data.adviceInfo;
				    			this.diseaseInfo = res.data.adviceInfoDisease;
				    			this.drugInfo = res.data.adviceInfoDrug;
				    			this.itemInfo = res.data.adviceInfoItem;
				    			this.materialInfo = res.data.adviceInfoMaterial;
				    		}
				    	}
		  })
	}
	/*返回*/
	goBack(){
      let link =['healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/waringInformation/waringInformation'];
      this.router.navigate(link);
	}
}