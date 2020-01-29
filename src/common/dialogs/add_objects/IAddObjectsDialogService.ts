export interface IAddObjectsDialogService {
    show(params,successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}