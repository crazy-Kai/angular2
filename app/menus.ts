class SubMenu {
    title:string;
    resource: string
};

export class Menu {
   id:number;
   iconSrc:string;
   iconActionSrc :string;
   title:string;
   resource:string;
   subMenus:SubMenu[];
};

export const menus: Menu[] = [{
        id: 1,
        iconSrc: 'app/images/menu-set.svg',
        iconActionSrc: 'app/images/menu-set-a.svg',
        title: '首页',
        resource:'healthCareChargedFees/home',
        subMenus: []
    }, {
        id: 2,
        iconSrc: 'app/images/menu-audit.svg',
        iconActionSrc: 'app/images/menu-audit-a.svg',
        title: '干预效果分析',
        resource:"",
        subMenus: [
            { title: '干预数据统计', resource: 'healthCareChargedFees/interveneData' },
            { title: '警示信息干预分析', resource: 'healthCareChargedFees/cautionInformation' }
        ]
    }, {
        id: 3,
        iconSrc: 'app/images/menu-result.svg',
        iconActionSrc: 'app/images/menu-result-a.svg',
        title: '医保目录设置',
        resource:"",
        subMenus: [
            { title: '医保险种目录', resource: 'healthCareChargedFees/typeOfInsuranceCatalog'},
            { title: '医保疾病目录', resource: 'healthCareChargedFees/medicareCatalog/disease' },
            { title: '医保药品目录', resource: 'healthCareChargedFees/medicareCatalog/drugs' },
            { title: '医保项目目录', resource: 'healthCareChargedFees/medicareCatalog/project' },
            { title: '医保材料目录', resource: 'healthCareChargedFees/medicareCatalog/material' },
            { title: '医保药物组目录', resource: 'healthCareChargedFees/medicareCatalog/druggroupdirectory' },
            { title: '医保科室目录', resource:'healthCareChargedFees/medicareCatalog/office'}
        ]
    }, {
        id: 4,
        iconSrc: 'app/images/menu-statistics.svg',
        iconActionSrc: 'app/images/menu-statistics-a.svg',
        title: '基础信息维护',
        resource:"",
        subMenus: [
            { title: '医保政策文件', resource: 'healthCareChargedFees/healthInsurancePolicyFile'},
            { title: '规则分析类型', resource: 'healthCareChargedFees/healthInsuranceSetting/ruleAnalyze' },
            { title: '机构基本信息', resource: 'healthCareChargedFees/basicInformationOrignization' },
            { title: '警示方式设置', resource: 'healthCareChargedFees/warning-information' },
            { title: '版本生效设置', resource: 'healthCareChargedFees/versionEffect' },
            { title: '查看计算公式', resource: 'healthCareChargedFees/formula' }
        ]
    }, {
        id: 5,
        iconSrc: 'app/images/menu-alert-message.svg',
        iconActionSrc: 'app/images/menu-alert-message-a.svg',
        title: '医保规则维护',
        resource:"",
        subMenus: [
            { title: '医保规则管理', resource: 'healthCareChargedFees/healthManagementRules' },

        ]
    },{
    	id:6,
    	iconSrc: 'app/images/comparison.svg',
    	iconActionSrc: '',
    	title: '医院目录比对',
    	resource:"",
    	subMenus: [
    		{title: '比对',resource: 'healthCareChargedFees/catalogComparison'}
    	]
    	
    	
    }];