/*药品目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
	 constructor(private http:InterceptorService ) { }
        private baseName = "/ipharmacare-distributed-yb-web/";
	 	calcTreeUrl = this.baseName + "/formula/ztree/";/*获取节点*/
        searchTreeUrl = this.baseName + "formula/";/*选择节点*/
        addTreeUrl = this.baseName + "formula";/*添加*/  
	     //获取计算分类树
    getCalcTree(dictVal?: string,insuranceId?:any ) {

        let tempUrl = dictVal ? `${this.calcTreeUrl}?dictValue=${dictVal}` : this.calcTreeUrl+insuranceId;

        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
     /**
     * 药品内容逻辑
     * @Method getData() => 获取对应数据
     * @Method updateData() => 修改对应的目录
     */
    
    //点击节点获取数据方法
    getData(id:any){
        let tempUrl:string = this.searchTreeUrl + id ;
        return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractJson)
                .catch(this.handleError);
    }
    updateData(data:any){
        let tempUrl:string = this.addTreeUrl;
         return this.http.post(tempUrl, data)
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
 


 