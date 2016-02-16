'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    module = angular.module('tink.gis.angular');
    module.controller('groupLayerController',
        function ($scope) {
            var vm = this;
            vm.grouplayer = $scope.grouplayer;
            vm.chkChanged = function () {
                $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
            };
        });
})();