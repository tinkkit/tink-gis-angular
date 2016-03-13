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
            vm.test = function(test) {
                console.log("jaaaa");
            };
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