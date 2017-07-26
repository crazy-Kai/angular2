/*科室比对目录service*/
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
	constructor(private http:InterceptorService ) { }
	private baseName = "/ipharmacare-distributed-yb-web/";
	 
	private compareCatalogueUrl = this.baseName + "comparison/dept/"; /*获取比对目录*/
	private searchCompareCatalogueUrl = this.baseName + "comparison/dept/";/*搜索科室比对目录*/
	private autoComparisonUrl = this.baseName + "comparison/";/*自动比对*/
	private standardUrl = this.baseName + "dept/leaf"; /*获取右侧列表*/
	private getSearchRightCatalogue = this.baseName +"dept/comparison/keyword";/*搜索右侧目录*/
	private onlyCompareUrl = this.baseName + "comparison/dept/";/*只显示未比对*/
	private deleteCompare = this.baseName + "comparison/"; /*取消比对*/
	private changeUrl = this.baseName + "comparison/manualComparison"; //修改比对或者建立比对
	
	
       
    
    	
     /**
     * 科室比对内容逻辑
     * @Method getCompareCatalogue() => 初始化获取科室比对数据
     * @Method getSearchCompareCatalogue() => 搜索科室比对
     * @Method autoCompareCatalogue() => 自动比对
     * @Method getRightCatalogue() => 获取右侧目录
     * @Method searchRightCatalogue() => 搜索右侧科室比对
   	 * @Method deleteCompareItem() => 取消比对
   	 * @Method changeCompare() => 修改比对
     */
    getCompareCatalogue(code?:string){
    	let d = new Date().getTime();
    	let tempUrl : string = this.compareCatalogueUrl + code +"?" +d;
    	return this.http.get(tempUrl)
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
    }
    getSearchCompareCatalogue(name?:string,code?:string,flag?:any){
    	
    	let tempUrl = this.searchCompareCatalogueUrl+code +"?keyword="+name;
    	if(flag){
    		tempUrl = tempUrl+"&&flag=" +flag;
    	}
    	tempUrl = encodeURI(tempUrl);
    	return this.http.get(tempUrl)
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
    	
    }
    autoCompareCatalogue(code?:string,type?:number){
    	let tempUrl = this.autoComparisonUrl+code+'/'+type;
    	return this.http.post(tempUrl,{})
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
    }
    
    getRightCatalogue(){
    	let tempUrl = this.standardUrl;
    	return this.http.get(tempUrl)
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
    	
    }
    
    searchRightCatalogue(name?:string){
    	let tempUrl = this.getSearchRightCatalogue +"?keyword="+name;
    	tempUrl = encodeURI(tempUrl);
    	return this.http.get(tempUrl)
    		.toPromise()
    		.then(this.extractJson)
    		.catch(this.handleError);
    }
	  /*只显示未比对*/
    onlyShowNoCompare(code?:string,flag?:any){
    	let tempUrl = this.onlyCompareUrl 
    	if(flag){
    		tempUrl = tempUrl+code+'?flag='+flag;
    	}else{
    		tempUrl = tempUrl+code;
    	}
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