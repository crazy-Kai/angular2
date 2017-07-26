import { Component,OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HealthInsurancePolicyFileService } from './healthInsurancePolicyFile.service';
import { TableModel } from '../common/ug-table/table.module';
import { TablePlugin } from '../common/ug-table/table.module';
import { DialogPlugin } from '../common/ug-dialog/dialog';
import { DialogModel } from '../common/ug-dialog/dialog.model';
import {IosScollerFn} from '../common/table_width';//兼容IOS表格的滚动条宽度的方法
import {DataList} from './dataList';//获取表格数据
@Component({
	selector:'healthInsurancePolicyFile',
	templateUrl:'healthInsurancePolicyFile.component.html',
	styleUrls:['healthInsurancePolicyFile.component.css'],
	providers:[HealthInsurancePolicyFileService]
})
export class HealthInsurancePolicyFileComponent implements OnInit{
    @ViewChild(TablePlugin) tablePlugin: TablePlugin;
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
	selectedProduct: any;//每一行数据点击
    private policy: any[] = [];//参数列表
    private touchedTrow: any;//当前鼠标所在行
    selectedData: any;//数据
    tableUrl = '/ipharmacare-distributed-yb-web/policy';
    dataList: DataList = new DataList();
    pageInfo: any = {};
    msgList:any;
    
	constructor(
		private healthInsurancePolicyFileService:HealthInsurancePolicyFileService,
		private router: Router
	) {}
    ngOnInit(){ 
        this.getMsgList(this.tableUrl + "/" + 1 + "/"+ 20);
        this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
	}
    
//获取table列表信息   
    getMsgList(Api: string){
    	let query: string = Api;
    	for(let attr in this.dataList){
    		if(this.dataList[attr]){
    			query += `&${attr}=${this.dataList[attr]}`;
    		}
    	}
    	this.healthInsurancePolicyFileService.getTableList(query)
    	   .then(res=>{
    	   	    if(res.code == 200 && res.data){
    	   	    	this.pageInfo = new Object();
    	   	    	this.pageInfo.currentPage = res.data.currentPage;
    	   	    	this.pageInfo.totalPageCount = res.data.pageCount;
    	   	    	this.pageInfo.pageSize = res.data.pageSize;
    	   	    	this.pageInfo.recordCount = res.data.recordCount;
    	   	    	this.msgList = res.data.recordList || [];
					this.iosScollerFn.fn();
    	   	    }else{
    	   	    	this.msgList = [];
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
        tempUrl = this.tableUrl;
        this.getMsgList(this.tableUrl + "/" + this.pageInfo.currentPage + "/"+ this.pageInfo.pageSize);
    }
//添加医保政策内容
	addFile(){
		let link = ['healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile/healthInsurancePolicyFile_add'];
    	this.router.navigate(link);   	
	}
//点击事件	 每一行
    onClick($event: any){
    	this.selectedProduct = $event;
    }
//删除内容
    deleteData(id:number){
    	console.log(id);
	   this.dialogPlugin.confirm('您确定要删除吗？', () => {
			this.healthInsurancePolicyFileService.del(id)
				.then(res => {
					console.log(res);
					if(res.code==200){
						this.dialogPlugin.tip(res.message,null,'success');
						this.getMsgList(this.tableUrl + "/" + 1 + "/"+ 20);						
					}
				})
		}, () => { })	
	}
//修改数据
   goToEditPage(id?: number){
   	  let link:any[] = ['healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile/healthInsurancePolicyFile_modification'];
   	   if (id)
            link.push(id);
   	  this.router.navigate(link);
   }
}

