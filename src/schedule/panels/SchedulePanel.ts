import '../../common/dialogs/add_equpment/AddEqupmentDialogService';
import '../../common/dialogs/add_objects/AddObjectsDialogService';

import { IAddObjectsDialogService } from '../../common/dialogs/add_objects/IAddObjectsDialogService';
import { IChangeDataDialogService } from '../dialogs/IChangeDataDialogService';
import { IScheduleSaveService } from '../IScheduleSaveService';
import { IRostersViewModel } from '../../models';

interface ISchedulePanelBindings {
    [key: string]: any;

}

const SchedulePanelBindings: ISchedulePanelBindings = {}

class SchedulePanelChanges implements ng.IOnChangesObject, ISchedulePanelBindings {
    [key: string]: ng.IChangesObject<any>;
}

class RostersStatuses {
    id: string;
    title: string;
}

export class ShiftRoster {
    public id: string;
    public org_id: string;
    public name: string;
    public deleted?: boolean;
    public start: number;
    public duration: number;
    public startDate?: Date;
    public endDate?: Date;

    public roster?: iqs.shell.Roster;
}

export class RosterFullObject {
    public assign_id?: string;
    public planned?: boolean;
    public actual?: boolean;
    public start_time?: string;
    public end_time?: string;
    public objectAssign?: iqs.shell.ControlObject

    public id: string;
    public org_id: string;
    public category: string;
    public type: string;
    public deleted: boolean;
    public name: string;
    public description: string;
    public phone: string;
    public pin: string;
    public email?: string;
    public device_id: string;
    public group_ids: string[];
    public longitude?: number;
    public latitude?: number;
    public icon?: any;
}

class ScheduleSection {
    public name: string;
    public shifts: ShiftRoster[];
}

class SchedulePanelController implements ng.IController {
    public $onInit() { }
    public currentState: string;
    public status: string;
    public details: boolean;
    private _date: string = null;
    public dateLocal: moment.Moment;
    public shifts: iqs.shell.Shift[] = [];
    public sections: ScheduleSection[] = [];
    public selectSection: number;
    public selectRoster: number = 0;
    public selectedRoster: ShiftRoster;
    public selectedRosterObjects: RosterFullObject[];
    public selectedRosterObjectsActual: RosterFullObject[];
    public selectedRosterObjectsNotActual: RosterFullObject[];

    private _position: number = 0;
    private organizationOffset;
    private localOffset;
    public typeCollection: iqs.shell.TypeCollection;
    public type: number = 0;
    public typeObjectsCount: number = 0;
    public types: any[] = [
        {
            title: 'OBJECT_CATEGORY_PERSON',
            id: iqs.shell.ObjectCategory.People
        }, {
            title: 'OBJECT_CATEGORY_EQUIPMENT',
            id: iqs.shell.ObjectCategory.Equipment
        }, {
            title: 'OBJECT_CATEGORY_ASSET',
            id: iqs.shell.ObjectCategory.Asset
        }];

    public typeAssign: number = 0;
    public typesAssign: any[] = [
        {
            title: 'UNASSIGNED',
            id: 'empty'
        }, {
            title: 'ASSIGNED',
            id: 'done'
        }];

