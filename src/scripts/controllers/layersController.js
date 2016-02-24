'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($http, map, MapService, $modal) {
        var vm = this;
        vm.themes = MapService.Themes;
        vm.selectedLayers = [];
        vm.AddLayers = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/modals/addLayerModalTemplate.html',
                controller: 'addLayerController',
                resolve: {
                    backdrop: false,
                    keyboard: true,
                    urls: function () {
                        return MapService.ThemeUrls;
                    }
                }
            });
            addLayerInstance.result.then(function (selectedThemes) {
                MapService.AddAndUpdateThemes(selectedThemes);
                console.log(selectedThemes);
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['$http', 'map', 'MapService', '$modal'];
})();