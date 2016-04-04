'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController',
        function($scope, ResultsData, map) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.EmptyResult = ResultsData.EmptyResult;
            vm.Loading = ResultsData.Loading;
        });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();