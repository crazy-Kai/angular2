import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()

export class DataTreeService{
	constructor(private http:InterceptorService ) {
		
	}
	private baseName = '/ipharmacare-distributed-yb-web/';
	        hospitalUrl = this.baseName+'warningInfo/hospital';//获取医院
        	officeUrl = this.baseName + 'dept/leaf'; //获取科室
        	numberUrl = this.baseName + 'dataStatistics/visitInfoStatistics/visitData';//就诊数量分析 - 就诊数据
        	dealUrl = this.baseName + 'dataStatistics/visitDispose';//就诊处理分析
        	levelUrl = this.baseName + 'dataStatistics/selectLevel';//警示信息等级分析
        	typeUrl = this.baseName + 'dataStatistics/selectSummary';//警示信息类型分析
        	interveneUrl = this.baseName + 'dataStatistics/visitInfoStatistics/interveneData';//就诊数量分析 - 干预数据
        	lanJieUrl = this.baseName + 'dataStatistics/visitInfoStatistics/interceptData';//就诊数量分析 - 拦截数据

       //获取信息
        getList(Api?:any){
       	    let tempUrl = Api;
       	    return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
        } 
       //获取科室
		getOfficeData(){
			let tempUrl =this.officeUrl;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
		//获取医院
		getHospitalData(){
			let tempUrl =this.hospitalUrl;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
		//获取就诊数量分析 - 就诊数据
		getNumberData(api?:any){
			let tempUrl = this.numberUrl+api;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
		//获取就诊数量分析 - 干预数据
		getInterveneData(api?:any){
			let tempUrl = this.interveneUrl+api;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
		//获取就诊数量分析 - 拦截数据
		getLanJieData(api?:any){
			let tempUrl = this.lanJieUrl+api;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
		//就诊处理分析
		getDealData(api?:any){
			let tempUrl = this.dealUrl+api;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError);
		}
		//警示信息等级分析
		getLevelData(api?:any){
			let tempUrl = this.levelUrl+api;
			return this.http.get(tempUrl).toPromise()
				.then(this.extractJson)
				.catch(this.handleError)
		}
		//警示信息类型分析
		getTypeData(api?:any){
			let tempUrl = this.typeUrl+api;
			return this.http.get(tempUrl).toPromise()
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