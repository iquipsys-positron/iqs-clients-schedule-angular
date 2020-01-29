function initPopulating(
    iqsShiftsViewModel: iqs.shell.IShiftsViewModel,
    pipIdentity: pip.services.IIdentityService,
    iqsLoading: iqs.shell.ILoadingService
) {
    iqsLoading.push('data', [
        iqsShiftsViewModel.clean.bind(iqsShiftsViewModel)
    ], async.parallel, [
            (callback) => {
                iqsShiftsViewModel.initShifts(
                    null,
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    }
                );
            }
        ]);
    if (pipIdentity.identity && pipIdentity.identity.id) {
        iqsLoading.start();
    }
}


let m: any;
const requires = [
    'iqsRosters.ViewModel',
    'iqsShifts.ViewModel'
];

try {
    m = angular.module('iqsLoading');
    m.requires.push(...requires);
    m.run(initPopulating);
} catch (err) { }