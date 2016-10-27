'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController',
        function ($scope, ResultsData, map) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.EmptyResult = ResultsData.EmptyResult;
            vm.LoadingCompleted = function () {
                return ResultsData.GetRequestPercentage() >= 100;
            }
            vm.loadingPercentage = function () {
                return ResultsData.GetRequestPercentage();
            }
        });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();