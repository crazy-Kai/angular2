import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { InterceptorService } from 'ng2-interceptors';
@Injectable()
export class TypesOfInsuranceCatalogComponentService {
    constructor(private http: InterceptorService) { }
    private insuranceListUrl = '/ipharmacare-distributed-yb-web/insurance/insuranceVO';//险种的列表信息
//险种的列表信息   
    getInsuranceList(){
    	return this.http.get(this.insuranceListUrl)
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

}
