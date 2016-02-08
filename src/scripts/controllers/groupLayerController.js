'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.controller('groupLayerController',
        function ($scope) {
            $scope.Locate = function () {
                console.log("klik");
            };
        });
    // theController.$inject = ['MapService', 'map'];
})();