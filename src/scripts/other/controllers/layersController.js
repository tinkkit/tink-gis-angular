'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function ($scope, MapData, map, ThemeService, $modal) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.selectedLayers = [];

        vm.sortableOptions = {
            stop: function (e, ui) {
                MapData.SetZIndexes();
            }
        };
        $scope.$watch(function () { return MapData.Themes; }, function (newVal, oldVal) {
            MapData.SetZIndexes(newVal);
        });
        vm.updatethemevisibility = function (theme) {
            ThemeService.UpdateThemeVisibleLayers(theme); 
        };
        vm.Lagenbeheer = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/layermanagement/layerManagerTemplate.html',
                controller: 'LayerManagerController',
                resolve: {
                    backdrop: false,
                    keyboard: true
                }
            });
            addLayerInstance.result.then(function (selectedThemes) {
                ThemeService.AddAndUpdateThemes(selectedThemes);
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['MapData', 'map', 'ThemeService', '$modal'];
})();