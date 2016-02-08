'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkGrouplayertheme', function () {
        return {
            replace: true,
            scope: {
                theme: '@'
            },
            templateUrl: 'templates/groupLayeremplate.html',
            controller: 'groupLayerController'
        };
    });
})();