'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.controller('themeController', ['$scope', 'MapService', 'ThemeService',
        function ($scope, MapService, ThemeService) {
            var vm = this;
            console.log("Theme geladen");
            vm.theme = $scope.theme;
            $scope.$on('groupCheckboxChangedEvent', function (event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function (event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            });
            vm.chkChanged = function () {
                MapService.UpdateThemeStatus(vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            };
            vm.deleteTheme = function () {
                ThemeService.DeleteTheme(vm.theme);
            }
        }]);
})();