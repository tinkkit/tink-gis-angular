'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function($scope, MapData, map, ThemeService, $modal) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.selectedLayers = [];

        vm.sortableOptions = {
            // update: function(e, ui) {
            //     console.log("UPDATEZINDEXES");
            //     MapData.SetZIndexes();
            // },
            stop: function(e, ui) {
                // console.log("stop");
                MapData.SetZIndexes();
            }
        };
        $scope.$watch(function() { return MapData.Themes; }, function(newVal, oldVal) {
            console.log("WATCH OP MAPDATATHEMES IN LAYERSCONTROLLER");
            MapData.SetZIndexes(newVal);
        });
        vm.AddLayers = function() {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/modals/addLayerModalTemplate.html',
                controller: 'addLayerController',
                resolve: {
                    backdrop: false,
                    keyboard: true,
                    urls: function() {
                        return MapData.ThemeUrls;
                    }
                }
            });
            addLayerInstance.result.then(function(selectedThemes) {
                ThemeService.AddAndUpdateThemes(selectedThemes);
            }, function(obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['MapData', 'map', 'ThemeService', '$modal'];
})();