import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {VersionmodificationDetail} from './dataList';
@Injectable()
export class HealthVersionModicationService {
	private headers = new Headers({'Content-Type': 'application/json'});
	constructor(private http: InterceptorService,private newHttp : Http) { }
	private baseName = "/ipharmacare-distributed-yb-web/";
	private versionDataUpdateURL = '/ipharmacare-distributed-yb-web/ruleVersion';//根据id查询数据
	private updateVersionURL = '/ipharmacare-distributed-yb-web/ruleVersion';//修改版本规则
	private testNameUrl = this.baseName + 'ruleVersion/checkSummary'; //验证重名
/*检测同名*/
    checkName(insuranceId:number,name:string,id:number){
    	let tempUrl:string = this.testNameUrl + "?insuranceId=" + insuranceId +"&name=" + name + "&id=" + id;
    	return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }		
//根据id查询数据
	getVersionData(id:number){
		return this.http.get(this.versionDataUpdateURL + "/" + id)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
	}
//修改版本规则
	getupdateData(versionmodificationDetail:VersionmodificationDetail){
		return this.http.put(this.updateVersionURL, JSON.stringify(versionmodificationDetail), {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
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
