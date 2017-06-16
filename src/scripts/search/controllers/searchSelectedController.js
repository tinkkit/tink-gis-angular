'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController',
        function ($scope, ResultsData, MapData, SearchService, GeometryService, $modal, FeatureService, map) {
            var vm = this;
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            vm.props = [];
            vm.mobile = L.Browser.mobile;

            $scope.$watch(function () { return ResultsData.SelectedFeature; }, function (newVal, oldVal) {
                if (oldVal && oldVal != newVal && oldVal.mapItem) { // there must be an oldval and it must not be the newval and it must have an mapitem (to dehighlight)
                    if (oldVal.mapItem.isBufferedItem) {
                        MapData.SetStyle(oldVal.mapItem, Style.COREBUFFER, L.AwesomeMarkers.icon({ icon: 'fa-circle-o', markerColor: 'lightgreen' }));
                    }
                    else {
                        var myicon = L.icon({
                            iconUrl: 'bower_components/leaflet/dist/images/marker-icon.png',
                            iconRetinaUrl: 'bower_components/leaflet/dist/images/marker-icon-2x.png',
                            shadowUrl: 'bower_components/leaflet/dist/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            tooltipAnchor: [16, -28],
                            shadowSize: [41, 41]
                        });
                        MapData.SetStyle(oldVal.mapItem, Style.DEFAULT, myicon);
                    }

                }
                if (newVal) {
                    if (newVal.mapItem) {
                        var myicon = L.AwesomeMarkers.icon({
                            icon: 'fa-dot-circle-o',
                            markerColor: 'red'
                        });
                        MapData.SetStyle(newVal.mapItem, Style.HIGHLIGHT, myicon);
                    }
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
            vm.toonFeatureOpKaart = function () {
                if (vm.selectedResult.theme.Type === 'esri') {
                    MapData.PanToFeature(vm.selectedResult.mapItem);
                }
                else { // wms we go to the last identifybounds
                    MapData.GoToLastClickBounds();
                }
            };
            vm.volgende = function () {
                console.log(ResultsData.SelectedFeature);
                ResultsData.SelectedFeature = vm.nextResult;
            };
            vm.vorige = function () {
                ResultsData.SelectedFeature = vm.prevResult;

            };
            vm.buffer = 1;
            vm.doordruk = function () {
                MapData.ExtendedType = null;
                console.log(ResultsData.SelectedFeature);
                ResultsData.SelectedFeature.mapItem.toGeoJSON().features.forEach(feature => {
                    GeometryService.Doordruk(feature);
                });
            };
            vm.buffer = function () {
                MapData.ExtendedType = null;
                MapData.CleanDrawings();
                MapData.CleanBuffer();
                MapData.SetDrawLayer(ResultsData.SelectedFeature.mapItem);
                var bufferInstance = $modal.open({
                    templateUrl: 'templates/search/bufferTemplate.html',
                    controller: 'BufferController',
                    resolve: {
                        backdrop: false,
                        keyboard: true
                    }
                });
                bufferInstance.result.then(function (returnobj) {
                    ResultsData.SelectedFeature.mapItem.toGeoJSON().features.forEach(feature => {
                        GeometryService.Buffer(feature, returnobj.buffer, returnobj.layer);
                    });
                }, function (obj) {
                    console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
                });

            };
            vm.exportToCSV = function () {
                SearchService.ExportOneToCSV(vm.selectedResult);
            }
            vm.delete = function () {
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
            vm.close = function (feature) {
                vm.selectedResult = null;
                vm.prevResult = null;
                vm.nextResult = null;
                ResultsData.SelectedFeature = null;
            };
            vm.exportToCSVButtonIsEnabled = FeatureService.exportToCSVButtonIsEnabled;
            $scope.$watch(function () { return FeatureService.exportToCSVButtonIsEnabled; }, function (newValue, oldValue) {
                vm.exportToCSVButtonIsEnabled = newValue
            });

        });
    theController.$inject = ['$scope', 'ResultsData', 'GeometryService', '$modal', 'FeatureService', 'map'];
})();