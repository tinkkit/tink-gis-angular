


'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layerController', function ($scope, $http, GisDataService) {
        console.log('layerController CTOR');
        $scope.changeVisibility = function (url) {
            GisDataService.changeVisibility(url);
        };
    })
    theController.$inject = ['GisDataService'];
})();