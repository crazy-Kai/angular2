import { Directive,Component,OnInit,ViewChild,Input, Output} from '@angular/core';
import { DetailDataService } from './interventionDataStatistics.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router } from '@angular/router';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
declare var echarts: any;
@Component({
	selector:'interventionDataDetialPage',
    templateUrl:'interventionDataStatistics.component.html',
	styleUrls:['interventionDataStatistics.component.css'],
	providers:[ DetailDataService ]
})

export class InterventionDataDetialComponent{
	@ViewChild(DialogPlugin) private dialogPlugins: DialogPlugin ;

	private information:any = {};
	  settingId:any;
	  temp:any;
	  myChart:any;
	  link:any;
	  code:any;
	  insuranceId:any;//险种ID 
	  // declare var echarts: any;
	  option = {
	  	 	color: ['#6ABAE9'],
	  	 	tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
    		},
		    xAxis:{
		    	type : 'value'
		    } ,
		    yAxis: {
		        data: []
		    },
		    series: [{
		        name: '次数',
		        type: 'bar',
		        barWidth: '60%',
		        data: []
		    }],

		};
	constructor(
		private detailDataService: DetailDataService,private router: Router,private route : ActivatedRoute
	) {}

	ngOnInit(){
		this.getRouteParam();
		console.log(history)
	}
	getRouteParam(){
		this.route.params.subscribe(param => {
		    this.settingId = this.route.params['value'].settingId;
			this.temp = this.route.params['value'].warningType;
			this.insuranceId = this.route.params['value'].insuranceId;
           		this.detailDataService.getInformation(this.settingId).then(res=>{
           			if(res.code == 200){
           				this.information = res.data.details;
           				/*请求成功之后初始化图表*/
           				this.option.yAxis.data = res.data.teamName; 
           				this.option.series[0].data = res.data.teamCount;
           				this.code = res.data.teamNameCode;
       					this.myChart = echarts.init(document.getElementById('content-main'));
						this.myChart.setOption(this.option);
						this.resizeFn();
						this.chartHoverEvents();
           			}
           		})
          
       });
	}
	/*根据类型选择跳转路径*/
	chooseType(type?:any,code?:any){
		console.log(type)
		switch(type){
			case '3':
			this.link = ['healthCareChargedFees/cautionInformation/drugWarningInformationDetails/drugWarningInformationDetails-component',this.settingId,type,code,this.insuranceId];
			break;
			case '4':
			this.link = ['healthCareChargedFees/cautionInformation/objectWarningInformationDetails/objectWarningInformationDetails-component',this.settingId,type,code,this.insuranceId];
			break;
			case '5':
			this.link = ['healthCareChargedFees/cautionInformation/materialWarningInformationDetails/materialWarningInformationDetails-component',this.settingId,type,code,this.insuranceId];
			break;
			case '2':
			this.link = ['healthCareChargedFees/cautionInformation/diseaseWarningInformationDetails/diseaseWarningInformationDetails-component',this.settingId,type,code,this.insuranceId];
			break;
			case '1':
			this.link = ['healthCareChargedFees/cautionInformation/visitingWarningInformationDetails/visitingWarningInformationDetails-component',this.settingId,type,code,this.insuranceId];
			break;
		}
		console.log(this.link )
	}
	chartHoverEvents(){
		let me = this;
		this.myChart.on('click',function(params){
		let index:any,
			hostPropertiesCode:any;
			index = me.serialize(me.option.yAxis.data,params.name);
			hostPropertiesCode = me.code[index];
			console.log(hostPropertiesCode)
			me.chooseType(me.temp,hostPropertiesCode)
			if(me.link){
				me.router.navigate(me.link);
			}
		})
	}
	/*获取index*/
	serialize(arr?:any,value?:any){
		let index:number;
		for(let i = 0;i<arr.length;i++){
			if(arr[i] == value){
				index = i;
			}
		}
		return index;
	}
	/*设置图表宽度*/
	resizeFn(){
		window.onresize = () => { this.myChart.resize({width:window.innerWidth, height:window.innerHeight}); };
	}
	/*返回*/
	goBack(){
		 this.link = ['healthCareChargedFees/cautionInformation'];
		 this.router.navigate(this.link);
	}
}