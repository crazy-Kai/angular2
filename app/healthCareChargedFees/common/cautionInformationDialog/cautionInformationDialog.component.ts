/*
	公用警示信息设置组件
*/

import { Component, Input, Output, ViewChild, EventEmitter, OnChanges , OnInit} from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';
import { FileInfo , DataList} from './FileInfo';


@Component({
    selector: 'cautionInformationDialog',
    template: `
	  	<div class="settingMessage-hander">
			警示信息设置
	  	</div>
	  	<div class="settingMessage-main fn-clear" >
	  		<div *ngIf="isShow == true">
		  		<div class="form-inline">
		  			<div class="fn-MB10">
						<div class="form-group fn-MR10">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">使用范围：</label>
							<select class="form-control form-control-sm fn-W126 fn-H24" style="padding:0;border-radius:0;" [(ngModel)]="dataList.scope">
									<option value="">请选择</option>
					                <option value="1">门诊</option>
					                <option value="2">住院</option>
		            		</select>
						</div>
						<div class="form-group fn-MR10">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">分析类型：</label>
							<select class="form-control form-control-sm fn-W126 fn-H24" style="padding:0;border-radius:0;" [(ngModel)]="dataList.analysisType"  (ngModelChange)="selectedanalysis($event)">
					                <option value="">请选择</option>
					                <option *ngFor="let obj of analysis" value="{{obj.id}}">{{obj.name}}</option>
					             
		            		</select>
					               
						</div>
						<div class="form-group">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">提示类型：</label>
							<select class="form-control form-control-sm fn-W126 fn-H24" style="padding:0;border-radius:0;" [(ngModel)]="dataList.promptType">
					                <option value="">请选择</option>
					                <option *ngFor="let obj of promptmessage"  value="{{obj.id}}">{{obj.name}}</option>
					                
		            		</select>
						</div>
		  			</div>
		  			<div class="fn-MB12">
						<div class="form-group fn-MR23px">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">警示等级：</label>
							<select class="form-control form-control-sm fn-W72 fn-H24" style="padding:0;border-radius: 0;" [(ngModel)]="dataList.level" >
					                <option value="" >请选择</option>
					                <option value="0">0</option>
					                <option value="1">1</option>
					                <option value="2">2</option>
					                <option value="3">3</option>
					                <option value="4">4</option>
					                <option value="5">5</option>
					                <option value="6">6</option>
					                <option value="7">7</option>
					                <option value="8">8</option>
									<option value="9">9</option>
		            		</select>
						</div>
						<div class="form-group fn-MR23px">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">是否启用：</label>
							<select class=" form-control form-control-sm fn-W72 fn-H24" style="padding:0;border-radius: 0;" [(ngModel)]="dataList.isEnable">
									<option value="">请选择</option>
					                <option value="1">启用</option>
					                <option value="0">禁用</option>
		            		</select>
						</div>
						<div class="form-group fn-MR23px">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">警示状态：</label>
							<select class="form-control form-control-sm fn-W72 fn-H24" style="padding:0;border-radius: 0;" [(ngModel)]="dataList.status">
									<option value="">请选择</option>
					                <option value="确认">确认</option>
					                <option value="缺省">缺省</option>
									<option value="待查">待查</option>
		            		</select>
						</div>
						<div class="form-group ">
							<label class="control-label" style="margin-top:2px;font-size: 13px;">使用理由：</label>
							<select class="form-control form-control-sm  fn-W72 fn-H24" style="padding:0;border-radius: 0;" [(ngModel)]="dataList.isNeedReason">
									<option value="">请选择</option>
					                <option value="1">需要</option>
					                <option value="2">不需要</option>
		            		</select>
						</div>
		  			</div>
		  		</div>
		  		<div class="fn-disInBl settingMessage-left">
					<div class="settingMessage-addName">
						<div class="settingMessage-addName-hint">提示信息：<em>插入节点名称</em></div>
						<div class="form-inline">
								<textarea  class="form-control fn-W290 fn-PaAl6"  style="height:127px;max-height:127px;max-width:290px;font-size: 13px;border-radius: 0;" [(ngModel)]="dataList.promptMessage"></textarea>
					    </div>
					</div>
					<div class="settingMessage-addName">
						<div class="settingMessage-addName-hint">处理意见：<em>插入节点名称</em></div>
						<div class="form-inline">
								<textarea  class="form-control fn-W290 fn-PaAl6"  style="height:127px;max-height:127px;max-width:290px;font-size: 13px;border-radius: 0;"[(ngModel)]="dataList.processingOpinion" ></textarea>
					    </div>
					</div>
		  		</div>
		  		<div class="fn-disInBl settingMessage-right">
					<div class="settingMessage-addName-hint">管理依据：</div>
					<div class="settingMessage-message">
							<ul >
								<li *ngFor="let obj of medicareRules;let i = index;" id="managementBasis" (mouseenter)="selectedMessage=obj;" [class.settingMessage-message-selected]="obj == selectedMessage" class="settingMessage-li">
									<label class="fn-ellipsis" title="{{obj.name}}" style="cursor:pointer;"><input class="fn-VA2D"  value="{{obj.id}}" [(ngModel)]="obj.checked" type="checkbox"  (change)="checkMessage($event.target.checked, i)"/> {{obj.name}}</label>
								</li>
							</ul>
					</div>
		  		</div>
	  		</div>
	  	</div>
	  	<my-dialog></my-dialog>
    `,
    styles:[`
		.form-inline textarea.form-control{
			width:290px;
		}
		.settingMessage-main{
			height:430px;
		}
		.settingMessage-main .form-inline .fn-W126{
			width:126px;
		}
		.settingMessage-main .form-inline .fn-W72{
			width:72px;
		}
		.settingMessage-message li{
			border-right:none;
		} 
    `]
    // styleUrls:['../../../app.component.css']
})
export class CautionInformationDialogComponent {
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	@Input() option:any;
	@Output() getDataList: EventEmitter<any> = new EventEmitter();
	@Output() getMedicareRules: EventEmitter<any> = new EventEmitter();
	ngAfterViewInit() {
        console.log(this.dialogPlugin)
    }
	/*变量*/
	private isShow:boolean = false;
	private analysis:any;
	private selectedMessage:any;
	private promptmessage:any;
	private baseName = '/ipharmacare-distributed-yb-web/';
	private getMessageUrl = this.baseName + "warningInfoSetting";//提示信息的请求
	private warningUrl = this.baseName + "policy/policyForSelect";/*医保规则*/
	private analysisUrl = this.baseName + "type/comboBox";//分析下拉框请求
	private promptmessageUrl = this.baseName + "type/comboBox/";//提示类型请求
	private dataList :any;
	private medicareRules :any = [];
	constructor(private http: InterceptorService) { }

