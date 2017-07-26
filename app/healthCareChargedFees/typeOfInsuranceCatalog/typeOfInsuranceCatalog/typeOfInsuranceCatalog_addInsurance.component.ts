import { Component,OnInit,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DialogPlugin, DialogModel } from '../../common/ug-dialog/dialog';//引入插件
import {TypesOfInsuranceCatalogAddInsuranceService}  from './typeOfInsuranceCatalog_addInsurance.service';//服务
import {AddInsuranceDetail,AddInsuranceDesignation,AddInsurancePersonCategory,TestDatail} from './typeInsuranceAddInsuranceDetail';//保存中的数据
@Component({
	selector:'typeOfInsuranceCatalog_addInsurance',
	templateUrl:'typeOfInsuranceCatalog_addInsurance.component.html',
	styleUrls:['typeOfInsuranceCatalog_addInsurance.component.css'],
	providers:[TypesOfInsuranceCatalogAddInsuranceService]
})
export class TypesOfInsuranceCatalogAddInsuranceComponent implements OnInit{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;//对话框
/*变量*/
	addInsuranceDetail: AddInsuranceDetail = new AddInsuranceDetail();//参数列表
	addInsuranceDesignation:AddInsuranceDesignation[]=[];//报销分类
	addInsurancePersonCategory:AddInsurancePersonCategory[]=[];//投保人员类别
	private isShow:boolean=true;
	private isTextShow:boolean=false;
	private isShowBtn:boolean = true;//报销分类
	private reimbursements: AddInsuranceDesignation[] = [];
	private reimbursementObject: AddInsuranceDesignation  = new  AddInsuranceDesignation();
    private personCategorys: AddInsuranceDetail[] = [];//投保人员类别参数
    private personClassifies:AddInsurancePersonCategory[] = [];
    private personClassifiesObject: AddInsurancePersonCategory  = new  AddInsurancePersonCategory();
    private testDatail:TestDatail[] = [];
	insuranceName:any;//险种名称
	insuranceDescription:any;//险种简介
	insurancedrugNumbers:any;//复方位数
	insurancepayType:any;//关联的险种id
    insuranceId:number;//险种id
    isImgShow:boolean = true;
    
    TestInsuranceName:boolean = false;
    TestClassifyName:boolean = false;
    TestScale:boolean = true;
    TestPeople:boolean = true;
    CheckSameName:boolean = true;
    CheckPersonName:boolean = true;
    
    OptionClickdata:boolean = true;
    classifyName0Data:any;//保存
	gmtCreate:any;
	gmtModified:any;
	personClassifiesArray:any;
	handleType: string;
	payTypeData:any;//关联是险种id	
	payTypeDataArray:any=[];
	private resourceID = [{name:'城市职工基本医疗保险',id:"01",disabled:false},{name:'城市居民基本医疗保险',id:"02",disabled:false},{name:'新型农村合作医疗',id:"03",disabled:false},{name:'贫困救助',id:"04",disabled:false},{name:'商业医疗保险',id:"05",disabled:false},{name:'全公费',id:"06",disabled:false},{name:'全自费',id:"07",disabled:false},{name:'其他社会保险',id:"08",disabled:false},{name:'其他',id:"99",disabled:false}];//所有关联ID信息   
	personCategorysIndex:any;//删除投保人
	personCategoryShow:boolean=false;   
	index:any;//删除分类  报销分类 
	classifyShow:boolean=false;
	testNameResult :boolean = true;

