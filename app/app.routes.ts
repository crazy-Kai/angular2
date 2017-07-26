import { Routes, RouterModule, CanActivate, Router } from '@angular/router';

import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';

import { UserService } from './user.service';
import { HomeComponent } from './healthCareChargedFees/home/home.ts';
// import { CanDeactivateGuard } from './can-deactivate-guard.service';


//页面
import { IndexAppComponent } from './healthCareChargedFees/index/index.component';
//药品目录
import { DrgusComponentApp } from './healthCareChargedFees/medicareCatalog/drugs/drugs.component';
//疾病目录
import { DiseaseComponentApp } from './healthCareChargedFees/medicareCatalog/disease/disease.component';
//医保药物组目录
import { DruggroupdirectoryComponentApp } from './healthCareChargedFees/medicareCatalog/druggroupdirectory/druggroupdirectory.component';
//规则分析类型
import { RuleAnalyzeTypeComponentApp } from './healthCareChargedFees/healthInsuranceSetting/ruleAnalyze/ruleAnalyzeType.component';
//警示信息设置
import { WarningInformationComponent } from './healthCareChargedFees/warning-information/warning-information.component';
//引入计算公式设置Component
import { FormulaPreserveComponent } from './healthCareChargedFees/formula/formula-preserve.component';
//版本生效设置
import {VersionEffectComponent} from './healthCareChargedFees/versionEffect/versionEffect.component';
//警示信息干预分析
import { InterventionDataAnalysisOfTheHomePageComponent } from './healthCareChargedFees/cautionInformation/interventionDataStatistics/interventionDataAnalysisOfTheHomePage.component';
//医院数据详情页面
import { InterventionDataDetialComponent } from './healthCareChargedFees/cautionInformation/hospitalDataDetail/interventionDataStatistics.component';
//就诊警示信息详情页面
import { VisitingWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/visitingWarningInformationDetails/visitingWarningInformationDetails.component';
//药品警示信息详情页面
import  { DrugWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/drugWarningInformationDetails/drugWarningInformationDetails.component';
//项目警示信息详情页面
import { ObjectWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/objectWarningInformationDetails/objectWarningInformationDetails.component';
//材料警示信息详情页面
import { MaterialWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/materialWarningInformationDetails/materialWarningInformationDetails.component';
//警示信息详情页面
import { DiseaseWarningInformationDetailsComponent } from './healthCareChargedFees/cautionInformation/diseaseWarningInformationDetails/diseaseWarningInformationDetails.component';

//医保规则页面
//医保规则管理
import {HealthManagementRules} from './healthCareChargedFees/healthManagementRules/healthManagementRules.component';
//版本管理
import {VersionManagementComponent} from './healthCareChargedFees/healthManagementRules/version-management.component';
//校验历史的内容
import {RulesCheckoutHistoryComponent} from './healthCareChargedFees/healthManagementRules/rulesCheckoutHistory/rulesCheckoutHistory.component';
//校验历史下面的警示信息
import {WaringInformationComponent} from './healthCareChargedFees/healthManagementRules/waringInformation/waringInformation.component';
//医保版本管理中的修改内容
import {HealthRulesVersionComponent} from './healthCareChargedFees/healthManagementRules/healthRulesVersion/healthRulesVersion.component';
//医保版本管理中的修改内容
import {HealthRulesVersionModicationComponent} from './healthCareChargedFees/healthManagementRules/healthRulesVersion/healthRulesVersion_modication.component';
//查看处方
import {HealthLookRecipeComponent} from './healthCareChargedFees/healthManagementRules/healthRulesCheckout/healthLookRecipe.component';
import {InterferenceAnalysis} from './healthCareChargedFees/healthManagementRules/interferenceAnalysis/interferenceAnalysis.component';
//医保规则干预效果分析住院详情
import {InHospitalPage} from './healthCareChargedFees/healthManagementRules/inHospitalPage/inHospitalPage.component';
//医保规则干预效果  校验历史下的医嘱信息
import {DoctorAdviceDetails} from './healthCareChargedFees/healthManagementRules/doctorAdviceDetails/doctorAdviceDetails.component'
//医保规则干预效果  校验历史下的处方信息
import {PrescriptionDetails} from './healthCareChargedFees/healthManagementRules/prescriptionDetails/prescriptionDetails.component'

//医保政策文件页面
//医保政策文件
import {HealthInsurancePolicyFileComponent } from './healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile.component';
////医保政策文件中添加组件
import {HealthInsurancePolicyFileAddComponent } from './healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile_add.component';
////医保政策文件中修改组件
import {HealthInsurancePolicyFileModificationComponent } from './healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile_modification.component';


//险种目录页面
//险种目录版本
import {TypesOfInsuranceCatalogComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog.component';
//险种目录版本下面的添加
import {TypesOfInsuranceCatalogAddInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_addInsurance.component';
//险种目录版本下面的查看
import {TypesOfInsuranceCatalogLookInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_lookInsurance.component';
//险种目录版本下面的修改
import {TypesOfInsuranceCatalogChangeInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_changeInsurance.component';
////险种目录版本下面的查看下面的修改
import {TypesOfInsuranceCatalogModificationInsuranceComponent} from './healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_midioficationInsurance.component';


//机构基本信息
import {BasicInformationOrganizationComponent} from './healthCareChargedFees/basicInformationOrignization/basicInformationOrignization.component';

//药品中的版本管理
import {DrugVersionManagementComponent} from './healthCareChargedFees/all_version_management/Drug_version_management.component';
//版本管理中的对话框
// import {MyDialogComponent} from './healthCareChargedFees/all_version_management/my-dialog/my-dialog.component';
//疾病中的版本管理
import {SicknessVersionManagementComponent} from './healthCareChargedFees/all_version_management/Sickness_version_management.component';
//项目中的版本管理
import {ProgectVersionManagementComponent} from './healthCareChargedFees/all_version_management/Project_version_management.component';
//材料中的版本管理
import {MaterialVersionManagementComponent} from './healthCareChargedFees/all_version_management/Material_version_management.component';


//医保项目目录页面
import {ProjectComponentApp} from './healthCareChargedFees/medicareCatalog/project/project.component';

//医保材料目录页面
import {MaterialComponentApp} from './healthCareChargedFees/medicareCatalog/material/material.component';

//医保科室目录页面
import {OfficeComponentApp} from './healthCareChargedFees/medicareCatalog/office/office.component';

//干预数据统计页面
import {InterveneData} from './healthCareChargedFees/interveneData/interveneData.component';

//目录对比下的比对目录
import {CompareComponent} from './healthCareChargedFees/catalogComparison/compare/compare.component';
//目录比对下的材料对比目录
import {MaterialCompareComponent} from './healthCareChargedFees/catalogComparison/materialCompare/materialCompare.component';
//目录比对下的项目对比目录
import {ProjectCompareComponent} from './healthCareChargedFees/catalogComparison/projectCompare/projectCompare.component';
//目录比对下的科室比对页面
import {OfficeCompareComponent} from './healthCareChargedFees/catalogComparison/officeCompare/officeCompare.component';
//目录比对下的人员类别比对页面
import {PersonCompareComponent} from './healthCareChargedFees/catalogComparison/personCompare/personCompare.component';

//诊疗过程
import { ProceduresComponent } from './healthCareChargedFees/cautionInformation/procedures/procedures.component';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) { }

    canActivate() {
 
        return this.userService.isLogin;
    }
}




const routes: Routes = [{
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
}, {
    path: 'healthCareChargedFees/home',
    component:IndexAppComponent, //首页
    canActivate: [AuthGuard]
},{
    path :'healthCareChargedFees/medicareCatalog/drugs',//药品目录
    component: DrgusComponentApp,
    canActivate: [AuthGuard]
},{
    path :'healthCareChargedFees/medicareCatalog/drugs/:insuranceId/:versionId/:summary/:any',//药品目录
    component: DrgusComponentApp,
    canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/medicareCatalog/disease',//疾病目录
	component: DiseaseComponentApp,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/medicareCatalog/disease/:insuranceId/:versionId/:summary',//疾病目录
	component: DiseaseComponentApp,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/medicareCatalog/druggroupdirectory',//医保药物组目录
	component:DruggroupdirectoryComponentApp,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation',//警示信息干预分析
	component:InterventionDataAnalysisOfTheHomePageComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/hospitalDataDetail/interventionDataDetial',
	component:InterventionDataDetialComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/hospitalDataDetail/interventionDataDetial/:settingId/:warningType/:insuranceId',
	component:InterventionDataDetialComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/visitingWarningInformationDetails/visitingWarningInformationDetails-component',//就诊警示信息详情
	component:VisitingWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/visitingWarningInformationDetails/visitingWarningInformationDetails-component/:settingId/:temp/:code/:insuranceId',//就诊警示信息详情
	component:VisitingWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/drugWarningInformationDetails/drugWarningInformationDetails-component',
	component:DrugWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/drugWarningInformationDetails/drugWarningInformationDetails-component/:settingId/:temp/:code/:insuranceId',
	component:DrugWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/objectWarningInformationDetails/objectWarningInformationDetails-component',
	component:ObjectWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/objectWarningInformationDetails/objectWarningInformationDetails-component/:settingId/:temp/:code/:insuranceId',
	component:ObjectWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/materialWarningInformationDetails/materialWarningInformationDetails-component',
	component:MaterialWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/materialWarningInformationDetails/materialWarningInformationDetails-component/:settingId/:temp/:code/:insuranceId',
	component:MaterialWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/diseaseWarningInformationDetails/diseaseWarningInformationDetails-component',
	component:DiseaseWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/cautionInformation/diseaseWarningInformationDetails/diseaseWarningInformationDetails-component/:settingId/:temp/:code/:insuranceId',
	component:DiseaseWarningInformationDetailsComponent,
	canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/warning-information',//警示方式设置
    component:WarningInformationComponent,
    canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/formula', //计算公式
    component:FormulaPreserveComponent,
    canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/versionEffect', //版本生效
    component:VersionEffectComponent,
    canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthInsuranceSetting/ruleAnalyze',//规则分析类型
	component:RuleAnalyzeTypeComponentApp,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/interveneData',//干预数据统计
	component:InterveneData,
	canActivate: [AuthGuard]
},
//医保规则页面
{
	path:'healthCareChargedFees/healthManagementRules',//医保规则
	component:HealthManagementRules,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/version-management',//医保规则下的版本管理 
	component:VersionManagementComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/version-management/:id',//医保规则下的版本管理 
	component:VersionManagementComponent,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/healthManagementRules/version-management/healthRulesVersion/healthRulesVersion',//医保规则下的版本管理 下面的修改页面
    component:HealthRulesVersionComponent,
    canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/version-management/healthRulesVersion/healthRulesVersion/:id',//医保规则下的版本管理 下面的修改页面
    component:HealthRulesVersionComponent,
    canActivate: [AuthGuard]  
},{
	path:'healthCareChargedFees/healthManagementRules/version-management/healthRulesVersion/healthRulesVersion_modication/:id/:insuranceId',//医保规则下的版本管理 下面的添加页面
	component:HealthRulesVersionModicationComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/version-management/healthRulesVersion/healthRulesVersion_modication',//医保规则下的版本管理 下面的添加页面
	component:HealthRulesVersionModicationComponent,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/rulesCheckoutHistory', //医保规则下的规则校验下的校验历史
	component:RulesCheckoutHistoryComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/rulesCheckout/rulesCheckoutHistory/waringInformation/waringInformation/:ruleName/:id', //医保规则下的规则校验下的校验历史 警示信息
	component:WaringInformationComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/rulesCheckout/healthRulesCheckout/healthLookRecipe', //医保规则下的规则校验下的查看处方
	component:HealthLookRecipeComponent,
    canActivate: [AuthGuard]	
},
{
	path:'healthCareChargedFees/healthManagementRules/rulesCheckout/healthRulesCheckout/healthLookRecipe/:insuranceId/:versionId/:nodeName/:nodeId/:nodeType/:type/:drugIdversionId/:diseaseVersionId/:itemIdversionId/:materialIdversionId', //医保规则下的规则校验下的查看处方
	component:HealthLookRecipeComponent,
	canActivate: [AuthGuard]
},
{
//	path:'healthCareChargedFees/healthManagementRules/interferenceAnalysis/interferenceAnalysis/:eventNo/:hospitalNo/:insuranceId/:versionId/:nodeName/:nodeId/:nodeType/:type/:drugIdversionId/:diseaseVersionId/:itemIdversionId/:materialIdversionId/:tableData', //医保规则下的干预分析处方详情
	path:'healthCareChargedFees/healthManagementRules/interferenceAnalysis/interferenceAnalysis/:eventNo/:hospitalNo', //医保规则下的干预分析处方详情
	component:InterferenceAnalysis,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/inHospitalPage/inHospitalPage/:eventNo/:hospitalNo', //医保规则下的干预分析处方详情
	component:InHospitalPage,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/doctorAdviceDetails/doctorAdviceDetails', //医保规则干预效果  校验历史下的医嘱信息
	component:DoctorAdviceDetails,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthManagementRules/prescriptionDetails/prescriptionDetails',//医保规则干预效果  校验历史下的处方信息
	component:PrescriptionDetails,
	canActivate: [AuthGuard]
},
//医保政策页面
{
	path:'healthCareChargedFees/healthInsurancePolicyFile', //医保政策页面
    component:HealthInsurancePolicyFileComponent,
    canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile/healthInsurancePolicyFile_add', //医保政策页面下的添加
    component:HealthInsurancePolicyFileAddComponent,
    canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile/healthInsurancePolicyFile_modification',   //医保政策页面下的修改
	component:HealthInsurancePolicyFileModificationComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/healthInsurancePolicyFile/healthInsurancePolicyFile/healthInsurancePolicyFile_modification/:id',   //医保政策页面下的修改
	component:HealthInsurancePolicyFileModificationComponent,
	canActivate: [AuthGuard]
},
//险种目录
{
	path:'healthCareChargedFees/typeOfInsuranceCatalog', //险种目录页面
	component:TypesOfInsuranceCatalogComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/:insuranceId/:versionId', //险种目录页面
	component:TypesOfInsuranceCatalogComponent,
	canActivate: [AuthGuard]
},
{ 
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog_addInsurance',//险种目录版本下面的添加
	component:TypesOfInsuranceCatalogAddInsuranceComponent,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog_addInsurance/:id',//险种目录版本下面的添加
	component:TypesOfInsuranceCatalogAddInsuranceComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_changeInsurance',//险种目录版本下面的修改
	component:TypesOfInsuranceCatalogChangeInsuranceComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_changeInsurance/:id',//险种目录版本下面的修改
	component:TypesOfInsuranceCatalogChangeInsuranceComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_midioficationInsurance',//险种目录下面的查看下面的修改
	component:TypesOfInsuranceCatalogModificationInsuranceComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_midioficationInsurance/:id',//险种目录下面的查看下面的修改
	component:TypesOfInsuranceCatalogModificationInsuranceComponent,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/typeOfInsuranceCatalog/typeOfInsuranceCatalog/typeOfInsuranceCatalog_lookInsurance/:id',//险种目录版本下面的查看
	component:TypesOfInsuranceCatalogLookInsuranceComponent,
	canActivate: [AuthGuard]
},
//版本管理页面
{
	path:'healthCareChargedFees/medicareCatalog/drugs/all_version_management/Drug_version_management/:id',//药品中的版本管理
	component:DrugVersionManagementComponent,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/medicareCatalog/disease/Sickness_version_management/:id',//疾病中的版本管理
	component:SicknessVersionManagementComponent,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/medicareCatalog/project/all_version_management/Project_version_management/:id',//项目中的版本管理
	component:ProgectVersionManagementComponent,
	canActivate: [AuthGuard]    	
}
,{
	path:'healthCareChargedFees/medicareCatalog/material/all_version_management/Material_version_management/:id',//材料中的版本管理
	component:MaterialVersionManagementComponent,
	canActivate: [AuthGuard]
},
//机构基本信息
{
	path:'healthCareChargedFees/basicInformationOrignization',
	component:BasicInformationOrganizationComponent,
	canActivate: [AuthGuard]
},
//诊疗过程
{
	path:'healthCareChargedFees/cautionInformation/procedures/procedures-component',
	component: ProceduresComponent, 
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/cautionInformation/procedures/procedures-component/:visitId/:patientNumber/:hospitalNo/:type/:insuranceId/:settingId',
	component: ProceduresComponent,
	canActivate: [AuthGuard]
},
//医保项目目录
{
	path:'healthCareChargedFees/medicareCatalog/project/:insuranceId/:versionId/:summary',//项目目录
	component:ProjectComponentApp,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/medicareCatalog/project',//项目目录
	component:ProjectComponentApp,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/medicareCatalog/material/:insuranceId/:versionId/:summary',//材料目录
	component:MaterialComponentApp,
	canActivate: [AuthGuard]
},{
	path:'healthCareChargedFees/medicareCatalog/material',//材料目录
	component:MaterialComponentApp,
	canActivate: [AuthGuard]
},
{
	path:'healthCareChargedFees/medicareCatalog/office',//科室目录
	component:OfficeComponentApp,
	canActivate: [AuthGuard]
},

//对比目录下的比对目录
{
	path: 'healthCareChargedFees/catalogComparison',//对比目录           
	component: CompareComponent,
	canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/catalogComparison/:hospitalCode',//对比目录           
	component: CompareComponent,
	canActivate: [AuthGuard]
},
{
	path: 'healthCareChargedFees/catalogComparison/materialCompare/materialCompare-component/:organizationCode/:type',//材料比对目录
	component: MaterialCompareComponent,
	canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/catalogComparison/materialCompare/materialCompare-component/:organizationCode/:insuranceId/:versionId/:type',//材料比对目录
	component: MaterialCompareComponent,
	canActivate: [AuthGuard]
},
{
	path: 'healthCareChargedFees/catalogComparison/projectCompare/projectCompare-component/:organizationCode/:type',//项目比对目录
	component: ProjectCompareComponent, 
	canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/catalogComparison/projectCompare/projectCompare-component/:organizationCode/:insuranceId/:versionId/:type',//项目比对目录
	component: ProjectCompareComponent,
	canActivate: [AuthGuard]
},
{
	path: 'healthCareChargedFees/catalogComparison/officeCompare/officeCompare-component/:organizationCode/:type',//科室比对目录
	component: OfficeCompareComponent,
	canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/catalogComparison/personCompare/personCompare-component/:organizationCode/:type',//人员类别比对目录
	component: PersonCompareComponent,
	canActivate: [AuthGuard]
},{
	path: 'healthCareChargedFees/catalogComparison/personCompare/personCompare-component/:organizationCode/:insuranceId/:type',//人员类别比对目录
	component: PersonCompareComponent,
	canActivate: [AuthGuard]
}
];

export const authProviders = [AuthGuard, UserService];
export const appRoutingProviders: any[] = [
    authProviders
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }