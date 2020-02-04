'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('wmsUrl', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/wmsUrlTemplate.html',
            controller: 'wmsUrlController',
            controllerAs: 'wmsUrlctrl'
        };
    });
})();
