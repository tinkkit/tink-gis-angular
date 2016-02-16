'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($http, map, MapService) {
        var vm = this;
        vm.themes = MapService.Themes;
        vm.selectedLayers = [];
    });
    theController.$inject = ['$http', 'map', 'MapService'];
})();