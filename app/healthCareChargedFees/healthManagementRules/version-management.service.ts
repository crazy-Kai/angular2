import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class VersionManagementService {
   private headers = new Headers({'Content-Type': 'application/json'});
   constructor(private http: InterceptorService) { } 
   private versionListURL = './ipharmacare-distributed-yb-web/ruleVersion/list/';//表格数据列表
//获取表格数据列表
   getversionData(insuranceId:number){
   	  return this.http.get(this.versionListURL + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
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
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
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
   


