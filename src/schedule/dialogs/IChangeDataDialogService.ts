export interface IChangeDataDialogService {
    show(params,successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}