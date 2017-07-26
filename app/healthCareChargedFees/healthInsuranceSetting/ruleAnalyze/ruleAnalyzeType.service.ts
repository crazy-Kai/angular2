/*药品目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
	 constructor(private http:InterceptorService ,private newHttp : Http) { }
        private baseName = '/ipharmacare-distributed-yb-web/';
        rulesAnalysisUrl = this.baseName + 'type';
        getChildrenUrl = this.baseName + 'type/tree/';
        checkNameUrl = this.baseName + 'type/checkName';//验证同名
        searchByKeyWordTreeUrl= this.baseName + "/type/keyword";/*按字查询*/
        analysisUrl = "/ipharmacare-distributed-yb-web/type/comboBox";//分析下拉框请求
        getMessageUrl = "/ipharmacare-distributed-yb-web/warningInfoSetting";//提示信息的请求
    
         //获取药品树的所有子节点
       getChildrenByNode(node?: any): Promise<any[]> {
            let tempUrl: string ;
             if (node && node.id){
                tempUrl = this.getChildrenUrl + node.id;
             }else{
                tempUrl = this.getChildrenUrl;
             }
            return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
        };


	     //获取资药品分类树
    getDrugsTree(dictVal?: string ) {

        let tempUrl = dictVal ? `${this.rulesAnalysisUrl}?dictValue=${dictVal}` : this.rulesAnalysisUrl;

        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
    // /*获取查询结果*/
    getDrugsSearchTree(dictVal:string){
        let tempUrl = this.searchByKeyWordTreeUrl+"?summary="+dictVal;
        	tempUrl = encodeURI(tempUrl);
        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
     /**
     * 药品内容逻辑
     * @Method getData() => 获取对应数据
     * @Method addData() => 添加数据到对应目录
     * @Method updateData() => 修改对应的目录
     * @Method delData() => 删除对应数据
     */
    
    //点击节点获取数据方法
    getData(id:any){
        let tempUrl:string = this.rulesAnalysisUrl + "/"+id;
        return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractJson)
                .catch(this.handleError);
    }

    updateData(data: any){
        let tempUrl:string = this.rulesAnalysisUrl;
         return this.http.put(tempUrl, data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }


    delData(id: string){
        let tempUrl:string = this.rulesAnalysisUrl +"/"+id ;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    postData(data: any){
        let tempUrl:string = this.rulesAnalysisUrl;
        return this.http.post(tempUrl, data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    
    /*检测同名*/
    checkName(name?:string,id?:any){
        let tempUrl:string;
        if(id){
             tempUrl = this.checkNameUrl+"?summary="+name+"&&id="+id;
        }else{
             tempUrl = this.checkNameUrl+"?summary="+name;
        }

        return this.newHttp.get(tempUrl)
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
  


 