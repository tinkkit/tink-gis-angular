'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('solrGis', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/solrGISTemplate.html',
            controller: 'solrGISController',
            controllerAs: 'solrGISctrl'
        };
    });
})();