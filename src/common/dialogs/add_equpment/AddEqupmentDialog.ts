export class AddEqupmentDialogController implements ng.IController {          public $onInit() {}
    public theme;
    public defaultCollection: string[];
    public searchedCollection: string[];
    public equpment_id: string;
    public search: string;
    public objects: iqs.shell.SearchResult[];
    public typeCollection: iqs.shell.TypeCollection;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        public $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private iqsGlobalSearch: iqs.shell.IGlobalSearchService,
        iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        params
    ) {
        "ngInject";
        
        iqsTypeCollectionsService.init();
        this.typeCollection = iqsTypeCollectionsService.getObjectType();

        this.theme = $rootScope[pip.themes.ThemeRootVar];
        this.equpment_id = params.equipment_id;
        this.search = '';

        let objectType: string = iqs.shell.SearchObjectTypes.ControlObject;
        this.searchedCollection = params.searchCollection || this.iqsGlobalSearch.getSpecialSearchCollection(objectType);
        this.defaultCollection = params.searchCollection || this.iqsGlobalSearch.getDefaultCollection(objectType);
        this.onSearchResult(this.search, true);
    }

    public initSelectedItems() {

    }

    public onSearchResult(query: string, initRoster: boolean = false) {
        this.search = query;
        this.iqsGlobalSearch.searchObjectsParallel(query, iqs.shell.SearchObjectTypes.ControlObject,
            (data) => {
                this.objects = _.union(
                    _.filter(data, { object_type: 'control_object', item: { category: iqs.shell.ObjectCategory.Equipment } }),
                    _.filter(data, { object_type: 'control_object', item: { category: iqs.shell.ObjectCategory.Asset } }));
                    this.objects = _.sortBy(this.objects, (obj: any) => {
                        return obj.item.name.toLocaleLowerCase();
                    });   
                if (initRoster) { this.initSelectedItems(); }
            });

    }

    public onCanselSearch() {
        this.search = '';
        this.onSearchResult(this.search);
    }

    public selectItem(index: number) {
        this.equpment_id = this.objects[index].id;
        //this.selected = this.objects[index].item;
    }

    public change() {
        this.$mdDialog.hide(this.equpment_id);
    }
    public cancel() {
        this.$mdDialog.cancel();
    }

     public config() {
         if (this.$state.current.name != 'settings_system.objects') {
            this.$state.go('settings_system.objects', {});
            this.$mdDialog.hide();
         }
          this.$mdDialog.hide();
    }


}

const translateConfig = function (pipTranslateProvider) {
    // Set translation strings for the module
    pipTranslateProvider.translations('en', {
        'EQUIPMENT_DIALOG_TITLE': 'Assign equpment or asset',
        'ADD_EQUIPMENT_EMPTY': 'Objects were not found in the system', 
        ADD_EQUPMENT_DIALOG_ASSINE: 'Assign'
    });

    pipTranslateProvider.translations('ru', {
        'EQUIPMENT_DIALOG_TITLE': 'Назначить машину или механизм',
        'ADD_EQUIPMENT_EMPTY': 'Машины в системе не найдены',
        ADD_EQUPMENT_DIALOG_ASSINE: 'Назначить'
    });
}
angular
    .module('iqsAddEqupmentDialog', [
        'ngMaterial',
        'iqsGlobalSearch',
        'iqsTypeCollections.Service'
    ])
    .config(translateConfig)
    .controller('iqsAddEqupmentDialogController', AddEqupmentDialogController);

import "./AddEqupmentDialogService"