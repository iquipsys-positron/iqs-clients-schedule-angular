(function () {

    var config = {
        "session": {
            "serverUrl": "/",
            "authorizedState": "app",
            "unautorizedState": "landing"
        }
    };

    angular
        .module('iqsConfig', ['pipCommonRest', 'pipErrors', 'pipErrors.Unauthorized'])
        .constant('SHELL_RUNTIME_CONFIG', config);
})();
