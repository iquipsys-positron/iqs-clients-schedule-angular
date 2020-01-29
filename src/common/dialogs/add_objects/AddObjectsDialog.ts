export class AddObjectsDialogController implements ng.IController {
    public $onInit() { }
    public theme;
    public defaultCollection: string[];
    public searchedCollection: string[];
    // public selectedObjects: SearchResult[] = [];
    public search: string;
    public dialogTitle: string;
    public objects: iqs.shell.SearchResultChecked[];
    public allCollection: iqs.shell.SearchResultChecked[];
    public defaultData: iqs.shell.SearchResult[];
    public initObjects: any;//RosterObject[];
    private objectType: string;
    private objectTypeFilter: string;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private iqsGlobalSearch: iqs.shell.IGlobalSearchService,
        params
    ) {
        "ngInject";

        this.initObjects = params.roster ? params.roster.objects : params.initObjects;
        this.objectTypeFilter = params.objectCategory ? params.objectCategory : null;
        this.defaultData = params.data;
        this.dialogTitle = params.dialogTitle ? params.dialogTitle : 'SCHEDULE_DIALOG_TITLE';
        this.theme = $rootScope[pip.themes.ThemeRootVar];
        this.search = '';

        this.objectType = params.objectType ? params.objectType : iqs.shell.SearchObjectTypes.ControlObject;
        this.searchedCollection = this.iqsGlobalSearch.getSpecialSearchCollection(this.objectType);
        this.defaultCollection = this.iqsGlobalSearch.getDefaultCollection(this.objectType);
        this.init();
    }

    private init(): void {

        let objects: iqs.shell.SearchResult[];

        if (this.defaultData) {
            if (this.objectTypeFilter) {
                objects = _.filter(this.defaultData, (obj: iqs.shell.SearchResult) => {
                    return obj.item.category == this.objectTypeFilter;
                });
            } else {
                objects = _.cloneDeep(this.defaultData);
            }
            this.objects = _.sortBy(objects, (obj: iqs.shell.SearchResult) => {
                return obj.item.name ? obj.item.name.toLocaleLowerCase() : '';
            });
            this.allCollection = _.cloneDeep(this.objects);
        } else {
            this.onSearchResult(this.search, true);
        }
    }

    public initSelectedItems() {
        if (this.initObjects && this.initObjects.length > 0) {
            this.initObjects.forEach(element => {
                let index: number = _.findIndex(this.objects, { id: element.object_id });
                if (index != - 1) {
                    this.objects[index].checked = true;
                }
            });
        }
    }

    private updateCollection() {
        let initObjects: any[] = [];
        _.each(this.objects, (item: iqs.shell.SearchResultChecked) => {
            let index = _.findIndex(this.allCollection, { id: item.id });
            if (index > -1) {
                this.allCollection[index].checked = item.checked;
            }
        });

        _.each(this.allCollection, (item: iqs.shell.SearchResultChecked) => {
            if (item.checked) {
                initObjects.push({
                    object_id: item.id
                });
            }
        });

        this.initObjects = initObjects;
    }

    public onSearchResult(query: string, notUpdateCollection?: boolean) {
        this.search = query;
        if (!notUpdateCollection) this.updateCollection();
        this.iqsGlobalSearch.searchObjectsParallel(query, this.objectType,
            (data) => {
                let objects: iqs.shell.SearchResult[];
                if (this.objectTypeFilter) {
                    objects = _.filter(data, (obj: iqs.shell.SearchResult) => {
                        return obj.item.category == this.objectTypeFilter;
                    });
                } else {
                    objects = data;
                }
                this.objects = _.sortBy(objects, (obj: iqs.shell.SearchResult) => {
                    return obj.item.name ? obj.item.name.toLocaleLowerCase() : '';
                });
                this.initSelectedItems();
                if (notUpdateCollection) this.allCollection = _.cloneDeep(this.objects);
            });
    }

    public onCanselSearch() {
        this.search = '';
        this.onSearchResult(this.search);
    }

    private getSelected() {
        this.updateCollection();
        let result: iqs.shell.SearchResultChecked[] = [];
        _.each(this.allCollection, (item: iqs.shell.SearchResultChecked) => {
            if (item.checked) {
                result.push(item)
            }
        });

        return result;
    }

    public change() {
        this.$mdDialog.hide(this.getSelected());
    }
    public cancel() {
        this.$mdDialog.cancel();
    }

    public config() {
        this.$state.go('settings_system.objects', {});
        this.$mdDialog.hide();
    }

}

const translateConfig = function (pipTranslateProvider) {
    // Set translation strings for the module
    pipTranslateProvider.translations('en', {
        'SCHEDULE_DIALOG_TITLE': 'Add objects',
        'ADD_OBJECTS_DIALOG_EMPTY': ''
    });

    pipTranslateProvider.translations('ru', {
        'SCHEDULE_DIALOG_TITLE': 'Добавить объекты',
        'ADD_OBJECTS_DIALOG_EMPTY': 'Объекты не найдены'
    });
}
angular
    .module('iqsAddObjectsDialog', [
        'ngMaterial',
        'iqsGlobalSearch'
    ])
    .config(translateConfig)
    .controller('iqsAddObjectsDialogController', AddObjectsDialogController);

import "./AddObjectsDialogService"