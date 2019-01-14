'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController',
        function ($scope, ResultsData, map, SearchService, MapData, FeatureService, $modal, GeometryService) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            vm.selectedResult = null;
            vm.layerGroupFilter = 'geenfilter';
            vm.collapsestatepergroup = {};
            vm.drawLayer = null;
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
            $scope.$watch(function () { return MapData.DrawLayer; }, function (newdrawobject, oldVal) {
                if (newdrawobject) {
                    vm.drawLayer = newdrawobject;
                }
                else {
                    vm.drawLayer = null;
                }
            });
            vm.mobile = L.Browser.mobile;
            vm.zoom2Drawing = function () {
                MapData.PanToItem(vm.drawLayer);
            };
            vm.deleteDrawing = function () {
                MapData.CleanDrawings();
            };
            vm.bufferFromDrawing = function () {
                MapData.ExtendedType = null;
                MapData.CleanBuffer();
                var bufferInstance = $modal.open({
                    templateUrl: 'templates/search/bufferTemplate.html',
                    controller: 'BufferController',
                    resolve: {
                        backdrop: false,
                        keyboard: true
                    }
                });
                bufferInstance.result.then(function (returnobj) {
                    if (vm.drawLayer.toGeoJSON().features) {
                        vm.drawLayer.toGeoJSON().features.forEach(feature => {
                            GeometryService.Buffer(feature, returnobj.buffer, returnobj.layer);
                        });
                    }
                    else {
                        GeometryService.Buffer(vm.drawLayer.toGeoJSON(), returnobj.buffer, returnobj.layer);

                    }

                }, function (obj) {
                    console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
                });
            };
            vm.extendedType = null;
            $scope.$watch(function () { return MapData.ExtendedType; }, function (newValue, oldValue) {
                vm.extendedType = newValue;
            });
            vm.addSelection = function () {
                if (vm.extendedType != "add") {
                    MapData.ActiveInteractieKnop = ActiveInteractieButton.SELECT;
                    MapData.DrawingType = DrawingOption.NIETS;
                    MapData.ShowDrawControls = true;
                    MapData.ShowMetenControls = false;
                    vm.extendedType = "add";
                    MapData.ExtendedType = "add";
                }
                else {
                    vm.extendedType = null;
                    MapData.ExtendedType = null;
                }
            };
            vm.removeSelection = function () {
                if (vm.extendedType != "remove") {
                    MapData.ActiveInteractieKnop = ActiveInteractieButton.SELECT;
                    MapData.DrawingType = DrawingOption.NIETS;
                    MapData.ShowDrawControls = true;
                    MapData.ShowMetenControls = false;
                    vm.extendedType = "remove";
                    MapData.ExtendedType = "remove";
                }
                else {
                    vm.extendedType = null;
                    MapData.ExtendedType = null;
                }
            };
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
                var alreadyexists = MapData.VisibleFeatures.some(x => x.toGeoJSON().features[0].id == feature.id && x.toGeoJSON().features[0].layerName == feature.layerName);
                        if (!alreadyexists) {
                            var mapItem = L.geoJson(feature, { style: Style.DEFAULT }).addTo(map);
                            MapData.TempExtendFeatures.push(mapItem);
                            feature.mapItem = mapItem;
                        }
                ResultsData.SelectedFeature = feature;
            };
            vm.exportToCSV = function () {
                SearchService.ExportToCSV();
            };
            vm.exportToCSVButtonIsEnabled = FeatureService.exportToCSVButtonIsEnabled;
            $scope.$watch(function () { return FeatureService.exportToCSVButtonIsEnabled; }, function (newValue, oldValue) {
                vm.exportToCSVButtonIsEnabled = newValue;
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
    theController.$inject = ['$scope', 'ResultsData', 'map', 'SearchService', 'MapData', 'FeatureService', '$modal', 'GeometryService'];

})();