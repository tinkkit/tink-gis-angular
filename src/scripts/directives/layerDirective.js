'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayer', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layerTemplate.html',
            controller: 'layerController',
        }
    });
})();