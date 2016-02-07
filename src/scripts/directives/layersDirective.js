'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinklayers', function () {
        console.log("layersDIRECTIVE CTOR");
        return {
            restrict: 'E',
            templateUrl: 'templates/layerstemplate.html',
            controller: 'layersController'
        };
    });
})();