	ngOnInit(){
		this.isShow = false;
		this.dataList = this.option.dataList;
		this.medicareRules = this.option.medicareRules;
		this.option.curNodeId?this.getMessageData(this.option.versionId,this.option.insuranceId,this.option.curNodeId)
		:this.getMessageData(this.option.versionId,this.option.insuranceId);
		// this.getAnalysisData();
		
	}

	/*获取警示信息和规则*/
	getMessageData(versionId?:any,insuranceId?:any,nodeId?:any){
		this.getInitMessage(versionId,insuranceId,nodeId).then(res =>{
			if(res.code == 200){
		  		if(res.data){
		  			this.dataList = res.data;
		  			console.log(this.dataList)
					this.getDataList.emit(this.dataList);
		  			this.getWarningMessage(this.dataList.managementBasis)
				   	 .then( res =>{
				   	 	if(res.code == 200){
					   	 	 if(res.data.length != 0){
					   	 	 	this.medicareRules = res.data;
					   	 	 	this.getMedicareRules.emit(this.medicareRules);
					   	 	 	this.getAnalysisData();
					   	 	 }else{
					   	 	 	this.medicareRules  = [];
					   	 	 }
				   	 	}
				   	 })
		  		}else{
		  			res.data = [];
		  		}
	  		}
		})

	}
	// /*获取规则*/
	getWarningMessage(ids){
        let tempUrl:string;
        tempUrl  = this.warningUrl+"?ids="+ids;
        return this.http.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }
	
	//  /*获取警示信息*/
    getInitMessage(versionId?:any,insuranceId?:any,nodeId?:any){
       let tempUrl:string;
           if(nodeId){
                tempUrl = this.getMessageUrl+"/"+versionId+"/"+insuranceId+"?nodeId="+nodeId;
           }else{
                tempUrl = this.getMessageUrl+"/"+versionId+"/"+insuranceId;
           }
        return this.http.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }
    /*获取分析类型*/	
	getAnalysisData(){
		this.getAnalysis().then(res =>{
			if(res.code == 200){
				console.log(res.data.length)
	   			if(res.data.length){
	 			 	this.analysis = res.data;
	 			 	console.log(this.dataList.analysisType)
	 			 	if(this.dataList.analysisType){
	 			 		this.getPromptmessage(this.dataList.analysisType)
	 			 	}else{
	 			 		this.isShow = true;
	 			 		this.promptmessage = [];
	 			 	}
	   			}
	   		}
		})
	}
	/*分系类型请求*/
	getAnalysis(){
		let tempUrl:string;
          tempUrl = this.analysisUrl;
        return this.http.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
	}
	/*获取提示信息*/
	getPromptmessage(id?:any){
			this.getPromptmessageUrl(id).then(res=>{
				if(res.code == 200 ){
		  	 		if(res.data.length){
		  	 			this.promptmessage = res.data;
						this.isShow = true;

		  	 		}else{
		  	 			this.promptmessage = [];
		  	 		}
		  	 	}
		})
	}

	// /*获取提示信息URL*/
	getPromptmessageUrl(id?:any){
        let tempUrl:string;
        tempUrl = this.promptmessageUrl+id;
        return this.http.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
    }
    /*切换分析类型*/
    selectedanalysis($event){
	  	if($event){
		  	let analysisId:any = $event;
		  	 this.dataList.analysisType = analysisId;
		  	this.getPromptmessage(analysisId);
	  	}else{

	  		this.promptmessage = [];
	  	}
		 this.dataList.promptType = "";
	  	
		 
  	}

	checkMessage(checked: boolean, i: number){
	  	if (checked) {
				this.medicareRules[i].checked = true;
			} else {
				this.medicareRules[i].checked = false;
			}
  	}
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
    }
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


}