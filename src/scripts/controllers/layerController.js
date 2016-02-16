'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope) {
        var vm = this;
        vm.layer = $scope.layer;
        vm.chkChanged = function () {
            $scope.$emit('layerCheckboxChangedEvent', $scope.layer); // stuur naar parent ofwel group ofwel theme
        };
    });
    theController.$inject = [];
})();