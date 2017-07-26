import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {AddGroupDetail} from './addGroupsData';
@Injectable()
export class WaringInformationService { 
private headers = new Headers({'Content-Type': 'application/json'});
   constructor(private http: InterceptorService) { } 
   private baseName = "/ipharmacare-distributed-yb-web/";
   private getWaringDataURL = this.baseName + 'warningActionSetting';//获取所有警示方式
   private addWaringDataURL = this.baseName + 'warningActionSetting';//新增警示方式
   private delDataURL = this.baseName + 'warningActionSetting';//删除
//获取所有警示方式
   getWaringData(insuranceId:number){
	   	return this.http.get(this.getWaringDataURL + "/" + insuranceId)
	    	    .toPromise()
	           .then(this.extractJson)
	            .catch(this.handleError)
   }
//新增警示方式
   addWaringData(addGroupDetail:AddGroupDetail){
   	   return this.http.post(this.addWaringDataURL, JSON.stringify(addGroupDetail), {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
   }
//删除 -> 政策
    del(id: number): Promise<any> {
        let tempUrl = this.delDataURL +"?id=" + id;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
     }
    
/**
 * promise预处理
 */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    isEmptyObject(obj: any) {
        for (var name in obj) {
            return false;
        }
        return true;
    }  
}