'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.controller('themeController', ['$scope', 'MapService',
        function ($scope, MapService) {
            var vm = this;
            vm.theme = $scope.theme;
            $scope.$on('groupCheckboxChangedEvent', function (event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
                MapService.UpdateThemeVisibleLayers(vm.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function (event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, vm.theme);
                MapService.UpdateThemeVisibleLayers(vm.theme);
            });
            vm.chkChanged = function () {
                MapService.UpdateThemeStatus(vm.theme);
                MapService.UpdateThemeVisibleLayers(vm.theme);
            };
            vm.deleteTheme = function () {
                MapService.DeleteTheme(vm.theme);
            }
        }]);
})();