    public defaultCollection: string[];
    public searchedCollection: string[];
    public countObjects: number = 0;
    public countPlan: number = 0;
    public countActive: number = 0;
    public countPlanOff: number = 0;
    private weeklyRosters: iqs.shell.Roster[] = [];
    private assign: string = "groups";
    private mediaSizeGtSm: boolean;
    private organizationTimezone: string;
    public accessConfig: any;
    private autoSelectTab: boolean = false;
    public openDatePicker: boolean;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        public iqsShiftsViewModel: iqs.shell.IShiftsViewModel,
        private $location: ng.ILocationService,
        private iqsRostersViewModel: IRostersViewModel,
        public pipMedia: pip.layouts.IMediaService,
        private pipDateConvert: pip.dates.IDateConvertService,
        private pipNavService: pip.nav.INavService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private pipTranslate: pip.services.ITranslateService,
        private pipToasts: pip.controls.IToastService,
        private pipDateFormat: pip.dates.IDateFormatService,
        private iqsAddObjectsDialog: IAddObjectsDialogService,
        private iqsAddEqupmentDialog,
        private iqsRostersData: iqs.shell.IRostersDataService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        public iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsChangeDataDialog: IChangeDataDialogService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsScheduleSaveService: IScheduleSaveService,
        private iqsAttendancesData: iqs.shell.IAttendancesDataService
    ) {
        "ngInject";

        this.accessConfig = this.iqsAccessConfig.getStateConfigure().access;
        this.organizationTimezone = this.iqsOrganization.organization && this.iqsOrganization.organization.timezone ? this.iqsOrganization.organization.timezone : moment.tz.guess();
        this.localOffset = moment(new Date()).utcOffset();
        this.organizationOffset = moment(new Date()).tz(this.organizationTimezone).format('z') !== undefined ? moment(new Date()).tz(this.organizationTimezone).utcOffset() : this.localOffset;

        // init in shell now
        // this.iqsTypeCollectionsService.init();
        this.typeCollection = this.iqsTypeCollectionsService.getObjectType();

        this.restoreState();

        this.dateLocal = this.dateLocal.startOf('isoweek');
        this.date = this.dateLocal.toISOString();

        const runWhenReady = () => {
            this.readRoster();

            this.mediaSizeGtSm = this.pipMedia('gt-sm');
            if (!this.pipMedia('gt-sm')) {
                this.details = $location.search().details == 'details' ? true : false;
            } else {
                this.details = false;
                this.$location.search('details', 'main');
            }
        }

        if (this.isPreloaded) {
            runWhenReady();
        }

        // Run when all need data ready
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => {
            if (!this.isPreloaded) return;
            this.accessConfig = this.iqsAccessConfig.getStateConfigure().access;
            runWhenReady();
        }));

        this.cf.push($rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');

                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                    this.$location.search('details', 'main');
                } else {

                }
                this.appHeader();
            }
        }));
    }

    private saveCurrentState() {
        this.iqsScheduleSaveService.currentDate = this.dateLocal.toDate();
        this.iqsScheduleSaveService.selectSection = this.selectSection;
        this.iqsScheduleSaveService.selectRoster = this.selectRoster;
    }

    private restoreState() {
        this.dateLocal = this.iqsScheduleSaveService.currentDate ? moment(this.iqsScheduleSaveService.currentDate) : this.$location.search().date ? moment(this.$location.search().date) : moment();
    }

    private readRoster() {
        this.iqsRostersViewModel.startDate = _.cloneDeep(this.dateLocal).add(-1, 'days').toISOString();
        this.iqsRostersViewModel.endDate = _.cloneDeep(this.dateLocal).add(8, 'days').toISOString();
        this.iqsRostersViewModel.initRosters(null, (data) => {
            this.init();
        });
    }

    public get isPreloaded(): boolean {
        return this.iqsObjectsViewModel.state === iqs.shell.States.Data
            && (this.iqsShiftsViewModel.state === iqs.shell.States.Data || this.iqsShiftsViewModel.state === iqs.shell.States.Empty);
    }

    public get isLoaded(): boolean {
        return this.isPreloaded && this.sections && this.sections.length > 0 && !!this.shifts;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsRostersViewModel.getTransaction();
    }

    public get date(): string {
        return this._date;
    }

    public set date(value: string) {
        this._date = value;
        this.$location.search('date', this._date);
    }

    private init() {
        this.selectedRosterObjects = [];
        this.setWeeklyRosters();
        this.setSections();

        let index: number;
        index = this.selectSection === undefined || this.selectRoster === null ? 0 : this.selectedIndex();
        this.selectItem(index);
        this.appHeader();
    }

    public $onDestroy(): void {
        this.saveCurrentState();
        for (const f of this.cf) { f(); }
    }

    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.appHeader();
    }

    private appHeader(): void {
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.breadcrumb.text = 'SCHEDULE';
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';

        if (!this.pipMedia('gt-sm')) {
            if (this.details) {
                let detailsTitle: string;
                if (this.selectSection && this.sections[this.selectSection]) {
                    detailsTitle = this.pipDateFormat.formatLongDayOfWeek(this.sections[this.selectSection].name) + ' ' +
                        this.pipDateFormat.formatLongDate(this.sections[this.selectSection].name)
                } else {
                    detailsTitle = 'SHEDULE_DETAILS_DEFAULT';
                }
                this.pipNavService.breadcrumb.items = [
                    <pip.nav.BreadcrumbItem>{ title: "SCHEDULE", click: () => { this.toMainFromDetails(); } },
                    <pip.nav.BreadcrumbItem>{
                        title: detailsTitle, click: () => { }, subActions: []
                    }
                ];
                this.pipNavService.icon.showBack(() => {
                    this.toMainFromDetails();
                });
            } else {
                this.pipNavService.icon.showMenu();
            }
        }
        this.pipNavService.actions.hide();
    }

    public changeAssign() {
        this.assign = this.assign == 'groups' ? 'assign' : 'groups';

        // re assign object
        if (this.assign == 'groups') {
            this.init();
        }
    }

    private setWeeklyRosters() {
        let dateLocal: moment.Moment = moment(this.dateLocal).tz(this.organizationTimezone);
        this.weeklyRosters = [];
        this.weeklyRosters = _.cloneDeep(this.iqsRostersViewModel.rosters);
    }

    private setSections(readRosters: boolean = false) {
        this.shifts = this.iqsShiftsViewModel.shifts;
        let sections = [];
        let section: ScheduleSection,
            dateStart: moment.Moment = moment(this.date).startOf('isoweek'),
            localStartDate: moment.Moment;

        for (let i: number = 0; i < 7; i++) {
            section = new ScheduleSection();
            localStartDate = _.cloneDeep(dateStart);
            localStartDate.add('days', i)
            section.name = localStartDate.toISOString();
            section.shifts = [new ShiftRoster()];
            section.shifts[0].name = "Full day";
            this.shifts.forEach(element => {
                section.shifts.push(_.cloneDeep(element));
            });

            for (let j: number = 0; j < section.shifts.length; j++) {
                section.shifts[j].roster = this.getRoster(localStartDate, section.shifts[j].id);
                if (section.shifts[j].roster) {
                    section.shifts[j].startDate = new Date(new Date(section.shifts[j].roster.start_time).getTime() - (this.localOffset - this.organizationOffset) * 60 * 1000);
                    section.shifts[j].endDate = new Date(new Date(section.shifts[j].roster.end_time).getTime() - (this.localOffset - this.organizationOffset) * 60 * 1000);
                }
            }
            sections.push(section);
        }
        this.sections = sections;

        if (readRosters) {
            this.iqsRostersViewModel.initRosters(null, (data) => {
                this.init();
            });
        }
    }

    public getRoster(shiftStartDate: any, shiftId: string) {
        let roster = _.find(this.weeklyRosters, (item: iqs.shell.Roster) => {
            let itemDate: moment.Moment = moment(new Date(item.start_time).getTime() - (this.localOffset - this.organizationOffset) * 60 * 1000).startOf('day');
            let isRoster: boolean = item.shift_id == shiftId &&
                itemDate.year() == shiftStartDate.year() &&
                itemDate.month() == shiftStartDate.month() &&
                itemDate.date() == shiftStartDate.date();

            return isRoster;
        });

        return roster;
    }

    public objectById(id: string) {
        return this.iqsObjectsViewModel.getObjectById(id);
    }

    public onCanselSearch() {
        this.status = '';
        this.$location.search('status', this.status);
        this.iqsRostersViewModel.filterRosters('all');
        this.iqsRostersViewModel.selectItem();
    }

    public get collection() {
        return this.iqsRostersViewModel.rosters;
    }

    private get position(): number {
        return this._position;
    }

    private set position(value: number) {
        this._position = value;
        if (value == 0) {
            this.selectSection = 0;
            this.selectRoster = 0;
        } else {
            this.selectSection = Math.floor(this._position / (this.iqsShiftsViewModel.shifts.length + 1));
            this.selectRoster = this._position - this.selectSection * (this.iqsShiftsViewModel.shifts.length + 1);
        }
        this.$location.search('position', this._position);
    }

    public selectedIndex() {
        return this.sections.length ? this.selectRoster + this.selectSection * this.sections[0].shifts.length : 0;
    }

    public selectButtons() {
        this.iqsRostersViewModel.filterRosters(this.status);
        this.iqsRostersViewModel.selectItem();
    }

    public onCalendarDateChange() {
        this.dateLocal = moment(this.dateLocal);
        this.selectSection = this.dateLocal.isoWeekday() - 1;
        this.dateLocal = this.dateLocal.startOf('isoweek');
        this.date = this.dateLocal.toISOString();
        this.position = 0;
        this.readRoster();
    }

    public next() {
        this.dateLocal = moment(this.dateLocal.add(7, 'days'));
        this.selectSection = this.dateLocal.isoWeekday() - 1;
        this.dateLocal = this.dateLocal.startOf('isoweek');
        this.date = this.dateLocal.toISOString();
        this.position = 0;
        this.readRoster();
    }

    public back() {
        this.dateLocal = moment(this.dateLocal.add(-7, 'days'));
        this.selectSection = this.dateLocal.isoWeekday() - 1;
        this.dateLocal = this.dateLocal.startOf('isoweek');
        this.date = this.dateLocal.toISOString();
        this.position = 0;
        this.readRoster();
    }

    public current() {
        this.dateLocal = moment();
        this.selectSection = this.dateLocal.isoWeekday() - 1;
        this.dateLocal = this.dateLocal.startOf('isoweek');
        this.date = this.dateLocal.toISOString();
        this.position = 0;
        this.readRoster();
    }

    private selectTab() {
        for (let i = 0; i < this.types.length; i++) {
            let count: number = 0;
            _.each(this.selectedRosterObjects, (item: RosterFullObject) => {
                if (item.category == this.types[i].id) {
                    count += 1;
                }
            });
            if (count > 0) {
                this.type = i;
                this.typeObjectsCount = count;

                return;
            }
        };
    }

    public selectItem(index: number) {
        this.position = index;
        this.getSelectedRoster();

        if (this.typeObjectsCount == 0) {
            this.selectTab();
        }

        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public getSelectedRoster() {
        let shift: ShiftRoster = this.sections[this.selectSection].shifts[this.selectRoster];
        this.selectedRoster = shift;

        if (shift && shift.roster) {
            let fromTime = shift.roster.start_time;
            let toTime = shift.roster.end_time;

            this.transaction.begin('ReadAttendances');
            this.iqsAttendancesData.readAttendances(
                {
                    from_time: fromTime,
                    to_time: toTime,
                },
                (data: iqs.shell.Attendances) => {
                    let dataCkeck: boolean = shift.roster.start_time == data.start_time && shift.roster.end_time == data.end_time;

                    // set actual information
                    let count: number = 0;
                    this.countPlan = 0;
                    this.countActive = 0;
                    this.countPlanOff = 0;

                    // planed objects
                    shift.roster.objects.forEach(element => {
                        let object = this.objectById(element.object_id);
                        let index: number = -1;
                        if (dataCkeck) {
                            index = _.findIndex(data.objects, { object_id: element.object_id });
                        }
                        element.actual = index > -1;
                        element.planned = true;

                        if (object && object.category == this.types[this.type].id) {
                            if (element.actual) this.countActive++;
                            if (element.planned && !element.actual) this.countPlan++;
                        }
                    });

                    // // not planed objects
                    // let objectIds: ObjectAttendance[] = _.cloneDeep(data.objects);
                    // // remove all planed objects
                    // let i: number;
                    // for (i = 0; i < objectIds.length; i++) {
                    //     let index: number = _.findIndex(shift.roster.objects, { object_id: objectIds[i].object_id });
                    //     if (index > -1) {
                    //         objectIds.splice(i, 1);
                    //         i--;
                    //     }
                    // }

                    // if (dataCkeck) {
                    //     // add not planed object
                    //     _.each(objectIds, (item) => {
                    //         let obj: RosterObject = {
                    //             object_id: item.object_id,
                    //             assign_id: null,
                    //             planned: false,
                    //             actual: true,
                    //             start_time: item.start_time,
                    //             end_time: item.end_time
                    //         };

                    //         shift.roster.objects.push(obj);
                    //     });
                    // }

                    let objects: iqs.shell.ControlObject[] = [];
                    _.each(shift.roster.objects, (item: iqs.shell.RosterObject) => {
                        let object: RosterFullObject = this.objectById(item.object_id);
                        if (object) {
                            object.assign_id = item.assign_id;
                            object.planned = item.planned;
                            object.actual = item.actual;
                            object.start_time = item.start_time;
                            object.end_time = item.end_time;
                            object.objectAssign = this.objectById(item.assign_id);
                            objects.push(object);
                        }
                    });

                    this.selectedRosterObjects = _.sortBy(objects, function (item: RosterFullObject) {
                        return item.name ? item.name.toLocaleLowerCase() : '';
                    });

                    this.selectedRoster = shift;
                    this.countObjects = this.selectedRosterObjects.length;

                    if (this.autoSelectTab) {
                        this.selectTab();
                        this.autoSelectTab = false;
                    }
                    this.typeObjectsCount = this.calcObjectsCount();
                    this.transaction.end();
                },
                (error: any) => {
                    this.transaction.end(error);
                }
            );
        } else {
            this.selectedRosterObjects = [];
            this.countObjects = 0;
            this.countPlan = 0;
            this.countActive = 0;
            this.typeObjectsCount = this.calcObjectsCount();
        }
    }

    public getNewRoster(sectionIndex: number, shiftIndex: number): iqs.shell.Roster {
        let roster: iqs.shell.Roster = new iqs.shell.Roster();
        roster.name = this.sections[sectionIndex].shifts[shiftIndex].name;
        roster.shift_id = this.sections[sectionIndex].shifts[shiftIndex].id;

        if (shiftIndex == 0) {
            roster.start_time = moment(this.sections[sectionIndex].name).add(this.localOffset - this.organizationOffset, 'minutes').toISOString();
            roster.end_time = moment(roster.start_time).add(1, 'days').toISOString();
        } else {
            let duration = this.sections[sectionIndex].shifts[shiftIndex].duration < 0 ? 24 * 60 + this.sections[sectionIndex].shifts[shiftIndex].duration : this.sections[sectionIndex].shifts[shiftIndex].duration;
            let startHours = Math.floor((this.sections[sectionIndex].shifts[shiftIndex].start) / 60) + (this.localOffset - this.organizationOffset) / 60;
            let endHours = Math.floor((this.sections[sectionIndex].shifts[shiftIndex].start + duration) / 60) + (this.localOffset - this.organizationOffset) / 60;

            roster.start_time = new Date(new Date(this.sections[sectionIndex].name).getTime() + startHours * 60 * 60 * 1000).toISOString();
            roster.end_time = new Date(new Date(this.sections[sectionIndex].name).getTime() + endHours * 60 * 60 * 1000).toISOString();
        }
        roster.objects = [];

        return roster;
    }

    public openMenu($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    public addRoster() {
        this.iqsAddObjectsDialog.show({ roster: {} }, (res: iqs.shell.SearchResult[]) => {
            let roster = this.getNewRoster(this.selectSection, this.selectRoster);
            let object: iqs.shell.RosterObject;
            res.forEach(element => {
                object = new iqs.shell.RosterObject();
                object.object_id = element.item.id;
                roster.objects.push(object);
            });

            this.iqsRostersViewModel.saveRoster(roster, (item) => {
                // update objects
                this.init();
            }, () => { });
        });
    }

    public updateRoster(shiftRoster: ShiftRoster) {
        if (!shiftRoster) return

        this.iqsAddObjectsDialog.show(
            {
                roster: shiftRoster.roster,
                objectCategory: shiftRoster.roster.objects && shiftRoster.roster.objects.length > 0 ? this.types[this.type].id : null
            },
            (res: iqs.shell.SearchResult[]) => {
                let object: iqs.shell.RosterObject;
                let objects: iqs.shell.RosterObject[] = [];
                let oldObjects: iqs.shell.RosterObject[] = _.cloneDeep(shiftRoster.roster.objects);

                // add objects other types
                shiftRoster.roster.objects.forEach(element => {
                    if (this.objectById(element.object_id).category != this.types[this.type].id) {
                        objects.push(element);
                    } else {
                        let item = _.find(res, (i) => {
                            return i.item.id == element.object_id
                        })
                        if (item) {
                            objects.push(element);
                        }
                    }
                });
                // add objects selected types
                res.forEach(element => {
                    let item = _.find(objects, (i) => {
                        return i.object_id == element.item.id
                    })
                    if (!item) {
                        object = new iqs.shell.RosterObject();
                        object.object_id = element.item.id;
                        objects.push(object);
                    }
                });

                shiftRoster.roster.objects = objects;

                this.iqsRostersViewModel.updateRoster(shiftRoster.roster, (item) => {
                    this.autoSelectTab = true;
                    this.init();
                }, () => { });
            });
    }

    public avatarClick(object_id: string): void {
        if (this.accessConfig.goToObject)
            // this.$state.go('settings_system.objects', { object_id: object_id });
            window.location.href = window.location.origin + `/config_objects/index.html#/objects?object_id=${object_id}`;
    }

    private calcObjectsCount(): number {
        let count: number = 0;
        _.each(this.selectedRosterObjects, (item: RosterFullObject) => {
            if (item.category == this.types[this.type].id) {
                count += 1;
            }
        });


        this.selectedRosterObjectsActual = _.filter(this.selectedRosterObjects, (item) => {
            return item.actual && item.category == this.types[this.type].id;
        });

        this.selectedRosterObjectsNotActual = _.filter(this.selectedRosterObjects, (item) => {
            return !item.actual && item.category == this.types[this.type].id;
        });

        return count;
    }

    public selectTypeObject(type: number) {
        this.type = type;

        this.typeObjectsCount = this.calcObjectsCount();

    }

    public selectTypeAssignObject(type: number) {
        this.typeAssign = type;
    }

    public deleteClick(id: string) {
        this.pipConfirmationDialog.show(
            {

            }, () => {
                this.iqsRostersViewModel.deleteRoster(id, () => { }, () => { });
            });
    }

    public deleteObjetClick(shiftRoster: ShiftRoster, item: any) {
        let object_id: string = item.id;
        if (!shiftRoster || !shiftRoster.roster) return;
        let object: iqs.shell.ControlObject = this.iqsObjectsViewModel.getObjectById(object_id);
        let name: string = object && object.name ? object.name : '';
        this.pipConfirmationDialog.show(
            {
                event: null,
                title: name ? this.pipTranslate.translate('OBJECT_CONFIRMATION_TITLE') + ' "' + name + '"?' : this.pipTranslate.translate('OBJECT_CONFIRMATION_TITLE') + '?',
                ok: 'DELETE',
                cancel: 'CANCEL'
            },
            () => {
                shiftRoster.roster.objects = _.filter(shiftRoster.roster.objects, function (item) { return item.object_id != object_id });
                this.selectedRosterObjects = _.filter(this.selectedRosterObjects, function (item) { return item.id != object_id });
                this.iqsRostersViewModel.updateRoster(shiftRoster.roster, (item) => {
                    this.init();
                },
                    () => { });
            });
    }

    public assigneObjetClick(shiftRoster: ShiftRoster, object_id: string, assign_id: string) {
        if (!shiftRoster || !shiftRoster.roster) return;

        let searchCollection: string[] = [];
        let objectIndex: number = _.findIndex(shiftRoster.roster.objects, (item: iqs.shell.RosterObject) => {
            return (item.object_id == object_id && item.assign_id == assign_id);
        });

        if (objectIndex == -1) return;

        _.each(this.selectedRosterObjects, (item: RosterFullObject) => {
            if (item.category == iqs.shell.ObjectCategory.Equipment || item.category == iqs.shell.ObjectCategory.Asset)
                searchCollection.push(item.name);
        });

        this.iqsAddEqupmentDialog.show({
            searchCollection: searchCollection,
            equipment_id: assign_id
        },
            (id: string) => {
                shiftRoster.roster.objects[objectIndex].assign_id = id;
                this.iqsRostersViewModel.updateRoster(shiftRoster.roster, (item) => {
                    this.init();
                }, () => { })
            });
    }

    public onAssign(object_id, assign_id) {
        // shiftRoster.roster.objects[index].assign_id = null;
        //  todo ?? 
    }

    public deleteAssine(shiftRoster: ShiftRoster, object_id: string, assign_id: string) {
        if (!shiftRoster || !shiftRoster.roster) return;

        let index: number = _.findIndex(shiftRoster.roster.objects, { object_id: object_id });
        if (index !== -1) {
            shiftRoster.roster.objects[index].assign_id = null;
        }
        this.iqsRostersViewModel.updateRoster(
            shiftRoster.roster,
            (item) => {
                // update objects
                this.init();
            },
            () => {

            });
    }

    public changeRoster() {
        if (!this.selectedRoster) return;

        let roster = this.selectedRoster.roster ? this.selectedRoster.roster : this.getNewRoster(this.selectSection, this.selectRoster);
        let startTime = moment(roster.start_time).tz(this.organizationTimezone).hours();
        let endTime = moment(roster.end_time).tz(this.organizationTimezone).hours();
        if (endTime <= startTime) {
            endTime += 24; // to next day
        }
        let startOfDay: moment.Moment = moment(roster.start_time).tz(this.organizationTimezone).startOf('day');
        let startDate: Date = moment([startOfDay.year(), startOfDay.month(), startOfDay.date(), startTime, 0, 0, 0]).toDate();
        let endDate: Date = moment([startOfDay.year(), startOfDay.month(), startOfDay.date(), endTime, 0, 0, 0]).toDate();

        this.iqsChangeDataDialog.show({ startDate: startDate, endDate: endDate }, (data) => {
            if (this.selectedRoster.roster && this.selectedRoster.roster.id) {
                let startTime = moment(data.dateStart).hours();
                let endTime = moment(data.dateEnd).hours();
                if (endTime <= startTime) {
                    endTime += 24; // to next day
                }
                let startOfDay: moment.Moment = moment(data.dateStart).startOf('day');
                roster.start_time = moment(data.dateStart).tz(this.organizationTimezone).startOf('day').add(startTime, 'hours').toISOString();
                roster.end_time = moment(data.dateStart).tz(this.organizationTimezone).startOf('day').add(endTime, 'hours').toISOString();

                this.iqsRostersViewModel.updateRoster(
                    this.selectedRoster.roster,
                    (item: iqs.shell.Roster) => {
                        // update objects
                        this.init();
                    },
                    (error: any) => { });
            } else {
                let roster: iqs.shell.Roster = new iqs.shell.Roster(),
                    object: iqs.shell.RosterObject;
                roster.name = this.sections[this.selectSection].shifts[this.selectRoster].name;
                roster.shift_id = this.sections[this.selectSection].shifts[this.selectRoster].id;
                roster.start_date = moment(this.sections[this.selectSection].name).format();

                if (this.selectRoster == 0) {
                    roster.start_time = moment(data.dateStart).tz(this.organizationTimezone).startOf('day').toISOString();
                    roster.end_time = moment(data.dateStart).tz(this.organizationTimezone).startOf('day').add(1, 'days').toISOString();
                } else {
                    let startTime = moment(data.dateStart).hours();
                    let endTime = moment(data.dateEnd).hours();
                    if (endTime <= startTime) {
                        endTime += 24; // to next day
                    }
                    let startOfDay: moment.Moment = moment(data.dateStart).startOf('day');
                    roster.start_time = moment([startOfDay.year(), startOfDay.month(), startOfDay.date(), startTime, 0, 0, 0]).tz(this.organizationTimezone).toISOString();
                    roster.end_time = moment([startOfDay.year(), startOfDay.month(), startOfDay.date(), endTime, 0, 0, 0]).tz(this.organizationTimezone).toISOString();
                }
                roster.objects = [];
                this.iqsRostersViewModel.saveRoster(
                    roster,
                    (item: iqs.shell.Roster) => {
                        this.init();
                    },
                    (error: any) => { });
            }

        });
    }

    private toZoneData(date: moment.Moment): moment.Moment {

        return date.add(this.localOffset - this.organizationOffset, 'minutes');
    }

    private fromZoneData(date: any): moment.Moment {

        return moment(date).add(this.organizationOffset - this.localOffset, 'minutes');
    }

    private clearCurrentRosters() {
        let currentRoster = _.cloneDeep(this.iqsRostersViewModel.rosters);
        let deleteBatch: iqs.shell.Roster[] = [];
        let copyError: string;
        async.series([
            // select current roster
            (callback) => {
                let dateLocal: moment.Moment = _.cloneDeep(this.dateLocal);
                dateLocal.startOf('isoweek').add(this.localOffset - this.organizationOffset, 'minutes');
                let startDate = _.cloneDeep(dateLocal).toISOString();
                _.each(currentRoster, (item: iqs.shell.Roster) => {
                    if (moment(item.start_time).valueOf() - dateLocal.valueOf() >= 0 && moment(item.start_time).valueOf() - dateLocal.valueOf() < 7 * 24 * 60 * 60 * 1000) {
                        deleteBatch.push(item);
                    }
                })
                callback();
            },
            // save roster copy to next week
            (callback) => {
                async.each(deleteBatch, (roster: iqs.shell.Roster, callback1) => {
                    this.iqsRostersData.deleteRoster(
                        roster.id,
                        (item) => {
                            callback1();
                        },
                        (error) => {
                            callback1(error);
                        });
                },
                    (error) => {
                        if (error) {
                            copyError = 'ROSTER_DELETE_ERROR';
                            callback(new Error(this.pipTranslate.translate(copyError)));
                        } else {
                            callback();
                        }
                    });
            }
        ], (error) => {
            if (error) {
                let errorMessage: string;
                errorMessage = copyError ? copyError : 'ROSTER_DELETE_ERROR';

                this.pipToasts.showError(
                    this.pipTranslate.translate(errorMessage),
                    () => { },
                    () => { }, '', error
                );

                return;
            }
            this.readRoster();
            this.pipToasts.showNotification(this.pipTranslate.translate('ROSTER_DELETE_SUCCESS'),
                ['ok'], () => { }, () => { }, '');
        });
    }

    public onClear() {
        this.pipConfirmationDialog.show(
            {
                event: null,
                title: this.pipTranslate.translate('ROSTER_CLEAR_CONFIRMATION_TITLE'),
                ok: 'SCHEDULE_CLEAR_BUTTON',
                cancel: 'CANCEL'
            },
            () => {
                this.clearCurrentRosters();
            });
    }

    // copy current shedule to next week
    public onCopy() {
        let currentRoster = _.cloneDeep(this.iqsRostersViewModel.rosters);
        let copyBatch: iqs.shell.Roster[] = [];
        let copyError: string;
        // todo: start transaction
        async.series([
            // check current roster
            (callback) => {
                let dateLocal: moment.Moment = _.cloneDeep(this.dateLocal);
                dateLocal.startOf('isoweek').add(this.localOffset - this.organizationOffset, 'minutes');
                let startDate = _.cloneDeep(dateLocal).toISOString();
                _.each(currentRoster, (item: iqs.shell.Roster) => {
                    if (moment(item.start_time).valueOf() - dateLocal.valueOf() >= 0 && moment(item.start_time).valueOf() - dateLocal.valueOf() < 7 * 24 * 60 * 60 * 1000) {
                        copyBatch.push(item);
                    }
                })
                if (copyBatch && copyBatch.length > 0) {
                    callback();
                } else {
                    copyError = 'CURRENT_ROSTER_EMPTY';
                    callback(new Error(this.pipTranslate.translate(copyError)));
                }
            },
            // check present next roster
            (callback) => {
                let dateLocal: moment.Moment = _.cloneDeep(this.dateLocal);
                dateLocal.startOf('isoweek').add(7, 'days').add(this.localOffset - this.organizationOffset, 'minutes');
                let startDate = _.cloneDeep(dateLocal).toISOString();

                let endDate = _.cloneDeep(dateLocal).add(7, 'days').toISOString();
                let params: any = {};
                if (startDate) {
                    params.from_time = startDate;;
                }
                if (startDate) {
                    params.to_time = endDate;
                }

                this.iqsRostersData.readRosters(
                    params,
                    (data: iqs.shell.DataPage<iqs.shell.Roster>) => {
                        if (data && data.data && data.data.length > 0) {
                            let isThisWeek: number = 0;
                            for (const shift of data.data) {
                                if (shift.start_time && moment(shift.start_time).isBefore(dateLocal)) isThisWeek++;
                            }
                            if (isThisWeek === data.data.length) {
                                callback();
                            } else {
                                copyError = 'ROSTER_NOT_EMPTY';
                                callback(new Error(this.pipTranslate.translate(copyError)));
                            }
                        } else callback();
                    },
                    (error: any) => {
                        callback(error);
                    }
                );
            },
            // save roster copy to next week
            (callback) => {
                async.each(copyBatch, (roster: iqs.shell.Roster, callback1) => {
                    roster.start_time = moment(roster.start_time).add(7, 'days').toISOString();
                    roster.end_time = moment(roster.end_time).add(7, 'days').toISOString();
                    delete roster.id;
                    this.iqsRostersViewModel.saveRoster(
                        roster,
                        (item) => {
                            callback1();
                        },
                        (error) => {
                            callback1(error);
                        });
                }, (error) => {
                    if (error) {
                        copyError = 'ROSTER_SAVE_ERROR';
                        callback(new Error(this.pipTranslate.translate(copyError)));
                    } else {
                        callback();
                    }
                });
            }
        ], (error) => {
            if (error) {
                let errorMessage: string;
                errorMessage = copyError ? copyError : 'ROSTER_COPY_ERROR';

                this.pipToasts.showError(this.pipTranslate.translate(errorMessage),
                    () => { }, () => { }, '', error);

                return;
            }
            this.pipToasts.showNotification(this.pipTranslate.translate('ROSTER_COPY_SUCCESS'),
                ['ok'], () => { }, () => { }, '');
        });
    }
}

(() => {
    angular
        .module('iqsSchedulePanel', [
            'iqsModels',
            'iqsAddObjectsDialog',
            'iqsAddEqupmentDialog',
            'iqsScheduleAssigne',
            'iqsChangeDataDialog',
            'iqsTypeCollections.Service',
            'iqsFormats.ObjectFilter'
        ])
        .component('iqsSchedulePanel', {
            bindings: SchedulePanelBindings,
            templateUrl: 'schedule/panels/SchedulePanel.html',
            controller: SchedulePanelController,
            controllerAs: '$ctrl'
        })
})();
