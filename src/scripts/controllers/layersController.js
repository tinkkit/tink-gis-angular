'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($http, map, MapService, $modal) {
        var vm = this;
        vm.themes = MapService.Themes;
        vm.selectedLayers = [];
        vm.AddLayers = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/addLayerTemplate.html',
                controller: 'addLayerController',
                resolve: {
                    backdrop: false,
                    keyboard: true,
                    items: function () {
                        return ['test Array'];
                    }
                }
            });

            addLayerInstance.result.then(function (obj) {
                console.log(obj); // The controller is closed because of the developer
                MapService.LoadAllLayers()
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };

    });
    theController.$inject = ['$http', 'map', 'MapService', '$modal'];
})();