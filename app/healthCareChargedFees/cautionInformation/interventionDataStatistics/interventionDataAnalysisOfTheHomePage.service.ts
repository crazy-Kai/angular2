
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
	 constructor(private http:InterceptorService ) { }
        private baseName = '/ipharmacare-distributed-yb-web/';
        	manageUrl =this.baseName + 'warningInfo/policy' //获取管理依据数据
        	tipUrl = this.baseName + 'warningInfo/type/'; //获取提示下拉框数据
        	ruleUrl =this.baseName + 'ruleVersion/list/comboBox/';//获取版本规则
        	analyzeUrl = this.baseName+ 'warningInfo/type/FX' ;//获取分析类型
        	hospitalUrl = this.baseName + 'warningInfo/hospital'; //获取医院
        	searchDataUrl = this.baseName +'warningInfo';//查询数据
        	insuranceUrl = "/ipharmacare-distributed-yb-web/insurance";
 //获取险种
       getInsuranceUrl(){
       	 let tempUrl= this.insuranceUrl;
       	 	  return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);

       }
//获取table信息
       getTableList(Api?:any){
       	   let tempUrl = Api;
       	   return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
       }     
// 		获取管理依据数据    
		getManageData(){
			let tempUrl =this.manageUrl;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
//		获取版本规则
		getRuleData(insuranceId:any){
			let tempUrl = this.ruleUrl;
			return this.http.get(tempUrl+insuranceId).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}   
//     获取提示数据
       	getTipData(id:any){
       		let tempUrl =this.tipUrl + id;
       		return this.http.get(tempUrl).toPromise()
       			.then(this.extractJson)
       			.catch(this.handleError);
       	}
//     	获取分析类型
		getanalyzeData(){
			let tempUrl = this.analyzeUrl;
			return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
		}
//		获取医院
		getHospitalData(){
			let tempUrl =this.hospitalUrl;
			return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
		}
		
//     	获取科室
		getOfficeData(id:string){
			let tempUrl = this.hospitalUrl +'/'+id;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
			
		}
//获取医护人员
    //     getDoctor(hospitalId?:any,officeId?:any){
    //     	let tempUrl = this.hospitalUrl+'/'+hospitalId+'/'+officeId;
    //     	return this.http.get(tempUrl).toPromise()
				// .then(this.extractJson)
				// .catch(this.handleError);
    //     }
		searchData(data){
				let tempUrl = this.searchDataUrl;
				return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
    private extractData(res: Response) {
    	
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
    }
     private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    
}
  


 