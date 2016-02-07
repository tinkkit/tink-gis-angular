'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService) {
        console.log("layersController CTOR");
        // $scope.layers = GisDataService.mapData.layers.overlays;
        // $scope.changeVisibility = function (url) {
        //     GisDataService.changeVisibility(url);
        // };
    })
    theController.$inject = ['GisDataService'];
})();