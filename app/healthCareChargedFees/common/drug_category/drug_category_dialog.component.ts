import { Component, Input, Output, ViewChild, EventEmitter, OnChanges,OnInit} from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';

class Params{
    nodeId: any;               //当前节点ID
    nodeDrugCode: any;            //当前节点code
    versionId: any;         //版本ID
    drugType: any;
    type: any;//区分增加和修改
}

@Component({
    selector: 'drug-control-tree',
    template: `
       <div class="search-panel form-inline fn-H28  fn-MT10 fn-MB10">
             <div class="form-group">
                            <div class="input-group fn-MR10">
                                <div class="input-group-addon" style="border-radius: 0;"></div>
                                <input class="fn-input fn-W286"  type="text" maxlength="30" placeholder="请输入关键字" [(ngModel)]="searchKeyWord"/>
                            </div>
                            <button type="submit" class="publicBtn fn-W40"  (click)="search(searchKeyWord)">搜索</button>
             </div>
        </div>
        <div class="addcatalog-main" *ngIf="params.type != '修改'">
            
                <Tree [nodes]="addDrugsData" class="my-tree"  [options]="options"  >
                            <template #treeNodeTemplate let-node>
                                <div >
                                        <label style="font-weight: normal;cursor:pointer;"><input class="fn-VA2D" type="checkbox" *ngIf="!node.data.hasChildren" (change)="checkboxChange($event,node.data.name,node.data.code,node)" style="margin-right: 2px;"/> {{node.data.name}}</label>
                                </div>
                            </template>
                </Tree>
           
        </div>
        <div class="addcatalog-main" *ngIf="params.type == '修改'">
            <div id="addcatalog-main"  >
                    <Tree [nodes]="addDrugsData" class="my-tree"  [options]="options">
                                <template #treeNodeTemplate let-node>
                                    <div >
                                            <label style="font-weight: normal;cursor:pointer;"><input  class="fn-VA2D"  type="radio"  name="addDrugsName" *ngIf="!node.data.hasChildren" (change)="radioChange($event,node.data.name,node.data.code,node)" style="margin-right: 2px;"/>{{node.data.name}}</label>
                                    </div>
                                </template>
                    </Tree>
            </div>
        </div>
        <my-dialog></my-dialog>
    `,
    styles:[`
        .search-panel .input-group-addon{
            border-radius: 0;
            border-right:none;
            padding: 0px;
            width: 30px;
           background:url('app/images/u7006.svg') center center no-repeat;
        }
    `]
    // styleUrls:['../../../app.component.css']
})


export class DrugControlTree {
    @ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
    @ViewChild(TreeComponent)
    private tree: TreeComponent;
    ngAfterViewInit() {
        console.log("find tree");
        console.log(this.tree);
        console.log(this.dialogPlugin)
    }


    @Input() drugOptions:any;
    @Output() onChecked: EventEmitter<any> = new EventEmitter();
    constructor(private http: InterceptorService) { }

    private baseName = "/ipharmacare-distributed-yb-web/";
    private addDrugsTreeUrl = this.baseName + "drug/treeDFS";/*获取修改药品接口*/
    private searchDFStreeUrl = this.baseName + "drug/treeDFSByKeyword";/*搜索接口*/
    private params :Params = new Params();
    private addDrugsData:any;//nodeData
    private options :any;
    private searchKeyWord :any;
    private addDrugsParameter :any = [];//选中的药品
    ngOnInit(){
        this.initProperty();
        this.getDrugs();//获取药品数据
        this.options = {
             getChildren: this.getDrugsTreeChildren.bind(this),
             idField:'id'
        }
    }

    /*获取新增药品信息*/
    getDrugs(){
        this.getAddDrugsData(this.params.nodeId,this.params.nodeDrugCode,"",this.params.versionId).then( res=>{
            if(res.length){
                this.addDrugsData = res;
                 this.setExpanded(this.addDrugsData);

            }else{
                 this.addDrugsData = [];
            }
        })
    }
    /*获取新增药品信息URL*/
    
