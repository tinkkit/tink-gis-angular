'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkmap', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/maptemplate.html',
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: 'mapController'
        };
    });
})();