'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope, ThemeService) {
        var vm = this;
        vm.layer = $scope.layer;
        vm.chkChanged = function () {
            ThemeService.UpdateThemeVisibleLayers(vm.layer.theme);
        };
    });
    theController.$inject = ['ThemeService'];
})();