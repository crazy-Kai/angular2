/*
  time:2017-3-15,
  author:吴凯
  responsible:王宏
 */

import { Component,OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import {OrganizationBasicInformationService} from './basicInformationOrignization.service';
import { DialogPlugin, DialogModel } from '../common/ug-dialog/dialog';
import {RightSearchDetail,SaveOriganizationDetail,OfficeList} from './dataList';//右边搜索框的数据
import {IosScollerFn} from '../common/table_width';//兼容IOS表格的滚动条宽度的方法
@Component({
	selector:'basicInformationOrignization',
	templateUrl:'basicInformationOrignization.component.html',
	styleUrls:['basicInformationOrignization.component.css'],
	providers:[OrganizationBasicInformationService]
})
export class BasicInformationOrganizationComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	private iosScollerFn:IosScollerFn = new IosScollerFn();//兼容IOS表格的滚动条宽度的方法
	private selectedProductList:any;//用来控制当前点击的那个的颜色变化
	private selectedProductListRight:any;//用来控制当前点击的那个的颜色变化
  hospitalInfo:any;
	searchWord:string="";//左边的搜索条件  
  officeInfo:any; 
  rightSearchWord:string;//右边的搜索词语   	
	rightSearchDetail:RightSearchDetail = new RightSearchDetail();//右边搜索框需要是数据
	giveOffice:any[]=[]; //用数组来接收右边初始数据(模板)
  isRightStatus:boolean=false;//右边是否有打开的开关
	itemListData:any=[];//机构基本设置中保存按钮
	itemList:any=[];//往后台传参的数组
	hospitalId:any;//医院id
	hospitalCode:string;//医院代码
	hospitalName:any;//医院名字,医院跟科室共用
	index:any = 0;//当前选中的机构所在数组的下标
	isShowTable:boolean = false;//初始化默认隐藏机构名称和医院
	constructor(
		private organizationBasicInformationService:OrganizationBasicInformationService,
		private router: Router,
		private route: ActivatedRoute,
		private activeRouter: ActivatedRoute
	) {}
    ngOnInit() { 
    	this.iosScollerFn.fn();//兼容IOS表格的滚动条宽度的方法
        this.getAllhospitalData();//查询出所有医院    
    }
//键盘回车事件
    onEnterData($event){
    	this.search();
    }
//左边的模糊查询搜索
    search(){
    this.isShowTable = false;
    this.index = 0;
		this.getSelectData(this.searchWord)
		this.clear();
    this.officeInfo = null;
    this.selectedProductList=null;
		
	}
//机构名称进行模糊查询    
   getSelectData(hospitalName:string){
   	  this.organizationBasicInformationService.getSelectData(hospitalName)
   	    .then(res=>{
            if(res.code ==200){
              	if(res.data.length!=0){
            		   this.getAllDataFn.call(this,res.data); 
              	}else{
                  this.isShowTable = true;
              		this.hospitalInfo = [];
                  this.officeInfo = [];
              	}
            }
   	    })
   }
//查询出所有医院和科室数据   
  getAllhospitalData(){
  	this.organizationBasicInformationService.getAllhospital()
	  	 .then(res=>{ 
	  	 	if(res.code ==200){
	  	 		if(res.data.length!=0){
              this.getAllDataFn.call(this,res.data);  
	  	 		}
	  	 	}else{
	  	 		
	  	 		 this.hospitalInfo = [];
           this.officeInfo = [];
	  	 	}
  	 })
  }
  /*查询出右边所有科室的方法*/
  getAllDataFn(data){
      this.hospitalId = data[0].hospitalId;
      this.hospitalCode = data[0].hospitalCode;
      this.hospitalName = data[0].hospitalName;
      this.hospitalInfo = data;
      this.getOfficeData(this.hospitalId,this.hospitalCode);
      this.selectedProductList = this.hospitalInfo[0];
  }
//跟新左边机构和右边科室的方法
  updateAllDataFn(index?:any,leftFlag?:any,item?:any,getOfficeData?:any){
  	this.organizationBasicInformationService.getAllhospital()
	  	 .then(res=>{ 
	  	 	if(res.code ==200){
           this.isShowTable  = true;
           console.log(this.isShowTable)
	  	 		if(res.data.length!=0){
             let hospitalIndex:any;//左边数据在整个数据中的下标
                /*这里的index是当前选中为切换前机构所在数据的下标*/
                for(let k = 0; k<res.data.length;k++){
                  if(res.data[k].interveneId == this.hospitalInfo[this.index].interveneId){
                    console.log(res.data[k].interveneId,this.hospitalInfo[this.index].interveneId)
                      hospitalIndex = k;
                      break;
                  }
                }
                if(hospitalIndex != undefined){
                      /*重新获取机构数据只改变当前操作后更新的机构的数据，而不是更新所有机构*/
                      this.hospitalInfo[this.index].enable = res.data[hospitalIndex].enable;
                }
                /*这里的index 保存操作后切换机构后新的机构所在数组中的下标*/
                if(index != undefined){
                  this.index = index;
                }
				       /*使切换后的机构显示选中状态*/
					     this.selectedProductList = this.hospitalInfo[this.index];
               /*切换机构时，如果用户直接控制左边的医院的干预按钮且点击取消按钮则要重新获取左边医院的数据，且更新右侧科室的数据*/
               if(leftFlag == true && item != undefined){
                  this.justSwitch.call(this,item)
               }else if( getOfficeData == true ) {
                //点击保存按钮没有点取消，
                  //更新右侧科室数据
                  this.getOfficeData.call(this,this.hospitalId,this.hospitalCode);
               }
	  	 		}
	  	 	}
  	 })
  }
//全闭
  open(item,i){
  	 if(item.hospitalId == this.hospitalId){
         item.enable=0;
         for(let i of this.officeInfo){
	  			i.enable=0;
	  	 }
     }
  }
//全开
  close(item,i){
    if(item.hospitalId == this.hospitalId){
    	item.enable=1;
    	for(let i of this.officeInfo){
	  		i.enable=1;
	  	}
    }
  }
 
  /*只切换机构*/
  justSwitch(item,i?:any){
        if(i != undefined){
            this.index = i;
            this.selectedProductList = item;
        }
          //清除右边科室的所有搜索条件
          this.clear();
          this.hospitalId = item.hospitalId;
          this.hospitalCode = item.hospitalCode;
          this.hospitalName = item.hospitalName;
          this.getOfficeData(this.hospitalId,this.hospitalCode);
  }
//点击左边不同的医院
    choose(item,i){
        console.log(this.index , i)
        if(this.index != i){
            this.compareData.call(this);
            if(this.itemList.length == 0){
              this.justSwitch.call(this,item,i)
            }else{
                  this.dialogPlugin.confirm('当前机构的操作已发生改变，请问是否保存此操作？', () => {
                       this.clear();
                      /*这里点击保存切换了机构所以要用item 参数来获取右边的机构*/
                       this.postSaveData.call(this,i,item,true);
                       /*点击取消按钮为防止用户直接点左侧开关，就重新获取了医院和科室的数据，用参数true和item 来识别*/
                      }, () => { this.updateAllDataFn.call(this,i,true,item)},null,'如不保存，切换机构后此操作将被重置')
                  
            }
        
        }
    }
//根据医院ID查询科室 
   getOfficeData(hospitalId:number,hospitalCode:string):void{
   	  this.organizationBasicInformationService.getOfficeData(hospitalId,hospitalCode)
   	    .then(res=>{
            //左边的开关默认状态由enable控制,0是关闭,1是开启
   	    	if(res.code==200){
            //成功之后显示机构和医院的所有数据
            this.isShowTable = true;
   	    		if(res.data.length !=0){
   	    			this.giveOffice=[];
   	    			for(let i of res.data){
   	    				let officeData = new OfficeList();
   	    				officeData.enable = i.enable;
   	    				officeData.interveneId = i.interveneId;
		   	    		this.giveOffice.push(officeData);
		   	    	}
   	    			this.officeInfo = res.data;
   	    		}else{
            		this.officeInfo = [];
            	}
   	    	}
   		})    	       
	}
//打开状态下点击事件
   officeOpen(item,i){
   	  item.enable = 0;
   }
//关闭状态下的点击事件
   officeClose(item,i){
   	  item.enable = 1;
   }
//右边的模糊搜索按钮 
	rightSearch(data:any){
    this.isShowTable = false;
    if(!this.hospitalInfo.length){
     
        this.rightSearchDetail.hospitalId  = this.hospitalId = null;
        this.rightSearchDetail.hospitalCode  = this.hospitalCode = null;
    }else{
        this.rightSearchDetail.hospitalId  = this.hospitalId;
	      this.rightSearchDetail.hospitalCode  = this.hospitalCode;
    }

    this.organizationBasicInformationService.getsearchdata(this.rightSearchDetail.hospitalId,this.rightSearchDetail.hospitalCode,this.rightSearchDetail.isIntervene,this.rightSearchDetail.orgType,this.rightSearchDetail.orgName)
     .then(res=>{
     	  if(res.code==200){
     	  	if(res.data.length!=0){
              //搜索时如果左边机构控制右边科室的医保干预的值而没有点保存，那么要重新获取左边机构的数据
              //右边搜索科室的时候不需要重新获取所有科室，所以以下方法不用传任何参数
              this.updateAllDataFn();
		   	    	this.officeInfo = res.data;
             
     	  	}else{
            this.isShowTable = true;
     	  		this.officeInfo=[]
     	  	}
     	  }
 	  })
	}  
  /*比较右边的数据*/
  compareData(){
      this.itemListData=[];
      this.itemList=[];
      console.log(this.giveOffice,this.officeInfo)
      if(this.giveOffice.length){
        for(let data of this.officeInfo){
          for(let item of this.giveOffice){
            if(data.interveneId == item.interveneId && data.enable != item.enable){
              this.itemListData.push(data);
            }
          }
        }
        if(this.itemListData.length){
            for(let item of this.itemListData){
              let saveOriganizationDetail:SaveOriganizationDetail = new SaveOriganizationDetail();
                  saveOriganizationDetail.id = item.interveneId;//机构干预配置ID
                saveOriganizationDetail.gmtCreate = item.gmtCreate;
                saveOriganizationDetail.gmtModified = item.gmtModified;
                saveOriganizationDetail.hospital = this.hospitalCode;//医院代码
                saveOriganizationDetail.department = item.orgCode;//科室代码
                saveOriganizationDetail.enable = item.enable; //是否开启医保干预1,开启 0,关闭
                this.itemList.push(saveOriganizationDetail);
            }
        }
      }
      
  }
//机构基本设置中保存按钮
     saveOriganization(){    
        this.compareData.call(this);
       	if(this.itemList.length==0){
  			   		this.dialogPlugin.tip("干预未修改",null,'error');
  			   		return ;
       	}
        /*这里点击保存按钮不需要切换机构不要item参数*/
        this.postSaveData.call(this,null,null,true)
     }
     /*点击保存发送数据给后端*/
     postSaveData(index?:any,item?:any,officeData?:any){
        let info :any = {};
        info['list'] = this.itemList;
        this.organizationBasicInformationService.getOriganizationData(info)
        .then(res=>{
             if(res.code==200){
                if(item){
                  this.hospitalId = item.hospitalId;
                  this.hospitalCode = item.hospitalCode;
                }
                this.updateAllDataFn(index,null,null,officeData);
                this.dialogPlugin.tip(res.message,null,'success');
             }
        })
     }

    //清除右边搜索条件
     clear(){
     	this.rightSearchDetail.isIntervene = "";
    	this.rightSearchDetail.orgType = "";
    	this.rightSearchDetail.orgName = "";
    	this.hospitalName = "";
     }    
}

