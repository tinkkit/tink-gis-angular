'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function (MapService, map) {
            var vm = this;
            vm.features = MapService.JsonFeatures;
            vm.Locate = function () {
                console.log("klik");
                console.log(vm.features);
            }
        });
    theController.$inject = ['MapService', 'map'];
})();