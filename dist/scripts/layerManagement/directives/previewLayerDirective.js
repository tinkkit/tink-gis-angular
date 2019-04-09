'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('previewLayer', function () {
        return {
            replace: true,
            scope: {
                theme: '=',
                addorupdatefunc: '&'
            },
            templateUrl: 'templates/layermanagement/previewLayerTemplate.html',
            controller: 'previewLayerController',
            controllerAs: 'previewctrl'
        };
    });
})();
