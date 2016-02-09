'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService, $http, map, LayersService) {
        $scope.themes = [];
    
        $scope.selectedLayers = [];
      
        
    });
    theController.$inject = ['GisDataService', '$http', 'map', 'LayersService'];
})();