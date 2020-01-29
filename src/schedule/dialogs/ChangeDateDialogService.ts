import { IChangeDataDialogService } from './IChangeDataDialogService';

class ChangeDataDialogService implements IChangeDataDialogService {
    public _mdDialog: angular.material.IDialogService;

    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            templateUrl: 'schedule/dialogs/ChangeDataDialog.html',
            controller: 'iqsChangeDataDialogController',
            controllerAs: '$ctrl',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(
                (data?: any) => {
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                () => {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            );
    }

}

angular
    .module('iqsChangeDataDialog')
    .service('iqsChangeDataDialog', ChangeDataDialogService);