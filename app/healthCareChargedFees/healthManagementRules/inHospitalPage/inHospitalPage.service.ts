import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
@Injectable()
export class DetailDataService{
	constructor(private http:InterceptorService ) { }

    private baseName = '/ipharmacare-distributed-yb-web/';
    getVisitorInfo = this.baseName + "ruleCheck/advice/this";/*获取本次就诊信息*/
    oldDetailsUrl = this.baseName + ' ruleCheck/prescription/history';//历史就诊
    
/*获取本次就诊信息*/    
    getVisitorInfomation(eventNo?:any,hospitalNo?:any){
   		let tempUrl = this.getVisitorInfo + "?eventNo=" + eventNo + "&hospitalNo=" + hospitalNo;
   		return this.http.get(tempUrl)
   			.toPromise()
   			.then(this.extractJson)
   			.catch(this.handleError);
    }
/*历史就诊*/     
    getOldDetailsData(idType?:any,idNo?:any){
        let tempUrl = this.oldDetailsUrl + "?idType=" + idType + "&idNo=" + idNo;
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