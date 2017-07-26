import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
//import { Headers, Http, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {Addversiondetail} from './dataList';
@Injectable()
export class HealthVersionAddService {
	private headers = new Headers({'Content-Type': 'application/json'});
	constructor(private http: InterceptorService,private newHttp : Http) { }
	private baseName = '/ipharmacare-distributed-yb-web/';
	private addVersionURL = this.baseName + 'ruleVersion';//添加版本
	private adddieaseVersionURL = this.baseName + 'ruleVersion/versionList/YP/';//查询药品下拉列表数据
	private adddrugsVersionURL = this.baseName + 'ruleVersion/versionList/JB/';//查询疾病下拉列表数据
	private addmaterialVersionURL = this.baseName + 'ruleVersion/versionList/CL/';//查询材料下拉列表数据
	private addProjectVersionURL = this.baseName + 'ruleVersion/versionList/XM/';//查询项目下拉列表数据
	private testNameUrl = this.baseName + 'ruleVersion/checkSummary'; //验证重名
	
	
//	http://localhost:8080/ipharmacare-distributed-yb-web/ruleVersion/versionList/JB/1
	
/*检测同名*/
    checkName(insuranceId:number,name:string){
    	let tempUrl:string = this.testNameUrl + "?insuranceId=" + insuranceId +"&name=" + name;
    	return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }		
//添加版本
	getaddversiondata(addversiondetail:Addversiondetail){
		 return this.http.post(this.addVersionURL, JSON.stringify(addversiondetail), {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
	}
//获取药品下的下拉菜单
	getdieasedata(insuranceId:number){
		return this.http.get(this.adddieaseVersionURL + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
	}
//获取疾病下的下拉菜单
	getdrugdata(insuranceId:number){
		return this.http.get(this.adddrugsVersionURL + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
	}  
//获取材料下的下拉菜单
	getmaterialdata(insuranceId:number){
		return this.http.get(this.addmaterialVersionURL + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
	}  
//获取项目下的下拉菜单
	getProjectdata(insuranceId:number){
		return this.http.get(this.addProjectVersionURL + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
	}  
//预处理
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
