'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('geoPunt', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/geoPuntTemplate.html',
            controller: 'geoPuntController',
            controllerAs: 'geoPuntctrl'
        };
    });
})();
