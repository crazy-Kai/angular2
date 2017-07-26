import { Component,OnInit,ViewChild} from '@angular/core';
import { IndexService } from './index.service';
import { Router } from '@angular/router'; 
import { DialogPlugin } from '../common/ug-dialog/dialog';
import { DialogModel } from '../common/ug-dialog/dialog.model';
import {IosScollerFn} from '../common/table_width';//兼容IOS表格的滚动条宽度的方法
@Component({
	selector:'index-app',
    templateUrl: 'index.component.html',
	styleUrls:['index.component.css'],
	providers:[IndexService]
})


export class IndexAppComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	
	private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
	constructor( private indexService : IndexService){

	}
	ngOnInit(){ 
		this.getMsgList(this.tableUrl + '?pageNo=1'+'&pageSize=20');
		this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
		this.confirmIsLead();
	}
	pageInfo: any = {};
	msgList:any=[];
	private controlNum:number = 0;//控制初始化引导条目出现 
	private isLead:any; //初始化获取是否需要引导
	tableUrl = '/ipharmacare-distributed-yb-web/index';
			
	
	addControlNum(){
		this.controlNum+=1;
		console.log(this.controlNum)
	}
	
	reduceControlNum(){
		this.controlNum -=1;
		console.log(this.controlNum)
		
	}
	//获取是否需要引导
	confirmIsLead(){
		this.indexService.getIsLead()
			.then(res =>{
				if(res.code == 200){
					console.log(res)
					this.isLead = res.data;
				}
				
			})
	}
//	不再提示
	noLead(){
		this.dialogPlugin.confirm('此操作会导致您以后再也不会进入引导您确定要继续么？', () => {
			
				this.indexService.getNoTips()
					.then(res => {
						if (res.code == 200) {
							this.isLead = res.data;
							this.dialogPlugin.tip("初始化成功",null,'success');
							
						}
					})
		}, () => { })
	}
//	忽略表格上的数据
	ignoreDataById(deleteId){
		
		this.dialogPlugin.confirm('您确定要忽略这条干预失效错误么？', () => {
						this.indexService.ignoreData(deleteId)
							.then(res => {
								if(res.code == 200){
									console.log(res)
									this.dialogPlugin.tip("忽略成功",null,'success');
									this.getMsgWithPageInfo(this.pageInfo);
								}
							})
				}, () => { })
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
//		获取首页表格信息
	getMsgWithPageInfo(pageInfo:any){
		let tempUrl = "";
        tempUrl = this.tableUrl + '?pageNo=' + this.pageInfo.currentPage + '&pageSize=' + this.pageInfo.pageSize;
        this.getMsgList(tempUrl);
	}
	//获取table列表信息
getMsgList(Api: string){
		let query: string = Api;
        this.indexService.getTableList(query).then(res=>{
        	if(res.code == 200 && res.data){
        		this.pageInfo = new Object();
                this.pageInfo.currentPage = res.data.currentPage;
                this.pageInfo.totalPageCount = res.data.pageCount;
                this.pageInfo.pageSize = res.data.pageSize;
                this.pageInfo.recordCount = res.data.recordCount;
             	this.msgList = res.data.recordList || [];
                this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
        	}
        })
}

}