'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('layersManagementController', ['$scope', 'MapData', 'ThemeService', 'LayerManagementService',
        function ($scope, MapData, ThemeService, LayerManagementService) {
            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            $scope.availableThemes = MapData.Themes;
            $scope.allThemes = [];

            $scope.searchChanged = function () {

            };

            $scope.pageChanged = function (page, recordsAPage) {
                let startItem = ((page - 1) * recordsAPage);
                $scope.availableThemes = $scope.allThemes.slice(startItem, startItem + recordsAPage);
            };
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.previewTheme = function (theme) {
                console.log('themeChanged');
                console.log(theme);
                var alreadyExistingTheme = MapData.Themes.find(x => { return x.CleanUrl === theme.CleanUrl });
                if (alreadyExistingTheme) {
                    theme = alreadyExistingTheme;
                }
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
            };
            $scope.clearPreview = function () {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
            };
            $scope.ThemeChanged = function (theme) {
                $scope.previewTheme(theme);
                // added to give the selected theme an Active class
                $scope.selected = theme;
                $scope.isActive = function (theme) {
                    return $scope.selected === theme;
                };
            };

            $scope.AddOrUpdateTheme = function () {
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();

            };
            $scope.delTheme = function (theme) {
                if ($scope.selectedTheme == theme) {
                    $scope.clearPreview();
                }
                // theme.AllLayers.forEach(lay => {
                //     lay.enabled = false;
                // });
                ThemeService.DeleteTheme(theme);
            }
            var init = function () {
                $scope.searchTerm = '';
                if (!$scope.selected && $scope.availableThemes[0]) {
                    $scope.ThemeChanged($scope.availableThemes[0]);
                }
            } ();

        }]);
})();
