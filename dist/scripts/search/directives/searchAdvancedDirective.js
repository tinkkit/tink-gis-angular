'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchAdvanced', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchAdvancedTemplate.html',
            controller: 'searchAdvancedController',
            controllerAs: 'srchadvctrl'
        };
    });
})();
