import { Component } from '@angular/core';

@Component({
	selector: 'prompt-component',
	template: `
		<div class="prompt" *ngIf="show">
			<div class="dialog">
				<div class="dialog-header">
					<button class="close" (click)="close()">×</button>
					<span class="dialog-title">
						{{title}}
					</span>
				</div>
				<div class="dialog-body">
					<img class="dialog-icon" src="app/images/{{icon}}.gif">
					<div class="dialog-content">
						{{tip}}
						<div *ngIf="otherTip" style="font-size:12px; color:#666;">
							{{otherTip}}
						</div>
					</div>
				</div>
				<div class="dialog-footer">
					<button class="btn btn-sm btn-success" (click)="fnHandle('successCallback')">确认</button>
					<button class="btn btn-sm btn-grey ml10" *ngIf="!isAlert" (click)="fnHandle('closeCallback')">取消</button>
				</div>
			</div>
		</div>
	`,
	styleUrls: [ 'prompt.component.css' ]
})

export class PromptComponent {
	private show: boolean = false;
	private title: string = '提示';
	private tip: string = '提示内容';
	private otherTip: string = '';
	private successCallback: any = function(){};
	private closeCallback: any = function(){};
	private icon: string = 'alert';
	private isAlert: boolean = true;

	alert(tip){
		this.show = true;
		if(typeof tip == 'string'){
			this.tip = tip;
		}else{
			for(let prop in tip){
				if(tip.hasOwnProperty(prop)){
					this[prop] = tip[prop];
				}
			}
		}
		
		this.isAlert = true;
	}

	close(){
		this.show = false;

		this.tip = '提示内容';
		this.otherTip = '';
	}

	prompt(param){
		this.show = true;
		this.isAlert = false;
		for(let prop in param){
			if(param.hasOwnProperty(prop)){
				this[prop] = param[prop];
			}
		}
	}

	fnHandle(method){
		this[method]();

		this.close();

		this.initFn();
	}

	initFn(){
		this.successCallback = function(){};
		this.closeCallback = function(){};
	}
}