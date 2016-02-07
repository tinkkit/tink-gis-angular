(function (module) {
    'use strict';
    module = angular.module('tink.gis.angular');
    module.directive('layer', function () {
        return {
            restrict: 'E',
            scope: {
                layerData: '='
            },
            templateUrl: 'templates/layer.html',
            controller: 'layerController',
        }
    });
})();