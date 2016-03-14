'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController',
        function($scope, ResultsData) {
            var vm = this;
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            vm.props = [];
            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                if (newVal) {
                    vm.selectedResult = newVal;
                    var item = Object.getOwnPropertyNames(newVal.properties).map(function(k) { return ({ key: k, value: newVal.properties[k] }) });
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
            });
            vm.toonFeatureOpKaart = function() {
                console.log(vm.selectedResult);
                // var bounds = L.latLngBounds(vm.selectedResult.mapItem);
                // map.fitBounds(bounds);//works!
                // map.setView(new L.LatLng(51.2192159, 4.4028818));

            };
            vm.volgende = function() {
                ResultsData.SelectedFeature = vm.nextResult;
            };
            vm.vorige = function() {
                ResultsData.SelectedFeature = vm.prevResult;

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