import { Component, Input, Output, ViewChild, EventEmitter, OnChanges,OnInit} from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { DialogPlugin } from '../../common/ug-dialog/dialog';
import { DialogModel } from '../../common/ug-dialog/dialog.model';



@Component({
    selector: 'drug-dictionaries-tree',
    template: `
       	<div class="addcatalog-main" >
				<div id="addcatalog-main"  >
					<Tree [nodes]="dictionariesData" class="my-tree"  [options]="addPropsOption">
				                <template #treeNodeTemplate let-node>
				                    <div style="cursor: pointer;">
											<label style="font-weight:normal;cursor: pointer;"><input  type="checkbox"  style="margin-right: 2px;" name="addDrugsName" *ngIf="node.data.name != '西药' &&node.data.name != '中成药' &&node.data.name !='中药饮片'" (change)="propsValueChange($event,node.data.name,node.data.id,node)" style="vertical-align:-2px;margin-right: 2px;"/> {{node.data.name}}</label>
				                    </div>
				                </template>
				    </Tree>
				</div>
	    </div>
        <my-dialog></my-dialog>
    `,
    styles:[`
       
    `]
    // styleUrls:['../../../app.component.css']
})

export class DrugDictionariesTree implements OnInit, OnChanges{
	@ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
    @ViewChild(TreeComponent)
    private tree: TreeComponent;
    ngAfterViewInit() {
        console.log("find tree");
        console.log(this.tree);
        console.log(this.dialogPlugin)
    }
    @Input() dictionariesOptions:any;
    @Output() onChecked: EventEmitter<any> = new EventEmitter();
    constructor(private http: InterceptorService) { };
    private  dictionariesData:any;//字典值
    private  addPropsOption:any;//配置项
    ngOnInit(){
        this.addPropsOption = {
             idField:'id'
        }
    }
    ngOnChanges(changes: any){
    	console.log(1111111111111)
    	if(changes){
    		this.dictionariesData = changes.dictionariesOptions.currentValue.nodes;
    		
    	}
    }	

}