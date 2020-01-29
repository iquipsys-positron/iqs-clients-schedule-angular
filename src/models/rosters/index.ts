import './RostersViewModel';

let m: any;

try {
    m = angular.module('iqsRosters');
    m.requires.push(...[
        'iqsRosters.ViewModel'
    ]);
} catch (err) { }

export * from './IRostersViewModel';
export * from './RostersModel';
export * from './RostersViewModel';