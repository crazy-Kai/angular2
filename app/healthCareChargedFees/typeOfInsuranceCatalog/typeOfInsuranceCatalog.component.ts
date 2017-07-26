import 'rxjs/add/operator/switchMap';
import { Component,OnInit,ViewChild} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import {TypesOfInsuranceCatalogComponentService} from './typesOfInsuranceCatalog.service';
import { DialogPlugin, DialogModel } from '../common/ug-dialog/dialog';
@Component({
	selector:'typeOfInsuranceCatalog',
	templateUrl:'typeOfInsuranceCatalog.component.html',
	styleUrls:['typeOfInsuranceCatalog.component.css'],
	providers:[TypesOfInsuranceCatalogComponentService]
})
export class TypesOfInsuranceCatalogComponent implements OnInit{ 
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
    private optRecipeList:any;
	constructor(
		private typesOfInsuranceCatalogComponentService:TypesOfInsuranceCatalogComponentService,
		private route: ActivatedRoute,
		private router: Router
	) {}
	
	ngOnInit(){
		this.getInsuranceList()
	}
//获取险种列表信息
	getInsuranceList(){
		this.typesOfInsuranceCatalogComponentService.getInsuranceList()
		 .then(result=>{
		 	if(result.code == 200){
		 		if(result.data.length!=0){
		 			this.optRecipeList = [];
		 			this.optRecipeList = result.data;
		 		}
		 	}
	   })
	}
//修改数据
    goToEditPage(insuranceId?: number){
   	  let link:any[] = ['healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_changeInsurance'];
   	   if (insuranceId)
       link.push(insuranceId);
   	   this.router.navigate(link);
    }
 //添加数据
    addInsurance(){
    	let link:any[] = ['healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog_addInsurance'];
   	    this.router.navigate(link);  
    }
}
