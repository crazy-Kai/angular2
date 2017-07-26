import { Component,OnInit,ViewChild,EventEmitter} from '@angular/core';
import { DataTreeService } from './compare.service';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { Router ,ActivatedRoute,Params} from '@angular/router';

import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
@Component({
	selector: 'compare',
	templateUrl:'compare.component.html',
	styleUrls:['compare.component.css'],
	providers:[DataTreeService]
})


export class CompareComponent{
	// @ViewChild(UploadPlugin) uploadPlugin: UploadPlugin;
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	constructor(
		private dataTreeService: DataTreeService,private router: Router,private route : ActivatedRoute
		) { 
		
	}
		
	/*初始化选择机构option*/
	private organizationOption :any = {
		width:'426px',
		height:'28px',
		api:'/ipharmacare-distributed-yb-web/intervene',
		currentInsuranceId: ''
	}
		
	ngOnInit(){
		/*初始化行为*/
		this.getRouteParam();
	}
	/*变量*/
	
	organizationCode:string; //机构代码
	organizationName:string; //机构名称
	compareListInfoArray:any; //机构信息
	private link:any; //路由地址
	private isHiddenDom:boolean = true;//默认隐藏
	/*点击查看跳转页面*/
	goToPage(type?:any){
		switch(type){
			case 1: 
			this.link = ['healthCareChargedFees/catalogComparison/projectCompare/projectCompare-component/',this.organizationCode,type];
			break;
			case 2:
			this.link = ['healthCareChargedFees/catalogComparison/materialCompare/materialCompare-component/',this.organizationCode,type];
			break;
			case 3:
			this.link = ['healthCareChargedFees/catalogComparison/officeCompare/officeCompare-component/',this.organizationCode,type];
			break;
			case 4:
			this.link = ['healthCareChargedFees/catalogComparison/personCompare/personCompare-component/',this.organizationCode,type];
			break;
		}
		this.router.navigate(this.link);
	}

	/*选择机构*/
	chooseOrganization($event){
			this.isHiddenDom = false;
			this.organizationCode = $event.hospitalCode;
			console.log(this.organizationCode);
    		this.organizationName = $event.hospitalName;	
    		if(this.organizationCode){
    			this.compareListInfo(this.organizationCode)
    		}else{
    			this.compareListInfoArray = [];
    		}
    }
	
	compareListInfo(hospitalCode?:string){
		this.dataTreeService.getCompareListInfo(hospitalCode)
			.then(res =>{
				if(res.code == 200){
					if(res.data.length){
						this.compareListInfoArray = res.data;
					}else{
						this.compareListInfoArray = [];
					}	
				}
			})
	}
	
	getRouteParam(){
		this.route.params.subscribe(param =>{			
				this.organizationCode = this.route.params['value'].hospitalCode;
				this.organizationOption.currentInsuranceId = this.organizationCode;	

		})
	}
}