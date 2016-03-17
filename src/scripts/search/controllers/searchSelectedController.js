'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController',
        function($scope, ResultsData, MapData, SearchService) {
            var vm = this;
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            vm.props = [];
            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                if (newVal) {
                    vm.selectedResult = newVal;
                    var item = Object.getOwnPropertyNames(newVal.properties).map(k => ({ key: k, value: newVal.properties[k] }));
                    vm.props = item;
                    vm.prevResult = SearchService.GetPrevResult();
                    vm.nextResult = SearchService.GetNextResult();
                }
                else {
                    vm.selectedResult = null;
                    vm.prevResult = null;
                    vm.nextResult = null;
                }
            });
            vm.toonFeatureOpKaart = function() {
                console.log(vm.selectedResult);
                MapData.PanToFeature(vm.selectedResult);

            };
            vm.volgende = function() {
                ResultsData.SelectedFeature = vm.nextResult;
            };
            vm.vorige = function() {
                ResultsData.SelectedFeature = vm.prevResult;

            };
            vm.delete = function() {
                var prev = SearchService.GetPrevResult();
                var next = SearchService.GetNextResult();
                SearchService.DeleteFeature(vm.selectedResult);
                if (next) {
                    ResultsData.SelectedFeature = next;
                }
                else if (prev) {
                    ResultsData.SelectedFeature = prev;
                }
                else {
                    ResultsData.SelectedFeature = null;
                }
            };
            vm.close = function(feature) {
                vm.selectedResult = null;
                vm.prevResult = null;
                vm.nextResult = null;
                ResultsData.SelectedFeature = null;
            };

        });
    theController.$inject = ['$scope', 'ResultsData',];
})();