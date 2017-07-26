/*项目比对目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
	 constructor(private http:InterceptorService ) { }
       private baseName = "/ipharmacare-distributed-yb-web/";
       private versionUrl =this.baseName + "version/list/XM/";/*获取版本*/
       private itemCatalogueUrl = this.baseName + "comparison/item/"; //获取材料比对目录
       private searchCompareCatalogueUrl = this.baseName +'comparison/item/'; // 搜索项目比对目录
       private autoComparisonUrl = this.baseName + "comparison/project/"; //自动比对
       private standardUrl = this.baseName + "item"; //获取右侧列表
       private getSearchRightCatalogue = this.baseName +"item/comparison/keyword" //搜索右侧目录
       private deleteCompare = this.baseName + "comparison/"; /*取消比对*/
       private onlyCompareUrl = this.baseName + "comparison/item/"; //只显示未比对
       private changeUrl = this.baseName + "comparison/manualComparison"; //修改比对或者建立比对
       
       /**
     * 材料比对内容逻辑
     * @Method getVersion() => 获取版本信息
     * @Method getCompareCatalogue() => 初始化获取材料比对数据
     * @Method getSearchCompareCatalogue() => 搜索材料比对
     * @Method autoCompareCatalogue() => 自动比对
     * @Method getRightCatalogue() => 获取右侧目录
     * @Method searchRightCatalogue() => 搜索右侧材料比对
   	 * @Method deleteCompareItem() => 取消比对
   	 * @Method changeCompare() => 修改比对
     */
       getVersion(insuranceId?:any){
       		 let tempUrl:string;
       		tempUrl = this.versionUrl + insuranceId;
    	 	return this.http.get(tempUrl)
    	 		.toPromise()
    	 		.then(this.extractJson)
    	 		.catch(this.handleError)
   		}
       
       getCompareCatalogue(code?:string,insuranceId?:any,versionId?:any,type?:any){
       		let d = new Date().getTime();
    		let tempUrl :string = this.itemCatalogueUrl + code + "/" +insuranceId + "/" +versionId + "/" +type + "?" +d;
    		return this.http.get(tempUrl)
    			.toPromise()
    			.then(this.extractJson)
    			.catch(this.handleError);
    	}
       
       getSearchCompareCatalogue(name?:string,code?:string,flag?:any,insuranceId?:any,versionId?:any,type?:any){
	    	let tempUrl = this.searchCompareCatalogueUrl+ code +'/'+insuranceId +'/'+versionId+ '/' + type + "?keyword="+name;
	    	if(flag){
	    		tempUrl = tempUrl +"&&flag=" +flag;
	    	}
	    	tempUrl = encodeURI(tempUrl);
	    	return this.http.get(tempUrl)
	    		.toPromise()
	    		.then(this.extractJson)
	    		.catch(this.handleError); 
    	}
       
       autoCompareCatalogue(code?:string,type?:number,insuranceId?:any,versionId?:any){
	     	let tempUrl =this.autoComparisonUrl + code +"/"+type +"/"+insuranceId +"/"+ versionId;
	     	return this.http.post(tempUrl,{})
	     		.toPromise()
	     		.then(this.extractJson)
	     		.catch(this.handleError);
    	 }
       
       	getRightCatalogue(versionId?:any){
	     	let tempUrl = this.standardUrl +"?versionId=" +versionId;
	    	return this.http.get(tempUrl)
	    		.toPromise()
	    		.then(this.extractJson)
	    		.catch(this.handleError);
    	}
       	
       	searchRightCatalogue(name?:string,versionId?:any){
	    	let tempUrl = this.getSearchRightCatalogue + "?keyword=" +name+"&&versionId="+versionId;
	    	tempUrl = encodeURI(tempUrl);
	    	return this.http.get(tempUrl)
	    		.toPromise()
	    		.then(this.extractJson)
	    		.catch(this.handleError);
   		}
       	
       	deleteCompareItem(ids?:string){
	    	let tempUrl = this.deleteCompare + ids;
	    	return this.http.delete(tempUrl)
	    		.toPromise()
	    		.then(this.extractJson)
	    		.catch(this.handleError);   
    	}
       	
       	/*只显示未比对*/
    onlyShowNoCompare(code?:string,flag?:any,insuranceId?:any,versionId?:any,type?:any){
    	let tempUrl = this.onlyCompareUrl+code+'/'+insuranceId+"/"+versionId +"/" +type;
    	if(flag){
    		tempUrl = tempUrl+'?flag='+flag;
    	}else{
    		tempUrl = tempUrl;
    	}
    	return this.http.get(tempUrl)
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
    
    }
    
    changeCompare(data){
    	let tempUrl = this.changeUrl;
    	return this.http.post(tempUrl,data)
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
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