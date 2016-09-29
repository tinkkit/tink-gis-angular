'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('layersManagement', function () {
        return {
            replace: true,
            // scope: {
            //     layer: '='
            // },
            templateUrl: 'templates/layermanagement/layersManagementTemplate.html',
            controller: 'layersManagementController',
            controllerAs: 'layersManagementctrl'
        };
    });
})();