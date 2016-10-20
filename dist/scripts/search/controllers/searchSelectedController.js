'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController', function ($scope, ResultsData, MapData, SearchService, GeometryService, $modal) {
        var vm = this;
        vm.selectedResult = null;
        vm.prevResult = null;
        vm.nextResult = null;
        vm.props = [];
        $scope.$watch(function () {
            return ResultsData.SelectedFeature;
        }, function (newVal, oldVal) {
            if (oldVal && oldVal != newVal && oldVal.mapItem) {
                // there must be an oldval and it must not be the newval and it must have an mapitem (to dehighlight)
                var tmplayer = oldVal.mapItem._layers[Object.keys(oldVal.mapItem._layers)[0]];
                if (tmplayer._latlngs) {
                    // with s so it is an array, so not a point so we can set the style
                    tmplayer.setStyle(Style.DEFAULT);
                }
            }
            if (newVal) {
                if (newVal.mapItem) {
                    var tmplayer = newVal.mapItem._layers[Object.keys(newVal.mapItem._layers)[0]];
                    if (tmplayer._latlngs) {
                        // with s so it is an array, so not a point so we can set the style
                        tmplayer.setStyle(Style.HIGHLIGHT);
                    }
                }
                vm.selectedResult = newVal;
                var item = Object.getOwnPropertyNames(newVal.properties).map(function (k) {
                    return { key: k, value: newVal.properties[k] };
                });
                vm.props = item;
                vm.prevResult = SearchService.GetPrevResult();
                vm.nextResult = SearchService.GetNextResult();
            } else {
                vm.selectedResult = null;
                vm.prevResult = null;
                vm.nextResult = null;
            }
        });
        vm.toonFeatureOpKaart = function () {
            if (vm.selectedResult.theme.Type === 'esri') {
                MapData.PanToFeature(vm.selectedResult.mapItem);
            } else {
                // wms we go to the last identifybounds
                MapData.GoToLastClickBounds();
            }
        };
        vm.volgende = function () {
            ResultsData.SelectedFeature = vm.nextResult;
        };
        vm.vorige = function () {
            ResultsData.SelectedFeature = vm.prevResult;
        };
        vm.buffer = 1;
        vm.doordruk = function () {
            console.log(ResultsData.SelectedFeature);
            ResultsData.SelectedFeature.mapItem.toGeoJSON().features.forEach(function (feature) {
                GeometryService.Doordruk(feature);
            });
        };
        vm.buffer = function () {
            var bufferInstance = $modal.open({
                templateUrl: 'templates/search/bufferTemplate.html',
                controller: 'BufferController',
                resolve: {
                    backdrop: false,
                    keyboard: true
                    // urls: function() {
                    //     return MapData.ThemeUrls;
                    // }
                }
            });
            bufferInstance.result.then(function (returnobj) {
                ResultsData.SelectedFeature.mapItem.toGeoJSON().features.forEach(function (feature) {
                    GeometryService.Buffer(feature, returnobj.buffer, returnobj.layer);
                });
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
        vm.delete = function () {
            var prev = SearchService.GetPrevResult();
            var next = SearchService.GetNextResult();
            SearchService.DeleteFeature(vm.selectedResult);
            if (next) {
                ResultsData.SelectedFeature = next;
            } else if (prev) {
                ResultsData.SelectedFeature = prev;
            } else {
                ResultsData.SelectedFeature = null;
            }
        };
        vm.close = function (feature) {
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            ResultsData.SelectedFeature = null;
        };
    });
    theController.$inject = ['$scope', 'ResultsData', 'GeometryService', '$modal'];
})();
