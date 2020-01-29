export const ScheduleStateName: string = 'app';

class ScheduleController implements ng.IController {          public $onInit() {}
    /**
     * Cleanup function
     */
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        private $window: ng.IWindowService,
        private pipMedia: pip.layouts.IMediaService,
        private pipNavService: pip.nav.INavService,

    ) {
        "ngInject";

        this.cf.push($rootScope.$on(pip.layouts.LayoutResizedEvent, ($event, newSize) => {
            this.appHeader();
        }));

        this.appHeader();
    }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    public onRetry() {
        this.$window.history.back();
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'menu': true, 'actions': 'primary', 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
    }
}

function configureScheduleRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ScheduleStateName, {
            url: '/schedule?details&edit&date&position',
            auth: true,
            reloadOnSearch: false,
            views: {
                '@': {
                    controller: ScheduleController,
                    controllerAs: '$ctrl',
                    templateUrl: 'schedule/Schedule.html'
                }
            }
        });
}

function configureScheduleAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {
        addObject: iqs.shell.AccessRole.manager,
        assignObject: iqs.shell.AccessRole.manager,
        editShift: iqs.shell.AccessRole.manager,
        goToObject: iqs.shell.AccessRole.user,
    }
    iqsAccessConfigProvider.registerStateAccess(ScheduleStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(ScheduleStateName, accessConfig);
}

(() => {
    angular
        .module('iqsSchedule', ['pipNav', 'iqsSchedulePanel', 'iqsSchedule.SaveService'])
        .config(configureScheduleRoute)
        .config(configureScheduleAccess);
})();
