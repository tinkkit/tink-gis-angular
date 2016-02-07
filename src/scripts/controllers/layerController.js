


'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope, $http, GisDataService) {
        console.log('layerController CTOR');
        // $scope.changeVisibility = function (url) {
        //     GisDataService.changeVisibility(url);
        // };
        
    })
    theController.$inject = ['GisDataService'];
})();