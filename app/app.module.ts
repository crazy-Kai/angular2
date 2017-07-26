import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { provideInterceptorService } from 'ng2-interceptors';
import { ServerInterceptor } from './server.interceptor';
//angular2 module
import { TreeModule } from 'angular2-tree-component';

import { appRoutingProviders, AppRoutingModule } from '../app/app.routes';
//验证插件
import {CustomFormsModule} from "ng2-validation";
//用户登录
import { UserService } from './user.service';

import { AppComponent }  from './app.component';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { I18n, CustomDatepickerI18n } from './healthCareChargedFees/common/i18n_service';

//自定义组件

import { TimeIntervalComponent } from './healthCareChargedFees/common/time-interval/time-interval.component';
import { PaginationComponent } from './healthCareChargedFees/common/pagination/pagination.component';
import { DialogModule } from './healthCareChargedFees/common/ug-dialog/dialog';
import { TableModule } from './healthCareChargedFees/common/ug-table/table.module';
import { SelectComponent } from './healthCareChargedFees/common/select-comp/select.component';

//文件导入
import { UploadPlugin } from './healthCareChargedFees/common/ug-upload/upload.plugin';
//页面
import { IndexAppComponent } from './healthCareChargedFees/index/index.component';
//药品目录
import { DrgusComponentApp } from './healthCareChargedFees/medicareCatalog/drugs/drugs.component';
//疾病目录
import { DiseaseComponentApp}  from './healthCareChargedFees/medicareCatalog/disease/disease.component';
//医保药物组目录
import { DruggroupdirectoryComponentApp } from './healthCareChargedFees/medicareCatalog/druggroupdirectory/druggroupdirectory.component';
//规则分析类型
import { RuleAnalyzeTypeComponentApp } from './healthCareChargedFees/healthInsuranceSetting/ruleAnalyze/ruleAnalyzeType.component';
//警示信息设置
import { WarningInformationComponent } from './healthCareChargedFees/warning-information/warning-information.component';
//计算公式设置
import { FormulaPreserveComponent } from './healthCareChargedFees/formula/formula-preserve.component';
//版本生效设置
import {VersionEffectComponent} from './healthCareChargedFees/versionEffect/versionEffect.component';
//医保规则目录
//医保规则管理
import {HealthManagementRules} from './healthCareChargedFees/healthManagementRules/healthManagementRules.component';
//规则校验
//import {RulesCheckoutComponent} from './healthCareChargedFees/healthManagementRules/rulesCheckout.component';
//版本管理
import {VersionManagementComponent} from './healthCareChargedFees/healthManagementRules/version-management.component';
//医保规则版本
import {HealthRulesVersionComponent} from './healthCareChargedFees/healthManagementRules/healthRulesVersion/healthRulesVersion.component';
//医保规则版本修改
import {HealthRulesVersionModicationComponent} from './healthCareChargedFees/healthManagementRules/healthRulesVersion/healthRulesVersion_modication.component';
//医保规则干预效果分析处方详情页
import {InterferenceAnalysis} from './healthCareChargedFees/healthManagementRules/interferenceAnalysis/interferenceAnalysis.component';
//医保规则干预效果分析住院详情页
import {InHospitalPage} from './healthCareChargedFees/healthManagementRules/inHospitalPage/inHospitalPage.component';
//医保规则干预效果  校验历史下的医嘱信息
import {DoctorAdviceDetails} from './healthCareChargedFees/healthManagementRules/doctorAdviceDetails/doctorAdviceDetails.component'
//医保规则干预效果  校验历史下的处方信息
import {PrescriptionDetails} from './healthCareChargedFees/healthManagementRules/prescriptionDetails/prescriptionDetails.component'

//规则校验中内容
//import {HealthRulesCheckoutComponent} from './healthCareChargedFees/healthManagementRules/healthRulesCheckout/healthRulesCheckout.component';
//校验历史的内容
import {RulesCheckoutHistoryComponent} from './healthCareChargedFees/healthManagementRules/rulesCheckoutHistory/rulesCheckoutHistory.component';
//校验历史下面的警示信息
import {WaringInformationComponent} from './healthCareChargedFees/healthManagementRules/waringInformation/waringInformation.component';
//查看处方
import {HealthLookRecipeComponent} from './healthCareChargedFees/healthManagementRules/healthRulesCheckout/healthLookRecipe.component';
//模拟干预
//import {HealthSimulateMeddleComponent} from './healthCareChargedFees/healthManagementRules/healthRulesCheckout/Health_simulate_meddle.component'
//添加组合
//import {WarmingInformationAddggroupComponent } from './healthCareChargedFees/warning-information/warming_information_addggroup.component';
//添加规则
//import {HealthManagementAddRulesComponent} from './healthCareChargedFees/healthManagementRules/healthManagementAddRules.component';
//添加规则里面下一步 的那个列表
//import {HealthManagementRulesListComponent} from './healthCareChargedFees/healthManagementRules/healthManagementRulesList/healthManagementRulesList.component';

