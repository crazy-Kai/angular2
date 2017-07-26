/**
 *  @author: anwen
 *  @Description:TODO(用户模块涉及的接口)     
 */

import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {InterceptorService } from 'ng2-interceptors';
// import {User}           from './user';



@Injectable()
export class UserService {
    isLogin = false;
    // user = new User();
    constructor(private http: InterceptorService ) { }

    private baseName = "/ipharmacare-distributed-yb-web/";
    magicnoUrl = '/api/v1/magicno';
    loginUrl = this.baseName + 'common/login';
    currentUserUrl = this.baseName +'common/currentUser';
    logoutUrl = this.baseName + 'common/logout';
  


    // getMagicno(): Promise<any>{
    //     return this.http.get(this.magicnoUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }

    login(param): Promise<any>{
        if(param){
            this.loginUrl = this.baseName + 'common/login';
            this.loginUrl = this.loginUrl +'?name=' + param.username + '&password=' + param.password +'&zoneId=';
        }
        return this.http.post(this.loginUrl,{})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    currentUser(): Promise<any>{
        return this.http.get(this.currentUserUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    logout(): Promise<any>{
        return this.http.post(this.logoutUrl, {})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }



    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: any;
        try {
            body = res.json();
        } catch (error) {
            return {};
        } 

        if(body.code==500) this.isLogin = false;
        return body || {};
    }
    //返回带message的结果
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: any;
        try {
            body = res.json();
        } catch (error) {
            return {};    
        }

        if(body.code==500) this.isLogin = false;
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
