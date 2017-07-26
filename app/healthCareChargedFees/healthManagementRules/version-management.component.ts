import { Component,OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { VersionManagementService } from './version-management.service';
import { DialogPlugin, DialogModel } from '../common/ug-dialog/dialog';
import {AddManagementDetail} from './dataList';
@Component({
	selector: 'version-management',
	templateUrl:'version-management.component.html',
    styleUrls:['version-management.component.css'],
	providers:[VersionManagementService]
})
export class VersionManagementComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/	
	private insuranceId:any;//险种id
    private optRecipeList:any;
	private id:number;//当前id
	
	constructor(
		private versionManagementService:VersionManagementService,
		private router: Router,
		private route: ActivatedRoute,
		private activeRouter: ActivatedRoute
	) {}
	ngOnInit(){ 
        this.insuranceId = this.activeRouter.params['value'].id;
        if(this.insuranceId){
           this.getVersionManagementList(this.insuranceId);
        }
	}
/*表格数据*/	
	getVersionManagementList(insuranceId:number):void{
		this.versionManagementService.getversionData(insuranceId)
		  .then(res=>{
		  	  if(res.code==200){
		  	  	  this.optRecipeList = [];
		  	      for(let obj of res.data){
			  	  	this.optRecipeList.push(obj);
		  	      }
		  	  }
		  })
	}
//修改
    modification(id?:number){
    	let link:any[] =['healthCareChargedFees/healthManagementRules/version-management/healthRulesVersion/healthRulesVersion_modication/' + id + '/' + this.insuranceId];
    	this.router.navigate(link);
    }
//添加
    choose(){
        let link =['healthCareChargedFees/healthManagementRules/version-management/healthRulesVersion/healthRulesVersion/' + this.insuranceId];
    	this.router.navigate(link);
    }
}
