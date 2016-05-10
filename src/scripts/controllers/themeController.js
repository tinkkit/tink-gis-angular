'use strict';
(function(module) {
    module = angular.module('tink.gis');
    module.controller('themeController', ['$scope', 'MapService', 'ThemeService',
        function($scope, MapService, ThemeService) {
            var vm = this;
            console.log('Theme geladen');
            vm.theme = $scope.theme;
            $scope.$on('groupCheckboxChangedEvent', function(event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function(event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            });
            vm.chkChanged = function() {
                MapService.UpdateThemeStatus(vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            };
            vm.deleteTheme = function() {
                swal({
                    title: 'Verwijderen?',
                    text: 'U staat op het punt om ' + vm.theme.Naam + ' te verwijderen.',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Verwijder',
                    closeOnConfirm: true
                }
                    , function() {
                        ThemeService.DeleteTheme(vm.theme);
                        $scope.$apply();

                    });
                console.log(vm.theme);
            }
        }]);
})();