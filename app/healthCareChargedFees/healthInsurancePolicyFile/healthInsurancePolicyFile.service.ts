import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { InterceptorService } from 'ng2-interceptors';
@Injectable()
export class HealthInsurancePolicyFileService {
    constructor(private http: InterceptorService) { }
    private delDataUrl ='/ipharmacare-distributed-yb-web/policy/';//删除政策信息
//删除 -> 政策
    del(id: number): Promise<any> {
    	console.log(id)
        let tempUrl = this.delDataUrl  + id;
        return this.http.delete(tempUrl)
            .toPromise()
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
// /**
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

