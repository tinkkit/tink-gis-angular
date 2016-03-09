'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function($scope, ResultsData, map) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
        });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();