/*首页service*/
//import { Injectable } from '@angular/core';
//import { InvalidInformationcs,InvalidInformationc  } from './messages';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';


@Injectable()
export class IndexService {
//  invalidInformationcs :InvalidInformationc [] = InvalidInformationcs;
	constructor(private http:InterceptorService ) { }
	
	
	private baseName = "/ipharmacare-distributed-yb-web/";
	indexUrl = this.baseName + "index";//获取首页当前表格信息
	isLeadUrl = this.baseName + "index/userboot"; //判断是否需要引导
	noTipsUrl = this.baseName +"index"; //不再提示
	ignoreUrl = this.baseName + "index/"; //忽略
	
//	初始化的时候发送首页表格信息的请求
	getTableList(api){
		let tempUrl:string = api;
		return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
	}
	
// 初始化的时候判断是否需要引导
	getIsLead(){
		let tempUrl = this.isLeadUrl;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
	}
//	不再提示
	getNoTips(){
		let tempUrl = this.noTipsUrl;
			return this.http.put(tempUrl,{}).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
	}
//	忽略
	ignoreData(id:any){
		let tempUrl = this.ignoreUrl + id;
			return this.http.put(tempUrl,{})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
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
