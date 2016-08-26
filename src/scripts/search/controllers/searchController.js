'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController',
        function ($scope, ResultsData, map) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.EmptyResult = ResultsData.EmptyResult;
            vm.Loading = ResultsData.Loading;
            vm.MaxLoading = 0;
            $scope.$watch(function () { return ResultsData.Loading; }, function (newVal, oldVal) {
                vm.Loading = newVal;
                if (oldVal == 0) {
                    vm.MaxLoading = newVal;
                }
                if (newVal < oldVal) {
                    if (vm.MaxLoading < oldVal) {
                        vm.MaxLoading = oldVal;
                    }
                }
                if (newVal == 0) {
                    vm.MaxLoading = 0;
                }
                console.log("Loading val: " + newVal + "/" + vm.MaxLoading);
            });
        });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();