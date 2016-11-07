'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController',
        function ($scope, ResultsData, map, SearchService, MapData) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            vm.selectedResult = null;
            vm.layerGroupFilter = 'geenfilter';
            $scope.$watchCollection(function () { return ResultsData.JsonFeatures; }, function (newValue, oldValue) {
                vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
                vm.layerGroupFilter = 'geenfilter';
            });
            // vm.loadingPercentage = ResultsData.GetRequestPercentage();
            $scope.$watch(function () { return ResultsData.SelectedFeature; }, function (newVal, oldVal) {
                vm.selectedResult = newVal;
            });
            vm.deleteFeature = function (feature) {
                SearchService.DeleteFeature(feature);
            };
            vm.aantalFeaturesMetType = function (type) {
                return vm.features.filter(x => x.layerName == type).length;
            };
            // vm.HoveredFeature = null;
            // vm.HoverOver = function (feature) {
            //     if (vm.HoveredFeature) {
            //         vm.HoveredFeature.hoverEdit = false;
            //     }
            //     feature.hoverEdit = true;
            //     vm.HoveredFeature = feature;
            // };
            vm.deleteFeatureGroup = function (featureGroupName) {
                SearchService.DeleteFeatureGroup(featureGroupName);
            };
            vm.showDetails = function (feature) {
                if (feature.theme.Type === 'esri') {
                    if (feature.geometry.type == 'Point') {
                        MapData.PanToPoint({ x: feature.geometry.coordinates[1], y: feature.geometry.coordinates[0] });
                    }
                    else {
                        MapData.PanToFeature(feature.mapItem);

                    }
                }
                ResultsData.SelectedFeature = feature;
            };
            vm.exportToCSV = function () {
                SearchService.ExportToCSV();
            };


        });
    theController.$inject = ['$scope', 'ResultsData', 'map', 'MapData'];
})();