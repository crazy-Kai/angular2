import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import 'rxjs/add/operator/toPromise';
import {AddRulesData} from './dataList';
@Injectable()
export class HealthManagementRulesService {
	 private headers = new Headers({'Content-Type': 'application/json'});
     constructor(private http: InterceptorService,private newHttp : Http) { } 
     private baseName = "/ipharmacare-distributed-yb-web/";
	 private  getversionDataURL = this.baseName + 'medicareRules';  //规则版本下拉框   
     private  getDiseaseDataURL = this.baseName +'medicareRules/disease/tree';//疾病树
     private  getDrugsDataURL = this.baseName + 'medicareRules/drug/tree';//药品树
     private  getItemsDataURL = this.baseName + 'medicareRules/item/tree';//项目树
     private  getmaterialDataURL = this.baseName + 'medicareRules/material/tree';//材料树
     private  getVisitingDataURL = this.baseName + 'visit';//就诊列表数据
     private  addRulesDataURL = this.baseName + 'visit';//就诊中新增   规则  
     private getRulesDataURL = this.baseName + 'medicareRules/ruleNumber';//五个树中有多少规则 接口    
     private deleteDataURL = this.baseName + 'visit';//五个树中有多少规则 接口     
     private testNameUrl = this.baseName + 'visit/checkSummary'; //验证重名
/*就诊  检测同名*/
    checkName(insuranceId:number,name:string,ruleVersion:any){
    	let tempUrl:string = this.testNameUrl + "?insuranceId=" + insuranceId +"&name=" + name + "&ruleVersion=" + ruleVersion;
    	return this.newHttp.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }		     
//就诊中的删除
    del(id:number,insuranceId:any,ruleVersion:any): Promise<any> {
        let tempUrl = this.deleteDataURL + "?id=" + id + '&&insuranceId=' + insuranceId + "&&ruleVersion=" + ruleVersion;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }
//规则版本下拉框   
	getversionData(insuranceId:number){
        let tempUrl:string;
        tempUrl = this.getversionDataURL + "/"+ insuranceId;
          return this.http.get(tempUrl)
          .toPromise()
          .then(this.extractJson)
          .catch(this.handleError)
    }
//疾病树
	getDiseaseDataTree(versionId?:number,insuranceId?:number,diseaseId?:any){
		let tempUrl:string;
		tempUrl = this.getDiseaseDataURL + "?versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + diseaseId;
		return this.http.get(tempUrl)
		    .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
	}
//疾病树   获取药品树的所有子节点
	   getDiseaseChildrenByNode(node: any,versionId?:number,insuranceId?:number,diseaseId?:any): Promise<any[]> {
	        let tempUrl: string;
             if (node && node.id){
                tempUrl = this.getDiseaseDataURL +  "?pcode=" + node.id + "&&versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + diseaseId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
	    };
//药品树	  
    getDrugsDataTree(versionId?:number,insuranceId?:number,drugId?:any){
		let tempUrl:string;
		tempUrl = this.getDrugsDataURL + "?versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + drugId;
		return this.http.get(tempUrl)
		    .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
	}
//药品树   获取药品树的所有子节点
	   getDrugsChildrenByNode(node: any,versionId?:number,insuranceId?:number,drugId?:any): Promise<any[]> {
	        let tempUrl: string;
             if (node && node.id){
                tempUrl = this.getDrugsDataURL +  "?pid=" + node.id + "&&versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + drugId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
	    };	   
//项目树	  
    getItemsDataTree(versionId?:number,insuranceId?:any,itemId?:any){
		let tempUrl:string;
		tempUrl = this.getItemsDataURL + "?versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + itemId;
		return this.http.get(tempUrl)
		    .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
	}
//项目树   获取药品树的所有子节点
	   getItemsChildrenByNode(node: any,versionId?:number,insuranceId?:any,itemId?:any): Promise<any[]> {
	        let tempUrl: string;
             if (node && node.id){
                tempUrl = this.getItemsDataURL +  "?pid=" + node.id + "&&versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + itemId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
	    };	
//材料树	  
    getmaterlalDataTree(versionId?:number,insuranceId?:any,materialId?:any){
		let tempUrl:string;
		tempUrl = this.getmaterialDataURL + "?versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + materialId;
		return this.http.get(tempUrl)
		    .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
	}
//材料树   获取药品树的所有子节点
	   getMaterialChildrenByNode(node: any,versionId?:number,insuranceId?:any,materialId?:any): Promise<any[]> {
	        let tempUrl: string;
             if (node && node.id){
                tempUrl = this.getmaterialDataURL +  "?pid=" + node.id + "&&versionId=" + versionId + "&&insuranceId=" + insuranceId + "&&ruleVersion=" + materialId;
             }
	        return this.http.get(tempUrl)
	            .toPromise()
	            .then(this.extractData)
	            .catch(this.handleError);
	    };		    

//就诊列表数据
      getVisitingData(insuranceId?:number,id?:any){
      	  let tempUrl = this.getVisitingDataURL + "?insuranceId=" + insuranceId + "&&ruleVersion=" + id;
      	  return this.http.get(tempUrl)
		    .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
      }
// 就诊中新增   规则  
     getAddRulesData(addRulesData:AddRulesData){
     	return this.http.post(this.addRulesDataURL, JSON.stringify(addRulesData), {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
     }
//五个树中有多少规则 接口    
     getRulesDataList(insuranceId?:number,versionId?:number){
     	 let tempUrl = this.getRulesDataURL + "?insuranceId=" + insuranceId + "&ruleVersion=" + versionId;
      	  return this.http.get(tempUrl)
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


 let id = 0;
function uuid() {
    id = id + 1;
    return id;
}

