'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, $http, map, MapService) {
        $scope.themes = MapService.Themes;
        $scope.selectedLayers = [];
    });
    theController.$inject = ['$http', 'map', 'MapService'];
})();