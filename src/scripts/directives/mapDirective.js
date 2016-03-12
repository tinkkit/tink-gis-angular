'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/maptemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();