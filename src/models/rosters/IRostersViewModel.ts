export interface IRostersViewModel {
    initRosters(filter?: string, successCallback?: (data: iqs.shell.Roster[]) => void, errorCallback?: (error: any) => void);
    filterRosters(filter: string);
    selectItem(index?: number);
    getRosterById(rosterId: string): iqs.shell.Roster;
    saveRoster(data: iqs.shell.Roster, callback: (item: iqs.shell.Roster) => void, error: (err: any) => void);
    updateRoster(data: iqs.shell.Roster, callback: (item: iqs.shell.Roster) => void, error: (err: any) => void);
    deleteRoster(id, callback: () => void, error: () => void);
    filterWithArrayObjects(objects: iqs.shell.SearchResult[]); 
    getCurrentRosters(time: Date, successCallback?: (data: iqs.shell.Roster[]) => void, errorCallback?: (error: any) => void);
    getTransaction(): pip.services.Transaction;
    clean(): void;
    state: string;
    selectedIndex: number;
    rosters: iqs.shell.Roster[];
    allRosters: iqs.shell.Roster[];
    startDate: string;
    endDate: string;
    isPopulated: boolean;
}