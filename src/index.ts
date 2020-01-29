/// <reference path="../typings/tsd.d.ts" />
class PositronScheduleAppController implements ng.IController {
    public $onInit() { }
    public isChrome: boolean;

    constructor(
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        pipSystemInfo: pip.services.ISystemInfo,
    ) {
        "ngInject";

        this.isChrome = pipSystemInfo.browserName == 'chrome' && pipSystemInfo.os == 'windows';
        // $rootScope.$on(iqs.shell.LoadingSuccessEvent, () => {
        //     $state.go();
        // });
    }
}
angular
    .module('iqsPositronScheduleApp', [
        'iqsPositronSchedule.Config',
        'iqsPositronSchedule.Templates',
        'iqsOrganizations.Service',
        'iqsSchedule'
    ])
    .controller('iqsPositronScheduleAppController', PositronScheduleAppController);


