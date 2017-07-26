import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {EffectiveTimeDetail} from './tabledata';//表格数据需要传入的参数
import { InterceptorService } from 'ng2-interceptors';
@Injectable()
export class VersionEffectService {
    constructor(private http: InterceptorService) { }
    private headers = new Headers({'Content-Type': 'application/json'});
    private baseName = "/ipharmacare-distributed-yb-web/";
    private getTableDataURL = this.baseName + 'activeRule';//获取生效版本设置列表
    private getTableSelectListURL = this.baseName + 'ruleVersion/list/comboBox';//选择版本下拉框
    private getTimeDataURL = this.baseName + 'activeRule';//设置生效版本
    private delActiveDataURL = this.baseName + 'activeRule';//点击取消删除当前这条正在生效的数据
    private showDataURL = this.baseName + 'activeRule/activeTask';//获取新数据的接口	
//获取新数据的接口	    
    getShowData(insuranceId:number){
    	return this.http.get(this.showDataURL + "/" + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
    }
//获取生效版本设置列表
    getTableData(insuranceId:number){
    	return this.http.get(this.getTableDataURL + "/" + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
    }
//选择版本下拉框
    getTableSelectListData(insuranceId:number){
    	return this.http.get(this.getTableSelectListURL + "/" + insuranceId)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
    }
//设置生效版本
    getTimeData(effectiveTimeDetail:EffectiveTimeDetail){
    	return this.http.post(this.getTimeDataURL, JSON.stringify(effectiveTimeDetail), {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
    }
//删除 -> 信息
    del(effectiveTimeDetail:EffectiveTimeDetail){
        return this.http.put(this.delActiveDataURL, JSON.stringify(effectiveTimeDetail), {headers: this.headers})
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

