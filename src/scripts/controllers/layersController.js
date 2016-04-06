'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function(MapData, map, ThemeService, $modal) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.selectedLayers = [];
        vm.sortableOptions = {
            update: function(e, ui) {
                vm.SetZIndexes(vm.themes);
            }
        };
        vm.SetZIndexes = function(themes) {
            var counter = 1;
            themes.forEach(theme => {
                if (theme.Type == ThemeType.WMS) {
                    theme.MapData.setZIndex(counter);
                }
                else {
                    var lays = theme.MapData.getLayers();
                    lays.forEach(lay => {
                        console.log(lay);
                        lay.setZIndex(counter);
                    });
                }
                counter++;
                console.log(theme.MapData);
            })
        };
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