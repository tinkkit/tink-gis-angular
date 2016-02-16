'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();           