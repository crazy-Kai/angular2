import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import {WaringInfomationService} from './waringInformation.service';
import {IosScollerFn} from '../../common/table_width';//兼容IOS表格的滚动条宽度的方法
import {TableListData} from './tableList.ts';//获取表格数据
@Component({
	selector: 'waringInformation',
	templateUrl:'waringInformation.component.html',
	styleUrls:['waringInformation.component.css'],
	providers:[WaringInfomationService]
})
export class WaringInformationComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	tableList:TableListData = new TableListData();//获取表格数据
	private isTableShow:boolean=true;//门诊表格出现
    private isServiceTableShow:boolean=false;//门诊表格出现
    private isHospitalTableShow:boolean=false;//住院表格出现
	private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
	tableUrl = '/ipharmacare-distributed-yb-web/ruleCheck/checkInfo';	
	pageInfo: any = {};
	msgList:any;
	
	constructor(
		private waringInfomationService:WaringInfomationService,
		private router: Router,
		private route : ActivatedRoute
	){}
	
	ngOnInit(){
		this.getRouteParam();
		this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
        this.getMsgList(this.tableUrl + '?sign=' +  this.id + '&pageNo=1'+'&pageSize=20');//获取表格数据
	}
	ruleName:any;//规则名称
	id:any;//当前点击的一条数据的id
	getRouteParam(){
		this.route.params.subscribe(param => {
			this.ruleName = this.route.params['value'].ruleName;
			this.id = this.route.params['value'].id;
		})
	}
/*获取table列表信息 */
	getMsgList(Api: string){
		let query: string = Api;
	    for(let attr in this.tableList){
            if (this.tableList[attr]) {
				query += `&${attr}=${this.tableList[attr]}`;
			}
        }
		this.waringInfomationService.getTableList(query)
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
//点击查看分别进入不同的页面    
   lookRecipe(eventNo,hospitalNo,source){
   	  if(source==1){
           let link:any[] = ['healthCareChargedFees/healthManagementRules/interferenceAnalysis/interferenceAnalysis',eventNo,hospitalNo];
	   	   this.router.navigate(link);
   	  }
   	  if(source==2){
   	  	   let link:any[] = ['healthCareChargedFees/healthManagementRules/inHospitalPage/inHospitalPage',eventNo,hospitalNo];
	   	   this.router.navigate(link);
   	  }
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
        this.getMsgList(this.tableUrl + '&pageSize=20'+'&&pageNo=1');//获取表格数据
    }
}


