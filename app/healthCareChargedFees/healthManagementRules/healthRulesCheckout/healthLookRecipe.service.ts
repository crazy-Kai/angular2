import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {LookRecipeList,TableListData} from './lookRecipe';//表格信息
@Injectable()
export class RulesLookRecipeService {
   private headers = new Headers({'Content-Type': 'application/json'});
   constructor(private http: InterceptorService) { } 
   private baseName = '/ipharmacare-distributed-yb-web/';
   private diseaseDataListURL = this.baseName + 'catelogTree/disease';//获取疾病数据
   private diseaseDataURL = this.baseName + 'catelogTree/disease/children';//获取疾病数据
   private drugDataListURL = this.baseName + 'catelogTree/drug';//获取药品数据
   private drugDataURL = this.baseName + 'catelogTree/drug/children';//获取药品数据
   private projectDataListURL = this.baseName + 'catelogTree/item';//获取项目数据
   private projectDataURL = this.baseName + 'catelogTree/item/children';//获取项目数据
   private materialDataListURL = this.baseName + 'catelogTree/material';//获取材料数据
   private materialDataURL = this.baseName + 'catelogTree/material/children';//获取材料数据
   private getSearchURL = this.baseName + "ruleCheck/interveneTest";//规则搜索信息数据
   
//获取疾病数据
    getDiseaseDataList(insuranceId?:number,versionId?:number,ruleVersion?:any,code?:any){
   	   let tempUrl = this.diseaseDataListURL + "/" + insuranceId + "/" + versionId + "/" + ruleVersion + "?code=" + code;
		return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
    }
    getDiseaseChildrenByNode(insuranceId?:number,versionId?:number,ruleVersion?:any,node?: any): Promise<any[]>{
   	  		 let tempUrl: string;
             if (node && node.id){
                tempUrl =  this.diseaseDataURL + "/" + insuranceId + "/" + versionId + "/" + ruleVersion + "?pcode=" + node.id;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
    }
//获取药品数据
    getDrugDataList(versionId?:number,nodeId?:any,ruleType?:any,ruleVersion?:any,insuranceId?:any){
       let tempUrl = this.drugDataListURL + "?versionId=" + versionId + "&nodeId=" + nodeId + "&nodeType=" + ruleType + "&ruleVersion=" + ruleVersion + "&insuranceId=" + insuranceId;
		return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
    }
    getdrugsChildrenByNode(versionId?:number,node?: any,ruleType?:any,ruleVersion?:any,insuranceId?:any): Promise<any[]>{
   	  		 let tempUrl: string;
             if (node && node.id){
				tempUrl = this.drugDataURL + "?versionId=" + versionId + "&nodeId=" + node.id + "&nodeType=" + ruleType + "&ruleVersion=" + ruleVersion + "&insuranceId=" + insuranceId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
    }
//获取项目数据
   getProjectDataList(versionId?:number,nodeId?:any,ruleType?:any,ruleVersion?:any,insuranceId?:any){
   	   let tempUrl = this.projectDataListURL + "?versionId=" + versionId + "&nodeId=" + nodeId + "&nodeType=" + ruleType + "&ruleVersion=" + ruleVersion + "&insuranceId=" + insuranceId;
		return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
   }
   getProjectsChildrenByNode(versionId?:number,node?: any,ruleType?:any,ruleVersion?:any,insuranceId?:any): Promise<any[]>{
   	   let tempUrl: string;
             if (node && node.id){
                tempUrl = this.projectDataURL + "?versionId=" + versionId + "&nodeId=" + node.id + "&nodeType=" + ruleType + "&ruleVersion=" + ruleVersion + "&insuranceId=" + insuranceId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
   }
//获取材料数据
   getMaterailsDataList(versionId?:number,nodeId?:any,ruleType?:any,ruleVersion?:any,insuranceId?:any){
   	   let tempUrl = this.materialDataListURL + "?versionId=" + versionId + "&nodeId=" + nodeId + "&nodeType=" + ruleType + "&ruleVersion=" + ruleVersion + "&insuranceId=" + insuranceId;
		return this.http.get(tempUrl).toPromise()
			.then(this.extractJson)
			.catch(this.handleError);
   }
   getMaterailsChildrenByNode(versionId?:number,node?: any,ruleType?:any,ruleVersion?:any,insuranceId?:any): Promise<any[]>{
   	   let tempUrl: string;
             if (node && node.id){
                tempUrl = this.materialDataURL + "?versionId=" + versionId + "&nodeId=" + node.id + "&nodeType=" + ruleType + "&ruleVersion=" + ruleVersion + "&insuranceId=" + insuranceId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
   }
//获取搜索信息 数据 
    getSearchData(lookRecipeList:LookRecipeList){
    	return this.http.post(this.getSearchURL, JSON.stringify(lookRecipeList), {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
    }
//获取表格数据   
    getTableList(Api?:any){
       	   let tempUrl = Api;
       	   return this.http.get(tempUrl).toPromise()
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
   


