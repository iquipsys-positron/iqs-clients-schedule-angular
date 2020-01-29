export class RosterParams {
    skip: number = 0;
    total: boolean = true;
    size: number = 100;
    type?: string;
    time?: string;
    to_time: string;
    from_time: string;
}

export class RostersModel {
    public state: string;
    public allRosters: iqs.shell.Roster[];
    public rosters: iqs.shell.Roster[];
    public selectedIndex: number;
    public startDate: string;
    public endDate: string;
    private transaction: pip.services.Transaction;

    constructor(
        private $location: ng.ILocationService,
        private iqsRostersData: iqs.shell.IRostersDataService,
        private pipTransaction: pip.services.ITransactionService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('rosters');
    }

    public getRosters(filter: string, successCallback?: (data: iqs.shell.Roster[]) => void, errorCallback?: (error: any) => void) {
        this.state = iqs.shell.States.Progress;
        let params: RosterParams = new RosterParams();
        if (this.startDate) {
            params.from_time = this.startDate;;
        }
        if (this.startDate) {
            params.to_time = this.endDate;
        }
        this.transaction.begin('read');
        this.iqsRostersData.readRosters(
            params,
            (data: iqs.shell.DataPage<iqs.shell.Roster>) => {
                this.getRostersCallback(data, filter, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public getCurrentRosters(time: Date, successCallback?: (data: iqs.shell.Roster[]) => void, errorCallback?: (error: any) => void) {
        let params: RosterParams = new RosterParams();
        // params.time = new Date(time) instanceof Date && !isNaN(time.valueOf()) ? new Date(time).toISOString() : new Date().toISOString();
        params.time = moment(time).toDate() instanceof Date && !isNaN(time.valueOf()) ? moment(time).toISOString() : new Date().toISOString();
        this.transaction.begin('read');
        this.iqsRostersData.readRosters(
            params,
            (data: iqs.shell.DataPage<iqs.shell.Roster>) => {
                this.transaction.end();
                if (successCallback) successCallback(data.data);
            },
            (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public selectItem(index?: number) {
        if (index) {
            this.selectedIndex = index;

        }
        if (this.rosters.length <= this.selectedIndex) {
            this.selectedIndex = 0;
        }
        if (this.rosters.length > 0) {
            this.$location.search('roster_id', this.rosters[this.selectedIndex].id);
            this.state = iqs.shell.States.Data;
        } else {
            this.state = iqs.shell.States.Empty;
        }
    }

    public filterRosters(filter: string = 'all') {
        this.rosters = this.allRosters;
        this.state = this.rosters.length > 0 ? iqs.shell.States.Data : iqs.shell.States.Empty;
    }

    public filterWithArrayObjects(objects: iqs.shell.SearchResult[]) {
        this.rosters = _.filter(this.rosters, (item: iqs.shell.Roster) => {
            return _.findIndex(objects, { id: item.id }) != -1 ? true : false;
        })
        this.state = this.rosters.length > 0 ? iqs.shell.States.Data : iqs.shell.States.Empty;

    }

    public getRosterById(rosterId: string) {
        return _.find(this.allRosters, (roster) => { return roster.id === rosterId; });
    }

    private getRostersCallback(data: iqs.shell.DataPage<iqs.shell.Roster>, filter?: string, successCallback?: (data: iqs.shell.Roster[]) => void) {
        this.allRosters = data.data;
        this.filterRosters(filter);

        if (this.$location.search()['roster_id']) {
            this.selectedIndex = _.findIndex(this.rosters, { id: this.$location.search()['roster_id'] });
        } else {
            if (this.rosters.length > 0) {
                this.selectedIndex = 0;
                this.$location.search('roster_id', this.rosters[0].id)
            } else {
                this.selectedIndex = null;
            }
        }
        this.transaction.end();

        if (successCallback) {
            successCallback(this.allRosters);
        }
    }

    public saveRoster(data: iqs.shell.Roster, callback?: (item: iqs.shell.Roster) => void, errorCallback?: (err: any) => void) {
        this.transaction.begin('create');
        this.iqsRostersData.saveRoster(data,
            (item: iqs.shell.Roster) => {
                this.rosters.push(item);
                this.allRosters.push(item);
                this.selectedIndex = this.rosters.length - 1;
                this.selectItem();
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public deleteRoster(id: string, callback?: () => void, errorCallback?: (error: string) => void) {
        this.transaction.begin('delete');
        this.iqsRostersData.deleteRoster(id,
            (item) => {
                this.rosters = _.filter(this.rosters, (roster: iqs.shell.Roster) => {
                    return item.id != roster.id
                });
                this.allRosters = _.filter(this.allRosters, (roster: iqs.shell.Roster) => {
                    return item.id != roster.id
                });
                if (this.selectedIndex >= this.rosters.length) {
                    this.selectedIndex = this.rosters.length - 1;
                }
                this.selectItem();
                this.transaction.end();
                if (callback) {
                    callback();
                }
            },
           (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public updateRoster(data: iqs.shell.Roster, callback?: (item) => void, errorCallback?: (err) => void) {
        this.transaction.begin('update');
        this.iqsRostersData.updateRoster(data.id, data,
            (item: iqs.shell.Roster) => {
                let index: number = _.findIndex(this.rosters, { id: item.id });
                if (index > -1) {
                    this.rosters[index] = item;
                }

                index = _.findIndex(this.allRosters, { id: item.id });
                if (index > -1) {
                    this.allRosters[index] = item;
                }
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
           (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public clean(): void {
        this.allRosters = [];
        this.rosters = [];
        this.state = iqs.shell.States.Empty;
        this.selectedIndex = -1;
    }

}