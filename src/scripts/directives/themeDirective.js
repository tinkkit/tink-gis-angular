'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkTheme', function () {
        return {
            replace: true,
            scope: {
                theme: '='
            },
            templateUrl: 'templates/themeTemplate.html',
            controller: 'themeController'
        };
    });
})();