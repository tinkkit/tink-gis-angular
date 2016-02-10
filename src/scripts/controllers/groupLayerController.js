'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.controller('groupLayerController',
        function ($scope) {
            $scope.visChanged = function () {
                $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
            };
        });
})();