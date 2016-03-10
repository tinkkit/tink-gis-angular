'use strict';
(function(module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchSelected', function() {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchSelectedTemplate.html',
            controller: 'searchSelectedController',
            controllerAs: 'srchslctdctrl'
        };
    });
})();