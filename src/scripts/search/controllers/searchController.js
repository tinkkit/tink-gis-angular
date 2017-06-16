'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController',
        function ($scope, ResultsData, map, $interval) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.EmptyResult = ResultsData.EmptyResult;
            vm.LoadingCompleted = true;
            vm.loadingPercentage = 100;
            vm.mobile = L.Browser.mobile;
            var percentageupdater = $interval(function () {
                vm.loadingPercentage = ResultsData.GetRequestPercentage();
                vm.LoadingCompleted = vm.loadingPercentage >= 100;
            }, 333);
        });
    theController.$inject = ['$scope', 'ResultsData', 'map', '$interval'];
})();