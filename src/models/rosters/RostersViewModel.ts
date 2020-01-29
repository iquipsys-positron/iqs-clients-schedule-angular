import { RostersModel } from './RostersModel';
import { IRostersViewModel } from './IRostersViewModel';

class RostersViewModel implements IRostersViewModel {
    private _isPopulated: boolean = false;
    public model: RostersModel;

    constructor(
        $location: ng.ILocationService,
        iqsRostersData: iqs.shell.IRostersDataService,
        pipTransaction: pip.services.ITransactionService
    ) {
        this._isPopulated = false;
        this.model = new RostersModel($location, iqsRostersData, pipTransaction);
    }

    public initRosters(filter?: string, successCallback?: (data: iqs.shell.Roster[]) => void, errorCallback?: (error: any) => void) {
        this.model.getRosters(filter || 'all', (data: iqs.shell.Roster[]) => {
            this._isPopulated = true;
            successCallback(data);
        }, errorCallback);
    }

    public filterRosters(filter: string = 'all') {
        this.model.filterRosters(filter);
    }

    public get rosters() {
        return this.model.rosters;
    }

    public get allRosters() {
        return this.model.allRosters;
    }

    public selectItem(index?: number) {
        this.model.selectItem(index);

    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
    }

    public get state(): string {
        return this.model.state;
    }

    public set state(state: string) {
        this.model.state = state;
    }

    public get startDate(): string {
        return this.model.startDate;
    }

    public set startDate(startDate: string) {
        this.model.startDate = startDate;
    }

    public get endDate(): string {
        return this.model.endDate;
    }

    public set endDate(endDate: string) {
        this.model.endDate = endDate;
    }

    public get selectedIndex(): number {
        return this.model.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.model.selectedIndex = index;
    }

    public get isPopulated(): boolean {
        return this._isPopulated;
    }

    public getRosterById(rosterId: string): iqs.shell.Roster {
        return this.model.getRosterById(rosterId)
    }

    public saveRoster(data: iqs.shell.Roster, callback: (item: iqs.shell.Roster) => void, error: (err: any) => void) {
        this.model.saveRoster(data, callback, error);
    }

    public deleteRoster(id, callback: () => void, error: () => void) {
        this.model.deleteRoster(id, callback, error);
    }

    public updateRoster(data: iqs.shell.Roster, callback: (item: iqs.shell.Roster) => void, error: (err: any) => void) {
        this.model.updateRoster(data, callback, error);
    }

    public filterWithArrayObjects(objects: iqs.shell.SearchResult[]) {
        this.model.filterWithArrayObjects(objects);
    }

    public getCurrentRosters(time: Date, successCallback?: (data: iqs.shell.Roster[]) => void, errorCallback?: (error: any) => void) {
        this.model.getCurrentRosters(time, successCallback, errorCallback);
    }

    public clean(): void {
        this._isPopulated = false;
        this.model.clean();
    }
}

angular.module('iqsRosters.ViewModel', ['iqsRosters.Data'])
    .service('iqsRostersViewModel', RostersViewModel);