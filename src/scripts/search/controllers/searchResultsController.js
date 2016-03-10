'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController',
        function($scope, ResultsData) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            vm.selectedResult = null;
            $scope.$watchCollection(function() { return ResultsData.JsonFeatures }, function(newValue, oldValue) {
                console.log("CHANGES");
                vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
                console.log(vm.features);
            });

            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                vm.selectedResult = newVal;
            });
            vm.deleteFeature = function(feature) {
                var featureIndex = ResultsData.JsonFeatures.indexOf(feature);
                if (featureIndex > -1) {
                    ResultsData.JsonFeatures.splice(featureIndex, 1);
                }
            };
            vm.showDetails = function(feature) {
                ResultsData.SelectedFeature = feature;
            }
            vm.test = function(test) {
                console.log("jaaaa");
            };

            // vm.fullyVis = function(feat) {
            //     console.log("JA");
            //     console.log(feat);
            // };
            // vm.hoverIn = function() {
            //     console.log("JA");
            //     vm.hoverEdit = true;
            // };

            // vm.hoverOut = function() {
            //     console.log("JA");
            //     vm.hoverEdit = false;
            // };
        });
    theController.$inject = ['$scope', 'ResultsData'];
})();