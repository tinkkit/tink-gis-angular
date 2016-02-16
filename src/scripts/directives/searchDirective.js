'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkSearch', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/searchTemplate.html',
            controller: 'searchController',
            controllerAs: 'srchctrl'
        };
    });
})();