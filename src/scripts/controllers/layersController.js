'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService, $http, map, MapService) {
        $scope.themes = MapService.Themes;
        $scope.selectedLayers = [];
    });
    theController.$inject = ['GisDataService', '$http', 'map', 'MapService'];
})();