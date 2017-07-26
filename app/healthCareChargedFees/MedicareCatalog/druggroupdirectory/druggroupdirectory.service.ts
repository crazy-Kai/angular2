/*药品目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
     constructor(private http:InterceptorService ,private newHttp : Http) { }
        private baseName = "/ipharmacare-distributed-yb-web/";
        drugsTreeUrl = this.baseName + "drugGroup/index";/*获取节点*/
        oldModifyUrl = this.baseName + 'drugGroup';/*获取已经添加的药品数据*/
        addDrugsTreeUrl = this.baseName + "drugGroup/drugTree";/*获取修改药品接口*/
        toggelDrugsTreeUrl = this.baseName + "drugGroup/drug";//点击节点获取数据
        searchByKeyWordTreeUrl= this.baseName + "drugGroup/keyword";/*按字查询*/
        testNameUrl =this.baseName+ 'drugGroup/checkName';//检测同名
        versionUrl = this.baseName + "version/list/YP/";/*获取版本*/
        getDrugsDataUrl = this.baseName + 'drugGroup/ztree';//获取修改药品的树
         //获取资药品分类树
    getDrugsTree(dictVal?:string,insuranceId?:any,versionId?:any) {
        let tempUrl = dictVal ? `${this.drugsTreeUrl}?dictValue=${dictVal}` : this.drugsTreeUrl+'/'+ insuranceId+'/'+versionId;
        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
    // /*获取查询结果*/
    getDrugsSearchTree(dictVal:string,insuranceId,versionId){
        let tempUrl = this.searchByKeyWordTreeUrl+'/'+insuranceId +'/'+versionId+"?drugName="+dictVal;
            tempUrl = encodeURI(tempUrl);
        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }

    /*获取子节点*/
     getChildrenByNode(drugCode?:any,drugs?:any): Promise<any[]> {
            let tempUrl: string = this.getDrugsDataUrl + '?drugCodes='+drugs;
             if (drugCode && drugCode.id){
                tempUrl = this.getDrugsDataUrl + "?pid=" + drugCode.id+"&&drugCodes="+drugs
             }
            return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
        };
     /*获取版本信息*/
    getVersion(insuranceId?:any){
        let tempUrl:string;
        tempUrl = this.versionUrl  + insuranceId;
          return this.http.get(tempUrl)
          .toPromise()
          .then(this.extractJson)
          .catch(this.handleError)

    }
     /**
     * 药品内容逻辑
     * @Method getData() => 获取对应数据
     * @Method addData() => 添加数据到对应目录
     * @Method updateData() => 修改对应的目录
     * @Method delData() => 删除对应数据
     */
    
    //点击节点获取数据方法
    getData(id?:any,versionId?:any){
        let tempUrl:string = this.oldModifyUrl + "/"+id + '/' + versionId;
        return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractJson)
                .catch(this.handleError);
    }
    // 获取药品数据方法
    getDrugs(code?:any){
         let tempUrl:string = this.toggelDrugsTreeUrl + "?drugCode="+code;
          return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractJson)
                .catch(this.handleError);
    }
    updateData(data: any){
        let tempUrl:string = this.oldModifyUrl;
         return this.http.post(tempUrl, data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //获取修改药品
    getDrugsData(drugCode?:string,versionId?:any ){
         let tempUrl = drugCode ? this.getDrugsDataUrl+ '/'+ versionId + '?drugCodes='+drugCode +'&&pid=""' : this.getDrugsDataUrl +'/'+ versionId +'?pid=""';
        return this.http.get(tempUrl).toPromise()
            .then(this.extractJson)
            .catch(this.handleError);

    }
    delData(id: string){
        let tempUrl:string = this.oldModifyUrl + '?drugGroupId='+id ;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    postData(data: any){
        let tempUrl:string = this.oldModifyUrl;
        return this.http.post(tempUrl, data)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    
    /*检测同名*/
    checkName(name?:string,id?:any,versionId?:any){
        let tempUrl:string;
        if(id){
             tempUrl = this.testNameUrl+"?summary="+name+"&&id="+id+"&&versionId="+versionId;
        }else{
             tempUrl = this.testNameUrl+"?summary="+name+"&&versionId="+versionId;
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


 