'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('themeUrl', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/themeUrlTemplate.html',
            controller: 'themeUrlController',
            controllerAs: 'themeUrlctrl'
        };
    });
})();