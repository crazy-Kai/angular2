/**
 *  @author: anwen
 *  @Description:TODO(弹窗组件的封装)     
 */
import { Component, Input, Output, ContentChild, TemplateRef } from '@angular/core';
import { DialogContentPlugin } from './dialog.content.plugin';
import { DialogModel } from './dialog.model';
import { Observable } from 'rxjs/Observable';
import { AdHocComponentFactoryCreator } from './adhoc-component-factory.service';
import { IDialogModel } from './dialog.content.plugin';
export class Dialog {
    isShow: boolean;//false显现，true隐藏
    message: string;
    noMessage:string;
    isConfirm: boolean;
    confirmMessage: string;
    deniedMessage: string;
    loading: boolean;
    tip:boolean;
    isCancel:boolean;
    status:string;
    resMessage:boolean;
    constructor() {
        this.isShow = false;
        this.message = "warning";
        this.isConfirm = false;
        this.confirmMessage = "OK";
        this.deniedMessage = "CANCEL";
        this.loading = false;
        this.tip = false;
        this.isCancel = true;
    }
}

@Component({
    selector: 'my-dialog',
    template: `
    <div  *ngIf="dialogModel.confirmModule" class="dialog" [hidden]="!dialogInfo.isShow" >
        <div class="dialog-message" [hidden]="!dialogInfo.tip"  [class.dialog-success]="dialogInfo.status == 'success'"  [class.dialog-resMessage]="dialogInfo.resMessage == true" >
            <div *ngIf="!dialogInfo.resMessage" class="fn-word-wrap" style="font-size:13px;">
                <span class="{{dialogInfo.status}}-image" ></span>{{dialogInfo.message}}
            </div>
            <div *ngIf="dialogInfo.resMessage" class="fn-clear" style="font-size:13px;width:100%;height:100%;padding:10px;line-height:30px;text-align:left;">
                    <div  style="display:inline-block;float:left;width:20px;height:100%;">
                        <span class="{{dialogInfo.status}}-image"></span>
                    </div>
                    <div style="display:inline-block;float:left;width:278px;height:100%;">
                        {{dialogInfo.message}}
                    </div>
                    <div style="clear:both;"></div>
            </div>
        </div>
        <div [hidden]="!dialogInfo.isConfirm" class="confirm center">
            <div class="warning">
                <div class="warning-image"></div>
            </div>
            <div >
                <div class="center" style="font-size:16px;margin-bottom:10px;">{{dialogInfo.message}}</div>
                <div class="center" style="font-size:13px;color:#999;word-wrap:break-word;word-break:break-all;white-space:normal;">{{dialogInfo.noMessage}}</div>
            </div>
            <div  class="center" >
                <button  *ngIf="dialogInfo.isCancel"  class="dialog-btn-cancel" (click)="dialogInfo.isShow = false;callbackError();">取消</button>
                <button   class="dialog-btn-determine"  (click)="dialogInfo.isShow = false;callbackSuccess();">确认</button>
            </div>
        </div>
    </div>
    <div class="container" *ngIf="dialogModel.customModule">
        <template *ngIf="dialogModel.customModule" [ngTemplateOutlet]="dialogTemplate" [ngOutletContext]="{ $implicit: dialogModel }" ></template>
        <div class="in modal-backdrop fade"></div>
    </div>
    <div class="container" *ngIf="dialogModel.isTemplate">
        <div class="modal" style="display:block;" [class.fade]="!dialogModel.isTemplate">
            <div class="modal-dialog ">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">
                        <span (click)="onClose()">x</span>
                        <span class="sr-only" (click)="onClose()">关闭</span>
                    </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <my-dialog-content [dialogTemplate]="dialogTemplate"></my-dialog-content>
                </div>
            </div>
        </div>
        <div class="in modal-backdrop fade" *ngIf="dialogModel.isTemplate"></div>
    </div>
    `,
    styles: [require('./dialog.plugin.css') + ""],
    providers: [DialogModel, AdHocComponentFactoryCreator]
})
export class DialogPlugin {
    @Input() title = "知识管理平台";
    @Input() dialogMsgWidth: number = 200;  //消息浮动层的默认宽度，同css设置的宽度
    @ContentChild('dialogTemplate') dialogTemplate: TemplateRef<IDialogModel>;
    callbackSuccess: any;
    callbackError: any;
    dialogInfo = new Dialog();
    constructor(private dialogModel: DialogModel) { };
    specialMsg: string;
    ignoreLoading: boolean;
    //@Description:TODO(提示框)     
    tip(message: string, ignoreLoading?: boolean,status?:string,resMessage?:boolean) {     //ignoreLoading  忽略持续性loading事件  直接关闭对话框
        this.dialogInfo.isConfirm = false;
        this.dialogInfo.isShow = true;
        this.dialogInfo.tip = true;
        this.dialogInfo.status = status;
        this.dialogInfo.message = message;
        this.ignoreLoading = ignoreLoading;
        this.dialogInfo.resMessage = resMessage;
        this.dialogModel.confirmModule = true;
        window.setTimeout(() => {
            if (!this.dialogInfo.isConfirm) {
                this.dialogInfo.isShow = false;
                this.dialogInfo.tip = false;
            }
            //如果存在一个持续性loading事件，由它来控制关闭
            if (this.dialogInfo.loading) {
                if (this.ignoreLoading) return;

                this.dialogInfo.isShow = true;
                this.dialogInfo.message = this.specialMsg;
            }
               this.dialogModel.confirmModule = false;
        }, 2000);
    }

    //@Description: 特殊事件，加载。
    loading(message: string) {
        this.dialogInfo.loading = true;
        this.dialogInfo.isShow = true;
        this.dialogInfo.message = this.specialMsg = message;
    }
    success() {
        this.dialogInfo.loading = false;
        this.dialogInfo.isShow = false;
    }

    //@Description:TODO(对话框)    
    confirm(message: string, callbackSuccess: () => void, callbackError: () => void,isCancel?:boolean,noMessage?:string) {
        this.dialogModel.confirmModule = true;
        this.dialogInfo.noMessage = noMessage;
        this.dialogInfo.isShow = true;
        this.dialogInfo.isConfirm = true;
        this.dialogInfo.message = message;
        this.callbackSuccess = callbackSuccess;
        this.callbackError = callbackError;
        if(isCancel != undefined){
            this.dialogInfo.isCancel = isCancel;
        }else{
            this.dialogInfo.isCancel = true;
        }
    }


    confirmWin(message?: string) {
        // return new Observable((observer:any) =>{
        return window.confirm(message || 'Is it OK?');
        // });
    };

    //@Description:TODO(自定义框)
    myDialog(title?: string) {
        if ( title ) {
            this.title = title;
        }
        this.dialogInfo.isShow = false;
        this.dialogModel.isTemplate = true;
        // this.dialogModel.setData({ dialogTemplate: myComponent });
    }
    myModule(){
        this.dialogModel.customModule = true;
    }

    onClose() {
        this.dialogModel.isTemplate = false;
        this.dialogModel.customModule = false;
    }
}