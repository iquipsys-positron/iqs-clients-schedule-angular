import { IRostersViewModel } from '../../models';

interface IScheduleAssigneBindings {
    [key: string]: any;
    roster: any;
    fullDayRoster: any;
    type: any;
}

class AssignParams {
    public object_id: string;
    public assign_id: string;
}

const ScheduleAssigneBindings: IScheduleAssigneBindings = {
    roster: '<?iqsRoster',
    fullDayRoster: '<?iqsFullDayRoster',
    type: '<?iqsType'
}

class ScheduleAssigneChanges implements ng.IOnChangesObject, IScheduleAssigneBindings {
    [key: string]: ng.IChangesObject<any>;

    roster: ng.IChangesObject<iqs.shell.Roster>;
    fullDayRoster: ng.IChangesObject<iqs.shell.Roster>;
    type: ng.IChangesObject<string>;
}

class ScheduleAssigneController implements ng.IController {          public $onInit() {}
    public roster: iqs.shell.Roster;
    public fullDayRoster: iqs.shell.Roster;

    public objects: iqs.shell.ControlObject[];
    public equipments: iqs.shell.ControlObject[];
    public selectObjectIndex: number = 0;
    public selectEquipmentIndex: number = 0;
    public type: string;
    public typeCollection: iqs.shell.TypeCollection;
    public accessConfig: any;

    constructor(
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private iqsRostersViewModel: IRostersViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private pipToasts: pip.controls.IToastService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService
    ) {

        this.accessConfig = iqsAccessConfig.getStateConfigure().access;
        iqsTypeCollectionsService.init();
        this.typeCollection = iqsTypeCollectionsService.getObjectType();
    }

    public $onChanges(changes: ScheduleAssigneChanges) {
        if (changes.roster && changes.roster.currentValue) {
            this.roster = changes.roster.currentValue;
        }

        if (changes.type && changes.type.currentValue) {
            this.type = changes.type.currentValue;
            this.selectObjectIndex = 0;
            this.selectEquipmentIndex = 0;
        }

        if (changes.fullDayRoster && changes.fullDayRoster.currentValue) {
            this.fullDayRoster = changes.fullDayRoster.currentValue;
        }
        this.getObjects();
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsRostersViewModel.getTransaction();
    }

    public avatarClick(object_id: string): void {
        if (this.accessConfig.goToObject)
           // this.$state.go('settings_system.objects', { object_id: object_id });
           window.location.href = window.location.origin + `/config_objects/index.html#/objects?object_id=${object_id}`;
    }
    
    public getObjects() {
        let object: iqs.shell.ControlObject;
        this.objects = [];
        this.equipments = [];
        this.roster.objects.forEach(element => {

            if (this.type == "empty") {
                if (!element.assign_id) {
                    object = this.iqsObjectsViewModel.getObjectById(element.object_id);
                    if (!object) return;
                    if (object.category == iqs.shell.ObjectCategory.People) {
                        this.objects.push(object);
                    } else {
                        if (!_.find(this.roster.objects, { assign_id: object.id })) {
                            this.equipments.push(object);
                        }
                    }
                }
            } else {
                if (element.assign_id) {
                    object = this.iqsObjectsViewModel.getObjectById(element.object_id);
                    this.objects.push(object);
                    object = this.iqsObjectsViewModel.getObjectById(element.assign_id);
                    this.equipments.push(object);
                }
            }
        });

        if (this.objects.length < this.selectObjectIndex) {
            this.selectObjectIndex = 0;
        }
        if (this.equipments.length < this.selectEquipmentIndex) {
            this.selectEquipmentIndex = 0;
        }
    }

    public selectEquipment(index: number) {
        this.selectEquipmentIndex = index;
        if (this.type == 'done') {
            this.selectObjectIndex = index;
        }
    }

    public selectObject(index: number) {
        this.selectObjectIndex = index;
        if (this.type == 'done') {
            this.selectEquipmentIndex = index;
        }
    }

    public updateRoster() {
        let index: number = _.findIndex(this.roster.objects, { object_id: this.objects[this.selectObjectIndex].id });
        if (this.type == 'done') {
            this.roster.objects[index].assign_id = null;
        } else {
            this.roster.objects[index].assign_id = this.equipments[this.selectEquipmentIndex].id;
        }
        this.iqsRostersViewModel.updateRoster(
            this.roster, 
            () => {
                this.getObjects();
            },
            () => {
                this.selectEquipmentIndex = 0;
                this.selectObjectIndex = 0;
            });
    }

    public autoRoster() {
        let indexObject: number, indexEquipment: number;
        let isFind: boolean = false;
        this.objects.forEach(element => {
            if (element.perm_assign_id) {
                indexEquipment = _.findIndex(this.roster.objects, { object_id: element.perm_assign_id });
                if (indexEquipment > -1) {
                    indexObject = _.findIndex(this.roster.objects, { object_id: element.id });

                    if (!_.find(this.roster.objects, { assign_id: element.id })) {
                        this.roster.objects[indexObject].assign_id = element.perm_assign_id;
                        isFind = true;
                    }
                }

            }
        });
        if (isFind) {
            this.iqsRostersViewModel.updateRoster(
                this.roster, () => {
                    this.getObjects();
                },
                () => {

                });
        } else {
            this.pipToasts.showNotification(this.pipTranslate.translate('ROSTERS_ASSIGNED_NOT_FOUND'),
                ['ok'], () => { }, () => { }, '');
        }

    }

}


(() => {
    angular
        .module('iqsScheduleAssigne', ['iqsTypeCollections.Service'])
        .component('iqsScheduleAssigne', {
            bindings: ScheduleAssigneBindings,
            templateUrl: 'schedule/components/ScheduleAssigne.html',
            controller: ScheduleAssigneController,
            controllerAs: '$ctrl'
        })
})();
