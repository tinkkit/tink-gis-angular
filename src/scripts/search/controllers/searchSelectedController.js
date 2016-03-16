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
                    vm.prevResult = null;
                    vm.nextResult = null;
                    var index = ResultsData.JsonFeatures.indexOf(newVal);
                    var layerName = newVal.layerName;
                    if (index > 0) { // check or prevResult exists
                        var prevItem = ResultsData.JsonFeatures[index - 1];
                        if (prevItem.layerName === layerName) {
                            vm.prevResult = prevItem;
                        }
                    }
                    if (index < ResultsData.JsonFeatures.length - 1) { // check for nextResult exists
                        var nextItem = ResultsData.JsonFeatures[index + 1];
                        if (nextItem.layerName === layerName) {
                            vm.nextResult = nextItem;
                        }
                    }
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
                SearchService.DeleteFeature(vm.selectedResult);
                if (vm.nextResult) {
                    ResultsData.SelectedFeature = vm.nextResult;
                }
                else if (vm.nextResult) {
                    ResultsData.SelectedFeature = vm.prevResult;
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