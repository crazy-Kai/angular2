/*
  time:2017-3-15,
  author:王宏
  responsible:王宏
 */
import { Component, OnInit, Input, Output, EventEmitter, HostListener, Renderer,ViewChild,Inject} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DialogPlugin, DialogModel } from '../common/ug-dialog/dialog';//引入插件
import {AddGroupDetail,AddGroupNurseDetail,SelectData} from './addGroupsData';//保存信息中传输的数据
import {WaringInformationService} from './warning-information.service';//服务
@Component({
	selector: 'warning-information',
	templateUrl:'warning-information.component.html',
	styleUrls:['warning-information.component.css'],
	providers:[WaringInformationService]
})
export class WarningInformationComponent implements OnInit {
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;//对话框
/*变量*/
    /*医生端*/
	  private addGroupList:any =[];//push数据的  医生端
	  D:any = 'D';//医生端
	  private isDoctorcontentShow:boolean=true;//判断医生端出现,没有数据的时候,隐藏,有数据显示出来
    private isAnalysisBoxShow:boolean=true;//控制医生端就诊来源
    doctorType:boolean=true;//医生标志   添加组合的时候和保存的时候,如果那五个选择中有其中某一个没填,则提示报错   医生端
    AtPrentId:any;//医生端  删除的那个id
		doctorI:any;//医生端  删除当条数据的索引
		isDoctorShow:boolean=false;//医生端删除对话框出现
		addlevel:any;//医生端警示等级    判断选中把数据存起来
		addType:any;//医生端规则类型   判断选中把数据存起来
		addSource:any;//医生端所有来源    判断选中把数据存起来
		addSourceValue:any =[];/*医生端所有来源    判断选中把数据存起来*/
		addLevelValue:any = [];
	  doctorTypeValue:any=[];/*医生端规则类型    判断选中把数据存起来*/
		rulesTypeSplit:any;//规则类型 医生端  做对比的
		sourcedataSplit:any;//就诊来源 医生端 做对比的
		levelDataSplit:any;//警示等级 医生端 做对比的
	  arrayDtaconten:any;//就诊来源 医生端  做对比的
	  levelwaringGroup:any;//警示等级 医生端  做对比的
	  rulesTypeContent:any;//规则类型 医生端   做对比的
    /*护士端*/
		private addGroupNurselist:any=[];//添加组合 护士端
		N:any = 'N';//护士端
		private isNursecontentShow:boolean=true;//护士端出现,没有数据的时候,隐藏,有数据显示出来
		nurseType:boolean=true;//护士标志	添加组合的时候和保存的时候,如果那五个选择中有其中某一个没填,则提示报错   护士端
		addNurseDataGroup:any;//警示等级 护士端  做对比的
	  nurseArrayDtaconten:any;//就诊来源 护士端   做对比的
	  NurseRulesTypeContent:any; //规则类型  护士端   做对比的
	  NurseRulesTypeSplit:any;//规则类型  护士端 做对比的
		nurseSourcedataSplit:any;//就诊来源 护士端 做对比的
		nurselevelDataSplit:any; //警示等级 护士端 做对比的
		AtPrentIdnurse:any;//护士端  当前 删除  的那个 id
		isNurseShow:boolean=false;//护士端   删除对话框出现
		AtPrentIdnurseI:any;//护士端 删除当条数据的索引
		addNurseType:any=[];//护士端添加组合  规则类型
		addNurseLevel:any=[];//护士端添加组合 警示等级
		nurseSourceValue:any=[];/*护士端所有来源    判断选中把数据存起来*/
		nurseTypeValue:any=[];/*护士端规则类型    判断选中把数据存起来*/
		addNurselevel:any;//护士端警示等级    判断选中把数据存起来
		addNurseTypeData:any;//护士端规则类型    判断选中把数据存起来
		addNurseSource:any;//护士端所有来源    判断选中把数据存起来
	    /*其他的*/
		insuranceId:any;//险种请求返回的保险ID
		versionName:any;//当前版本名字
		combineData:any = [];//最后保存的时候,合并两个数组的数据
		contentData:any;//保存医生端和护士端总的数据  初始化的时候
		docutorListsource:any;//医生端来存就诊来源 规则类型中文的变量
		nurseListSource:any;//护士端来存就诊来源 规则类型中文的变量
		
/*初始化发送获取险种请求*/
	private insuranceTypeOption : any = {
		width:'100%',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/insurance'
	};	
//切换险种   下拉列表查询数据
	chooseInsurance($event){
		 if($event){
			  this.insuranceId = $event.id;//险种id
	    	this.versionName = $event.name; // 当前版本名称 
	    	if(this.insuranceId){
	    		 this.getWaringDataList(this.insuranceId);
	    	}
	    	this.nurseType = true;
			  this.doctorType = true;
		  }
    }
/*构造函数*/	
	constructor( 
		private waringInformationService:WaringInformationService,
		private router: Router,
        private route: ActivatedRoute,
        private activeRouter: ActivatedRoute,
        private renderer: Renderer
	) {
		renderer.listenGlobal('document','click',($event)=>{
			if($event.target.className != 'audit-plan-dept-select'){
				this.closeDocument();/*点击全局document的时候,需要关闭此打开的对象*/
			}
		});
	}
/*点击全局document的时候,需要关闭此打开的对象*/
		closeDocument(){
				for(let i =0;i<this.addGroupList.length;i++){
		        this.addGroupList[i].isAnalysisBoxShow = false;
		        this.addGroupList[i].isRuleTypeShow = false;
		        this.addGroupList[i].isLeveShow = false;
		        delete this.addGroupList[i].isAnalysisBoxShow;
		        delete this.addGroupList[i].isRuleTypeShow;
		        delete this.addGroupList[i].isLeveShow;
		    }
		    for(let i =0;i<this.addGroupNurselist.length;i++){
		        this.addGroupNurselist[i].isNurseBoxShow = false;
		        this.addGroupNurselist[i].isNurseTypeShow = false;
		        this.addGroupNurselist[i].isNurseLenverShow = false;
		        delete this.addGroupNurselist[i].isNurseBoxShow;
		        delete this.addGroupNurselist[i].isNurseTypeShow;
		        delete this.addGroupNurselist[i].isNurseLenverShow;
		    }
		}
/*初始化*/
    ngOnInit(){}
//获取所有警示方式  需要展示在页面上的数据  后端返回的数据
		getWaringDataList(insuranceId:number):void{
			 this.waringInformationService.getWaringData(insuranceId)
			   .then(res=>{
			   	  console.log(res);
			 	   if(res.code==200){
			 		     if(res.data.length!=0){
							 			/*清空组合数组*/
							 			this.addGroupList = [];
							 			this.addGroupNurselist = [];
							 			/*重新更新数据源*/
							 			this.contentData = res.data;
							 			for(let i=0;i<this.contentData.length;i++){
							            /*医生端*/
											 		if(this.contentData[i].category==this.D){
							 								this.addGroupList.push(this.contentData[i]);/*医生端数据*/
							 								this.getDoctorData();/*后端给我返回的数字,转化成中文显示在页面上*/
									            /*循环后端给我返回的数据  和现在的数据做对比*/
									            this.comparisonDoctoryLevelData()//警示等级  所有来源 规则类型 做对比
									            this.isDoctorcontentShow = true; /*有数据,和没数据,展示状态*/  
											 		}
										 		  /*护士端数据*/
											 		if(this.contentData[i].category==this.N){
											 			 	 this.addGroupNurselist.push(this.contentData[i]);/*护士端数据*/
											 				 this.getNurseData();/*后端给我返回的数字,转化成中文显示在页面上*/
											 			   /*循环后端给我返回的数据  和现在的数据做对比,如果相等,就默认被勾上*/
											 		     this.comparisonNurseLevelData() //警示等级 所有来源 规则类型   做对比
											 		     this.isNursecontentShow = true; /*有数据,和没数据,展示状态*/  
											 		}
											 		/*根据医生端数组长度来判断是否显示与隐藏*/ 
													if(this.addGroupList.length != 0){
													 	   this.isDoctorcontentShow = true;
												  }else{
													     this.isDoctorcontentShow = false;
												  }
											 		/*根据护士端数组的长度来判断空间是否存在*/
											 		if(this.addGroupNurselist.length != 0){
											 			   this.isNursecontentShow = true;
											 		}else{
											 			   this.isNursecontentShow = false;
											 		}
							 	   }
			 		}else{
				 			 this.addGroupList = [];
				 			 this.addGroupNurselist=[];
				 			 this.isNursecontentShow = false;
				 			 this.isDoctorcontentShow = false; 
			 		}
			 	}
			})
	}
/*固定数据,医生端和护士端固定不变的数据*/
    getSelectData(obejct,value1?:any,value2?:any,value3?:any){
			 obejct[value1]=[new SelectData('全部',0),new SelectData('门诊',1),new SelectData('住院',2)];
			 obejct[value2]=[new SelectData('全部',0),new SelectData('项目规则',1),new SelectData('材料规则',2),new SelectData('疾病规则',3),new SelectData('药物规则',4),new SelectData('就诊规则',5)];
			 obejct[value3]=[new SelectData('全部',-1),new SelectData('0',0),new SelectData('1',1),new SelectData('2',2),new SelectData('3',3),new SelectData('4',4),new SelectData('5',5),new SelectData('6',6),new SelectData('7',7),new SelectData('8',8),new SelectData('9',9)];
	  }
/*护士端   后端给我返回的数字,转化成中文显示在页面上*/	
	getNurseData(){
			for(let i=0;i<this.addGroupNurselist.length;i++){
				/*固定值*/
				this.getSelectData.call(this,this.addGroupNurselist[i],'nurseListContent','nurseTypeContent','nurselevelContent');
				/*医生端和护士端   后端给我返回的数字,转化成中文显示在页面上*/		
				this.JudgeContenData.call(this,this.addGroupNurselist[i],'isNurseBoxShow','isNurseTypeShow','isNurseLenverShow','nurseSourceData','sarrSource','source','nurseTypeData','sarrType','ruleType');
			}
	}	
/*医生端   后端给我返回的数字,转化成中文显示在页面上*/	
	getDoctorData(){
			for(let i=0;i<this.addGroupList.length;i++){
	      /*固定值*/
	      this.getSelectData.call(this,this.addGroupList[i],'doctoryListContent','doctorTypeContent','doctorlevelContent');
	      /*医生端和护士端   后端给我返回的数字,转化成中文显示在页面上*/		
	      this.JudgeContenData.call(this,this.addGroupList[i],'isAnalysisBoxShow','isRuleTypeShow','isLeveShow','sourceData','sarrSource','source','typeData','sarrType','ruleType');
			}
	}
/*医生端和护士端   后端给我返回的数字,转化成中文显示在页面上*/		
	JudgeContenData(Object,value1?:any,value2?:any,value3?:any,value4?:any,value5?:any,value6?:any,value7?:any,value8?:any,value9?:any){
			  /*变量*/
			  Object[value1] = false;
			  Object[value2] = false;
			  Object[value3] = false;
			  /*就诊来源*/
			  Object[value4] = '';
			  value5 = [];
			  if(Object[value6].indexOf("1") > -1) value5.push("门诊")
			  if(Object[value6].indexOf("2") > -1) value5.push("住院")
			  Object[value4] = value5.join(",");
		    /*规则类型*/
			  Object[value7] = '';
			  value8 = [];
			  if(Object[value9].indexOf("1") > -1) value8.push("项目规则")
			  if(Object[value9].indexOf("2") > -1) value8.push("材料规则")
			  if(Object[value9].indexOf("3") > -1) value8.push("疾病规则")
			  if(Object[value9].indexOf("4") > -1) value8.push("药物规则")
			  if(Object[value9].indexOf("5") > -1) value8.push("就诊规则")
			  Object[value7] = value8.join(",");
	}
/*护士端 医生端  数据  最后点击保存的时候,要加一些变量 并 删除  封装的一个函数,最后用另一个函数来调用他*/     
    deleteDataContent(Object,value1?:any,value2?:any,value3?:any,value4?:any,value5?:any,value6?:any,value7?:any,value8?:any,value9?:any,value10?:any){
         	delete Object[value1];
         	delete Object[value2];
         	delete Object[value3];
         	delete Object[value4];
         	delete Object[value5];
         	delete Object[value6];
         	delete Object[value7];
         	delete Object[value8];
         	delete Object[value9];
         	delete Object[value10];
    }
/*护士端和护士端 数据   最后点击保存的时候,要加一些变量 并 删除*/  
    deleteNurseData(){
    	for(let i=0;i<this.addGroupNurselist.length;i++){
    		   this.deleteDataContent.call(this,this.addGroupNurselist[i],'gmtCreate','gmtModified','isNurseBoxShow','isNurseTypeShow','isNurseLenverShow','nurseListContent','nurseTypeContent','nurselevelContent','nurseSourceData','nurseTypeData');
      }
    	for(let i=0;i<this.addGroupList.length;i++){
    		   this.deleteDataContent.call(this,this.addGroupList[i],'gmtCreate','gmtModified','isAnalysisBoxShow','isLeveShow','isRuleTypeShow','doctoryListContent','doctorTypeContent','doctorlevelContent','sourceData','typeData');
    	}
    }   
/*最后点击保存按钮*/
    WarimgSave():void { 
				this.checkUserNurseRequired();/*护士端什么没填报错  五个值中有一个没填,提示报错 */
				this.checkUserInfoRequired();/*医生端五个值中有一个没填,提示报错 */
				if(this.doctorType && this.nurseType){
					  let info :any = {};	
				    this.deleteNurseData();/*护士端和护士端数据  保存的时候,要加一些变脸删除*/ 
			      this.combineData = this.addGroupList.concat(this.addGroupNurselist);/*医生端和护士端两者合并一起传给后端*/
			      info['list'] = this.combineData; 
					  this.waringInformationService.addWaringData(info)
						    .then(res=>{
						    	  console.log(res);
						   	    if(res.code==200){
							   	    	if(info.list.length!=0){
							   	    		this.dialogPlugin.tip(res.message,null,'success');
							   	    		if(this.insuranceId){
					    						   this.getWaringDataList(this.insuranceId);
					    					  }
						   	    	  }
						   	    }
						    })
				}
	  }	
/*医生端添加组合 */
    addGroupDetails(){
	    	this.isDoctorcontentShow = true;
	    	let i = document.getElementById("doctorScrollBox");
			  this.checkUserInfoRequired();//医生端什么没填报错 
			  if(this.doctorType){
						let addGroupDetailObject :AddGroupDetail = new AddGroupDetail(),
		       	addData:any = addGroupDetailObject;
		       	addData.insuranceId = this.insuranceId;
	    		  this.addGroupList.push(addData);
	    		  console.log(this.addGroupList,'医生端添加组合');
						if(i){
				        i.scrollTop = i.scrollHeight + 501;
						}
			  }
    }
/*护士端添加组合*/
    addGroupsNurse(){
	    	let i = document.getElementById("nueseScrollBox");
	    	this.isNursecontentShow = true;
			  this.checkUserNurseRequired();//护士端什么没填报错 
			  if(this.nurseType){
					 	let addGroupNurseDetailObject :AddGroupNurseDetail = new AddGroupNurseDetail(),
			   		addData:any = addGroupNurseDetailObject;
			   		addData.insuranceId = this.insuranceId;
			  		this.addGroupNurselist.push(addData);
			  		console.log(this.addGroupNurselist);
			  		if(i){
				           i.scrollTop = i.scrollHeight;
						}
			  }
    }   
/*医生端和护士端   循环后端给我返回的数据  和现在的数据做对比	如果数据和表格中那五个数据相等,则默认被勾上   总的函数*/
    comparisonData(Object,value1?:any,value2?:any,value3?:any,value4?:any){
    	  value1 = Object[value2].split(",");
    	  value3 = Object[value4];
    	  for(let i=0;i<value1.length;i++){
    	  	 for(let k=1;k<value3.length;k++){
    	  	 	   if(value1[i]==value3[k].name){
    	  	 	   	   value3[k].check = true;
    	  	 	   }
    	  	 	   if(value3.length==3){
	    	  	 	   	 if(value1[0]==value3[1].name&&value1[1]==value3[2].name){
		    	  	 	   	   value3[0].check = true;
		    	  	 	   }
    	  	 	   }else if(value3.length==11){
	    	  	 	   	 if(value1[0]==value3[1].name&&value1[1]==value3[2].name&&value1[2]==value3[3].name&&value1[3]==value3[4].name&&value1[4]==value3[5].name
	    	  	 	   	    &&value1[5]==value3[6].name&&value1[6]==value3[7].name&&value1[7]==value3[8].name&&value1[8]==value3[9].name){
		    	  	 	   	   value3[0].check = true;
		    	  	 	   }
    	  	 	   }else if(value3.length==6){
	    	  	 	   	 if(value1[0]==value3[1].name&&value1[1]==value3[2].name&&value1[2]==value3[3].name&&value1[3]==value3[4].name&&value1[4]==value3[5].name){
		    	  	 	   	   value3[0].check = true;
		    	  	 	   }
    	  	 	   }
    	  	 }
    	  }
    }
/*医生端  循环后端给我返回的数据  和现在的数据做对比	如果数据和表格中那五个数据相等,则默认被勾上  医生端*/
    comparisonDoctoryLevelData(){
    	for(let j=0;j<this.addGroupList.length;j++){
    		  this.comparisonData.call(this,this.addGroupList[j],'levelDataSplit','level','levelwaringGroup','doctorlevelContent');/*警示等级 医生端 */
    		  this.comparisonData.call(this,this.addGroupList[j],'rulesTypeSplit','typeData','rulesTypeContent','doctorTypeContent'); /*规则类型 医生端*/
    		  this.comparisonData.call(this,this.addGroupList[j],'sourcedataSplit','sourceData','arrayDtaconten','doctoryListContent');/*就诊来源 医生端*/
       }    
    }
/*护士端  循环后端给我返回的数据  和现在的数据做对比	如果数据和表格中那五个数据相等,则默认被勾上  医生端*/
    comparisonNurseLevelData(){
    	for(let j=0;j<this.addGroupNurselist.length;j++){
    		  this.comparisonData.call(this,this.addGroupNurselist[j],'nurselevelDataSplit','level','addNurseDataGroup','nurselevelContent');/*警示等级 护士端*/
    		  this.comparisonData.call(this,this.addGroupNurselist[j],'NurseRulesTypeSplit','nurseTypeData','NurseRulesTypeContent','nurseTypeContent');/*规则类型  护士端*/
    		  this.comparisonData.call(this,this.addGroupNurselist[j],'nurseSourcedataSplit','nurseSourceData','nurseArrayDtaconten','nurseListContent');/*就诊来源 护士端*/
      }    
    }  
 /*点击上面的div,下面的固定数据显示处理*/
    checkData($event,Object,value1?:any,value2?:any,value3?:any){
    	  $event.stopPropagation();
    	  Object[value1] = true;
    	  Object[value2] = false;
    	  Object[value3] = false;
    }
/*给他本身点击,当前阻止冒泡  并显示出来*/ 
     saveData($event,Object,value1?:any){
     	  $event.stopPropagation();
     	  Object[value1] = true;
     }
/*医生端  就诊来源 规则类型 警示等级  点击上面的div,下面的固定数据显示处理  给他本身点击,当前阻止冒泡  并显示出来*/     
    checkboxData($event,i,value):void{
        this.checkData.call(this,$event,this.addGroupList[i],'isAnalysisBoxShow','isRuleTypeShow','isLeveShow');/*医生端就诊来源  点击上面的div,下面的固定数据显示处理*/
    }
    savecontent($event,i,value){
        this.saveData.call(this,$event,this.addGroupList[i],'isAnalysisBoxShow');/*医生端就诊来源  给他本身点击,当前阻止冒泡  并显示出来*/    
    }  
		checkboxData1($event,i,value):void{
			  this.checkData.call(this,$event,this.addGroupList[i],'isRuleTypeShow','isAnalysisBoxShow','isLeveShow');/*医生端 规则类型   点击上面的div,下面的固定数据显示出来*/
		}
	  savecontent1($event,i):void{
	    	this.saveData.call(this,$event,this.addGroupList[i],'isRuleTypeShow');/*医生端 规则类型  点击他自己本身,阻止冒泡,并显示出来*/		
	  }
		checkboxData2($event,i,value):void{
			  this.checkData.call(this,$event,this.addGroupList[i],'isLeveShow','isAnalysisBoxShow','isRuleTypeShow');/*医生端 警示等级*/
		}
	  savecontent2($event,i):void{
	    	this.saveData.call(this,$event,this.addGroupList[i],'isLeveShow');/*医生端 警示等级*/		
	  }	
/*护士端  就诊来源 规则类型 警示等级  点击上面的div,下面的固定数据显示处理  给他本身点击,当前阻止冒泡  并显示出来*/  	
    checkboxNurse($event,i,value):void{
        this.checkData.call(this,$event,this.addGroupNurselist[i],'isNurseBoxShow','isNurseTypeShow','isNurseLenverShow');/*护士端就诊来源  点击上面的div,下面的固定数据显示出来*/
    }
    saveNurse($event,i){
    	 this.saveData.call(this,$event,this.addGroupNurselist[i],'isNurseBoxShow');/*护士端就诊来源  点击他自己本身,阻止冒泡,并显示出来*/    
    }  
		checkTypeNurse($event,i,value):void{
			 this.checkData.call(this,$event,this.addGroupNurselist[i],'isNurseTypeShow','isNurseBoxShow','isNurseLenverShow');/*护士端 规则类型    点击上面的div,下面的固定数据显示出来*/
		}
	  saveTypeNurse($event,i):void{
	     this.saveData.call(this,$event,this.addGroupNurselist[i],'isNurseTypeShow');/*护士端 规则类型  点击他自己本身,阻止冒泡,并显示出来*/		
	  }		    
		checkLevelNurse($event,i,value):void{
			 this.checkData.call(this,$event,this.addGroupNurselist[i],'isNurseLenverShow','isNurseBoxShow','isNurseTypeShow');/*护士端 警示等级    点击上面的div,下面的固定数据显示出来*/
		}	
	  saveLevelNurse($event,i):void{
	     this.saveData.call(this,$event,this.addGroupNurselist[i],'isNurseLenverShow');/*护士端 警示等级  点击他自己本身,阻止冒泡,并显示出来*/		
	  }	
/*医生端和护士端    判断选中把数据存起来  所有来源,规则类型,警示等级*/
  saveCheckContent(Object,value1?:any,value2?:any,value3?:any,value4?:any,obj?:any,arr?:any,index?:any,current?:any,info?:any){
		if(Object[index][value1] != ""){
		    value2 = Object[index][value3].split(",");
		    value4 = Object[index][value1].split(",");
		}else{
			  value2 = [];
			  value4 = [];
		}
		obj.check = !obj.check;
		if(obj.name == '全部'){			
			if(obj.check == true){
				  value2 = [];
			    value4 = [];
				  for(let i=1;i<arr.length;i++){
					    arr[i].check = true;
					    value2.push(arr[i].name);
					    value4.push(arr[i].value);
				  }
			}else{
				  for(let i=1;i<arr.length;i++){
					    arr[i].check = false;
					    value2 = [];
			        value4 = [];
				  }	
			}		
		}else{
			if(obj.check == true){
				  value2.push(arr[info].name);
				  value4.push(arr[info].value);
				  this.judgeLength(arr);/*根据arr数组的长度判断全部按钮会不会被勾选上*/
		   }else{
		   		let index:any;
		   		for(let i = 0; i<value2.length;i++){
		   			if(value2[i] == obj.name){
		   				index = i;
		   				value2.splice(index,1);	
		   			}
		   		}
		   		for(let i = 0; i<value4.length;i++){
		   			if(value4[i] == obj.value){
		   				index = i;
		   				value4.splice(index,1);	
		   			}
		   		}
		   		arr[0].check = false;
			}
		}
		 Object[index][value3] = value2.join(",");
     Object[index][value1] = value4.join(",");
	}
 /*根据长度来判断是就诊来源还是规则类型还是警示等级*/ 
    judgeLength(arr){
    	  if(arr.length==3){
    	  	  for(let i=1;i<arr.length;i++){
					     if(arr[1].check == true&&arr[2].check == true){
							    arr[0].check=true;
						   }else{
							    arr[0].check=false;
						   }
					  }
    	  }else if(arr.length==6){
			  	  for(let i=1;i<arr.length;i++){
					     if(arr[1].check == true&&arr[2].check == true&&arr[3].check == true&&arr[4].check == true&&arr[5].check == true){
							    arr[0].check=true;
						   }else{
							    arr[0].check=false;
						   }
					  }
			  }else if(arr.length==11){
				  	for(let i=1;i<arr.length;i++){
					     if(arr[1].check == true&&arr[2].check == true&&arr[3].check == true&&arr[4].check == true&&arr[5].check == true&&arr[6].check == true&&arr[7].check == true
					     	  &&arr[8].check == true&&arr[9].check == true){
							    arr[0].check=true;
						   }else{
							    arr[0].check=false;
						   }
					  }
			  }
    }
/*判断选中把数据存起来  点击radio按钮触发的事件  所有来源,规则类型,警示等级*/
	saveCheckSource(obj,arr,index,current,info){
		  this.saveCheckContent.call(this,this.addGroupList,'source','addSource','sourceData','addSourceValue',obj,arr,index,current,info);/*医生端所有来源    判断选中把数据存起来*/
	}
	saveCheckSource1(obj,arr,index,current,info){
		  this.saveCheckContent.call(this,this.addGroupList,'ruleType','addType','typeData','doctorTypeValue',obj,arr,index,current,info);/*医生端规则类型    判断选中把数据存起来*/
	}
	saveNurseSource(obj,arr,index,current,info){
		this.saveCheckContent.call(this,this.addGroupNurselist,'source','addNurseSource','nurseSourceData','nurseSourceValue',obj,arr,index,current,info);/*护士端所有来源    判断选中把数据存起来*/
	}
	saveCheckNurse(obj,arr,index,current,info){
		this.saveCheckContent.call(this,this.addGroupNurselist,'ruleType','addNurseTypeData','nurseTypeData','nurseTypeValue',obj,arr,index,current,info);/*护士端规则类型    判断选中把数据存起来*/
	}	
/*医生端护士端警示等级 判断选中把数据存起来 */	
  saveCheckLevelContent(Object,value1?:any,value2?:any,obj?:any,arr?:any,index?:any,current?:any,info?:any){
		if(Object[index][value1] != ""){
		    value2 = Object[index][value1].split(",");
		}else{
			  value2 = [];
		}
		obj.check = !obj.check;
		if(obj.name == '全部'){			
			if(obj.check == true){
				  value2 = [];
				  for(let i=1;i<arr.length;i++){
					    arr[i].check = true;
					    value2.push(arr[i].name);
				  }
			}else{
				  for(let i=1;i<arr.length;i++){
					    arr[i].check = false;
					    value2 = [];
				  }	
			}		
		}else{
			if(obj.check == true){
				  value2.push(arr[info].name);
						this.judgeLength(arr);/*如果0-9级都被选中,则全部被勾选上*/
		   }else{
		   		let index:any;
		   		for(let i = 0; i<value2.length;i++){
		   			if(value2[i] == obj.name){
		   				index = i;
		   				value2.splice(index,1);	
		   			}
		   		}
		   		arr[0].check = false;
			}
		}
		 Object[index][value1] = value2.join(",");
	}	
	saveCheckSource2(obj,arr,index,current,info){
        this.saveCheckLevelContent.call(this,this.addGroupList,'level','addlevel',obj,arr,index,current,info);/*医生端警示等级    判断选中把数据存起来*/ 
	}
	saveCheckNurseLevel(obj,arr,index,current,info){
      this.saveCheckLevelContent.call(this,this.addGroupNurselist,'level','addNurselevel',obj,arr,index,current,info);/*护士端警示等级    判断选中把数据存起来*/
	}
/*医生端  删除  点击删除的那个图片,删除当前这条数据*/
    deleatedata(i,value){
    	this.AtPrentId = value.id; 
    	this.doctorI = i;
    	this.isDoctorShow=true;
    	this.isNurseShow=false;
    	this.dialogPlugin.myModule();  
    }
//医生端删除  出现对话框
    deleateDataList(){
    	 this.delData(this.AtPrentId);
		   this.addGroupList.splice(this.doctorI,1);//医生端   
		   if(this.addGroupList.length!=0){
			     this.isDoctorcontentShow = true;
		   }else{
			     this.isDoctorcontentShow = false;
		   }
		   this.doctorType = true;
		   this.dialogPlugin.tip("删除成功",null,'success');
     	 this.dialogPlugin.onClose();//对话框提示消失
    }      
//护士端   删除
    deleatenursedata(i,value){	
    	this.AtPrentIdnurse = value.id; 
    	this.AtPrentIdnurseI=i;
    	this.isDoctorShow=false;
    	this.isNurseShow=true;
    	this.dialogPlugin.myModule();  
    }
//护士端   删除  出现对话框 
    deleateNurseList(){
	     this.delData(this.AtPrentIdnurse);
		   this.addGroupNurselist.splice(this.AtPrentIdnurseI,1);//护士端
		   if(this.addGroupNurselist.length==0){
			     this.isNursecontentShow = false;
		   }else{
			     this.isNursecontentShow = true;
		   }
		   this.nurseType = true;
		   this.dialogPlugin.tip("删除成功",null,'success');
    	 this.dialogPlugin.onClose();
    }
//删除请求
    delData(id:number){
    	if(id){
    		this.waringInformationService.del(id)
    	      .then(res=>{
    	      	  if(res.code==200){
    	      	  	  this.dialogPlugin.tip("删除成功",null,'success');
    	      	  }
    	    })
    	}
    }
/*添加组合的时候和保存的时候,如果那五个选择中有其中某一个没填,则提示报错   医生端*/
	private checkUserInfoRequired(){
      for(let i=0;i<this.addGroupList.length;i++){
				if(this.addGroupList[i].source==""){
					this.dialogPlugin.tip("医生端就诊来源不能为空!",null,'error');
					this.doctorType = false;
					return false;
				}else if(!this.addGroupList[i].ruleType){
					this.dialogPlugin.tip("医生端规则类别不能为空!",null,'error');
					this.doctorType = false;
					return false;
				}else if(this.addGroupList[i].reason ===""){
					this.dialogPlugin.tip("医生端使用理由不能为空!",null,'error');
					this.doctorType = false;
					return false;
				}else if(!this.addGroupList[i].level){
					this.dialogPlugin.tip("医生端警示等级不能为空!",null,'error');
					this.doctorType = false;
					return false;
				}else if(this.addGroupList[i].action ===""){
					this.dialogPlugin.tip("医生端执行操作不能为空!",null,'error');
					this.doctorType = false;
					return false;
				}else{
					this.doctorType = true;
				}
			}
	}
/*添加组合的时候和保存的时候,如果那五个选择中有其中某一个没填,则提示报错   护士端*/
	private checkUserNurseRequired(){
			for(let value of this.addGroupNurselist){
				if(!value.source){
					this.dialogPlugin.tip("护士端就诊来源不能为空!",null,'error');
					this.nurseType = false;
				}else if(!value.ruleType){
					this.dialogPlugin.tip("护士端规则类别不能为空!",null,'error');
					this.nurseType = false;
				}else if(value.reason ===""){
					this.dialogPlugin.tip("护士端使用理由不能为空!",null,'error');
					this.nurseType = false;
				}else if(!value.level){
					this.dialogPlugin.tip("护士端警示等级不能为空!",null,'error');
					this.nurseType = false;
				}else if(value.action ===""){
					this.dialogPlugin.tip("护士端执行操作不能为空!",null,'error');
					this.nurseType = false;
				}else{0
					this.nurseType = true;
				}
			}
	}
}


