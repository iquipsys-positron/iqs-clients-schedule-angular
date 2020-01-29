import { IAddObjectsDialogService } from './IAddObjectsDialogService';

class AddObjectsDialogService implements IAddObjectsDialogService {
    public _mdDialog: angular.material.IDialogService;
    
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            templateUrl: 'common/dialogs/add_objects/AddObjectsDialog.html',
            controller: 'iqsAddObjectsDialogController',
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
    .module('iqsAddObjectsDialog')
    .service('iqsAddObjectsDialog', AddObjectsDialogService);