'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/other/mapTemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();