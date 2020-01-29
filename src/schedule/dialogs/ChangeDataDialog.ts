export class ChangeDataDialogController implements ng.IController {
    public $onInit() { }
    public theme;
    public dateStart: any;
    public dateEnd: any;
    public timeStep: number = 60;

    public onDateChange: (date: Date) => void;
    public onDateChangeEnd: (date: Date) => void;
    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $rootScope: ng.IRootScopeService,
        params
    ) {
        "ngInject";

        this.theme = this.$rootScope[pip.themes.ThemeRootVar];
        this.dateStart = params.startDate;
        this.dateEnd = params.endDate;


        this.onDateChange = (date: Date) => {
            this.dateStart = date;
        }
        this.onDateChangeEnd = (date: Date) => {
            this.dateEnd = date;
        }
    }


    public close() {
        this.$mdDialog.hide({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd
        });
    }
    public cancel() {
        this.$mdDialog.cancel();
    }


}

const translateConfig = function (pipTranslateProvider) {
    // Set translation strings for the module
    pipTranslateProvider.translations('en', {
        'DIALOG_CHANGE_SET': 'Set',
        'CHANGE_DATA_DIALOG_TITLE': 'Change dates'
    });

    pipTranslateProvider.translations('ru', {
        'DIALOG_CHANGE_SET': 'Установить',
        'CHANGE_DATA_DIALOG_TITLE': 'Изменить время смены'
    });
}
angular
    .module('iqsChangeDataDialog', [
        'ngMaterial',
        'pipTimeAutocomplete'
    ])
    .config(translateConfig)
    .controller('iqsChangeDataDialogController', ChangeDataDialogController);
