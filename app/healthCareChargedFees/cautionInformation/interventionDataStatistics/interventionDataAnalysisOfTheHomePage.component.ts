import { Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DataTreeService } from './interventionDataAnalysisOfTheHomePage.service';

import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { TablePlugin } from '../../common/ug-table/table.module';
import { DataList} from './dataList';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import {IosScollerFn} from '../../common/table_width';//兼容IOS表格的滚动条宽度的方法
@Component({
	selector:'interventionDataAnalysisOfTheHomePage',
    templateUrl:'interventionDataAnalysisOfTheHomePage.component.html',
	styleUrls:['interventionDataAnalysisOfTheHomePage.component.css'],
	providers:[DataTreeService]
})


export class InterventionDataAnalysisOfTheHomePageComponent {
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;
	@ViewChild(TablePlugin) tablePlugin: TablePlugin;
	private manageData:any[] = [];
    private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
	constructor(
		private dataTreeService: DataTreeService,private router: Router
	) {}
	ngOnInit(){ 
	    this.getInsuranceId();
		this.getManage();
		this.getAnalyze();
		this.getHospital();
		this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');
		this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
	}
	//	变量
	private manageArray:any = [];//管理数据
	private tipArray:any = [];//提示数据
	private officeArray:any =[];//科室数据
	private ruleArray: any =[];//规则数据
	private analyzeArray: any=[];//分析数据
	private hospitalArray:any=[];//医院数据
	private doctorArray:any = [];//医护人员
	dataList: DataList = new DataList();
	inputWidth:any = "100px";
	defaultValue :any = 1;
	pageInfo: any = {};
	insuranceArray:any;
	msgList:any;
	insuranceId:any;//险种ID
	tableUrl = '/ipharmacare-distributed-yb-web/warningInfo';
	startDate: any;//开始时间
	endDate: any;//结束时间
	/*初始化获取的时间*/
	private searchParams: any = {
        startTime:'',
        endTime: ''
    };	
	
	
 //获取险种
 getInsuranceId(){
 	this.dataTreeService.getInsuranceUrl()
 	.then( res =>{
 		if(res.code == 200 ){
 			this.insuranceArray = res.data;
 			this.insuranceId = this.insuranceArray[0].id;
 			this.getRule(this.insuranceId);
 		}
 	})
 }
 //切换险种
 selectedInsuranceId($event){
 	this.insuranceId = $event;
 	this.getRule(this.insuranceId);
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
        this.dataTreeService.getTableList(query).then(res=>{
        	if(res.code == 200 && res.data){
        		this.pageInfo = new Object();
                this.pageInfo.currentPage = res.data.currentPage;
                this.pageInfo.totalPageCount = res.data.pageCount;
                this.pageInfo.pageSize = res.data.pageSize;
                this.pageInfo.recordCount = res.data.recordCount;
                this.msgList = res.data.recordList || [];
                this.dataList.startTime = "";
                this.dataList.overTime = "";
                this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
        	}
        })
}


	
//	获取管理依据
	getManage(){
		this.dataTreeService.getManageData()
		.then( res=>{
			if(res.code ==200){
				this.manageArray=res.data;
			}
		})
	}
//	获取规则版本
	getRule(id){
		this.dataTreeService.getRuleData(id)
			.then(res =>{
				if(res.code ==200){
					this.ruleArray=res.data;	
				}
			})
	}
//	获取分析类型
	getAnalyze(){
		this.dataTreeService.getanalyzeData()
			.then(res =>{
				if(res.code == 200){
					this.analyzeArray=res.data;	
				}
			})
	}
	/*切换分析类型*/
	selectedanalysis($event){
		if($event){
		  	let analysisId:any = $event;
		  	this.dataList.analysisType = analysisId;
		  	this.getTip(analysisId);
	  	}else{

	  		this.tipArray = [];
	  	}
		 this.dataList.promptType = "";
	}
//	获取提示
	getTip(id){
		this.dataTreeService.getTipData(id)
		.then( res=>{
			if(res.code == 200){
				this.tipArray=res.data;
			}
		})
	}
//	获取医院
	getHospital(){
		this.dataTreeService.getHospitalData()
			.then(res =>{
				if(res.code == 200){
					this.hospitalArray = res.data;
				}
			})
	}
	//切换医院
	selectedHospital($event){
		if($event){
			this.dataList.hospitalNo = $event;
			this.getOffice(this.dataList.hospitalNo)
		}else{
			this.officeArray = [];
		}
		this.dataList.department = "";
	}
//	获取科室
	getOffice(hospitalNo){
		this.dataTreeService.getOfficeData(hospitalNo)
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
	
//	点击查看跳转页面
	goToDetail(item:any){
		let link = ['healthCareChargedFees/cautionInformation/hospitalDataDetail/interventionDataDetial/',item.settingId,item.warningType,this.insuranceId];
		console.log(link)
		this.router.navigate(link);
	}
	
	
	/*更新时间*/
	updateTime($event){
		this.startDate = this.searchParams.startTime =  $event.startTime;
        this.endDate =  this.searchParams.endTime = $event.endTime;
	}

	checkNumber(currentValue?: number | string){
		if(currentValue === "") return //如果没选则退出;
		let correctVlaue :any = currentValue? currentValue : this.defaultValue;
		  if(correctVlaue < 1){
		  	correctVlaue = 1;
		  }else if(this.dataList.overCount !="" && parseInt(correctVlaue)>= parseInt(this.dataList.overCount)){
				correctVlaue = parseInt(this.dataList.overCount) -1;
		  } 
		  
		// this.defaultValue = correctVlaue;
		this.dataList.startCount  = correctVlaue;
	}
	checkOverCount(currentValue?: number | string){
	   if(currentValue === "") return //如果没选则退出;
	   let correctVlaue :any = currentValue? currentValue : this.defaultValue;
		  if(correctVlaue < 1){
		  	correctVlaue = 1;
		  }else if(this.dataList.startCount !="" && parseInt(correctVlaue)<= parseInt(this.dataList.startCount)){
				correctVlaue = parseInt(this.dataList.startCount) +1;
		  } 
		  
		// this.defaultValue = correctVlaue;
		this.dataList.overCount  = correctVlaue;
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

    
    //查询
	search(){
		this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');
	}
}
