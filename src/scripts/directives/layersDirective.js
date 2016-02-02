'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, $http, GisDataService, leafletData) {
        console.log("layersController CTOR");
        $scope.layers = GisDataService.layers;
        $scope.changeVisibility = function (url) {
            GisDataService.changeVisibility(url);
        };
    })
    theController.$inject = ['GisDataService'];
    module.directive('tinklayers', function () {
        console.log("layersDIRECTIVE CTOR");
        return {
            restrict: "E",
            templateUrl: 'templates/layerstemplate.html',
            controller: 'layersController'
        };
    });
})();