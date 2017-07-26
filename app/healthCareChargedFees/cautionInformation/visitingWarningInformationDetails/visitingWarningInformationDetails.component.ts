import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DetailDataService } from './visitingWarningInformationDetails.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
declare var echarts: any;
import { DataList } from './dataList';
@Component({
	selector:'visitingWarningInformationDetailsPage',
    templateUrl:'visitingWarningInformationDetails.component.html',
	styleUrls:['visitingWarningInformationDetails.component.css'],
	providers:[ DetailDataService ]
})

export class  VisitingWarningInformationDetailsComponent{
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;

	constructor(
		private detailDataService: DetailDataService,private router: Router,private route : ActivatedRoute
	) {}
	/*变量*/
	private information:any = {};
	  link:any;
	  dataList: DataList = new DataList();
	  hospitalNo:any;//医院名称
      officeArray:any;//科室
      pageInfo: any = {};
	  msgList:any;
	  insuranceId:any;//保险Id
	  personCategorys:any = [];//人员类别
	  tableUrl = '/ipharmacare-distributed-yb-web/warningInfo/hospitalPatient';
	  defaultValue :any = 1;
		/**
	 * 时间控件参数
	 */
	startDate: any;//开始时间
	endDate: any;//结束时间
	/*初始化获取的时间*/
	private searchParams: any = {
        startTime:'',
        endTime: ''
    };	
	

	goToDetail(item){
		let link = ['healthCareChargedFees/cautionInformation/procedures/procedures-component',item.visitInfoId,item.patientNumber,this.dataList.hospitalNo,this.dataList.warningType,this.insuranceId,this.dataList.settingId];
		this.router.navigate(link);
	}

	ngOnInit(){
		this.getRouteParam();
		this.getOffice();
	}
	/*获取人员类别*/
	getPersonCategorys(){
 		this.detailDataService.getPersonCategory(this.insuranceId).then(res=>{
 			if(res.code == 200){
 				this.personCategorys = res.data;
 			}
 		})
	}
		//获取table列表信息
	
	getMsgList(Api: string){
		/*时间格式转换*/
		if(this.startDate && this.endDate){
		 	this.dataList.startTime = this.startDate;
		  	this.dataList.overTime =this.endDate;
		}
		let query: string = Api;
	    for(let attr in this.dataList){
            if (this.dataList[attr]) {
				query += `&${attr}=${this.dataList[attr]}`;
			}
        }
        this.detailDataService.getTableList(query).then(res=>{
        	if(res.code == 200 && res.data){
        		this.pageInfo = new Object();
                this.pageInfo.currentPage = res.data.currentPage;
                this.pageInfo.totalPageCount = res.data.pageCount;
                this.pageInfo.pageSize = res.data.pageSize;
                this.pageInfo.recordCount = res.data.recordCount;
                this.msgList = res.data.recordList || [];
                this.dataList.startTime = "";
                this.dataList.overTime = "";
        	}
        })
	}
	getRouteParam(){
		this.route.params.subscribe(param => {
		    this.dataList.settingId = this.route.params['value'].settingId;
           	this.dataList.warningType = this.route.params['value'].temp;	
          	this.dataList.hospitalNo = this.route.params['value'].code;
          	this.insuranceId =  this.route.params['value'].insuranceId;
          	/*初始化table*/
          	this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');
            /*获取警示信息*/
            this.getInformation();
            /*初始化人员类别*/
            this.getPersonCategorys();
       });
	}
	
	// 根据医院获取科室
	getOffice(){
		this.detailDataService.getOfficeData(this.dataList.hospitalNo)
			.then( res =>{
				if(res.code == 200){
					this.officeArray = res.data;
				}
			})
	}
	//切换科室
	selectedOffice($event){
		if($event){
			this.dataList.department = $event;
		}

	}
	//获取警示信息
	getInformation(){
		this.detailDataService.getInformation(this.dataList.settingId,this.dataList.hospitalNo,this.dataList.warningType)
		  .then( res =>{
			  	if(res.code == 200){
			  		this.information = res.data;
			  		
			  		this.hospitalNo = res.data.hospitalName;
			  	}
		  })
	}

	/*分页器切换当前页*/
   setPage($event: any){
        this.pageInfo.currentPage = $event;
        this.getMsgWithPageInfo(this.pageInfo);
    }
    setPageSize($event: any){
        this.pageInfo.pageSize = $event;
        this.getMsgWithPageInfo(this.pageInfo);
    }
    getMsgWithPageInfo(pageInfo: any){
        let tempUrl = "";
        tempUrl = this.tableUrl + '?pageNo=' + this.pageInfo.currentPage + '&pageSize=' + this.pageInfo.pageSize;
        this.getMsgList(tempUrl);
    }
	//搜索
	search(){
		this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');
	}
	checkNumber(currentValue?: number | string){
		if(currentValue === "") return //如果没选则退出;
		let correctVlaue :any = currentValue? currentValue : this.defaultValue;
		  if(correctVlaue < 1){
		  	correctVlaue = 1;
		  }else if(this.dataList.overAge !="" && parseInt(correctVlaue)>= parseInt(this.dataList.overAge)){
				correctVlaue = parseInt(this.dataList.overAge) -1;
		  } 
		  
		// this.defaultValue = correctVlaue;
		this.dataList.startAge = correctVlaue;
	}
	checkOverCount(currentValue?: number | string){
	   if(currentValue === "") return //如果没选则退出;
	   let correctVlaue :any = currentValue? currentValue : this.defaultValue;
		  if(correctVlaue < 1){
		  	correctVlaue = 1;
		  }else if(this.dataList.startAge !="" && parseInt(correctVlaue)<= parseInt(this.dataList.startAge)){
				correctVlaue = parseInt(this.dataList.startAge) +1;
		  } 
		  
		// this.defaultValue = correctVlaue;
		this.dataList.overAge  = correctVlaue;
	}
	/*返回*/
	goBack(){
    	this.link = ['healthCareChargedFees/cautionInformation/hospitalDataDetail/interventionDataDetial',this.dataList.settingId,	this.dataList.warningType,this.insuranceId];
		this.router.navigate(this.link);
	}
		/*更新时间*/
	updateTime($event){
		this.startDate = this.searchParams.startTime =  $event.startTime;
        this.endDate =  this.searchParams.endTime = $event.endTime;
	}
}