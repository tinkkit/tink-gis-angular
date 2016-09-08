'use strict';
(function (module) {

    module = angular.module('tink.gis');


    module.directive('tinkLayer', ['RecursionHelper', function (RecursionHelper) {
        return {
            replace: false,
            scope: {
                layer: '=',
                layercheckboxchange: '&'
            },
            templateUrl: 'templates/other/layerTemplate.html',
            controller: 'layerController',
            controllerAs: 'lyrctrl',
            compile: function (element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            }
        };
    }]);
})();