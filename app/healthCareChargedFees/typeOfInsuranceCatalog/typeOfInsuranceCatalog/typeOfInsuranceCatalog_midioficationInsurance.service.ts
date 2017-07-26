import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {AddInsuranceDetail} from './typeInsuranceAddInsuranceDetail';
@Injectable()
export class TypesOfInsuranceCatalogModificationInsuranceService {
	private headers = new Headers({'Content-Type': 'application/json'});
	private auditPlan: AddInsuranceDetail = new AddInsuranceDetail();
	constructor(private http: InterceptorService,private newHttp : Http) { }
	private hospitalUrl = '/ipharmacare-distributed-yb-web/insurance'  //更新险种数据
	private insuranceIdURL = './ipharmacare-distributed-yb-web/insurance/payType';//关联的险种id
	private delDateURL = './ipharmacare-distributed-yb-web/reimbursement/';//删除 -> 当前一条信息  人员类别
	private delDatePersonURL = '/ipharmacare-distributed-yb-web/personClassify/';//删除 -> 当前一条信息  投保人员中的数据
	private baseName = "/ipharmacare-distributed-yb-web/";
	private testNameUrl = this.baseName + 'insurance/checkName'; //验证重名
/*检测同名*/
    checkName(summary:string,id:number){
    	let tempUrl:string = this.testNameUrl + "?name=" + summary +"&id=" + id;
    	return this.newHttp.get(tempUrl)
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
//根据险种id来查看数据
	getOptRecipe(insuranceId:number){
        return this.http.get(this.hospitalUrl + "/" + insuranceId)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
//增加保险信息   post
    updateAuditPlan(data: any): Promise<any> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.hospitalUrl, body, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
//根据保险ID更新保险信息   put
	updateInsurance(data: any): Promise<any> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.hospitalUrl, body, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
//删除 -> 当前一条信息  人员类别
    del(id:number): Promise<any> {
        let tempUrl = this.delDateURL  + id;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
     }
//删除 -> 当前一条信息  投保人员中的数据
    delPerson(id:number): Promise<any> {
        let tempUrl = this.delDatePersonURL  + id;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
     }
	private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
    
	isEmptyObject(obj: any) {
        for (var name in obj) {
            return false;
        }
        return true;
    } 
    
    
	
}
	