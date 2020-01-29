import { IAddEqupmentDialogService } from './IAddEqupmentDialogService';

class AddEqupmentDialogService implements IAddEqupmentDialogService {
    public _mdDialog: angular.material.IDialogService;
    
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            templateUrl: 'common/dialogs/add_equpment/AddEqupmentDialog.html',
            controller: 'iqsAddEqupmentDialogController',
            controllerAs: '$ctrl',
            locals: {params: params},
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
    .module('iqsAddEqupmentDialog')
    .service('iqsAddEqupmentDialog', AddEqupmentDialogService);