    getAddDrugsData(id:any,drugCode?:any,durgPid?:any,versionId?:any){
        let tempUrl:string;
        if(!durgPid){
            tempUrl = this.addDrugsTreeUrl + "?id="+id +"&&versionId="+versionId+"&&drugCode="+drugCode+"&&durgPid=";
        }else{
             tempUrl = this.addDrugsTreeUrl + "?id="+id +"&&versionId="+versionId+"&&drugCode="+drugCode+"&&durgPid="+durgPid.id;
        }
        return this.http.get(tempUrl)
          .toPromise()
          .then(this.extractData)
          .catch(this.handleError)
    }
    /*获取子节点*/
    getDrugsTreeChildren(node: any):any{
        return this.getAddDrugsData(this.params.nodeId,this.params.nodeDrugCode,node.data,this.params.versionId)
    }

    /*搜索URL*/
        /*搜索弹出框里的药品*/
     getDFSTree(name?:string,id?:any,versionId?:any){
        let tempUrl: string =this.searchDFStreeUrl+"?drugName="+name+"&&id="+id+"&&versionId="+versionId;
            tempUrl = encodeURI(tempUrl); 
        return this.http.get(tempUrl)
        .toPromise()
        .then(this.extractJson)
        .catch(this.handleError)
        
    }
    search(keyword?:any){
        if(keyword){
            this.searchDrug(keyword.replace(/\s+/g,""));
        }else{
             keyword = "";
             this.searchDrug(keyword);
        }
    }
    /*搜索药品*/
    searchDrug(keyword?:any){
       
        this.getDFSTree(keyword,this.params.nodeId,this.params.versionId)
        .then(res =>{
            if(res.code == 200){
                if(res.data!=""){
                    if(keyword!=""){
                        this.clearExpandNode();
                        this.setExpanded(res.data);
                    }else{
                        this.clearExpandNode();
                        this.setExpanded(res.data);
                    }
                    this.addDrugsData = res.data;
                }else{
                    this.addDrugsData = [];
                }
            } 
        })
    }

    /*勾选复选框事件*/
    checkboxChange($event,name,code,node){
        let newData:any = {};
        newData.versionId = this.params.versionId;
        newData.summary = name;
        newData.drugCode = code;
        newData.isLeaf = 1;
        newData.parentId = this.params.nodeId;
        newData.drugType =this.params.drugType;
        if($event.target.checked == true){
            /*避免重复数据*/
                if(this.addDrugsParameter.length != 0 ){
                    if(!this.contains(this.addDrugsParameter,newData).result){
                        this.addDrugsParameter.push(newData)
                    }
                }else{
                    this.addDrugsParameter.push(newData)
                    
                }
            
        }else{
            if(this.contains(this.addDrugsParameter,newData).result){
                this.addDrugsParameter.splice(this.contains(this.addDrugsParameter,newData).index,1);
            }
        }
        this.onChecked.emit(this.addDrugsParameter)
        
    }
    /*勾选单选框事件*/
     radioChange($event,name,code,node){
        if($event.target.checked == true){
            this.onChecked.emit(node.data)
        }
    }
    /*判断数组中是否包含*/
    contains(arr,target){
            let result:boolean = false;
            let obj :any = {};
             for(let i = 0; i<arr.length;i++){
                if(arr[i].drugCode == target.drugCode){
                     obj.index = i;
                     result = true;
                }
             };
             obj.result = result; 
             return obj;
        }
    setExpanded(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].open  == true && arr[i].hasChildren == true){
                this.tree.treeModel.expandedNodeIds[arr[i].id] = true;
            }
            if (arr[i].hasChildren && arr[i].children && arr[i].children.length)
                this.setExpanded(arr[i].children);
        }
    }
     /*删除展开属性*/ 
    private clearExpandNode(){
        for(let prop in this.tree.treeModel.expandedNodeIds){
            if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
                delete this.tree.treeModel.expandedNodeIds[prop];
            }
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
    private initProperty(){
        if(!this.drugOptions) return;

        this.params = this.extend(this.params, this.drugOptions);
    }
    private extend(o1, o2){
        for (let name in o2) {
            o1[name] = o2[name];
        }
        return o1;
    }
   
   
}