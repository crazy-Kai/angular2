/*
    codeby DemoXu
    options： 主要是接收DRUG_ID 药品ID,用于查询部分分类
*/
import { Component, Input, Output, ViewChild, EventEmitter, OnChanges,OnInit} from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';


@Component({
    selector: 'drug-category-tree',
    template: `
        <div class="relevanceDrugs-main fn-clear">
                    <div class="multitree-tree">
                        <div class="drugsObject">药品目录</div>
                        <div class="relevanceDrugs-tree my-tree">
                        	
                           	<Tree #tree [nodes]="drugNodes" [options]="options"  class="treeWidth">
                                 <template #treeNodeTemplate let-node>
                                                <div style="line-height: 20px;cursor:pointer;">
                                                    <span class="button" *ngIf="node.data.type == 1" [class.status0]="node.data.orgxtType == 0 " [class.status04]="node.data.orgxtType == 1 " [class.status02]="node.data.orgxtType == 2 " [class.status01]="node.data.orgxtType == 3 "></span>{{node.data.name}}
                                                </div>
                                </template>
                            </Tree>
                        </div>
                    </div>
                    <div class="multitree-nodes">
                        <div class="drugsObject">已选择药品</div>
                        <div class="checkedDrugs">
                            <ul *ngIf="isSuccess">
                                <li *ngFor="let obj of drugs;let i = index;">
                                        <div (click)="deleteCheckName(obj,i)" style="cursor:pointer;">
                                            <span class="button status04"></span>{{obj.summary}}
                                        </div>
                                </li>
                            </ul>
                        </div>
                        
                    </div>
        </div>
        <my-dialog></my-dialog>
    `,
    styleUrls:['./drug_category_tree.component.css']
})
export class DrugCategoryTree implements OnChanges {
    @ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
    @ViewChild('tree')
	private tree: TreeComponent;
    ngAfterViewInit() {
        console.log("find tree");
        console.log(this.tree);
        console.log(this.dialogPlugin)
    }

    @Input() nodes: any;
    @Input() keyword: String;
    @Input() drugCode:string;
    @Input() drugUrl:string;
    @Input() drugs: any;
    @Output() onActivate: EventEmitter<any> = new EventEmitter();
    searchDrugyUrl = '/ipharmacare-distributed-yb-web/drugGroup/drugName';
    drugNodes: any[] = [];
    searchKeyWord:string;
    options: any;
    drugCategoryUrl = '/api/v1/drugTree';
    isSuccess = false;
    //药品 url
    private baseName = "/ipharmacare-distributed-yb-web/";
    constructor(private http: InterceptorService) { }
    
    ngOnInit() {
        if(this.drugs == undefined){
            this.drugs = [];
        }
        this.options = {
            getChildren: this.getChildren.bind(this),
            actionMapping: {
                mouse: {
                    click: (tree, node, $event) => {
                        this.checkedNode(node)
                    }
                }
            },
            idField:'id',

        };
     
        this.getDrugCategory(this.drugCode).then(res => {
            if(res.code == 200){
              this.drugNodes = res.data;

              this.isSuccess = true;
            }

        });
	}

 

    private getDrugCategory(drugCode?:string): any {
        this.clearExpandNode();
         let tempUrl = drugCode ? this.drugUrl+ '?drugCodes='+drugCode +'&&pid='+ '' : this.drugUrl +'?pid='+'';
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    };
     private getChildren(node: any): any {
		let code:any,
            drugCodes:any = [];
        if(this.drugs.length !=0){
            for(let i = 0; i<this.drugs.length;i++){
                    drugCodes.push(this.drugs[i].id);
            }
            code = drugCodes.join(",");
        }else{
            code = "";
        }
        return this.getChildrenByNode(node.data,code);
	}
     /*获取子节点*/
     private getChildrenByNode(drugCode?:any,drugs?:any): any {
            let tempUrl: string = this.drugUrl + '?drugCodes='+drugs;
             if (drugCode && drugCode.id){
                tempUrl = this.drugUrl + "?pid=" + drugCode.id+"&&drugCodes="+drugs;
             }
            return this.http.get(tempUrl)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
        };

