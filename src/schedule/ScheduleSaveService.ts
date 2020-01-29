import { IScheduleSaveService } from './IScheduleSaveService';

class ScheduleSaveService implements IScheduleSaveService {
    private _selectSection: number;
    private _selectRoster: number;
    private _currentDate: Date;

    constructor() {
        "ngInject";
    }

    public set selectSection(selectSection: number) {
        this._selectSection = selectSection;
    }

    public get selectSection(): number {
        return this._selectSection;
    }
    public set selectRoster(selectRoster: number) {
        this._selectRoster = selectRoster;
    }

    public get selectRoster(): number {
        return this._selectRoster;
    }

    public set currentDate(currentDate: Date) {
        this._currentDate = currentDate;
    }

    public get currentDate(): Date {
        return this._currentDate;
    }
}

{
    angular.module('iqsSchedule.SaveService', [])
        .service('iqsScheduleSaveService', ScheduleSaveService);

}
