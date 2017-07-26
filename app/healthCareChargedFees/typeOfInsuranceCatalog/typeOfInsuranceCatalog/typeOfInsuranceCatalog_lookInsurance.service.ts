import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {TypeOfInsurance} from './typeInsuranceAddInsuranceDetail';
import {InterceptorService } from 'ng2-interceptors';
//依赖注入
@Injectable()
export class TypeOfInsuranceService {
    constructor(private http: InterceptorService) { }
    private auditPlanUrl = '/ipharmacare-distributed-yb-web/insurance/';//根据险种id来查看数据
//根据险种id来查看数据
    getOptRecipe(insuranceId:number){
        return this.http.get(this.auditPlanUrl + insuranceId)
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
        let body = res.json().data;
        return body || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}