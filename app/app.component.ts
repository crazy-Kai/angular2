import { Component, OnInit, Input, trigger, state, style, transition, animate, ViewChild, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Menu } from './Menus';
import { Http } from '@angular/http';
import './rxjs-operators';
import { PathLocationStrategy } from '@angular/common';
import { UserService } from './user.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

//引入插件
// import { DialogPlugin } from './healthCareChargedFees/common/ug-dialog/dialog.plugin';

//引入Service
import { MenuService } from './menu.service';

class RegisterMessage{
    username:string;
    password:string;
    constructor(){
        this.username = "";
        this.password = "";
    }
}
@Component({
    selector: 'my-app',
    template: require('./app.component.html'),
    styles: [
        require('../src/bootstrap/css/bootstrap.min.css').toString(),
        require('../src/app.common.css') + "",
        require('./app.component.css') + "",
         require('../src/style.css') + ""
    ],
    providers: [
        MenuService,
        PathLocationStrategy 
    ]

})
export class AppComponent implements OnInit {
    selectMenu: Menu;
    selectedThrMenu:any;//选中的三级菜单
    menus :Menu[];
    currentTitle:any = '请选择左侧导航栏';
    constructor( private pathLocationStrategy: PathLocationStrategy,private menuService: MenuService, private userService: UserService, private router: Router, private http: Http) { }
    status:boolean = true;
    isLoginOutBtn:boolean = false;
    currentType:any;//当前所在页面
    adminName:any;
    registerMessage = new RegisterMessage();
    innerHtml:any = "";
    tempUrl:any="";//刷新之后路由要跳转的地方
    ngOnInit() {
        let me = this;
        window.onpopstate = function(event){
           if(location.pathname == '/' ){
               me.currentTitle = '请选择左侧导航栏';
               me.selectMenu = null;
               me.selectedThrMenu = null;
               me.tempUrl = "";
           }else{
             me.topTitle();
           }
            
        }

    	this.topTitle();
        this.currentType = 'healthCare';
        this.userService.isLogin = false;
        //让用户名获取焦点
        document.getElementById('username').focus();
        this.userService.currentUser().then(res=>{
            if(res.data){
              this.userService.isLogin = true;
              this.adminName = res.data.username;
              if(this.tempUrl != ""){
                 /*解码中文编码，因为刷新后angualr2自动编码了中文*/
                let newTempUrl :any = decodeURIComponent(decodeURIComponent(this.tempUrl));
                console.log(newTempUrl);
                this.router.navigate([newTempUrl]);
              }

            }else{
               this.userService.isLogin = false;
            }
        })
        this.adaptiveStyle();   
        


    }
    //选中一级菜单
    getFirstUrl(){
          this.currentType ='healthCare';
          this.selectMenu =  this.menuService.menus[0];
          this.currentTitle = "首页";
          this.status = true;
          this.selectedThrMenu=null;
          this.router.initialNavigation();
          this.router.navigate(['healthCareChargedFees/home']);
    }
    //改变 页面高度的自适应布局
    adaptiveStyle(){
       
        let  oDiv = document.getElementById("body-content");
        let winHeight:any;
        if (window.innerHeight)
        winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
        if (document.documentElement && document.documentElement.clientHeight)
        winHeight = document.documentElement.clientHeight;
        function _rest() {
        
            let h:number = (winHeight - oDiv.offsetHeight) / 2 - 30;
            oDiv.style.marginTop= (h>30?h:0) +"px";
           
        }
        _rest();
       window.onresize = _rest;
       
    }
    //刷新时上面title和左边目录显隐性
    topTitle(){
    	let str = window.location.href;
    	let num = str.indexOf("healthCareChargedFees");
    	if(num != -1){
    		this.tempUrl = str.substring(num);
    	}else{
            this.tempUrl = "";
        }
    	for(let item of this.menuService.menus){
           
    		if(item.subMenus.length>0){
    			for(let i of item.subMenus){
	    			if(window.location.href.indexOf(i.resource) !=-1){
	    				this.currentTitle=i.title;
	    				this.selectMenu=item;
              this.selectedThrMenu = i;
                    
	    			}
	    		}
    		}else{
    				if(window.location.href.indexOf(item.resource) !=-1){
	    				this.currentTitle=item.title;
		    			this.selectMenu=item;
	    			}
    		}
    	}
    }


    isItemShow(menu){
    	if(this.selectMenu==menu){
    		this.selectMenu=null;
    	}else{
    		this.selectMenu=menu;
    	}
    }

    onMouseenter($event){
        this.isLoginOutBtn = true;
    }
    onMoseleave($event){
        this.isLoginOutBtn = false;
    }
    //更新账号密码
    updateUsername($event){
        console.log($event)
        this.registerMessage.username = $event.replace(/\s+/g,"");
        console.log(this.registerMessage.username)
    }
    updatePassword($event){
        this.registerMessage.password = $event.replace(/\s+/g,"");
        console.log(this.registerMessage.password)
    }
    //键盘回车事件
    onEnterPressed($event){
        this.onSubmit();
    }
    /*点击登录按钮事件*/
    onSubmit(){

        if(!this.registerMessage.username){
            this.innerHtml = "请输入用户名";
        }
        if(!this.registerMessage.password){
            this.innerHtml = "请输入密码";
        }
        if(this.registerMessage.username && this.registerMessage.password){
            this.userService.login(this.registerMessage).then( res =>{
            if(res.code == 200){
               if(res.data){
                  this.adminName =  res.data.username;
               } 
                  this.userService.isLogin = true;
                  this.innerHtml = "";
                  this.selectMenu =  this.menuService.menus[0];
                  this.currentTitle = "首页";
                  this.status = true;
                  this.selectedThrMenu = null;
                  this.router.initialNavigation();
                  this.router.navigate(['healthCareChargedFees/home']);
            }else{
                 if(res.code == 405){
                    this.innerHtml = res.data;
                 }
                 this.userService.isLogin = false;
            }
            this.registerMessage.username = "";
            this.registerMessage.password = "";
          })
        }
    }
    /*登出事件*/
    loginOutFn($event){
        this.isLoginOutBtn = false;
        this.userService.logout().then( res => {
            if(res.code == 200){
                if(res.data){
                    location.reload();
                    // this.userService.isLogin = false;
                    // this.selectMenu =  this.menuService.menus[0];
                    // this.status = true;
                }
            }
        })
    }
}
