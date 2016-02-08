'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function ($scope, MapService, map) {
            $scope.features = MapService.jsonFeatures;
            $scope.Locate = function () {
                console.log("klik");;
            }
        });
    theController.$inject = ['MapService', 'map'];
})();