/*项目目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
@Injectable()

export class DataTreeService{
	 constructor(private http:InterceptorService,private newHttp : Http ) { }
	 private baseUrl = "/ipharmacare-distributed-yb-web/";
	 	officeTreeUrl = this.baseUrl + "dept/tree";/*获取节点*/
	 	searchByKeyWordTreeUrl=this.baseUrl + "dept/treeKeyword";/*按字查询*/
		addTreeUrl = this.baseUrl + "dept";/*添加*/
	 	searchTreeUrl = this.baseUrl + "dept/";/*选择节点*/
	 	
	 	
        
        
        dragTreeUrl=this.baseUrl + "dept/drag"; /*拖拽*/
      	testNameUrl = this.baseUrl +'dept/checkSummary';//检测同名
      
	 	 //获取项目树的所有子节点
	   getChildrenByNode(node: any): Promise<any[]> {
	        let tempUrl: string = this.officeTreeUrl;
             if (node && node.id){
                tempUrl += "?pid=" + node.id;
             }else{
                 tempUrl = tempUrl;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
	    };
	    
	    
	    /*检测同名*/
    checkName(name?:string,id?:any){
        let tempUrl:string;
        tempUrl = this.testNameUrl+"?summary="+name+"&&id="+id;
        return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }

	     //获取科室分类树
    getOfficeTree() {

        let tempUrl = this.officeTreeUrl;

        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
    /*获取查询结果*/
    getOfficeSearchTree(dictVal:string){
        let tempUrl = this.searchByKeyWordTreeUrl+"?name="+dictVal;
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
    getData(id:any){
        let tempUrl:string = this.searchTreeUrl+ id;
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


    delData(id: string){
        let tempUrl:string = this.searchTreeUrl + id ;
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
    /*拖拽节点的put请求*/
    postData(data:any){
        let tempUrl:string = this.dragTreeUrl;
        return this.http.put(tempUrl,data)
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


 