//医保政策文件页面
//医保政策文件
import {HealthInsurancePolicyFileComponent} from './healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile.component';
////医保政策文件中添加组件
import {HealthInsurancePolicyFileAddComponent} from './healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile_add.component';
////医保政策文件中修改组件
import {HealthInsurancePolicyFileModificationComponent} from './healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile_modification.component';

 //险种目录版本
//险种目录版本主页面
import {TypesOfInsuranceCatalogComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog.component';
//险种目录版本下面的添加
import {TypesOfInsuranceCatalogAddInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_addInsurance.component';
//险种目录版本下面的查看
import {TypesOfInsuranceCatalogLookInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_lookInsurance.component';
//险种目录版本下面的修改
import {TypesOfInsuranceCatalogChangeInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_changeInsurance.component';
//险种里面那个报销分类添加页面
//import {AddApplyClassifyComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/add_apply_classify/add_apply_classify.component';
//险种目录下面的查看下面的修改
import {TypesOfInsuranceCatalogModificationInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_midioficationInsurance.component';

//机构基本信息
import {BasicInformationOrganizationComponent} from './healthCareChargedFees/basicInformationOrignization/basicInformationOrignization.component';

//医保项目目录
import {ProjectComponentApp} from './healthCareChargedFees/medicareCatalog/project/project.component';

//医保材料目录
import {MaterialComponentApp} from './healthCareChargedFees/medicareCatalog/material/material.component';

//医保科室目录
import {OfficeComponentApp} from './healthCareChargedFees/medicareCatalog/office/office.component';


//药品中的版本管理
import {DrugVersionManagementComponent} from './healthCareChargedFees/all_version_management/Drug_version_management.component';
//疾病中的版本管理
import {SicknessVersionManagementComponent} from './healthCareChargedFees/all_version_management/Sickness_version_management.component';
//项目中的版本管理
import {ProgectVersionManagementComponent} from './healthCareChargedFees/all_version_management/Project_version_management.component';
//材料中的版本管理
import {MaterialVersionManagementComponent} from './healthCareChargedFees/all_version_management/Material_version_management.component';
//警示信息干预分析
import {InterventionDataAnalysisOfTheHomePageComponent} from './healthCareChargedFees/cautionInformation/interventionDataStatistics/interventionDataAnalysisOfTheHomePage.component';
//医院干预分析详情页面
import {InterventionDataDetialComponent} from './healthCareChargedFees/cautionInformation/hospitalDataDetail/interventionDataStatistics.component';
//就诊警示信息详情页面
import { VisitingWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/visitingWarningInformationDetails/visitingWarningInformationDetails.component';
//药品警示信息详情页面
import { DrugWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/drugWarningInformationDetails/drugWarningInformationDetails.component';
//项目警示信息详情页面
import { ObjectWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/objectWarningInformationDetails/objectWarningInformationDetails.component';
//材料警示信息详情页面
import { MaterialWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/materialWarningInformationDetails/materialWarningInformationDetails.component';
//疾病警示信息详情页面
import { DiseaseWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/diseaseWarningInformationDetails/diseaseWarningInformationDetails.component'; 

//干预数据统计
import {InterveneData} from './healthCareChargedFees/interveneData/interveneData.component';



//目录比对下面的比对目录
import {CompareComponent} from './healthCareChargedFees/catalogComparison/compare/compare.component';
//比对目录下的材料比对页面
import {MaterialCompareComponent} from './healthCareChargedFees/catalogComparison/materialCompare/materialCompare.component';
//比对目录下的项目比对页面
import {ProjectCompareComponent} from './healthCareChargedFees/catalogComparison/projectCompare/projectCompare.component';
//比对目录下的科室比对页面
import {OfficeCompareComponent} from './healthCareChargedFees/catalogComparison/officeCompare/officeCompare.component';
//比对目录下的人员类别比对页面
import {PersonCompareComponent} from './healthCareChargedFees/catalogComparison/personCompare/personCompare.component';
//诊疗过程
import { ProceduresComponent } from './healthCareChargedFees/cautionInformation/procedures/procedures.component';
//通用组件部分 common component
import { DrugCategoryTree } from './healthCareChargedFees/common/drug_category/drug_category_tree.component';
import { DrugControlTree } from './healthCareChargedFees/common/drug_category/drug_category_dialog.component';
/*药品字典弹窗*/
import { DrugDictionariesTree } from './healthCareChargedFees/common/drug_category/drug_dictionaries_dialog.component';
import { CautionInformationDialogComponent } from './healthCareChargedFees/common/cautionInformationDialog/cautionInformationDialog.component';
import { AutocompleteDirective } from './healthCareChargedFees/common/auto-complete-directive/autocomplete-directive';
import { AutocompleteWindowComponent } from './healthCareChargedFees/common/auto-complete-directive/autocomplete-window.component';
import { AutocompleteService } from './healthCareChargedFees/common/auto-complete-directive/autocomplete.service';
//快捷回复组件
import { HomeComponent } from './healthCareChargedFees/home/home.ts';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PromptComponent } from './healthCareChargedFees/common/prompt/prompt.component';
@NgModule({
  //模版
  imports: [
    BrowserModule,
    FormsModule,
    DialogModule,
    TreeModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot(),
    //tree
    TableModule   //表格
  ],
  //组建
  declarations: [
    AppComponent,
    IndexAppComponent,
    UploadPlugin,//文件上传
    DrgusComponentApp ,// 药品目录
    DiseaseComponentApp,//疾病目录
    DruggroupdirectoryComponentApp,//医保药物组目录
    SelectComponent,//下拉框组件
    WarningInformationComponent, //警示信息设置
    FormulaPreserveComponent,   //计算公式设置
    VersionEffectComponent,  //版本生效设置
    RuleAnalyzeTypeComponentApp,//规则分析类型
//  医保规则页面
    HealthManagementRules,   //医保规则管理
//  RulesCheckoutComponent,   //规则校验
    VersionManagementComponent,   //版本管理
    HealthRulesVersionComponent,       //医保规则版本
    HealthRulesVersionModicationComponent,  //医保规则版本修改
//  HealthRulesCheckoutComponent,     //规则校验中内容
    RulesCheckoutHistoryComponent,   //校验历史的内容
    WaringInformationComponent,   //校验历史下面的警示信息
    HealthLookRecipeComponent,    //查看处方
//  HealthSimulateMeddleComponent,     //模拟干预
//  WarmingInformationAddggroupComponent,    //添加组合
//  HealthManagementAddRulesComponent,  //添加规则
    InterferenceAnalysis, //干预效果分析处方详情
    InHospitalPage,//干预效果分析住院详情
    DoctorAdviceDetails,//DoctorAdviceDetails,//医保规则干预效果  校验历史下的医嘱信息
    PrescriptionDetails,//医保规则干预效果  校验历史下的处方信息
//  医保政策页面
    HealthInsurancePolicyFileComponent,     //医保政策文件
    HealthInsurancePolicyFileAddComponent,  //医保政策文件中添加组件
    HealthInsurancePolicyFileModificationComponent,  //医保政策文件中修改组件 
//  HealthManagementRulesListComponent,   //添加规则里面下一步 的那个列表    
//  险种页面
    TypesOfInsuranceCatalogComponent,  //险种目录版本
    TypesOfInsuranceCatalogAddInsuranceComponent,   //险种目录版本下面的添加
    TypesOfInsuranceCatalogLookInsuranceComponent,   //险种目录版本下面的查看
//   AddApplyClassifyComponent,    //险种里面那个报销分类添加页面
    TypesOfInsuranceCatalogChangeInsuranceComponent, //险种目录版本下面的修改  
    TypesOfInsuranceCatalogModificationInsuranceComponent,//险种目录下面的查看下面的修改
//  所有的版本管理页面
    DrugVersionManagementComponent,   //药品中的版本管理
//  MyDialogComponent,  //版本管理中的对话框
    SicknessVersionManagementComponent,   //疾病中的版本管理
    ProgectVersionManagementComponent,   //项目中的版本管理
    MaterialVersionManagementComponent,  //材料中的版本管理
//  机构基本页面    
    BasicInformationOrganizationComponent,
//  AddApplyClassifyComponent,    //险种里面那个报销分类添加页面
    ProjectComponentApp,         //医保项目目录
    MaterialComponentApp,        //医保材料目录
    OfficeComponentApp,				//医保科室目录
    InterventionDataAnalysisOfTheHomePageComponent,//警示信息干预分析
    InterventionDataDetialComponent, //医院数据详情页面
    InterveneData ,//干预数据统计
    DrugCategoryTree,//通用组建
    DrugControlTree,//通用组建
    //警示信息详情页面
    VisitingWarningInformationDetailsComponent,//就诊警示信息详情
    DrugWarningInformationDetailsComponent,//药品警示信息详情,
    ObjectWarningInformationDetailsComponent,//项目警示信息详情
    MaterialWarningInformationDetailsComponent,//材料警示信息详情
    DiseaseWarningInformationDetailsComponent,//警示信息详情
    CompareComponent,//对比目录下的比对目录
    MaterialCompareComponent,//比对目录下的材料比对目录
    ProjectCompareComponent,//比对目录下的项目比对目录
    OfficeCompareComponent,//比对目录下的科室比对页面
    PersonCompareComponent,//比对目录下的人员类别比对页面
    ProceduresComponent,//诊疗过程
    //自定义分页组件
    PaginationComponent,
    //警示信息设置组件
    CautionInformationDialogComponent,
    //模糊查询组件
    AutocompleteDirective,
    AutocompleteWindowComponent,
    HomeComponent,
    PromptComponent,
    TimeIntervalComponent, //日期组件
    DrugDictionariesTree //字典组件
],
//依赖注入
 providers: [
    appRoutingProviders,
    ServerInterceptor,
    AutocompleteService,
    I18n,{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    provideInterceptorService([
      ServerInterceptor
    ]),
    UserService,
  ],
  entryComponents:[AutocompleteWindowComponent],
  bootstrap: [ AppComponent  ]
})
export class AppModule { }