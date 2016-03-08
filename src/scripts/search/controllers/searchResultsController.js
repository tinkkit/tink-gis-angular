'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchResultsController',
        function($scope, MapData, map) {
            var vm = this;
            vm.features = MapData.JsonFeatures;
        });
    theController.$inject = ['$scope', 'MapData', 'map'];
})();