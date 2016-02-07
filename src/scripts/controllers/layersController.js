'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService) {
        console.log("layersController CTOR");
 
    })
    theController.$inject = ['GisDataService'];
})();