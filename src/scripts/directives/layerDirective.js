(function (module) {
    'use strict';
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layerController', function ($scope, $http, GisDataService) {
        console.log('layerController CTOR');
        $scope.changeVisibility = function (url) {
            GisDataService.changeVisibility(url);
        };
    })
    theController.$inject = ['GisDataService'];
    var theDirective = function () {
        return {
            restrict: 'E',
            scope: {
                layerData: '='
            },
            templateUrl: 'templates/layer.html',
            controller: 'layerController',
        }
    };

    angular.module('tink.gis.angular').directive('layer', theDirective);
})();