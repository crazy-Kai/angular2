import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {InsuranceModificationDetail} from './dataList';//获取表格数据
@Injectable()
export class HealthInsurancePolicyFileModificationService {
    constructor(private http: InterceptorService,private newHttp : Http) { }
    private baseName = "/ipharmacare-distributed-yb-web/";
    private saveDataUrl = this.baseName + 'policy';//修改->保存信息
    private lookModificationDataURL = this.baseName + 'policy/';//根据医保政策信息id查询 
    private testNameUrl = this.baseName + 'policy/checkName'; //验证重名
     
// 修改->保存信息 
    save(insuranceModificationDetail:InsuranceModificationDetail){
        let body = JSON.stringify(insuranceModificationDetail);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(this.saveDataUrl, body, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
//修改第一步  根据医保政策信息id查询
    getOptRecipe(policyId:number){
      	let tempUrl:string = this.lookModificationDataURL + policyId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
/*检测同名*/
    checkName(summary:string,policyId:number){
    	console.log(name);
    	console.log(policyId);
    	let tempUrl:string = this.testNameUrl + "?summary=" + summary + "&id=" + policyId;
    	return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
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

