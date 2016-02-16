'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkGrouplayer', function () {
        return {
            replace: true,
            scope: {
                grouplayer: '='
            },
            templateUrl: 'templates/groupLayerTemplate.html',
            controller: 'groupLayerController',
            controllerAs: 'grplyrctrl'
        };
    });
})();