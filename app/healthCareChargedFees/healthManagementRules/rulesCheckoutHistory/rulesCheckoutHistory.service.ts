import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {TableList} from './tableList';//表格 搜索条件需要传的参数
@Injectable()
export class RulesCheckoutHistoryService {
   constructor(private http: InterceptorService) { } 
   private baseName = '/ipharmacare-distributed-yb-web/';
   private getInsuranceURL = this.baseName + 'insurance';//获取险种下拉数据
   private getversionDataURL = this.baseName + 'medicareRules';//规则版本下拉框
   private getTableDataURL = this.baseName + 'ruleCheckHistory/info';//获取整个表格的数据
  
/*获取险种下拉数据*/
	getInsuranceData(){
		 let tempUrl:string;
        tempUrl = this.getInsuranceURL;
          return this.http.get(tempUrl)
          .toPromise()
          .then(this.extractJson)
          .catch(this.handleError)
	}
 /*规则版本下拉框   */
	getversionData(insuranceId:number){
        let tempUrl:string;
        tempUrl = this.getversionDataURL + "/"+ insuranceId;
          return this.http.get(tempUrl)
          .toPromise()
          .then(this.extractJson)
          .catch(this.handleError)
    } 
//获取整个表格的数据   
    getTableList(Api?:any){
       	   let tempUrl = Api;
       	   return this.http.get(tempUrl).toPromise()
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
   