    /*选择药品节点*/
    private checkedNode(node){
        this.onActiveEvent(node.data,node)
    }
    private onActiveEvent(node?:any,treeNode?:any){
        if(node.type == 1){

            let code:any = node.id;
            let flag:any = false,
                same:any = false;
            node.summary = node.name;
            node.drugCode = node.id;
            node.pid = node.pid;
            if(!this.drugs){
                this.drugs = [];
            }

            if(this.drugs.length !=0){
                console.log('length != 0')
                for(let k = 0;k<this.drugs.length;k++){
                    if( node.pid != this.drugs[k].pid){
                       same = true;
                       break;
                    }
                }

                if(same == true){
                    this.dialogPlugin.tip('请在同一目录中选择药品',null,'error');
                }else{

                    for(let i = 0;i<this.drugs.length;i++){
                        if(code == this.drugs[i].id){
                            this.drugs.splice(i,1);
                            console.log('重复')
                            this.deleteStaus(treeNode)
                            flag = true;
                            break;
                        }
                     }
           
                    if(flag == false){
                        console.log('没有重复的')
                        this.drugs.push(node);
                        this.addStatus(treeNode)
                    }
                   
                }
                  this.drugs.length != 0 ?  this.onActivate.emit(this.drugs[0].pid) : this.onActivate.emit('')
                 
            }else{
                console.log('length == 0')
                this.drugs.push(node);
                this.addStatus(treeNode);
                this.drugs.length != 0 ?  this.onActivate.emit(this.drugs[0].pid) : this.onActivate.emit('')
            }
        }  
    }
  
   private deleteStaus(node){
        switch(node.data.orgxtType){
            case  1:
            node.data.orgxtType = 0;
            this.getParentNode(node);
            break;
            case 3:
            node.data.orgxtType = 2;
            this.serializeStatus(node);
            break;

        }   
    }
     private addStatus(node){
        switch(node.data.orgxtType){
            case 0:
            node.data.orgxtType = 1;
            this.getParentNodeData(node);
            break;
            case 2:
            node.data.orgxtType = 3;
            break;
        }
    }
    
    private publicCode(node,state){
        let flag = false;
                for(let i =0;i<node.parent.data.children.length;i++){
                    if(node.parent.data.children[i].orgxtType !=0){
                        flag = true;
                    }
                }
                if(flag == false){
                  node.parent.data.orgxtType = state;
                }
                this.getParentNode(node.parent)
    }
    private getParentNode(node){
        if(node.parent ){
            if( node.parent.data.orgxtType != 1 && node.parent.data.orgxtType != 3){
                this.publicCode.call(this,node,0)
            }
            else if(node.parent.data.orgxtType == 3){
                this.publicCode.call(this,node,1)
            }
        }
    }
    private getParentNodeData(node){
        if(node.parent ){
            if( node.parent.data.orgxtType == 0 ){
                node.parent.data.orgxtType = 2;
                this.getParentNodeData(node.parent)
            }else if (node.parent.data.orgxtType == 1){
                 node.parent.data.orgxtType = 3;
                this.getParentNodeData(node.parent)
            }
        }
    }

    private serializeStatus(node){
        if(node.data.children != ""){
                let flag = false;
                for (let i =0;i<node.data.children.length;i++) {
                    if(node.data.children[i].orgxtType != 0){
                        flag = true;
                    }
                }
                if(flag == false){
                    node.data.orgxtType = 0;
                    this.getParentNode(node);
                }
            }
    }
	
	private searchDrug(){
        let drugCodeArr :any = [],
            codes:string;
        if(this.drugs.length !=0 ){
            for(let i =0;i<this.drugs.length;i++){
                drugCodeArr.push(this.drugs[i].drugCode)
            }
            codes = drugCodeArr.join(',')
        }else{
            codes = "";
        }
		this.searchByDrugName(this.searchKeyWord,codes);
	}
    
    private searchByDrugName(drugName?: string,drugCodes?:any): any {
        let tempUrl = this.searchDrugyUrl  + '?name=' +drugName.replace(/\s+/g,"") +'&&drugCodes='+drugCodes;
            tempUrl = encodeURI(tempUrl);
        this.clearExpandNode();
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .then(drugNodes => {
                this.setExpanded(drugNodes);
                this.drugNodes = drugNodes;
            })
            .catch(this.handleError);
    }

    /*删除已选药品*/
    deleteCheckName(obj?:any,i?:any){
        let code = obj.drugCode,
            time = 2;
        this.drugs.splice(i,1);
       
    }

   
   
    getPstatus(pcode?:any, codes?:any, time?:any){
        if(codes){
            for(let i =0;i<codes.length;i++ ){
                if(pcode == codes[i].drugCode) continue;
                var subcode = codes[i].drugCode.substring(0,time*3);
                console.log(pcode,subcode);
                if(pcode == subcode) return true;
            }
        }
        return false
    }

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

    ngOnChanges(changes : any) {
     
    }

    setExpanded(arr: any[]) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].open && arr[i].hasChildren){
				this.tree.treeModel.expandedNodeIds[arr[i].id] = true;
			}
			if (arr[i].hasChildren && arr[i].children)
				this.setExpanded(arr[i].children);
		}
	}

    

}