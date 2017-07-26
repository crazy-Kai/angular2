/*项目目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
@Injectable()

export class DataTreeService{
	 constructor(private http:InterceptorService ,private newHttp : Http) { }
	 private baseUrl = "/ipharmacare-distributed-yb-web/";
		versionUrl =this.baseUrl + "version/list/CL/";/*获取版本*/
	 	materialTreeUrl = this.baseUrl + "material/tree";/*获取节点*/
	 	addTreeUrl = this.baseUrl + "material";/*添加*/
    searchTreeUrl = this.baseUrl + "material/";/*选择节点*/
    searchByKeyWordTreeUrl=this.baseUrl + "material/treeKeyword";/*按字查询*/
    dragTreeUrl=this.baseUrl + "material/drag"; /*拖拽*/
    reimbursementUrl = this.baseUrl + "reimbursement";/*报销分类*/
    saveMessageUrl = this.baseUrl + "warningInfoSetting";//保存警示信息设置
    testNameUrl = this.baseUrl + 'material/checkSummary';//检测同名
    testSaveUrl = this.baseUrl + 'ruleVersion/status';//点击保存检测
      
	 	 //获取项目树的所有子节点
	   getChildrenByNode(node: any,versionId?:any): Promise<any[]> {
	        let tempUrl: string = this.materialTreeUrl;
             if (node && node.id){
                tempUrl += "?pid=" + node.id+"&&versionId="+versionId;
             }else{
                 tempUrl += "?versionId="+versionId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
	    };
	    
	  /*检测是否可以保存*/
    testIsSave(nodeType?:string,versionId?:string){
        let tempUrl = this.testSaveUrl + '?nodeType=' + (nodeType?nodeType:'') + '&versionId=' + (versionId?versionId:'');

        return this.http.get(tempUrl).toPromise()
               .then(this.extractJson)
               .catch(this.handleError);

    }
	    /*检测同名*/
    checkName(name?:string,id?:any,pId?:any,versionId?:any){
        let tempUrl:string;
        if(id){
             tempUrl = this.testNameUrl+"?summary="+name+"&&id="+id+"&&versionId="+versionId+"&&pid="+pId;
        }else{
             tempUrl = this.testNameUrl+"?summary="+name+"&&versionId="+versionId+"&&pid="+pId;
        }

        return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }

	     //获取项目分类树
    getMaterialTree(dictVal?: string,versionId?:any ) {

        let tempUrl = dictVal ? `${this.materialTreeUrl}?dictValue=${dictVal}` : this.materialTreeUrl+"?versionId="+versionId;

        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
    /*获取查询结果*/
    getDrugsSearchTree(dictVal:string,versionId?:any){
        let tempUrl = this.searchByKeyWordTreeUrl+"?name="+dictVal+"&&versionId="+versionId;
            tempUrl = encodeURI(tempUrl);
        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
     /**
     * 项目内容逻辑
     * @Method getData() => 获取对应数据
     * @Method addData() => 添加数据到对应目录
     * @Method updateData() => 修改对应的目录
     * @Method delData() => 删除对应数据
     */
    
    //点击节点获取数据方法
    getData(id:any,versionId?:any){
        let tempUrl:string = this.searchTreeUrl+ id + "?versionId="+versionId;
        return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractJson)
                .catch(this.handleError);
    }

    updateData(data: any,id:any){
        let tempUrl:string = this.searchTreeUrl + id + "";
         return this.http.put(tempUrl, data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }


    delData(id: string,versionId?:any){
        let tempUrl:string = this.searchTreeUrl + id + '/' +versionId;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    addData(data: any){
        let tempUrl:string = this.addTreeUrl;
        return this.http.post(tempUrl, data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /*拖拽节点的post请求*/
    postData(data:any){
        let tempUrl:string = this.dragTreeUrl;
        return this.http.put(tempUrl,data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    /*获取版本信息*/
    getVersion(insuranceId?:any){
        let tempUrl:string;
        tempUrl = this.versionUrl  + insuranceId;
          return this.http.get(tempUrl)
          .toPromise()
          .then(this.extractJson)
          .catch(this.handleError)

    }
 
    /*报销分类*/
    getreimbursement(insuranceId?:any){
        let tempUrl:string;
        tempUrl = this.reimbursementUrl+'/'+insuranceId;
        return this.http.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }

    /*保存警示信息设置*/
    saveMessage(data?:any){
          let tempUrl:string;
          tempUrl = this.saveMessageUrl;
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



 