'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('previewQueryLayer', function() {
        return {
            replace: true,
            scope:  {
                querylayer: '=',
                query: '='
            },
            templateUrl: 'templates/layermanagement/previewQueryLayerTemplate.html',
            controller: 'previewQueryLayerController',
            controllerAs: 'previewQueryCtrl'
        };
    });
})();