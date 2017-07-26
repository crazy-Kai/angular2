import { Component,OnInit,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import {TypeOfInsuranceService} from './typeOfInsuranceCatalog_lookInsurance.service';
import {AddInsuranceDetail,AddInsuranceDesignation} from './typeInsuranceAddInsuranceDetail.ts';
@Component({
	selector:'typeOfInsuranceCatalog_lookInsurance',
	templateUrl:'typeOfInsuranceCatalog_lookInsurance.component.html',
	styleUrls:['typeOfInsuranceCatalog_lookInsurance.component.css'],
	providers:[AddInsuranceDetail,TypeOfInsuranceService]
})
export class TypesOfInsuranceCatalogLookInsuranceComponent implements OnInit{	
/*变量*/
	 private auditPlan: AddInsuranceDetail = new AddInsuranceDetail();//列表参数
     insuranceId:number;
	 reimbursementsdata:any;
	 reimbursementsList:any=[];
	 personClassifiesData:any;
	 personClassifiesList:any=[];
	 
	 constructor(
			private typeOfInsuranceService: TypeOfInsuranceService,
			private router: Router,
			private activeRouter: ActivatedRoute
	 ){}  
	ngOnInit(){
        let insuranceId :any = this.activeRouter.params['value'].id;
        if (insuranceId) {
            this.getOptRecipe(insuranceId);
        }
    }	
//根据险种id来查看数据,将数据展示出来
      getOptRecipe(insuranceId: number): void {
	        this.typeOfInsuranceService.getOptRecipe(insuranceId)
	        .then(res => {
	        	this.reimbursementsdata = res.reimbursements;
	        	for(let i=0;i<this.reimbursementsdata.length;i++){
	        		this.reimbursementsList.push(this.reimbursementsdata[i]);
	        	}
	        	this.personClassifiesData = res.personClassifies;
	        	for(let i=0;i<this.personClassifiesData.length;i++){
	        		this.personClassifiesList.push(this.personClassifiesData[i]);
	        	}
	        	this.auditPlan = res;
	        })
       } 
//修改按钮
     modificationdata(insuranceId?: number){
     	let link:any[] =['healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_midioficationInsurance'];
    	if(insuranceId)
    	link.push(insuranceId);
    	this.router.navigate(link);
     }
       
}
   


