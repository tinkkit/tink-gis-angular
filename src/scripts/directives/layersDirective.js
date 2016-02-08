'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayers', function () {
        return {
            replace: true,
            templateUrl: 'templates/layersTemplate.html',
            controller: 'layersController'
        };
    });
})();