	constructor(
		private typesOfInsuranceCatalogAddInsuranceService: TypesOfInsuranceCatalogAddInsuranceService,
        private router: Router,
        private route: ActivatedRoute,
        private activeRouter: ActivatedRoute
	) {}
	ngOnInit(){ 
		this.getInsuranceIddata();//关联是险种id
    }	
//原来是点击完成+删除成功之后,按钮变正常(改成遍历属性isShow,决定按钮开关)
    isButtonShow(){
		for(let item of this.reimbursements){
			if(item.isShow==true){
				this.isShowBtn = false;
			}
		}
	}
    isTextContentShow(obj){
    	obj.isShow=true;
    	this.isShowBtn=false;
    	if(obj.isShow==true){
    		this.isImgShow=false;
    	}
    }
//关联是险种id
   getInsuranceIddata(){    
   	   this.typesOfInsuranceCatalogAddInsuranceService.getInsuranceIddata()
   	     .then(res=>{
   	     	  for(let i=0;i<res.data.length;i++){
   	     	  	this.payTypeDataArray.push(res.data[i].payType);
   	     	  }
   	     	  for(let j=0;j<this.resourceID.length;j++){
   	     	  	for(let k=0;k<this.payTypeDataArray.length;k++){
   	     	  		if(this.resourceID[j].id == this.payTypeDataArray[k]){
   	     	  			this.resourceID[j].disabled = true;
   	     	  		}
   	     	  	}
   	     	  }
   	     })
   }
	optionClick($event){
	 	this.addInsuranceDetail.payType = $event;
	}
/*检测同名请求*/
   checkName(summary){
   	 this.typesOfInsuranceCatalogAddInsuranceService.checkName(this.addInsuranceDetail.name)
   	   .then(res=>{
   	   	   if(res.code == 200){
			   		if(res.data == false){
			   			 this.testNameResult = false;
			   		}else{
			   			this.testNameResult = true;
			   		}
			}else{
					if(res.code == 402){
		                    this.dialogPlugin.tip(res.message,null,"error",true);
		                    window.setTimeout(()=>{
		                    	location.reload();
	                		},3000)
	                }else{
							this.dialogPlugin.tip(res.message,null,"error",true);
                    }
	        }        
   	   })
   }
   testName(){
    	if(this.addInsuranceDetail.name!=""&&this.testNameCode(this.addInsuranceDetail.name)){
    		this.checkName(this.addInsuranceDetail.name);
    	}
    }
//验证是否输入错误
	testNameCode(value){
		let reg =/^[\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		return result;
	} 
//保存
    saveAuditPlan(): void {
    	if(this.isImgShow==true){
    		this.isImgShow=true;
    	}
    	//什么都没填,提示报错
    	if ( !this.checkUserInfoRequired(this.handleType) ) {
			    return;
		}
    	if(this.TestInsuranceName && this.TestPeople && this.CheckPersonName && this.OptionClickdata && this.testNameResult){
    		if(!this.isShowBtn){
    			this.dialogPlugin.tip("报销分类有误",null,"error");
    			return ;
    		}
			//报销分类
    		for(let i = 0;i<this.reimbursements.length;i++){
				delete this.reimbursements[i].isShow;
			//是否可以编辑
				if(this.reimbursements){
					this.reimbursements[i].isEnableModify=1;
				}else{
					this.reimbursements[i].isEnableModify=0;
				}
				//险种id
//				this.reimbursements[i].insuranceId = null;
			}
    		this.addInsuranceDetail.reimbursements = this.reimbursements;  
			//投保人员比例  
            for(let i=0;i<this.personClassifies.length;i++){
//          	this.personClassifies[i].insuranceId = null;
            	this.gmtCreate = this.personClassifies[i].gmtCreate;
            	this.gmtModified = this.personClassifies[i].gmtModified;
            }			    
           this.addInsuranceDetail.personClassifies = this.personClassifies;  
			//需要传入的其他值
       		this.insuranceName =  this.addInsuranceDetail.name;//险种名称
       		this.insuranceDescription =  this.addInsuranceDetail.description;//险种简介
       		if(this.addInsuranceDetail.drugNumbers==undefined){
       			this.addInsuranceDetail.drugNumbers = 5;
       		}
       		console.log(this.addInsuranceDetail.drugNumbers);
      		this.insurancedrugNumbers =  this.addInsuranceDetail.drugNumbers;//复方位数
      		this.addInsuranceDetail.drugNumbers = this.insurancedrugNumbers;
			//关联的险种id必填
      		this.insurancepayType =  this.addInsuranceDetail.payType;//关联的险种id
    		this.typesOfInsuranceCatalogAddInsuranceService.addAuditPlan(this.addInsuranceDetail)
    			  .then(res => {
    				if (res.code == 200) {
			            this.dialogPlugin.tip("保存成功",null,'success');
			            setTimeout(() => {
			                this.dialogPlugin.tip("保存成功",null,'success');
			                let link:any[] =['healthCareChargedFees/typeOfInsuranceCatalog'];
					    	this.router.navigate(link);
			            }, 1500);
                    }else {
			            this.dialogPlugin.tip("保存失败",null,'error');
                    }
      		});  	
    	}else if(!this.TestInsuranceName){
    		this.dialogPlugin.tip("险种名格式错误",null,"error");
    	}else if(!this.TestPeople){
    		this.dialogPlugin.tip("投保人员格式错误",null,"error");
    	}else if(!this.CheckPersonName){
    		this.dialogPlugin.tip("投保人员重名",null,"error");
    	}else if(!this.OptionClickdata){
    		this.dialogPlugin.tip("关联的险种id已经被占用",null,"error");
    	}else if(!this.testNameResult){
    		this.dialogPlugin.tip("险种名称不能重名",null,"error");
    	}
    }
//点击添加投保人员类别  
    addPersonCategory(){   	
    	if(this.CheckPersonName){
    		 let personClassifiesObject:AddInsurancePersonCategory = new AddInsurancePersonCategory();
	         this.personClassifies.push(personClassifiesObject);
	         this.personClassifiesArray = this.personClassifies;
	         for(let i=0;i<this.personClassifiesArray.length;i++){
	         	if(this.personClassifiesArray[i].classify == ''){
	         		this.CheckPersonName = false;
	         		return false;
	         	}
	         }
    	}else if(!this.CheckPersonName){
//  		this.dialogPlugin.tip("投保人同名",null,"error");
    	}
    }
//点击增加
	addDetails(){
	 	let reimbursementObject: AddInsuranceDesignation  = new  AddInsuranceDesignation();
		this.isShowBtn = false;
		this.isImgShow=false;
	 	this.reimbursements.push(reimbursementObject);
	}
//完成
	renderData(obj,i){
		if(this.TestClassifyName && this.TestScale && this.CheckSameName){
//			this.reimbursements[i].summary = obj.summary;
			if(obj.rate){
				this.reimbursements[i].rate = obj.rate;
			}else{
				this.reimbursements[i].rate = 0;
			}
			
			if(this.reimbursements[i].summary==undefined){
				this.dialogPlugin.tip("报销分类名不能为空!",null,"error");
				this.TestClassifyName = false;
				obj.isShow=true;
				this.isShowBtn = false;
				return;
			}
			
			console.log(this.reimbursements[i].summary);
//			this.reimbursements[i].description = obj.description;
			if(this.reimbursements[i].description!=undefined&&this.reimbursements[i].summary!=undefined){
				this.reimbursements[i].description = obj.description;
				this.reimbursements[i].summary = obj.summary;
			}else if(this.reimbursements[i].description==undefined&&this.reimbursements[i].summary!=undefined){
				this.reimbursements[i].description="未填写";
				this.reimbursements[i].summary = obj.summary;
			}else if(this.reimbursements[i].summary==undefined){
				this.dialogPlugin.tip("报销分类名不能为空",null,"error");
				this.CheckSameName = false;
			}else{
				this.dialogPlugin.tip("报销分类名不能为空",null,"error");
			}
			obj.isShow = false;
			this.isShowBtn = true;
			this.isImgShow=true;
			this.isButtonShow();
			this.testDatail.push(obj.summary);
		}else if(!this.TestClassifyName){
			this.dialogPlugin.tip("报销分类名错误",null,"error");
		}else if(!this.TestScale){
			this.dialogPlugin.tip("比例格式错误",null,"error");
		}else if(!this.CheckSameName){
			this.dialogPlugin.tip("报销分类名同名",null,"error");
		}
	}
// 验证提交信息必填项是否完整  点击保存按钮
	private checkUserInfoRequired(handleType: string) : boolean {
		if (!this.addInsuranceDetail.name) {
			this.dialogPlugin.tip("险种名称不能为空!");
			return false;
		}
		if (!this.addInsuranceDetail.payType) {
			this.dialogPlugin.tip("关联的险种id不能为空!");
			return false;
		}
		return true;
	} 
//输入框校验 保险名称
	testInsuranceName(value){
		let reg =/^[\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		if(result){
			this.TestInsuranceName = true;
		}else{
			this.dialogPlugin.tip("保险输入有误",null,"error");
			this.TestInsuranceName = false;
		}
	}
//分类名称
	testClassifyName(value){
		if(value){
//			let reg =/^[\u4e00-\u9fa5]{2,10}$/g;
			let reg = /^[_,.!\n\w\u4e00-\u9fa5]{2,10}$/g; 
//			let reg = /^[_,.!\n\w\u4e00-\u9fa5]{3,10}$/g; 
			let result = reg.test(value);
			if(result){
				this.TestClassifyName = true;
			}else{
				this.dialogPlugin.tip("报销分类名有误",null,"error");
				this.TestClassifyName = false;
			}
		}else{
			this.dialogPlugin.tip("报销分类名不能为空",null,"error");
			this.TestClassifyName = false;
			return false;
		}
	}
//比例校验
	testScale(value){
		if(value){
			let reg = /^[0-9]{1}$/g;
			let reg1 = /^[1-9][0-9]{1}$/g
			if(value.length==1){
				let result = reg.test(value);
				if(result){
					this.TestScale = true;
				}else{
					this.dialogPlugin.tip('比例输入有误',null,'error');
					this.TestScale = false;
				}
			}else if(value.length == 2){
				let result1 = reg1.test(value);
				if(result1){
					this.TestScale = true;
				}else{
					this.dialogPlugin.tip('比例输入有误',null,'error');
					this.TestScale = false;
				}
			}else if(value == 100){
				this.TestScale = true;
			}else{
				this.dialogPlugin.tip('比例输入有误',null,'error');
				this.TestScale = false;
			}
		}else{
			this.TestScale = true;
		}
	}
//测试投保人校验
	testPeople(value){
		if(value){
			let reg =/^[\u4e00-\u9fa5]{1,10}$/g;
			let result = reg.test(value);			
			if(result){
				this.TestPeople = true;
			}else{
				this.dialogPlugin.tip('投保人输入有误',null,'error');
				this.TestPeople = false;
			}
		}
			
	}
//删除投保人
	deleatePerson(i){
		this.personCategorysIndex = i;
		this.personCategoryShow=true;
		this.classifyShow=false;
		this.dialogPlugin.myModule();   
	}
	daleatePersonList(){
		this.personClassifies.splice(this.personCategorysIndex,1);		
		this.deleateCheckName(this.personClassifies);	
		this.dialogPlugin.onClose();
	}
//删除分类  报销分类 
	deleateClassify(i){
		this.index=i;
		this.classifyShow=true;
		this.personCategoryShow=false;
		this.isImgShow=true;
		this.dialogPlugin.myModule();     
	}
//点击图片删除本条信息  报销分类
    daleateList(){
    		this.reimbursements.splice(this.index,1);
    		this.testDatail.splice(this.index,1);
    		this.isShowBtn = true;
    		this.isButtonShow();
    		this.deleateCheckClassName(this.reimbursements);
    		this.dialogPlugin.onClose();
    }
    cancael(){
    	if(this.isImgShow==true){
    		this.isImgShow=false;
    	}
    }
    cancaelperson(){
    	if(this.isImgShow==true){
    		this.isImgShow=true;
    	}
    	if(this.isImgShow==false){
    		this.isImgShow=false;
    	}
    }
//检测报销分类同名
	checkSameName(classifyName){
		if(this.testDatail){
			for(let i=0;i<this.testDatail.length;i++){
				if(classifyName == this.testDatail[i]){
					this.CheckSameName=false;
					this.dialogPlugin.tip('报销分类名同名',null,'error');
					return false;
				}else{
					this.CheckSameName=true;
				}
			}
		}		
	}
//删除分类之后重新检测重名
	deleateCheckClassName(personArray){
		if(personArray.length>1){
			for(let i=0;i<personArray.length;i++){
				for(let j=i+1;j<personArray.length;j++){
					if(personArray[i]===personArray[j]){
						this.CheckSameName=false;
						return false;
					}else{
						this.CheckSameName=true;
					}
				}
			}
		}else{
			this.CheckSameName=true;
		}		
	}	
//检测投保人重名
	checkPersonName(personName){
		for(let i=0;i<this.personClassifies.length;i++){
			if(personName == this.personClassifies[i].classify){
				this.CheckPersonName=false;
				this.dialogPlugin.tip('投保人同名',null,'error');
				return false;
         	}else{
         		this.CheckPersonName=true;
         	}
		}
	}
//删除投保人之后重新检测重名
	deleateCheckName(personArray){
		if(personArray.length>1){
			for(let i=0;i<personArray.length;i++){
				for(let j=i+1;j<personArray.length;j++){
					if(personArray[i]===personArray[j]){
						this.CheckPersonName=false;
						return false;
					}else{
						this.CheckPersonName=true;
					}
				}
			}
		}else{
			this.CheckPersonName=true;
		}
		
	}
}
   



