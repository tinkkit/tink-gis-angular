'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController',
        function ($scope, ResultsData, map) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.EmptyResult = ResultsData.EmptyResult;
            vm.Loading = 0;
            vm.MaxLoading = 0;
            vm.LoadedCount = function () {
                if (ResultsData.Loading > vm.MaxLoading) {
                    vm.MaxLoading = ResultsData.Loading;
                }
                if (ResultsData.Loading == 0);
                {
                    vm.MaxLoading = 0;
                }
                vm.Loading = ResultsData.Loading;
                if (ResultsData.Loading == 0 && !$scope.$$phase) {
                    $scope.$apply();
                }
                return ResultsData.Loading;
            }
            // $scope.$watch(function () { return ResultsData.Loading; }, function (newVal, oldVal) {
            //     vm.Loading = newVal;
            //     if (oldVal == 0) {
            //         vm.MaxLoading = newVal;
            //     }
            //     if (newVal < oldVal) {
            //         if (vm.MaxLoading < oldVal) {
            //             vm.MaxLoading = oldVal;
            //         }
            //     }
            //     if (newVal == 0) {
            //         vm.MaxLoading = 0;
            //     }
            //     console.log("Loading val: " + newVal + "/" + vm.MaxLoading);
            // });
        });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();