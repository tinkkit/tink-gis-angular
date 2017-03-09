'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController',
        function ($scope, ResultsData, map, SearchService, MapData, FeatureService
        ) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            vm.selectedResult = null;
            vm.layerGroupFilter = 'geenfilter';
            vm.collapsestatepergroup = {};
            $scope.$watchCollection(function () { return ResultsData.JsonFeatures; }, function (newValue, oldValue) {
                vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
                vm.featureLayers.forEach(lay => {
                    if (vm.collapsestatepergroup[lay] === undefined || vm.collapsestatepergroup[lay] === null) {
                        vm.collapsestatepergroup[lay] = false; // at start, we want the accordions open, so we set collapse on false
                    }
                });

                vm.layerGroupFilter = 'geenfilter';
            });
            $scope.$watch(function () { return ResultsData.SelectedFeature; }, function (newVal, oldVal) {
                vm.selectedResult = newVal;
            });
            vm.deleteFeature = function (feature) {
                SearchService.DeleteFeature(feature);
            };
            vm.aantalFeaturesMetType = function (type) {
                return vm.features.filter(x => x.layerName == type).length;
            };
            vm.isOpenGroup = function (type) {
                return vm.features.filter(x => x.layerName == type);
            };
            vm.deleteFeatureGroup = function (featureGroupName) {
                vm.collapsestatepergroup[featureGroupName] = undefined; // at start, we want the accordions open, so we set collapse on false
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
            vm.exportToCSVButtonIsEnabled = FeatureService.exportToCSVButtonIsEnabled;
            $scope.$watch(function () { return FeatureService.exportToCSVButtonIsEnabled; }, function (newValue, oldValue) {
                vm.exportToCSVButtonIsEnabled = newValue
            });
            $scope.$watch(function () { return FeatureService.extraResultButtonIsEnabled; }, function (newValue, oldValue) {
                vm.extraResultButtonIsEnabled = FeatureService.extraResultButtonIsEnabled;
                vm.extraResultButton = FeatureService.extraResultButtonCallBack;
                vm.resultButtonText = FeatureService.resultButtonText;
            });

            $scope.$watch(function () { return FeatureService.extraResultButtonConditionCallBack(); }, function (newValue, oldValue) {
                // console.log(newValue, oldValue, "ZZZZZZZZZZZZZZZZZZZZZ");
                vm.extraResultButtonIsEnabled = newValue;
            });
            vm.extraResultButtonIsEnabled = FeatureService.extraResultButtonIsEnabled;
            vm.extraResultButton = FeatureService.extraResultButtonCallBack;
            vm.resultButtonText = FeatureService.resultButtonText;

        });
    theController.$inject = ['$scope', 'ResultsData', 'map', 'MapData', 'FeatureService'];
})();