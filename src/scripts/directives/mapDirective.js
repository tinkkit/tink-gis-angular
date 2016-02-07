'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkmap', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/maptemplate.html',
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: 'mapController'
        };
    });
})();