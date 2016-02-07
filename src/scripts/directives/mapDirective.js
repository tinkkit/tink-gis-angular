'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkMap', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: 'mapController'
        };
    });
})();