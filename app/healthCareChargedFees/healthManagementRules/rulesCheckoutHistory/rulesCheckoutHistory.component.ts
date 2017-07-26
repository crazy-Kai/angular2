import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import {RulesCheckoutHistoryService} from './rulesCheckoutHistory.service';
import {IosScollerFn} from '../../common/table_width';//兼容IOS表格的滚动条宽度的方法
import {TableList} from './tableList';//表格 搜索条件需要传的参数
@Component({
	selector: 'rulesCheckoutHistory',
	templateUrl:'rulesCheckoutHistory.component.html',
	styleUrls:['rulesCheckoutHistory.component.css'],
	providers:[RulesCheckoutHistoryService]
})
export class RulesCheckoutHistoryComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
/*变量*/
    tableList:TableList = new TableList();//获取表格数据
	insuranceId:number;//险种id
	id:any;//规则版本ID
	activeIdx:number = 0;//下拉列表默认选中的那个
	private selectList:any;//用来装下拉菜单的数据 版本信息
	private insuranceList: any=[];//用来装下拉菜单的数据  险种
	tableUrl = '/ipharmacare-distributed-yb-web/ruleCheckHistory/info';	
	pageInfo: any = {};
	msgList:any;
	constructor(
		private rulesCheckoutHistoryService:RulesCheckoutHistoryService,
		private router: Router,
		private route : ActivatedRoute
	){}
	ngOnInit(){
        this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');//获取表格数据
        this.getInsuranceData();//获取险种下拉数据
        this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
	}
/*获取险种下拉数据*/   
    getInsuranceData():void{
    	this.rulesCheckoutHistoryService.getInsuranceData()
    	  .then(res=>{
    	  	  if(res.code == 200){
    	  	   		if(res.data.length!=0){
	    	  	   	   	this.insuranceList = res.data;
    	  	   		}else{
	    	  	   	   this.insuranceList = [];//规则版本下拉数据
    	  	   		}
    	  	  }
    	  })
    }
/*select的change事件   获取险种    */
    insuranceClick($event){
    	if($event){
    	 	this.tableList.insuranceId = $event;
    	 	this.getVersionData(this.tableList.insuranceId);//获取版本下拉框数据
    	}
    }
/*获取版本下拉框数据*/
    getVersionData(insuranceId:number):void{
    	this.rulesCheckoutHistoryService.getversionData(insuranceId)
    	  .then(res=>{
    	  	   if(res.code == 200){
    	  	   		if(res.data.length!=0){
	    	  	   	   	this.selectList = res.data;
    	  	   		}else{
	    	  	   	   this.selectList = [];//规则版本下拉数据
    	  	   		}
    	  	    } 	  	  
    	  })
    } 
//select的change事件   版本信息
    optionClick($event){
    	if($event){
    		this.id = $event;
    		this.tableList.ruleVersion = this.id;
    	}
    } 	
/*获取table列表信息 */
	getMsgList(Api: string){
		let query: string = Api;
	    for(let attr in this.tableList){
            if (this.tableList[attr]) {
				query += `&${attr}=${this.tableList[attr]}`;
			}
        }
		this.rulesCheckoutHistoryService.getTableList(query)
		  .then(res=>{
		  	  if(res.code == 200 && res.data){
		  	  	 this.pageInfo = new Object();
                this.pageInfo.currentPage = res.data.currentPage;
                this.pageInfo.totalPageCount = res.data.pageCount;
                this.pageInfo.pageSize = res.data.pageSize;
                this.pageInfo.recordCount = res.data.recordCount;
                this.msgList = res.data.recordList || [];
                this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
		  	  }else{
		  	  	this.msgList = [];
		  	  }
		  })
	}
	/*点击详情进入页面传参数*/
	detailChange(ruleName,id){
		console.log(id);
		let link:any[] = ['healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/waringInformation/waringInformation',ruleName,id];
	   	this.router.navigate(link);
	}
/*查询*/
	search(){
		this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');
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
        tempUrl = this.tableUrl;
        this.getMsgList(this.tableUrl + "?pageNo=" + this.pageInfo.currentPage + "&pageSize="+ this.pageInfo.pageSize);
    }
}


