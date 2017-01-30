'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.controller('themeController', ['$scope', 'MapService', 'ThemeService',
        function ($scope, MapService, ThemeService) {
            var vm = this;
            console.log('Theme geladen');
            vm.theme = $scope.theme;
            vm.hidedelete = $scope.hidedelete;
            vm.chkChanged = function () {
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            };
            vm.deleteTheme = function () {
                swal({
                    title: 'Verwijderen?',
                    text: 'U staat op het punt om ' + vm.theme.Naam + ' te verwijderen.',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Verwijder',
                    closeOnConfirm: true
                }, function () {
                    ThemeService.DeleteTheme(vm.theme);
                    $scope.$applyAsync();

                });
                console.log(vm.theme);
            }
        }]);
})();