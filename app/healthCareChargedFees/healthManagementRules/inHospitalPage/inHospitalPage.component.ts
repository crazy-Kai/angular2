import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DetailDataService } from './inHospitalPage.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector:'inHospitalPage',
    templateUrl:'inHospitalPage.component.html',
	styleUrls:['inHospitalPage.component.css'],
	providers:[ DetailDataService ]
})

export class  InHospitalPage{
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;
/*变量*/
    private information:any = {};
    visitInfo:any = {};//住院详情
    diseaseInfo:any =[];//疾病详情
    drugInfo:any=[];//药品详情
    itemInfo:any=[];//项目详情
    materialInfo:any=[];//材料详情
    clinicType:any = 'current';
    oldDataList:any;
    
    eventNo:any;
	hospitalNo:any;
	docTitle:any;
	idType:any;
	idNo:any;
	
	
	
	private isDrugTitleShow:boolean=true;
	private isDrugsTitleShow:boolean=false;
	private isDrugsBackgroundShow:boolean=false;
	
	private isItemsTitleShow:boolean=true;
	private isItemsBackgroundShow:boolean=false;
	
	private isDiseaseTitleShow:boolean=true;
	private isDiseaseBackgroundShow:boolean=false;
	
	private isMaterialTitleShow:boolean=true;
	private isMaterialBackgroundShow:boolean=false;
	
	private isDrugDefaultTableShow:boolean=true;
	
	private isDrugsTableShow:boolean=false;
	private isDiseasesTableShow:boolean=false;
	private isItemsTableShow:boolean=false;
	private isMaterialsTableShow:boolean=false;
	
	
    
	constructor(
		private detailDataService: DetailDataService,
		private router: Router,
		private route : ActivatedRoute
	) {}
	ngOnInit(){
		this.getRouteParam();
	}
	defaultrugsShow(){
		this.isDrugTitleShow = false;
		this.isDrugsTitleShow = false;
		this.isDrugsBackgroundShow = true;
		
		this.isDrugDefaultTableShow = false;
		
		this.isDrugsTableShow = true;
		this.isDiseasesTableShow = false;
		this.isItemsTableShow = false;
		this.isMaterialsTableShow = false;
		
		this.isItemsBackgroundShow = false;
		this.isItemsTitleShow = true;
		
		this.isDiseaseTitleShow = true;
		this.isDiseaseBackgroundShow = false;
		
		this.isMaterialTitleShow = true;
		this.isMaterialBackgroundShow = false;
	}
	drugsShow(){
		this.isDrugTitleShow = false;
		this.isDrugsTitleShow = false;
		this.isDrugsBackgroundShow = true;
		
		this.isDrugDefaultTableShow = false;
		
		this.isDrugsTableShow = true;
		this.isDiseasesTableShow = false;
		this.isItemsTableShow = false;
		this.isMaterialsTableShow = false;
		
		this.isItemsBackgroundShow = false;
		this.isItemsTitleShow = true;
		
		this.isDiseaseTitleShow = true;
		this.isDiseaseBackgroundShow = false;
		
		this.isMaterialTitleShow = true;
		this.isMaterialBackgroundShow = false;
	}
	itemsShow(){
		this.isDrugTitleShow = false;
		this.isDrugsTitleShow = true;
		this.isDrugsBackgroundShow = false;
		
		this.isDrugDefaultTableShow = false;
		
		this.isDrugsTableShow = false;
		this.isDiseasesTableShow = false;
		this.isItemsTableShow = true;
		this.isMaterialsTableShow = false;
		
		this.isItemsBackgroundShow = true;
		this.isItemsTitleShow = false;
		
		this.isDiseaseTitleShow = true;
		this.isDiseaseBackgroundShow = false;
		
		this.isMaterialTitleShow = true;
		this.isMaterialBackgroundShow = false;
		
	}
	diseasesShow(){
		this.isDrugTitleShow = false;
		this.isDrugsTitleShow = true;
		this.isDrugsBackgroundShow = false;
		
		this.isDrugDefaultTableShow = false;
		
		this.isDrugsTableShow = false;
		this.isDiseasesTableShow = true;
		this.isItemsTableShow = false;
		this.isMaterialsTableShow = false;
		
		this.isItemsBackgroundShow = false;
		this.isItemsTitleShow = true;
		
		this.isDiseaseTitleShow = false;
		this.isDiseaseBackgroundShow = true;
		
		this.isMaterialTitleShow = true;
		this.isMaterialBackgroundShow = false;
	}
	materialsShow(){
		this.isDrugTitleShow = false;
		this.isDrugsTitleShow = true;
		this.isDrugsBackgroundShow = false;
		
		this.isDrugDefaultTableShow = false;
		
		this.isDrugsTableShow = false;
		this.isDiseasesTableShow = false;
		this.isItemsTableShow = false;
		this.isMaterialsTableShow = true;
		
		this.isItemsBackgroundShow = false;
		this.isItemsTitleShow = true;
		
		this.isDiseaseTitleShow = true;
		this.isDiseaseBackgroundShow = false;
		
		this.isMaterialTitleShow = false;
		this.isMaterialBackgroundShow = true;
	}
/*从前一个页面获取值*/	
	getRouteParam(){
		this.route.params.subscribe(param => {
	       this.eventNo = this.route.params['value'].eventNo;
		   this.hospitalNo = this.route.params['value'].hospitalNo;
		   this.getCurrentData(this.eventNo,this.hospitalNo);/*获取本次就诊信息*/
//		   this.getOldDataList(this.idType,this.idNo);/*历史就诊*/
       });
	}
/*获取本次就诊信息*/
	getCurrentData(eventNo?:any,hospitalNo?:any){
		 this.detailDataService.getVisitorInfomation(this.eventNo,this.hospitalNo)
		    .then(res=>{
		    	if(res.code == 200){
		    		if(res.data.length!=0){
		    			this.visitInfo = res.data.adviceInfo;
		    			for(let item of this.visitInfo){
		    				this.idType = item.idType;
		    				this.idNo = item.idNo;
		    			}
		    			console.log(this.idType,this.idNo);
		    			this.getOldDataList(this.idType,this.idNo);/*历史就诊*/
		    			this.diseaseInfo = res.data.adviceInfoDisease;
		    			this.drugInfo = res.data.adviceInfoDrug;
		    			for(let i of this.drugInfo){
		    				this.docTitle = i.docTitle;
		    			}
		    			this.itemInfo = res.data.adviceInfoItem;
		    			this.materialInfo = res.data.adviceInfoMaterial;
		    		}
		    	}
		   })
	}
/*获取历史就诊信息*/
	getOldDataList(idType?:any,idNo?:any){
		this.detailDataService.getOldDetailsData(idType,idNo)
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
}