import { Interceptor, InterceptedRequest, InterceptedResponse } from 'ng2-interceptors';
import { Mask } from './util/mask';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogPlugin } from './healthCareChargedFees/common/ug-dialog/dialog';
import { Component,OnInit,ViewChild} from '@angular/core';

export class ServerInterceptor implements Interceptor {

    @ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
	private mask: any;
    private loginMark :any;
   
	constructor(){
		this.mask = new Mask();
        this.loginMark= true;
	}
    public interceptBefore(request: InterceptedRequest): InterceptedRequest {
        this.mask.show();
      
        return request; 
    }
    public interceptAfter(response: InterceptedResponse): InterceptedResponse {
        this.mask.close();
        
        let body: any;
        try{
            body = response.response.json();
        }catch(e){
            body = {};
             window.setTimeout(() => {
                    alert('服务器挂了！');                   
                },1000)
        }
        if(body.code == 402){
            if(this.loginMark == true){
                this.loginMark = false;
                window.setTimeout(() => {
                    alert('登录已过期，请重新登录！');
                    location.reload();
                },500)
            }
        }else if(body.code && body.code != 200 && body.code != 402){
             window.setTimeout(() => {
                    alert(body.message);
                },1000)
        }else if(body.code && body.code == 200){

         
            /*展示用户名下的退出框添加宽度，因为angualr2的template渲染需要时间，所以这里要定时器获取,这个地方还需测试*/
            window.setTimeout(()=>{
                let userWidth:any,
                    loginOutBtn:any;
                userWidth = document.getElementById('loginBtn').offsetWidth;
                loginOutBtn = document.getElementById('loginOutBtn'); 
                loginOutBtn.style.width = userWidth +'px';
            },600)
        }
        // if(body.code == 500) alert('服务器在重启，稍等！');
        return response;
    }

}


