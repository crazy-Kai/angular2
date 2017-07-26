/*
  time:2017-3-15,
  author:王宏
  responsible:王宏
 */

import { Component, OnInit, Input, trigger, state, style, transition, animate, ViewChild, HostListener,Injectable} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DialogPlugin, DialogModel } from '../common/ug-dialog/dialog';
import {VersionEffectService} from "./versionEffect.service";
import {TableDataDetail,EffectiveTimeDetail} from './tabledata';//表格数据需要传入的参数
import {IosScollerFn} from '../common/table_width';//兼容IOS表格的滚动条宽度的方法
@Component({
	selector: 'versionEffect',
	templateUrl:'versionEffect.component.html',
	styleUrls:['versionEffect.component.css'],
	providers:[VersionEffectService]
})
export class VersionEffectComponent implements OnInit {
    @ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
    private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
    private isDialogShow: boolean = false;
    private isEdit: boolean = false;
    private isTitleShow: boolean = true;
    private ismodificationShow: boolean = false;
/*变量*/
    private effectiveTimeDetail:EffectiveTimeDetail = new EffectiveTimeDetail();//设置生效版本
    private tableList:any;
    private firstTrList:any;
    private insuranceId:number;//险种请求返回的保险ID
    versionName:any;//当前版本名字
	cateType: any = {};//当前节点的数据类型	
    private isDialogPlugin:boolean = false;//对话框出现 //定时生效与立即生效
    private isSuggestion:boolean = false;//立即生效提示    对话框出现
    private isTiming:boolean = true;//定时生效   对话框出现
	private isShow:boolean = false;
	private isTextShow:boolean = true;	
	private isActive:number;//当前生效
    private versionId:number;// 版本生效设置对象ID 
    activeMode:number; // 生效方式
    activeDate:string; // 生效时间
    gmtCreate:string;// 创建时间
    gmtModified:string;// 修改时间
    currentTime:any;//年月日
    currentHours:any;//小时
    currentMinutes:any;//分钟
    currentseconds:any;//秒
	rulesName:string;//获取整个列表
	ruleVersionName:any;
	ruleVersionDescription:any;
	
    selectList:any;//下拉列表数据
    activeIdx:number = 0;//下拉列表选中的那个
    name:any;
    id:any;
     
    isActiveHide:boolean = false;//如果第一条数据,没有返回值,则第一条数据消失
	info:any;//点击确定的时候,保存数据,设置版本生效
	day:any;
	oDate:any;//获取当前系统时间年月日时分秒
	getFullYear:any;
	getMonth:any;
    handleType: string;//验证提交信息必填项是否完整  点击保存按钮
    tableData:any;//获取真个表格的数据
    tableDataContent:any;
     
