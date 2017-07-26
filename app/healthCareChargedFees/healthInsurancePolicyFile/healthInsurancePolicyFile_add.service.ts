import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { InterceptorService } from 'ng2-interceptors';
import {InsuranceAddDetail} from './dataList';//获取表格数据
@Injectable()
export class HealthInsurancePolicyAddFileService {
    constructor(private http: InterceptorService,private newHttp : Http) { }
    private headers = new Headers({'Content-Type': 'application/json'});
    private baseName = "/ipharmacare-distributed-yb-web/";
    private addInsuranceURL = this.baseName +  'policy';//新增医保政策
    private lookModificationDataURL = this.baseName +  'policy/';//根据医保政策信息id查询 
    private HistoryDataURL = this.baseName + 'policy';//获取所有医院政策
    private testNameUrl = this.baseName + 'policy/checkName'; //验证重名
    
/*检测同名*/
    checkName(summary:string){
    	console.log(summary);
    	let tempUrl:string = this.testNameUrl +"?summary="+ summary;
    	return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }
//新增医保政策
    getInsuranceData(insuranceAddDetail:InsuranceAddDetail){
    	return this.http.post(this.addInsuranceURL, JSON.stringify(insuranceAddDetail), {headers: this.headers})
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
//获取所有医院政策
    getHistoryInfo(data:any){
    	let tempUrl = this.HistoryDataURL;
    	return this.http.get(tempUrl)
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

