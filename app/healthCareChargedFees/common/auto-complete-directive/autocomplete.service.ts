import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AutocompleteService {

    constructor(private http: InterceptorService){}

    private headers = new Headers({'Content-Type': 'application/json'});
    private api = {
        diseaseUrl:'/ipharmacare-distributed-yb-web/warningInfo/diseaseCode'
    }

    public getDiseaseList(code?:any,settingId?:any,hospitalNo?:any){
        return this.http.get(this.api.diseaseUrl + '?code='+ encodeURIComponent(code || '') +'&&hospitalNo='+ hospitalNo +'&&settingId='+ settingId, {headers: this.headers})
            .toPromise()
            .then(response => this.extractData(response))
            .catch(this.handleError);
    }

   
    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json(),
            _this = this;

        return body.data || [];
    }
}