    rvName:any;
	rvId:any;
	rvactiveDate:any;
/*初始化发送获取险种请求*/
	private insuranceTypeOption : any = {
		width:'100%',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/insurance'
	};
    constructor(
        private versionEffectService:VersionEffectService,
        private router: Router,
        private route: ActivatedRoute,
        private activeRouter: ActivatedRoute
	) { }	
     ngOnInit() {
     	this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
     }
//切换险种   下拉列表查询数据
	chooseInsurance($event){
    	this.insuranceId = $event.id;//险种id
    	this.getTableData(this.insuranceId);
    	this.getTableSelectListData(this.insuranceId);//获取表格数据
    	this.versionName = $event.name; // 当前版本名称 
    	this.getShowData(this.insuranceId);//获取id的接口
    }
//获取新数据的接口	
	getShowData(insuranceId:number){
     	this.versionEffectService.getShowData(insuranceId)
     	  .then(res=>{
     	  	  if(res.code == 200){
     	  	  	  if(res.data.length!=0){
     	  	  	  	   this.rvName = res.data.rvName;
     	  	  	  	   this.rvId = res.data.id;
     	  	  	  	   this.rvactiveDate = res.data.activeDate;
     	  	  	  	   this.isShow = true;
     	  	  	  	   this.isTextShow = false;
     	  	  	  }else{
     	  	  	  	 this.isShow = false;
     	  	  	  }
     	  	  }
     	  })
     }
//获取整个列表的数据
     getTableData(insuranceId:number){
     	this.versionEffectService.getTableData(insuranceId)
     	  .then(res=>{
     	  	this.tableList = [];
     	  	this.firstTrList = [];
     	  	if(res.code==200){
     	  		if(res.data.length!=0){
     	  			for(let i=0;i<res.data.length;i++){
						if(res.data[i].isActive !=1&&res.data[i].isActive ==2){
							this.tableList.push(res.data[i]);
							this.isActiveHide = false;
							this.isTitleShow = true;
						}else if(res.data[i].isActive ==1&&res.data[i].isActive !=2){
                            this.firstTrList = res.data[i];
							this.isActiveHide = true;
							this.isTitleShow = true;
						}
     	  			}
     	  		}
     	  		if(this.firstTrList.length==0){
     	  			this.isActiveHide = false;
     	  			this.isTextShow = true;
     	  			this.ismodificationShow = false;
					this.ruleVersionName = "暂无数据";
     	  		}else{
     	  			this.isTextShow = false;
     	  			this.ismodificationShow = true;
     	  			this.ruleVersionName = this.firstTrList.ruleVersionName;
     	  			this.isActiveHide = true;
     	  		}
     	  		
     	  		this.tableDataContent = this.tableList.concat(this.firstTrList);
	     	  	this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
     	  	}
     	  })
     }
//获取版本生效中下拉列表数据
    getTableSelectListData(insuranceId:number){
     	this.versionEffectService.getTableSelectListData(insuranceId)
     	  .then(res=>{
     	  	 if(res.code==200){
     	  	 	if(res.data.length!=0){
     	  	 		this.selectList = res.data;
		     	  	this.name = this.selectList[this.activeIdx].name;
		     	  	this.id = this.selectList[this.activeIdx].id;
     	  	 	}else{
     	  	 		this.selectList = [];
//   	  	 		this.isDialogShow=true;
     	  	 	}
     	  	 }
     	  })
    }
//select中的change事件
    optionClick($event){
    	console.log($event);
     	this.id = this.selectList[this.activeIdx].id;	
     	this.name = this.selectList[this.activeIdx].name;
    }
//立即生效 取消
    calcel(){
    	this.isSuggestion=false;
    	this.isDialogPlugin = true;
    	this.dialogPlugin.myModule();
    }
//立即生效 确认
    sure(){
   		this.effectiveTimeDetail.activeMode = 1;
   		this.effectiveTimeDetail.insuranceId = this.insuranceId;// 保险ID
     	this.effectiveTimeDetail.ruleVersion = this.id;// 规则版本ID
		this.getTableData(this.insuranceId);  
   		this.versionEffectService.getTimeData(this.effectiveTimeDetail)
     	   .then(res=>{
	     	   	if(res.code==200){
	 	   			this.isSuggestion=false;
			    	this.isDialogPlugin = true;
			    	this.isTiming = false;
			    	this.dialogPlugin.onClose(); 
	     	  	    this.getTableData(this.insuranceId);
	     	   	 }
     	   })
    }
//定时生效  提示框取消
	calcelTime(){
		this.isSuggestion=false;
    	this.isDialogPlugin = true;
    	this.isTiming = false;
    	this.dialogPlugin.myModule();
	}
//定时生效  提示框确定
   sureTime(){
		this.effectiveTimeDetail.insuranceId = this.insuranceId;// 保险ID
     	this.effectiveTimeDetail.ruleVersion = this.id;// 规则版本ID
 		this.effectiveTimeDetail.activeMode = 2;
 		this.gmtCreate = this.effectiveTimeDetail.gmtCreate;
 		this.gmtModified = this.effectiveTimeDetail.gmtModified;
		//时间什么没填报错 
 		if ( !this.checkUserInfoRequired(this.handleType) ) {
             return;
        }
		//定时生效中选定的时间                                 
        this.info = this.currentTime.year+'-'+this.currentTime.month+'-'+this.currentTime.day;
		this.day = this.info + " "+ "02" + ":" + "00" + ":" + "00";
        this.effectiveTimeDetail.activeDate = this.day;
        this.getTableData(this.insuranceId);  
     	this.versionEffectService.getTimeData(this.effectiveTimeDetail)
     	   .then(res=>{
     	   	   if(res.code == 200){
	     	   	   	   this.isTextShow = false;	
	     	   	   	   this.isTiming=false;
	     	   	   	   this.isDialogPlugin=false;
	     	   	   	   this.dialogPlugin.tip("保存成功",null,'success');
	     	   	   	   this.dialogPlugin.onClose(); 
	     	   	   	   this.getTableData(this.insuranceId);  
	     	   	   	   this.getShowData(this.insuranceId);//获取id的接口
	     	   	   	   this.isShow = true;
     	   	   }else{
     	   	   	   this.isTiming=true;
	     	   	   this.isDialogPlugin=false;
     	   	   }
     	   })
   }
//点击取消按钮的时候,修改字样出现
     calceldata(){
     	    this.isTextShow = true;     	
	   	    this.effectiveTimeDetail.insuranceId = this.insuranceId;// 保险ID
	     	this.effectiveTimeDetail.ruleVersion = this.id;// 规则版本ID
	 		this.effectiveTimeDetail.activeMode = 2;
	 		this.effectiveTimeDetail.id = this.rvId;
	 		this.gmtCreate = this.effectiveTimeDetail.gmtCreate;
	 		this.gmtModified = this.effectiveTimeDetail.gmtModified;
	 		this.effectiveTimeDetail.isActive = 2;
			//定时生效中选定的时间                                 
	        this.getTableData(this.insuranceId);   
	   	    this.versionEffectService.del(this.effectiveTimeDetail)
	   	    .then(res=>{
	   	    	if(res.code==200){
	   	    		this.isShow = false;
	   	    	}
	   	    })
     }
//点击取消,调用接口,删除当前正在生效的数据
   delActiveData(){
   	    this.effectiveTimeDetail.insuranceId = this.insuranceId;// 保险ID
     	this.effectiveTimeDetail.ruleVersion = this.id;// 规则版本ID
 		this.effectiveTimeDetail.activeMode = 2;
 		this.gmtCreate = this.effectiveTimeDetail.gmtCreate;
 		this.gmtModified = this.effectiveTimeDetail.gmtModified;
 		this.effectiveTimeDetail.isActive = 2;
		//定时生效中选定的时间                                 
        this.info = this.currentTime.year+'-'+this.currentTime.month+'-'+this.currentTime.day;
		this.day = this.info + " "+ "02" + ":" + "00" + ":" + "00";
        this.effectiveTimeDetail.activeDate = this.day;
        this.getTableData(this.insuranceId);   
   	    this.versionEffectService.del(this.effectiveTimeDetail)
   	    .then(res=>{
   	    	if(res.code==200){
   	    		this.isShow = false;
   	    	}
   	    })
   }    
//点击保存按钮   版本生效设置对象ID 
     sureVersion():void{
     	if(this.cateType.activeMode == 2){ 
     		if ( !this.checkUserInfoRequired(this.handleType) ) {
	             return;
	        }
    		this.isTiming = true;
    		this.isDialogPlugin=false;
  	    	this.isSuggestion=false;
    		this.dialogPlugin.myModule();
    		this.info = this.currentTime.year+'-'+this.currentTime.month+'-'+this.currentTime.day;
    	}else if(this.cateType.activeMode == 1){
  	    	this.isDialogPlugin=false;
  	    	this.isSuggestion=true;
  	    	this.isTiming = false;
  	    	this.dialogPlugin.myModule();
    	} 
     }
//验证提交信息必填项是否完整  点击保存按钮
	private checkUserInfoRequired(handleType: string) : boolean {
//		if (!this.rvName){
//			this.dialogPlugin.tip("用户名不能为空!");
//			return false;
//		}
		if (!this.currentTime){
			this.dialogPlugin.tip("时间不能为空!");
			return false;
		}
		return true;
	} 
//点击修改数据
    modification(){
		if(this.selectList.length!=0){
			this.dialogPlugin.myModule();
			this.isDialogPlugin = true;
			this.isSuggestion=false;
			this.isTiming=false;
			this.isDialogShow=false;
		}else if(this.selectList.length==0){
			this.dialogPlugin.myModule();
			this.isDialogPlugin = false;
			this.isSuggestion=false;
			this.isTiming=false;
			this.isDialogShow=true;
		}
		this.cateType.activeMode == 1;
    } 
// 提示框取消   
    sureAddVersion(){
		this.isDialogPlugin = false;
		this.isSuggestion=false;
		this.isTiming=false;
		this.isDialogShow=false;
		this.dialogPlugin.onClose(); 
    }
    /**
 * 时间控件参数
 */
	minStartDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
	maxEndDate: any;
	minEndDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1};        //设定药品核准时间的最大值为今天string;	
	objToDate(oriDate: any) {
        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
        return dateStr;
    }
	setStrartInterval($event: any){
		if($event){
			this.minStartDate = $event;
		}else{
			this.minStartDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
		}
	}
	startIns: any;
	endIns: any;
	toggleEnd(timeIns: any){
		timeIns.toggle();
		if(timeIns.isOpen()){
			this.endIns = timeIns;
		}else{
			this.endIns = null;
		}
	}
	@HostListener('document:click',[])
		onDocumnentClick(){
			if(this.endIns){
				this.endIns.close();
				this.endIns = null;
			}
	 	}
}
