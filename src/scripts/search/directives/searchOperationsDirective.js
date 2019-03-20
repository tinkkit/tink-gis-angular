'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('searchOperations', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchOperationsTemplate.html',
            controller: 'searchOperationsController',
            controllerAs: 'srchoprnctrl'
        };
    });
})();