'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController',
        function($scope, ResultsData) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            vm.selectedResult = null;
            vm.layerGroupFilter = "geenfilter";
            $scope.$watchCollection(function() { return ResultsData.JsonFeatures }, function(newValue, oldValue) {
                vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
                vm.layerGroupFilter = "geenfilter";
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
            vm.deleteFeatureGroup = function(featureGroupName) {
                ResultsData.JsonFeatures.forEach(function(feature) {
                    if (feature.layerName === featureGroupName) {
                        vm.deleteFeature(feature);
                    }
                });
            };

            vm.showDetails = function(feature) {
                ResultsData.SelectedFeature = feature;
            }
            vm.exportToCSV = function() {
                var csvContent = "data:text/csv;charset=utf-8,";
                var dataString = "";
                var layName = "";

                ResultsData.JsonFeatures.forEach(function(feature, index) {
                    if (layName !== feature.layerName) {
                        layName = feature.layerName;
                        var tmparr = [];
                        for (var name in feature.properties) {
                            tmparr.push(name);
                        }
                        var layfirstline = tmparr.join(",");

                        csvContent += layName + "\n" + layfirstline + "\n";
                    }
                    var infoArray = _.values(feature.properties)
                    dataString = infoArray.join(",");
                    console.log(dataString);
                    // csvContent += dataString + "\n";
                    csvContent += index < ResultsData.JsonFeatures.length ? dataString + "\n" : dataString;

                });
                var encodedUri = encodeURI(csvContent);
                window.open(encodedUri);
            };


        });
    theController.$inject = ['$scope', 'ResultsData'];
})();