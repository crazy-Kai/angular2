import { Component,OnInit,ViewChild,OnChanges,Input, Output, HostListener} from '@angular/core';
import { DataTreeService } from './interveneData.service';
import { TreeComponent, TreeNode , TREE_ACTIONS, IActionMapping} from 'angular2-tree-component';
import { DialogPlugin } from '../common/ug-dialog/dialog';
//import { DialogModel } from '../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import { DataList} from './dataList';

import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
declare var echarts: any;

@Component ({
	selector: 'intervene-data',
	templateUrl: 'interveneData.component.html',
	styleUrls:['interveneData.component.css'],
	providers:[DataTreeService]
})

export class InterveneData implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugins: DialogPlugin;
	@ViewChild(TreeComponent)
	private tree:TreeComponent;
    private isChangeOne:boolean = true; //上面四种类型选择
    private isChangeTwo:boolean = false;
    private isChangeThree:boolean = false;
    private isChangeFour:boolean = false;
    private spanOne:Boolean = true;//点击时背景色的改变
    private spanTwo:Boolean = false;
    private spanThree:Boolean = false;
    private spanFour:Boolean = false;
    private myChart_number:any;
            myChart_number_intercept:any;
		    myChart_level:any;
		    myChart_deal:any;
		    myChart_type:any;
		    isSpanOne:boolean = true; //三种类型选择
		    isSpanTwo:boolean = false;
		    isSpanThree:boolean = false;
		    isLanJie:boolean=true;//拦截金额占比的显隐性
		    hospitalArray:any=[];//医院数据
            officeArray:any=[];//科室数据
            numberArray:any=[];//就诊数量
            temp:any;//公用参数
            whichMap:number=0;//选择哪张图表
            date1:any;//快速选择的起始时间
            date2:any;//快速选择的结束时间
            date3:any;//日历最大时间设定
            dataList: DataList = new DataList();
            
    //就诊数量分析
    option_number = {
	    tooltip : {
	        trigger: 'axis',
	        formatter:"{a0} : {c0}<br />{a1} : {c1} <br />{a2} : {c2} <br />{a3} : {c3}",
	        textStyle:{
	        	align:'left',
	        	color:"#DDDD22"
	        },
	        backgroundColor:'rgba(0,0,0,0.8)'
	    },
	    legend: {
	    	x:'66.5%',
	        data:[]
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : []
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : []
	};
    
     option_number_intercept = {
	    tooltip : {
	        trigger: 'axis',
	        formatter:"{a}:{c}%",
	        textStyle:{
	        	align:'left',
	        	color:"#DDDD22"
	        },
	        backgroundColor:'rgba(0,0,0,0.8)'
	    },
	    legend: {
	    	x:'82%',
	        data:[]
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : []
	        }
	    ],
	    yAxis : [{
                type: 'value',
                name: '占比',
                max:'100',
                min:'0',
                axisLabel: {
                    formatter: '{value}%'
                }
            }
	    ],
	    series : []
	};
    
    //就诊处理分析
    option_deal = {
	    color: ['#3398DB'],
		
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : [],
	            axisTick: {
	                alignWithLabel: false
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	        	label: {normal: {
                    show: true,
                    position: 'top',
					formatter: '{c}'
                    }
               },
	            name:'此年龄段人数',
	            type:'bar',
	            barWidth: '20%',
	            data:[]
	        }
	        
	    ]
	};
    
    option_level = {
	    title : {
	        text: '',
	        x:'10%',
	        y:'center',
	        textStyle:{
	        	fontSize: 14,
	        	color:"#333",
	        }
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        x:'70%',
	        y:'center',
	        itemGap: 20,
            itemWidth: 14,
            itemHeight: 14,
	        data: []
	    },
	    series : [
	        {
	           
	            type: 'pie',
	            radius : '65%',
	            center: ['40%', '50%'],
	            data:[],
	            
	            itemStyle: {
	            	normal:{
	            		label:{
			            	position:'inner'
			            }
	            	},
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	
	//type类型
	option_type = {
	    title : {
	        text: '',
	        x:'10%',
	        y:'center',
	        textStyle:{
	        	fontSize: 14,
	        	color:"#333",
	        }
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        x:'70%',
	        y:'center',
	        itemGap: 20,
            itemWidth: 14,
            itemHeight: 14,
	        data: []
	    },
	    series : [
	        {
	           
	            type: 'pie',
	            radius : '65%',
	            center: ['40%', '50%'],
	            data:[],
	            
	            itemStyle: {
	            	normal:{
	            		label:{
			            	position:'inner'
			            }
	            	},
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	
	constructor(
		private dataTreeService: DataTreeService,private router: Router
	) {}
	ngOnInit(){
        this.getOffice();
        this.getHospital();
        this.getNumber("");//就诊数量分析--就诊总数
        this.getDeal("");//就诊处理分析
        this.getLevel("");//警示信息级别分析
        this.getType("");//警示信息类型分析
        this.bigTime();//日历最大时间设定
        
		let self = this;
		window.onresize = function(){
		   self.myChart_number.resize();
		   self.myChart_deal.resize();
		   self.myChart_level.resize();
		   self.myChart_type.resize();
		}
        
	};
	change(status){
		this.isChangeOne = false;this.isChangeTwo = false;this.isChangeThree = false;this.isChangeFour = false;
		this.spanOne = false;this.spanTwo = false;this.spanThree = false;this.spanFour = false;
		this.clearData();
		if(status == 0){
			this.isChangeOne = true;
			this.spanOne = true;
			this.whichMap=0
		}else if(status == 1){
			this.isChangeTwo = true;
			this.spanTwo = true;
			this.isLanJie=true;
			this.whichMap=1;
		}else if(status == 2){
			this.isChangeThree = true;
			this.spanThree = true;
			this.isLanJie=true;
			this.whichMap=2;
		}else if(status == 3){
			this.isChangeFour = true;
			this.spanFour = true;
			this.isLanJie=true;
			this.whichMap=3;
		}
	}
	dataChange(status){
		this.isSpanOne = false;this.isSpanTwo = false;this.isSpanThree = false;this.isLanJie=true;
		this.option_number.xAxis[0].data = [];
		this.option_number.series=[];
		this.option_number.legend.data=[];
		this.parameUrl();
		if(status == 0){
			this.isSpanOne = true;
			this.option_number.tooltip.formatter="{a0} : {c0}<br />{a1} : {c1} <br />{a2} : {c2} <br />{a3} : {c3}";
			this.getNumber(this.temp);
			this.whichMap=0;

		}else if(status == 1){
			this.isSpanTwo = true;
			this.option_number.tooltip.formatter="{a0} : {c0}<br />{a1} : {c1} ";
			this.getNumberIntervene(this.temp);
			this.whichMap=4
		}else if(status == 2){
			this.isSpanThree = true;
			this.isLanJie = false;
			this.whichMap=5;
			this.option_number.tooltip.formatter="{a0} : {c0}<br />{a1} : {c1}";
			this.getNumberLanJie(this.temp);
			let self = this;
			window.onresize = function(){
			   self.myChart_number.resize();
			   self.myChart_number_intercept.resize();
			   self.myChart_deal.resize();
			   self.myChart_level.resize();
			   self.myChart_type.resize();
		    }
		}
		if(document.getElementById('number')){
			this.myChart_number = echarts.init(document.getElementById('number'));
		    this.myChart_number.setOption(this.option_number);//就诊数量分析
		}
	}
	//获取医院
	getHospital(){
		this.dataTreeService.getHospitalData()
			.then(res =>{
				if(res.code == 200){
					this.hospitalArray = res.data;
				}
			})
	}
	//	获取科室
	getOffice(){
		this.dataTreeService.getOfficeData()
			.then(res =>{
				if(res.code == 200){
					this.officeArray = res.data;
				}
			})
	}
	//获取就诊总数
	getNumber(data){
		this.dataTreeService.getNumberData(data)
		.then(res =>{
			if(res.code == 200){
				this.option_number.xAxis[0].data = res.data.xAxis;
				this.option_number.series=res.data.dataList;
				this.option_number.legend.data=res.data.name;
				if(document.getElementById('number')){
					this.myChart_number = echarts.init(document.getElementById('number'));
		            this.myChart_number.setOption(this.option_number);//就诊数量分析
				}
			}
		})
	}
	//获取就诊数量分析 - 干预数据
	getNumberIntervene(data){
		this.dataTreeService.getInterveneData(data)
		.then(res =>{
			if(res.code == 200){
				this.option_number.xAxis[0].data = res.data.xAxis;
				this.option_number.series=res.data.dataList;
				this.option_number.legend.data=res.data.name;
				if(document.getElementById('number')){
					this.myChart_number = echarts.init(document.getElementById('number'));
		            this.myChart_number.setOption(this.option_number);//就诊数量分析 - 干预数据
				}
			}
		})
	}
	//获取就诊数量分析 - 拦截数据
	getNumberLanJie(data){
		this.dataTreeService.getLanJieData(data)
		.then(res =>{
			if(res.code == 200){
				this.option_number.xAxis[0].data = res.data.xAxis;
				this.option_number.series=res.data.dataList;
				this.option_number.legend.data=res.data.name;//表1
				this.option_number_intercept.xAxis[0].data = res.data.xAxis;
				this.option_number_intercept.series=res.data.dataList2;
				this.option_number_intercept.legend.data.push(res.data.name2);//表2
				if(document.getElementById('number')){
					this.myChart_number = echarts.init(document.getElementById('number'));
		            this.myChart_number.setOption(this.option_number);//就诊数量分析 - 拦截数据
				}
				if(document.getElementById('number_intercept')){
					this.myChart_number_intercept = echarts.init(document.getElementById('number_intercept'));
	        	    this.myChart_number_intercept.setOption(this.option_number_intercept);//金额占比
				}
			}
		})
	}
	
	
	//获取就诊处理分析
	getDeal(data){
		this.dataTreeService.getDealData(data)
		.then(res=>{
			if(res.code==200){
				this.option_deal.xAxis[0].data=res.data.name;
				this.option_deal.series[0].data = res.data.count;
				if(document.getElementById('deal')){
					this.myChart_deal = echarts.init(document.getElementById('deal'));
		            this.myChart_deal.setOption(this.option_deal);//就诊处理分析
				}
				
			}
		})
	}
	//警示信息等级分析
	getLevel(data){
		this.dataTreeService.getLevelData(data)
		.then(res=>{
			if(res.code==200){
				this.option_level.title.text = res.data.visitSum;
				this.option_level.legend.data = res.data.level;
				this.option_level.series[0].data=res.data.LevelDataList;
				if(document.getElementById('level')){
					this.myChart_level = echarts.init(document.getElementById('level'));
		            this.myChart_level.setOption(this.option_level);//警示信息等级分析
				}
			}
		})
	}
	//警示信息类型分析
	getType(data){
		this.dataTreeService.getTypeData(data)
		.then(res=>{
			if(res.code == 200){
				this.option_type.title.text = res.data.visitSum;	
				this.option_type.legend.data = res.data.level;
				this.option_type.series[0].data=res.data.LevelDataList;
				if(document.getElementById('type')){
					this.myChart_type = echarts.init(document.getElementById('type'));
		            this.myChart_type.setOption(this.option_type);//警示信息类型分析
				}
			}
		})
	}

	
	
	/**
	 * 时间控件参数
	 */
	startDate: any;
	endDate: any;
	minStartDate: any;
	maxStartDate:any;
	minEndDate: any;
	maxEndDate:any;    //设定药品核准时间的最大值为昨天string;
	//最大时间调值问题
	bigTime(){
		this.date3 = new Date(new Date());
	    this.date3.setDate(new Date().getDate()-1);
	    this.maxStartDate={year: this.date3.getFullYear(), month: this.date3.getMonth() + 1, day: this.date3.getDate()};
	    this.maxEndDate={year: this.date3.getFullYear(), month: this.date3.getMonth() + 1, day: this.date3.getDate()};
	}
	objToDate(oriDate: any) {
        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
        return dateStr;
    }
	setEndInterval($event: any){
		if($event){
			this.minEndDate = $event;
		}else{
			this.minEndDate = null;
		}
	}
	setStrartInterval($event: any){
		if($event){
			this.maxStartDate = $event;
		}else{
			this.maxStartDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
		}		
	}
	//开始时间
	startTime(str){
	    this.date1 = new Date(new Date());
	    this.date1.setDate(new Date().getDate()-str);
	    this.startDate={year: this.date1.getFullYear(), month: this.date1.getMonth() + 1, day: this.date1.getDate()}
	}
	//昨天为截至时间
	overTime(){
		this.date2 = new Date(new Date());
	    this.date2.setDate(new Date().getDate()-1);
	    this.endDate={year: this.date2.getFullYear(), month: this.date2.getMonth() + 1, day: this.date2.getDate()}   
	}

	 //切换逻辑
    startIns: any;
    endIns: any;
    toggleStart(timeIns: any){
        timeIns.toggle();
        if(timeIns.isOpen()){
            this.startIns = timeIns;
            if(this.endIns){
                this.endIns.close();
                this.endIns = null;
            }
        }else{
            this.startIns = null;
        }
    }

    toggleEnd(timeIns: any){
        timeIns.toggle();
        if(timeIns.isOpen()){
            this.endIns = timeIns;
            if(this.startIns){
                this.startIns.close();
                this.startIns = null;
            }
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
        if(this.startIns){
            this.startIns.close();
            this.startIns = null;
        }
    }
	
    //点击前一天的方法
    searchTime(status){
    	switch (status){
    		case 0:
    		    this.startTime(1);
    		    this.overTime();
    			break;
    	    case 1:
    		    this.startTime(3);
    		    this.overTime();
    			break;
    		case 2:
    		    this.startTime(7);
    		    this.overTime();
    			break;
    		case 3:
    		    this.startTime(30);
    		    this.overTime();
    			break;
    		case 4:
    		    this.startDate={year: new Date().getFullYear()-1, month: new Date().getMonth() + 1, day: new Date().getDate()}
	            this.overTime();
    		    break;
    		default:
    			break;
    	}
    	
    }
    //URL后面的参数
    parameUrl(){
    	if(this.startDate && this.endDate){
		 	 this.dataList.startTime = this.startDate.year +'-'+this.startDate.month+'-'+this.startDate.day;
		  	 this.dataList.overTime =this.endDate.year +'-' + this.endDate.month + '-' + this.endDate.day;
		}else{
			this.dataList.startTime = "";
			this.dataList.overTime = "";
		}
		this.temp='?startTime='+this.dataList.startTime+'&overTime='+this.dataList.overTime+'&type='+this.dataList.hospitalType+'&office='+this.dataList.office+'&level='+this.dataList.hospitalLevel+'&source='+this.dataList.way+'&hospital='+this.dataList.hospital;
    }
    
    //点击搜索之后的方法
    search(){
    	this.parameUrl();
    	switch (this.whichMap){
    		case 0:
    		    this.getNumber(this.temp);
    			break;
    		case 1:
    		    this.getDeal(this.temp);
    		    break;
    		case 2:
    		    this.getLevel(this.temp);
    		    break;
    		case 3:
    		    this.getType(this.temp);
    		    break;
    		case 4:
    		    this.getNumberIntervene(this.temp);
    		    break;
    		case 5:
    		    this.getNumberLanJie(this.temp);
    		    break;
    		default:
    			break;
    	}
    }
    //清空搜索条件
    clearData(){
    	this.startDate=null;
    	this.endDate=null;
    	this.dataList.startTime = "";
    	this.dataList.overTime = "";
    	this.dataList.hospitalType = "";
    	this.dataList.hospitalLevel = "";
    	this.dataList.office = "";
    	this.dataList.way = "";
    	this.dataList.hospital = ""
    }
    
	
}
