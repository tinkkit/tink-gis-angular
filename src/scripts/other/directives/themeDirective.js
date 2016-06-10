'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkTheme', function () {
        return {
            replace: true,
            scope: {
                theme: '='
            },
            templateUrl: 'templates/other/themeTemplate.html',
            controller: 'themeController',
            controllerAs: 'thmctrl'
        };
    });
})();