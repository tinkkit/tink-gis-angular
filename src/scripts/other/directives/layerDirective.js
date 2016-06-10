'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkLayer', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/other/layerTemplate.html',
            controller: 'layerController',
            controllerAs: 'lyrctrl'
        };
    });
})();