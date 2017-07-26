import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()
export class OrganizationBasicInformationService {
	
     constructor(private http: InterceptorService) { } 
     private headers = new Headers({'Content-Type': 'application/json'});
     private selectListURL = '/ipharmacare-distributed-yb-web/intervene/medicalOrgName';//机构模糊查询
     private gethospitalNameURL = '/ipharmacare-distributed-yb-web/intervene';//查询出所有医院
     private officeURL = '/ipharmacare-distributed-yb-web/intervene/org/';//根据机构ID查询科室
     private switchContralURL = '/ipharmacare-distributed-yb-web/intervene';//更改医院以及医院下所有科室的干预配置（开关左边）
     private rightSwitchContralURL = '/ipharmacare-distributed-yb-web/intervene/config';//更改医院以及医院下所有科室的干预配置（开关右边）
     private rightSearchURL = '/ipharmacare-distributed-yb-web/intervene/org/keyword';//是否开启医保干预 / 科室类型 / 科室名称 进行模糊查询  右边搜索
     private saveoriganizationURL = './ipharmacare-distributed-yb-web/intervene';//机构干预保存操作
  
 //机构模糊查询
     getSelectData(hospitalName:string){
     	console.log(hospitalName)
     	let tempUrl = this.selectListURL+"?hospitalName="+hospitalName;
     	tempUrl = encodeURI(tempUrl);
     	return this.http.get(tempUrl)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
     }
//查询出所有医院     
     getAllhospital(){
     	 return this.http.get(this.gethospitalNameURL)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
     }
//根据机构ID查询科室 
   getOfficeData(hospitalId:number,hospitalCode:string){
// 	  console.log(hospitalId)
// 	  console.log(hospitalCode)
   	    return this.http.get(this.officeURL + hospitalId + "/" + hospitalCode)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
   }
//是否开启医保干预 / 科室类型 / 科室名称 进行模糊查询  右边搜索 
    getsearchdata(hospitalId:number,hospitalCode:string,isIntervene:string,orgType:string,orgName:string){
     
//   	let tempur = this.rightSearchURL + "/" + hospitalId + "/" + HospitalCode+ "?isIntervene="+(isIntervene==undefined ? "" : isIntervene) + "&orgType="+(orgType==undefined ? "": orgType) + "&orgName="+(orgName ==undefined?"":orgName);
 let tempur = this.rightSearchURL  + '?hospitalId='+( hospitalId == undefined ? "" :  hospitalId ) + '&hospitalCode=' + (hospitalCode ==  undefined ? "" : hospitalCode )  + "&isIntervene=" + ( isIntervene == undefined ? "" : isIntervene) + "&orgType="+(orgType==undefined ? "": orgType) + "&orgName="+(orgName ==undefined ? "": orgName);
     	 return this.http.get(tempur)
	    	    .toPromise()
	            .then(this.extractJson)
	            .catch(this.handleError)
    }
//机构干预保存操作
    getOriganizationData(api){
     	return this.http.put(this.saveoriganizationURL, JSON.stringify(api), {headers: this.headers})
                   .toPromise()
                   .then(res => res.json())
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