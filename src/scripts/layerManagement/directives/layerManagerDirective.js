'use strict';
(function (module) {

    module = angular.module('tink.gis');


    module.directive('tinkManagementlayer', ['RecursionHelper', function (RecursionHelper) {
        return {
            replace: false,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/managementLayerTemplate.html',
            controller: 'managementLayerController',
            controllerAs: 'lyrctrl',
            compile: function (element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            }
        };
    }]);
})();