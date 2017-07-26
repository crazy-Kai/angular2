import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { InterceptorService } from 'ng2-interceptors';
import {AddInsuranceDetail} from './typeInsuranceAddInsuranceDetail';
@Injectable()
export class TypesOfInsuranceCatalogAddInsuranceService { 
	constructor(private http: InterceptorService,private newHttp : Http) { }
	private headers = new Headers({'Content-Type': 'application/json'});
	private baseName = "/ipharmacare-distributed-yb-web/";
	private auditPlanUrl = '/ipharmacare-distributed-yb-web/insurance';
	private insuranceIdURL = './ipharmacare-distributed-yb-web/insurance/payType';//关联的险种id
  private auditPlanUrl2 = '/ipharmacare-distributed-yb-web/insurance';//根据险种id来查看数据
  private insuranceListUrl = '/ipharmacare-distributed-yb-web/insurance/insuranceVO';//险种的列表信息
	private testNameUrl = this.baseName + 'insurance/checkName'; //验证重名
/*检测同名*/
  checkName(summary:string){
    	let tempUrl:string = this.testNameUrl + "?name=" + summary;
    	return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
  }	
//根据险种id来查看数据
  getOptRecipe(insuranceId:number){
        return this.http.get(this.auditPlanUrl2 + "/" + insuranceId)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
  }
//险种的列表信息
    getInsuranceList(){
    	return this.http.get(this.insuranceListUrl)
    	    .toPromise()
           .then(this.extractJson)
            .catch(this.handleError)
    }
//关联的险种id
    getInsuranceIddata(){
    	return this.http.get(this.insuranceIdURL)
    	    .toPromise()
           .then(this.extractJson)
            .catch(this.handleError)
    } 
//增加保险信息  
   addAuditPlan(addInsuranceDetail: AddInsuranceDetail){
        return this.http.post(this.auditPlanUrl, JSON.stringify(addInsuranceDetail), {headers: this.headers})
           .toPromise()
           .then(this.extractJson)
           .catch(this.handleError);
   }
  //   * promise处理
//   */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
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

}