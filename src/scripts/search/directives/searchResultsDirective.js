'use strict';
(function(module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchResults', function() {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchResultsTemplate.html',
            controller: 'searchResultsController',
            controllerAs: 'srchrsltsctrl'
        };
    });
})();