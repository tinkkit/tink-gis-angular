'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function ($scope, MapService, map) {
            var vm = this;
            vm.features = MapService.JsonFeatures;
        });
    theController.$inject = ['$scope', 'MapService', 'map'];
})();