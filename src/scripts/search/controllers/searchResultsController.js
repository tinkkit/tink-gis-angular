'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchResultsController',
        function($scope, ResultsData) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            $scope.$watchCollection(function() { return ResultsData.JsonFeatures }, function(newValue, oldValue) {
                console.log("CHANGES");
                vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
                console.log(vm.features);
            });

            vm.selectedResult = null;
            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                vm.selectedResult = newVal;
            });
            vm.showDetails = function(feature) {
                ResultsData.SelectedFeature = feature;
            }
        });
    theController.$inject = ['$scope', 'ResultsData'];
})();