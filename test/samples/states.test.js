'use strict';

describe('iqtModels.States', function () {
    var iqtStatesViewModel;
    let objState = {
        alt: 200,
        angle: 225,
        assign_id: null,
        device: {
            type: "simulated",
            udi: "678665",
            label: "sim006",
            org_id: "9cfaf79bc95b4a9e912314eb3db7a4ba",
            active: true
        },
        device_id: "afbdd036a6d449bf9fef99d73792b890",
        direction: 5,
        group_ids: ["044d550bdc36426caf7f062c185c533e", "de56b3d20b50452cb5e440377819835f"],
        icon: { direction: 9, template: "", templateUrl: "images/MapIcons/Equipment small.svg", url: "data:image/svg+xml;charset=UTF-8;base64,PD94bWwgdm…gPC9nPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+", scaledSize: null },
        id: "1",
        freezed: 0,
        latitude: 64.69864774531688,
        long_pressed: null,
        longitude: 30.651792724850328,
        object: { name: "TK123", description: "Haul truck", type: "haul", org_id: "9cfaf79bc95b4a9e912314eb3db7a4ba", category: "equipment" },
        object_id: "a84e8721a8174e7e9b69e011dceb4ba6",
        online: 282232.4899999921,
        options: { zIndex: 100 },
        pos: { coordinates: [], type: "Point" },
        pressed: null,
        quality: 2,
        org_id: "9cfaf79bc95b4a9e912314eb3db7a4ba",
        speed: 31,
        status: "active",
        time: "2017-11-13T14:23:18.435Z"
    };

    beforeEach(module('iqtTrackerApp'));

    beforeEach(inject(function (_iqtStatesViewModel_) {
        iqtStatesViewModel = _iqtStatesViewModel_;
    }));

    it('init state', function () {
        assert.equal(iqtStatesViewModel.type, 'monitoring');

        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.currentStates.focused);
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedIndex);
        assert.isUndefined(iqtStatesViewModel.currentStates.objectStates);
        assert.isUndefined(iqtStatesViewModel.currentStates.allObjectStates);
        assert.isArray(iqtStatesViewModel.currentStates.currentRosters);
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 0);

        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.timelineStates.focused);
        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedIndex);
        assert.isUndefined(iqtStatesViewModel.timelineStates.objectStates);
        assert.isUndefined(iqtStatesViewModel.timelineStates.allObjectStates);
        assert.isArray(iqtStatesViewModel.timelineStates.currentRosters);
        assert.equal(iqtStatesViewModel.timelineStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.timelineStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.timelineStates.currentShiftsObjectIds.length, 0);

    })

    it('clean function for current States obj', function () {
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.currentStates.focused);
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedIndex);
        assert.isUndefined(iqtStatesViewModel.currentStates.objectStates);
        assert.isUndefined(iqtStatesViewModel.currentStates.allObjectStates);
        assert.isArray(iqtStatesViewModel.currentStates.currentRosters);
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 0);

        iqtStatesViewModel.currentStates.currentRosters.push('new roster');
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 1);

        iqtStatesViewModel.currentStates.currentRostersObjectIds.push('new roster id');
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 1);

        iqtStatesViewModel.currentStates.currentShiftsObjectIds.push('new shift id');
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 1);

        iqtStatesViewModel.clean();
        assert.isFalse(iqtStatesViewModel.currentStates.selectedElements);
        assert.isNull(iqtStatesViewModel.currentStates.focused);
        assert.equal(iqtStatesViewModel.currentStates.selectedIndex, 0);
        assert.isArray(iqtStatesViewModel.currentStates.objectStates);
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 0);

        assert.isArray(iqtStatesViewModel.currentStates.currentRosters);
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 0);

    });

    it('cleanUpAllStates function for current State and timelineState', function () {
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.currentStates.focused);
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedIndex);
        assert.isUndefined(iqtStatesViewModel.currentStates.objectStates);
        assert.isUndefined(iqtStatesViewModel.currentStates.allObjectStates);
        assert.isArray(iqtStatesViewModel.currentStates.currentRosters);
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 0);

        iqtStatesViewModel.currentStates.currentRosters.push('new roster');
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 1);

        iqtStatesViewModel.currentStates.currentRostersObjectIds.push('new roster id');
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 1);

        iqtStatesViewModel.currentStates.currentShiftsObjectIds.push('new shift id');
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 1);

        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.timelineStates.focused);
        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedIndex);
        assert.isUndefined(iqtStatesViewModel.timelineStates.objectStates);
        assert.isUndefined(iqtStatesViewModel.timelineStates.allObjectStates);
        assert.isArray(iqtStatesViewModel.timelineStates.currentRosters);
        assert.equal(iqtStatesViewModel.timelineStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.timelineStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.timelineStates.currentShiftsObjectIds.length, 0);

        iqtStatesViewModel.timelineStates.currentRosters.push('new roster');
        assert.equal(iqtStatesViewModel.timelineStates.currentRosters.length, 1);

        iqtStatesViewModel.timelineStates.currentRostersObjectIds.push('new roster id');
        assert.equal(iqtStatesViewModel.timelineStates.currentRostersObjectIds.length, 1);

        iqtStatesViewModel.timelineStates.currentShiftsObjectIds.push('new shift id');
        assert.equal(iqtStatesViewModel.timelineStates.currentShiftsObjectIds.length, 1);

        iqtStatesViewModel.cleanUpAllStates();

        assert.isFalse(iqtStatesViewModel.currentStates.selectedElements);
        assert.isNull(iqtStatesViewModel.currentStates.focused);
        assert.equal(iqtStatesViewModel.currentStates.selectedIndex, 0);
        assert.isArray(iqtStatesViewModel.currentStates.objectStates);
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 0);

        assert.isArray(iqtStatesViewModel.currentStates.currentRosters);
        assert.equal(iqtStatesViewModel.currentStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.currentStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.currentStates.currentShiftsObjectIds.length, 0);

        assert.isFalse(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isNull(iqtStatesViewModel.timelineStates.focused);
        assert.equal(iqtStatesViewModel.timelineStates.selectedIndex, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.objectStates);
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 0);

        assert.isArray(iqtStatesViewModel.timelineStates.currentRosters);
        assert.equal(iqtStatesViewModel.timelineStates.currentRosters.length, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.currentRostersObjectIds);
        assert.equal(iqtStatesViewModel.timelineStates.currentRostersObjectIds.length, 0);
        assert.isArray(iqtStatesViewModel.timelineStates.currentShiftsObjectIds);
        assert.equal(iqtStatesViewModel.timelineStates.currentShiftsObjectIds.length, 0);
    });

    it('filterStates for monitoring', function () {
        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);

        iqtStatesViewModel.filterStates('all');
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 1);

        iqtStatesViewModel.filterStates();
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 1);

        iqtStatesViewModel.filterStates('empty');
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 0);

        iqtStatesViewModel.filterStates('data');
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 1);
    });

    it('filterStates for retrospective type', function () {
        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);

        iqtStatesViewModel.filterStates('all');
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 1);

        iqtStatesViewModel.filterStates();
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 1);

        iqtStatesViewModel.filterStates('empty');
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 0);

        iqtStatesViewModel.filterStates('data');
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 1);
    });

    it('filterStatesObjectsSearch for monitoring type', function () {
        let searchObj = [{
            id: objState.object_id
        }]
        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);

        iqtStatesViewModel.filterStatesObjectsSearch(searchObj);
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.state, 'data');
        assert.isArray(iqtStatesViewModel.currentStates.filterObjects);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects[0].id, objState.object_id);

        iqtStatesViewModel.filterStatesObjectsSearch();
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 0);
        assert.equal(iqtStatesViewModel.currentStates.state, 'empty');
        assert.isUndefined(iqtStatesViewModel.currentStates.filterObjects);

        searchObj = [{ id: "123" }];
        iqtStatesViewModel.filterStatesObjectsSearch(searchObj);
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 0);
        assert.equal(iqtStatesViewModel.currentStates.state, 'empty');
        assert.isArray(iqtStatesViewModel.currentStates.filterObjects);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects[0].id, "123");
    });

    it('filterStatesObjectsSearch for retro type', function () {
        let searchObj = [{
            id: objState.object_id
        }];

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);

        iqtStatesViewModel.filterStatesObjectsSearch(searchObj);
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.state, 'data');
        assert.isArray(iqtStatesViewModel.timelineStates.filterObjects);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects[0].id, objState.object_id);

        iqtStatesViewModel.filterStatesObjectsSearch();
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 0);
        assert.equal(iqtStatesViewModel.timelineStates.state, 'empty');
        assert.isUndefined(iqtStatesViewModel.timelineStates.filterObjects);

        searchObj = [{ id: "123" }];
        iqtStatesViewModel.filterStatesObjectsSearch(searchObj);
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 0);
        assert.equal(iqtStatesViewModel.timelineStates.state, 'empty');
        assert.isArray(iqtStatesViewModel.timelineStates.filterObjects);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects[0].id, "123");
    });

    it('cancelFiltered for monitoring type', function () {
        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.currentStates.objectStates = _.cloneDeep(iqtStatesViewModel.currentStates.allObjectStates);

        iqtStatesViewModel.cancelFiltered();
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 1);
        assert.isNull(iqtStatesViewModel.currentStates.filterObjects);
        assert.isNull(iqtStatesViewModel.currentStates.filterFunction);
    });

    it('cancelFiltered for retrospective type', function () {
        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.timelineStates.objectStates = _.cloneDeep(iqtStatesViewModel.timelineStates.allObjectStates);

        iqtStatesViewModel.cancelFiltered();
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 1);
        assert.isNull(iqtStatesViewModel.timelineStates.filterObjects);
        assert.isNull(iqtStatesViewModel.timelineStates.filterFunction);
    });

    it('highlightStatesByObjectsName for retrospective type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);

        iqtStatesViewModel.timelineStates.objectStates = iqtStatesViewModel.timelineStates.allObjectStates;
        iqtStatesViewModel.highlightStatesByObjectsName("123");
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.state, 'data');
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects, "123");

        iqtStatesViewModel.timelineStates.objectStates = iqtStatesViewModel.timelineStates.allObjectStates;
        iqtStatesViewModel.highlightStatesByObjectsName("35");
        assert.equal(iqtStatesViewModel.timelineStates.objectStates.length, 0);
        assert.equal(iqtStatesViewModel.timelineStates.state, 'empty');
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects, "35");
    });

    it('highlightStatesByObjectsName for monitoring type', function () {

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);

        iqtStatesViewModel.highlightStatesByObjectsName("123");
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.state, 'data');
        assert.equal(iqtStatesViewModel.currentStates.filterObjects, "123");
        iqtStatesViewModel.highlightStatesByObjectsName("35");
        assert.equal(iqtStatesViewModel.currentStates.objectStates.length, 0);
        assert.equal(iqtStatesViewModel.currentStates.state, 'empty');
        assert.equal(iqtStatesViewModel.currentStates.filterObjects, "35");
    });

    it('focusByDeviceId for monitoring type', function () {

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.currentStates.objectStates = iqtStatesViewModel.currentStates.allObjectStates;

        iqtStatesViewModel.focusByDeviceId(objState.device_id);
        assert.isTrue(iqtStatesViewModel.currentStates.updateCenter);
        assert.isUndefined(iqtStatesViewModel.currentStates.focused);

        iqtStatesViewModel.focusByDeviceId(objState.device_id, true, false, true);
        assert.isTrue(iqtStatesViewModel.currentStates.updateCenter);
        assert.equal(iqtStatesViewModel.currentStates.focused, objState.device_id);

        iqtStatesViewModel.focusByDeviceId(null, true, false, true);
        assert.isTrue(iqtStatesViewModel.currentStates.updateCenter);
        assert.equal(iqtStatesViewModel.currentStates.focused, objState.device_id);

        iqtStatesViewModel.focusByDeviceId("fake", true, false, true);
        assert.isTrue(iqtStatesViewModel.currentStates.updateCenter);
        assert.equal(iqtStatesViewModel.currentStates.focused, objState.device_id);

    });


    it('focusByDeviceId for retospective type', function () {
        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.timelineStates.objectStates = iqtStatesViewModel.timelineStates.allObjectStates;

        iqtStatesViewModel.focusByDeviceId(objState.device_id);
        assert.isTrue(iqtStatesViewModel.timelineStates.updateCenter);
        assert.isUndefined(iqtStatesViewModel.timelineStates.focused);

        iqtStatesViewModel.focusByDeviceId(objState.device_id, true, false, true);
        assert.isTrue(iqtStatesViewModel.timelineStates.updateCenter);
        assert.equal(iqtStatesViewModel.timelineStates.focused, objState.device_id);

        iqtStatesViewModel.focusByDeviceId(null, true, false, true);
        assert.isTrue(iqtStatesViewModel.timelineStates.updateCenter);
        assert.equal(iqtStatesViewModel.timelineStates.focused, objState.device_id);

        iqtStatesViewModel.focusByDeviceId("fake", true, false, true);
        assert.isTrue(iqtStatesViewModel.timelineStates.updateCenter);
        assert.equal(iqtStatesViewModel.timelineStates.focused, objState.device_id);

    });


    it('unfocusAll for retospective type', function () {
        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();

        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.timelineStates.allObjectStates[0].selected = true;
        iqtStatesViewModel.unfocusAll();
        assert.isNull(iqtStatesViewModel.timelineStates.focused);
        assert.equal(iqtStatesViewModel.timelineStates.allObjectStates[0].selected, false);
        assert.equal(iqtStatesViewModel.timelineStates.allObjectStates[0].focused, false);

        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.timelineStates.allObjectStates[0].selected = true;
        iqtStatesViewModel.unfocusAll(false);
        assert.isNull(iqtStatesViewModel.timelineStates.focused);
        assert.equal(iqtStatesViewModel.timelineStates.allObjectStates[0].selected, false);
        assert.equal(iqtStatesViewModel.timelineStates.allObjectStates[0].focused, false);

        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.timelineStates.allObjectStates[0].selected = true;
        iqtStatesViewModel.unfocusAll(true);
        assert.isNull(iqtStatesViewModel.timelineStates.focused);
        assert.equal(iqtStatesViewModel.timelineStates.allObjectStates[0].selected, true);
        assert.equal(iqtStatesViewModel.timelineStates.allObjectStates[0].focused, false);

    });

    it('unfocusAll for monitoring type', function () {

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.currentStates.allObjectStates[0].selected = true;
        iqtStatesViewModel.unfocusAll();
        assert.isNull(iqtStatesViewModel.currentStates.focused);
        assert.equal(iqtStatesViewModel.currentStates.allObjectStates[0].selected, false);
        assert.equal(iqtStatesViewModel.currentStates.allObjectStates[0].focused, false);

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.currentStates.allObjectStates[0].selected = true;
        iqtStatesViewModel.unfocusAll(false);
        assert.isNull(iqtStatesViewModel.currentStates.focused);
        assert.equal(iqtStatesViewModel.currentStates.allObjectStates[0].selected, false);
        assert.equal(iqtStatesViewModel.currentStates.allObjectStates[0].focused, false);

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.currentStates.allObjectStates[0].selected = true;
        iqtStatesViewModel.unfocusAll(true);
        assert.isNull(iqtStatesViewModel.currentStates.focused);
        assert.equal(iqtStatesViewModel.currentStates.allObjectStates[0].selected, true);
        assert.equal(iqtStatesViewModel.currentStates.allObjectStates[0].focused, false);

    });

    it('unselectAll for monitoring type', function () {

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.unselectAll();
        assert.isFalse(iqtStatesViewModel.currentStates.selectedElements);
        assert.isFalse(iqtStatesViewModel.currentStates.allObjectStates[0].highlighted);

    });

    it('unselectAll for retrospective type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.unselectAll();
        assert.isFalse(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isFalse(iqtStatesViewModel.timelineStates.allObjectStates[0].highlighted);
    });

    it('getToTime for retrospective type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        assert.equal(iqtStatesViewModel.getToTime(), iqtStatesViewModel.timelineStates.toTime);
    });

    it('selectByObjectIds for retrospective type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.selectByObjectIds();
        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.timelineStates.filterObjects);

        iqtStatesViewModel.selectByObjectIds([objState.object_id]);
        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isArray(iqtStatesViewModel.timelineStates.filterObjects);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects[0], objState.object_id);

        iqtStatesViewModel.timelineStates.focused = false;
        iqtStatesViewModel.timelineStates.objectStates = iqtStatesViewModel.timelineStates.allObjectStates;
        assert.isArray(iqtStatesViewModel.timelineStates.filterObjects);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects[0], objState.object_id);

    });


    it('selectByObjectIds for monitoring type', function () {

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.selectByObjectIds();
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.currentStates.filterObjects);

        iqtStatesViewModel.selectByObjectIds([objState.object_id]);
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isArray(iqtStatesViewModel.currentStates.filterObjects);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects[0], objState.object_id);

        iqtStatesViewModel.currentStates.focused = false;
        iqtStatesViewModel.currentStates.objectStates = iqtStatesViewModel.currentStates.allObjectStates;
        assert.isArray(iqtStatesViewModel.currentStates.filterObjects);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects[0], objState.object_id);

    });

    it('selectByDeviceIds for monitoring type', function () {

        iqtStatesViewModel.currentStates.allObjectStates = [];
        iqtStatesViewModel.currentStates.allObjectStates.push(objState);
        iqtStatesViewModel.selectByDeviceIds();
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.currentStates.filterObjects);

        iqtStatesViewModel.selectByDeviceIds([objState.device_id]);
        assert.isUndefined(iqtStatesViewModel.currentStates.selectedElements);
        assert.isArray(iqtStatesViewModel.currentStates.filterObjects);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects[0], objState.device_id);

        iqtStatesViewModel.currentStates.focused = false;
        iqtStatesViewModel.currentStates.objectStates = iqtStatesViewModel.currentStates.allObjectStates;
        iqtStatesViewModel.selectByDeviceIds([objState.device_id]);
        assert.isArray(iqtStatesViewModel.currentStates.filterObjects);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.currentStates.filterObjects[0], objState.device_id);

    });

    it('selectByDeviceIds for retrospective type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.toTime = new Date();
        iqtStatesViewModel.timelineStates.allObjectStates = [];
        iqtStatesViewModel.timelineStates.allObjectStates.push(objState);
        iqtStatesViewModel.selectByDeviceIds();
        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isUndefined(iqtStatesViewModel.timelineStates.filterObjects);

        iqtStatesViewModel.selectByDeviceIds([objState.device_id]);
        assert.isUndefined(iqtStatesViewModel.timelineStates.selectedElements);
        assert.isArray(iqtStatesViewModel.timelineStates.filterObjects);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects[0], objState.device_id);

        iqtStatesViewModel.timelineStates.focused = false;
        iqtStatesViewModel.timelineStates.objectStates = iqtStatesViewModel.timelineStates.allObjectStates;
        assert.isArray(iqtStatesViewModel.timelineStates.filterObjects);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects.length, 1);
        assert.equal(iqtStatesViewModel.timelineStates.filterObjects[0], objState.device_id);

    });


    it('getActiveByCategory for retrospective type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.timelineStates.personsActiveCount = 1;
        iqtStatesViewModel.timelineStates.devicesActiveCount = 2;
        iqtStatesViewModel.timelineStates.assetsActiveCount = 3;

        assert.equal(iqtStatesViewModel.getActiveByCategory('person'), 1);
        assert.equal(iqtStatesViewModel.getActiveByCategory('equipment'), 2);
        assert.equal(iqtStatesViewModel.getActiveByCategory('assets'), 3);
        assert.isUndefined(iqtStatesViewModel.getActiveByCategory());

    });

    it('getActiveByCategory for monitoring type', function () {

        iqtStatesViewModel.type = 'retro';
        iqtStatesViewModel.currentStates.personsActiveCount = 1;
        iqtStatesViewModel.currentStates.devicesActiveCount = 2;
        iqtStatesViewModel.currentStates.assetsActiveCount = 3;

        assert.equal(iqtStatesViewModel.getActiveByCategory('person'), 1);
        assert.equal(iqtStatesViewModel.getActiveByCategory('equipment'), 2);
        assert.equal(iqtStatesViewModel.getActiveByCategory('assets'), 3);
        assert.isUndefined(iqtStatesViewModel.getActiveByCategory());

    });


});
