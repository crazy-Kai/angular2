import { Component,OnInit,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {TypesOfInsuranceCatalogChangeInsuranceService} from './typeOfInsuranceCatalog_changeInsurance.service';
import {DialogPlugin} from '../../common/ug-dialog/dialog';
import {TablePlugin} from '../../common/ug-table/table.module';
import {AddInsuranceDetail} from './typeInsuranceAddInsuranceDetail.ts';
import {InsuranceModificationDetail,InsuranceModificationListDetail,ChangeInsurancePersonCategory,PersonCategoryArray,Test} from './modification_insurance_detail';
@Component({
	selector:'typeOfInsuranceCatalog_changeInsurance',
	templateUrl:'typeOfInsuranceCatalog_changeInsurance.component.html',
	styleUrls:['typeOfInsuranceCatalog_changeInsurance.component.css'],
	providers:[TypesOfInsuranceCatalogChangeInsuranceService]
})
export class TypesOfInsuranceCatalogChangeInsuranceComponent implements OnInit{	
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
/*变量*/
	private auditPlan: AddInsuranceDetail = new AddInsuranceDetail();
	addInsuranceDetail: AddInsuranceDetail = new AddInsuranceDetail();//参数列表
	history: any = window.history;
	insuranceModificationDetail:InsuranceModificationDetail = new InsuranceModificationDetail();
	insuranceModificationListDetail:InsuranceModificationListDetail[]=[];
	private isShow:boolean=true;
	private isTextShow:boolean=false;
	private isShowBtn:boolean = true;
	private reimbursements: InsuranceModificationListDetail[] = [];
	private testDatail:Test[] = [];
	private reimbursementObject: InsuranceModificationListDetail  = new  InsuranceModificationListDetail();
	insuranceId: number;
	//根据险种id来查看数据,将数据展示出来
	modificationName:any;
	modificationDescription:any;
	modificationPersonCategory:any;
	modificationativeDrugNumbers:any;
	modificationativeId:any;
	TestInsuranceName:boolean = true;
	CheckClassifyName:boolean = true;
    TestClassifyName:boolean = false;
    TestScale:boolean = true;
    TestPeople:boolean = true;
    CheckSameName:boolean = true;
    CheckPersonName:boolean = true;
    
    isAddShow:boolean = false;
    isOldShow:boolean = false;
    
	isImgShow:boolean = true;
	isOthenImgShow:boolean = true;
	
	reimbursementsList:any;
	reimbursementsArray:any=[];
	modificationgmtModified:any;//修改时间
	modificationggmtCreate:any;//创建时间
	modificationgpayType:any;//关联险种id
	gmtModified:any;
	gmtCreate:any;
	
	previous:any; //以前的关联险种id
	
    private personClassifies:ChangeInsurancePersonCategory[] = [];//投保人员类别
    private personClassifiesObject: ChangeInsurancePersonCategory  = new  ChangeInsurancePersonCategory();
	personClassifiesList:any; //根据险种id获取数据	
	personClassifiesArray:any=[];
	payTypeData:any;//关联是险种id
	payTypeDataArray:any=[];
	private resourceID = [{name:'城市职工基本医疗保险',id:"01",disabled:false},{name:'城市居民基本医疗保险',id:"02",disabled:false},{name:'新型农村合作医疗',id:"03",disabled:false},{name:'贫困救助',id:"04",disabled:false},{name:'商业医疗保险',id:"05",disabled:false},{name:'全公费',id:"06",disabled:false},{name:'全自费',id:"07",disabled:false},{name:'其他社会保险',id:"08",disabled:false},{name:'其他',id:"99",disabled:false}];//所有关联ID信息
	reimbursementsArrayList:any=[];//保存
	personClassList:any;
	index:any;//删除投保人  新添加的
	id:any;
	personId:any; //删除投保人 原有的数据
	personIdIndex:any;
	isOldPersonShow:boolean = false;
	isPersonShow:boolean = false;
	reimbursementsArrayContent:any;//点击图片删除本条信息  报销分类  新添加的数据
	classifyDataArray:any;//检测报销分类同名   input事件
	personClassifyContent:any;//检测投保人重名
	indexClassify:any;
	idData:any;
	indexClassifyOld:any;
	reimbursementsContent:any=[];
	testNameResult :boolean = true;

	constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
        private typesOfInsuranceCatalogChangeInsuranceService: TypesOfInsuranceCatalogChangeInsuranceService
    ) { } 
	ngOnInit(){
		let insuranceId :any = this.activeRouter.params['value'].id;
        if (insuranceId) {
            this.getOptRecipe(insuranceId);
        }     
        this.id = this.activeRouter.params['value'].id;  
	    this.getInsuranceIddata();
	}
//原来是点击完成+删除成功之后,按钮变正常(改成遍历属性isShow,决定按钮开关)
    isButtonShow(){
		for(let item of this.reimbursements){
			if(item.isShow==true){
				this.isShowBtn = false;
			}
		}
		for(let item of this.reimbursementsArray){
			if(item.isTextShow==true){
				this.isShowBtn = false;
			}
		}
	}
    isTextContentShow(obj){
    	obj.isTextShow=true;
    	this.isShowBtn=false;
    	if(obj.isTextShow==true){
    		this.isOthenImgShow=false;
    		this.isImgShow=false;
    	}
    }
    isNewShow(obj){
    	obj.isShow=true;
    	this.isShowBtn=false;
    	if(obj.isShow==true){
    		this.isImgShow=false;
    		this.isOthenImgShow=false;
    	}
    }
//关联是险种id
   getInsuranceIddata(){    
   	   this.typesOfInsuranceCatalogChangeInsuranceService.getInsuranceIddata()
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
   optionClick(current){
	   	for(let i=0;i<this.resourceID.length;i++){
	   		if(this.resourceID[i].id == this.previous){
	   			this.resourceID[i].disabled = false;
	   		}
	   	}
		this.modificationgpayType = current;
   }
//根据险种id获取数据	
    getOptRecipe(insuranceId: number): void {
	        this.typesOfInsuranceCatalogChangeInsuranceService.getOptRecipe(insuranceId)
	        .then(auditPlan => {
                this.insuranceId = insuranceId;
	        	this.auditPlan = auditPlan.data;	        	
			    /*报销分类下面的参数*/
				this.reimbursementsList = this.auditPlan.reimbursements;
				this.personClassifiesList = auditPlan.data.personClassifies;
                for(let i=0;i<this.reimbursementsList.length;i++){
                	if(this.reimbursementsList[i].isEnableModify == 1){
                		this.gmtModified = this.reimbursementsList[i].gmtModified;
	                	this.gmtCreate = this.reimbursementsList[i].gmtCreate;
	                    this.reimbursementsArray.push(this.reimbursementsList[i]);
                	}
                	if(this.reimbursementsList[i].isEnableModify == 0){
                		this.gmtModified = this.reimbursementsList[i].gmtModified;
	                	this.gmtCreate = this.reimbursementsList[i].gmtCreate;
	                    this.reimbursementsContent.push(this.reimbursementsList[i]);
                	}
                } 
            	for(let j=0;j<this.reimbursementsArray.length;j++){
	        		this.testDatail.push(this.reimbursementsArray[j].summary);
	        	}
                /*投保人员类别*/
				for(let i=0;i<this.personClassifiesList.length;i++){
	        		this.personClassifiesArray.push(this.personClassifiesList[i])
	        	}
			    /*初始的值*/                
                this.modificationName =this.auditPlan.name;
	        	this.modificationDescription =this.auditPlan.description;
	        	this.modificationativeDrugNumbers =this.auditPlan.drugNumbers;
	        	this.modificationativeId =this.auditPlan.id;
	        	
	        	this.modificationgmtModified = this.auditPlan.gmtModified;
	        	this.modificationggmtCreate = this.auditPlan.gmtCreate;
	        	this.modificationgpayType = this.auditPlan.payType;
	        	this.previous = this.auditPlan.payType;
	        })
      } 
      
//添加人员类别
    addPersonCategory(){
    	if(this.CheckPersonName){
    		let personClassifiesObject:ChangeInsurancePersonCategory = new ChangeInsurancePersonCategory();
	    	this.personClassifies.push(personClassifiesObject);
    	}
    }   
/*检测同名请求*/
    checkName(summary,id){
    	this.typesOfInsuranceCatalogChangeInsuranceService.checkName(this.modificationName,this.id)
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
    	if(this.modificationName!=""&&this.testNameCode(this.modificationName)){
    		this.checkName(this.modificationName,this.id);
    	}
    }
//验证是否输入错误
	testNameCode(value){
		let reg =/^[\u4e00-\u9fa5]{2,10}$/g;
		let result = reg.test(value);
		return result;
	} 
//保存
    submitHosp(){
    	if(this.isImgShow==true){
    		this.isOthenImgShow=true;
    	}else if(this.isOthenImgShow==true){
    		this.isImgShow=true;
    	}
    	
    	if(this.TestInsuranceName && this.TestPeople && this.CheckPersonName && this.testNameResult){   
    		if(!this.isShowBtn){
    			this.dialogPlugin.tip("报销分类有误",null,"error");
    			return ;
    		}
		    //投保人员比例
			for(let i=0;i<this.personClassifies.length;i++){
            	this.personClassifies[i].insuranceId = this.insuranceId;
            }	
           this.personClassList = this.personClassifiesArray.concat(this.personClassifies);
           console.log(this.personClassList);
           this.insuranceModificationDetail.personClassifies = this.personClassList;  
           for(let i=0;i<this.insuranceModificationDetail.personClassifies.length;i++){
            	if(!this.insuranceModificationDetail.personClassifies[i].classify){
            		this.dialogPlugin.tip("投保人员类别不能为空!",null,"error");
            		return;
            	}
            }
        //需要传给后端的其他值
            this.insuranceModificationDetail.name =  this.modificationName;//险种名称
	    	this.insuranceModificationDetail.description =  this.modificationDescription;//描述
//	    	if(this.modificationativeDrugNumbers==''){
//	    		this.modificationativeDrugNumbers = 5;
//	    	}
//	    	console.log(this.modificationativeDrugNumbers);
	    	this.insuranceModificationDetail.drugNumbers =  this.modificationativeDrugNumbers;//复方位数
	    	this.insuranceModificationDetail.id =  this.modificationativeId; //id 
            this.insuranceModificationDetail.gmtModified =  this.modificationgmtModified; //id 
            this.insuranceModificationDetail.gmtCreate =  this.modificationggmtCreate; //id 
            this.insuranceModificationDetail.payType =  this.modificationgpayType; //id 
	    //报销分类
			for(let i = 0;i<this.reimbursements.length;i++){
				delete this.reimbursements[i].isShow ;
				delete this.reimbursements[i].isTextShow;
		//是否可以编辑
				if(this.reimbursements){
					this.reimbursements[i].isEnableModify=1;
				}else{
					this.reimbursements[i].isEnableModify=0;
				}
	            this.reimbursements[i].gmtCreate = this.gmtCreate; 
	            this.reimbursements[i].gmtModified = this.gmtModified; 
	            this.reimbursements[i].insuranceId = this.insuranceId; 
			}
		//判断当前是数据是就数据还是新添加的数据	  
			for(let i=0;i<this.reimbursementsArray.length;i++){
				if(this.reimbursementsArray[i].isEnableModify==1){
					this.reimbursementsArrayList.push(this.reimbursementsArray[i]);
				}
			}
            this.reimbursementsArrayList = this.reimbursementsArrayList.concat(this.reimbursements);
            for(let i =0;i<this.reimbursementsArrayList.length;i++){
            	delete this.reimbursementsArrayList[i].isTextShow;
            }
            this.insuranceModificationDetail.reimbursements = this.reimbursementsArrayList;
	    //调接口
	    	this.typesOfInsuranceCatalogChangeInsuranceService.updateInsurance(this.insuranceModificationDetail)
	    	  .then(res =>{
  	                if(res.code == 200) {
                        this.dialogPlugin.tip("保存成功",null,'success');
                        setTimeout(() => {
                            this.dialogPlugin.tip("保存成功",null,'success');
                            this.history.back();
                        }, 1500);
			        }else{
                        this.dialogPlugin.tip("保存失败",null,'error');
                    }
	    	  })
	    }else if(!this.TestInsuranceName){
    		this.dialogPlugin.tip("险种名格式错误",null,"error");
    	}else if(!this.TestPeople){
    		this.dialogPlugin.tip("投保人员格式错误",null,"error");
    	}else if(!this.CheckPersonName){
    		this.dialogPlugin.tip("投保人员重名",null,"error");
    	}else if(!this.testNameResult){
    		this.dialogPlugin.tip("险种名称不能重名",null,"error");
    	}
    } 	
//点击增加
 addDetails(){
 	let reimbursementObject: InsuranceModificationListDetail  = new  InsuranceModificationListDetail();
	this.isShowBtn = false;
	this.isImgShow = false;
	this.isOthenImgShow = false;
 	this.reimbursements.push(reimbursementObject);
 }
//完成
	renderData(obj,i){
		if(this.TestClassifyName && this.TestScale && this.CheckSameName){
			/*报销分类名称*/
			if(this.reimbursements[i].summary==undefined){
				this.dialogPlugin.tip("报销分类名不能为空!",null,"error");
				this.TestClassifyName = false;
				obj.isShow=true;
				this.isShowBtn = false;
				return;
			}
			/*报销分类比例*/
			if(obj.rate){
				this.reimbursements[i].rate = obj.rate;
			}else{
				this.reimbursements[i].rate = 0;
			}
			/*报销分类描述*/
			if(this.reimbursements[i].description!=undefined&&this.reimbursements[i].summary==undefined){
				this.dialogPlugin.tip("报销分类名不能为空!",null,"error");
				this.reimbursements[i].description = obj.description;
				this.TestClassifyName = false;
				obj.isShow=true;
				this.isShowBtn = false;
				return;
			}else if(this.reimbursements[i].description!=undefined&&this.reimbursements[i].summary!=undefined){
				this.reimbursements[i].description = obj.description;
				this.reimbursements[i].summary = obj.summary;
			}else if(this.reimbursements[i].description==undefined){
				this.reimbursements[i].description = "暂无";
			}
			obj.isShow = false;
			this.isShowBtn = true;
			this.isImgShow=true;
			this.isOthenImgShow=true;
			
			this.isShow=true;
			this.isButtonShow()
			this.testDatail.push(obj.summary);
			console.log(this.testDatail);
		}else if(!this.TestClassifyName){
			this.dialogPlugin.tip("报销分类名错误",null,"error");
		}else if(!this.TestScale){
			this.dialogPlugin.tip("比例格式错误",null,"error");
		}else if(!this.CheckSameName){
			this.dialogPlugin.tip("报销分类名同名",null,"error");
		}
	}
//完成
	renderData2(obj,i){
		if(this.TestScale && this.CheckSameName){
			/*报销分类比例*/
			if(obj.rate){
				this.reimbursementsArray[i].rate = obj.rate;
			}else{
				this.reimbursementsArray[i].rate = 0;
			}
			/*报销分类描述*/
			if(this.reimbursementsArray[i].description!=undefined&&this.reimbursementsArray[i].summary==undefined){
				this.dialogPlugin.tip("报销分类名不能为空!",null,"error");
				this.reimbursementsArray[i].description = obj.description;
				this.TestClassifyName = false;
				obj.isShow=true;
				this.isShowBtn = false;
				return;
			}else if(this.reimbursementsArray[i].description!=undefined&&this.reimbursementsArray[i].summary!=undefined){
				this.reimbursementsArray[i].description = obj.description;
				this.reimbursementsArray[i].summary = obj.summary;
			}else if(this.reimbursementsArray[i].description==undefined&&this.reimbursementsArray[i].summary==undefined){
				this.dialogPlugin.tip("报销分类名不能为空!",null,"error");
				this.reimbursementsArray[i].description = "暂无";
				this.TestClassifyName = false;
				obj.isShow=true;
				this.isShowBtn = false;
			}else if(this.reimbursementsArray[i].description==undefined){
				this.reimbursementsArray[i].description = "暂无";
			}
			
			obj.isTextShow = false;
			this.isShowBtn = true;
			this.isImgShow = true;
			this.isOthenImgShow = true;
			
			this.isButtonShow();
			this.testDatail.push(obj.summary);
			console.log(this.testDatail);
			
		}else if(!this.TestClassifyName){
//			this.dialogPlugin.tip("报销分类名不能为空222",null,"error");
		}else if(!this.TestScale){
			this.dialogPlugin.tip("比例格式错误",null,"error");
		}else if(!this.CheckSameName){
			this.dialogPlugin.tip("报销分类名同名",null,"error");
		}
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
            let reg = /^[_,.!\n\w\u4e00-\u9fa5]{2,10}$/g; 
			let result = reg.test(value);
			if(result){
				this.TestClassifyName = true;
			}else{
				this.dialogPlugin.tip("报销分类名有误",null,"error");
				this.TestClassifyName = false;
			}
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
	
//删除投保人  新添加的
	deleatePerson(i,value){	
		this.personIdIndex=i;
		this.isPersonShow = true;
		this.isOldShow = false;
		this.isAddShow = false;
		this.isOldPersonShow = false;
		this.dialogPlugin.myModule(); 
	}
//删除投保人  新增加的	给他加一个提示框
	daleatePersonShow(){
		this.personClassifies.splice(this.personIdIndex,1);
		this.deleateCheckName(this.personClassifies);
		this.dialogPlugin.onClose();  
	}
//删除投保人  原有的的
     deleatePersonOld(i,value){
     	  this.personIdIndex = i;
       	  this.personId = value.id;
       	  this.isOldPersonShow = true;
       	  this.isPersonShow = false;
		  this.isOldShow = false;
		  this.isAddShow = false;
		  this.dialogPlugin.myModule();   
     }
//删除投保人  原有的的    给他加一个提示框 
    daleateOldPersonShow(){
		this.personClassifiesArray.splice(this.personIdIndex,1);
		this.deleateCheckName(this.personClassifiesArray);
		this.deleatePersonData(this.personId);
		this.dialogPlugin.onClose();  
    }  
//从数据库中删除投保人  
	deleatePersonData(id:number){
		this.typesOfInsuranceCatalogChangeInsuranceService.delPerson(id)
		  .then(res=>{
		  })
	}
    cancael(){
    	if(this.isImgShow==true){
    		this.isImgShow=false;
    	}else{
    		this.isImgShow=true;
    	}
    	
    	if(this.isOthenImgShow==true){
    		this.isOthenImgShow=false;
    	}else{
    		this.isOthenImgShow=true;
    	}
    }
    cancaelperson(){
    	if(this.isImgShow==true){
    		this.isImgShow=true
    	}
    	if(this.isImgShow==false){
    		this.isImgShow=false;
    	}
    	if(this.isOthenImgShow==true){
    		this.isOthenImgShow=true
    	}
    	if(this.isOthenImgShow==false){
    		this.isOthenImgShow=false;
    	}
    }
//一开始就有的数据   
indexClassifyNameold:any;
    deleateClassifyShow(i,obj){
		this.idData=obj.id;
		this.indexClassify = i;
		this.indexClassifyNameold = obj.summary;
		this.isOldShow = false;
		this.isAddShow = true;
		this.isOldPersonShow = false;
       	this.isPersonShow = false;
       	this.isImgShow=true;
		this.isOthenImgShow=true;
		this.dialogPlugin.myModule();    
	}	
//点击图片删除本条信息  报销分类    一开始就有的
    daleateList(){
		this.reimbursementsArray.splice(this.indexClassify,1);
//		this.testDatail.splice(this.indexClassify,1);
        this.remove(this.indexClassify,this.indexClassifyNameold);
		this.isShowBtn = true;
		this.isButtonShow();
		this.deleateCheckClassName(this.reimbursementsArray);
		this.dialogPlugin.onClose();    		
		this.delData(this.idData);
		console.log(this.testDatail,'开始就有的的数组数据')
    }     
//删除分类   新添加的数据  删除
indexClassifyName:any;
	deleateClassify(i,obj){
		this.indexClassifyOld = i;
		this.indexClassifyName = obj.summary;
		this.isAddShow = false;
		this.isOldShow = true;
		this.isOldPersonShow = false;
       	this.isPersonShow = false;
       	this.isImgShow=true;
		this.isOthenImgShow=true;
		this.dialogPlugin.myModule();    
	}    
//点击图片删除本条信息  报销分类  新添加的数据
    daleateListShow(){  
		this.reimbursements.splice(this.indexClassifyOld,1);
//		this.testDatail.splice(this.indexClassifyOld,1);
        this.remove(this.indexClassifyOld,this.indexClassifyName);
		this.isShowBtn = true;
		this.isButtonShow();
		this.deleateCheckClassName(this.reimbursements);
		this.dialogPlugin.onClose();
		console.log(this.testDatail,'新添加的数组数据');
    } 
    indexOfs(index,val){
        for(let i = 0; i <this.testDatail.length; i++){
            if(this.testDatail[i] == val){
            	return i;
            }
        }
        return -1;
    }
	remove(i,val){
        let index = this.indexOfs(i,val);
        if(index > -1){
        	if(this.CheckSameName){
        		console.log('cunz',777777);
        		this.testDatail.splice(index,1);
        	}else if(!this.CheckSameName){
        		console.log('cunz',66)
        	}
        }
   }
//检测报销分类同名   input事件
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
// 从数据库中删除这条信息  报销分类
   delData(id:number){
   	   this.typesOfInsuranceCatalogChangeInsuranceService.del(id)
   	     .then(res=>{
   	     })
   }
//检测投保人重名
	checkPersonName(personName){
		this.personClassifyContent=this.personClassifiesArray.concat(this.personClassifies);
		console.log(this.personClassifyContent);
		for(let i=0;i<this.personClassifyContent.length;i++){
			if(personName == this.personClassifyContent[i].classify){
				if(personName!=""){
					this.CheckPersonName=false;
					this.dialogPlugin.tip('投保人同名',null,'error');
					return false;
				}else{
					this.CheckPersonName=true;
				}
         	}else{
         		this.CheckPersonName=true;
         	}
		}
	}
//删除分类之后重新检测重名
	deleateCheckClassName(personArray){
		if(personArray.length>=1){
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
}
    	
  

