'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function ($scope, MapService, map) {
            $scope.features = MapService.JsonFeatures;
            $scope.Locate = function () {
                console.log("klik");
                console.log($scope.features);
            }
        });
    theController.$inject = ['MapService', 'map'];
})();