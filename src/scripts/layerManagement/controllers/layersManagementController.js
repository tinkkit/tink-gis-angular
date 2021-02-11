'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('layersManagementController', ['$scope', 'MapData', 'ThemeService', 'LayerManagementService','PopupService',
        function ($scope, MapData, ThemeService, LayerManagementService, PopupService) {
            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            $scope.availableThemes = MapData.Themes;
            $scope.queryLayers = MapData.QueryLayers;
            $scope.allThemes = [];

            $scope.searchChanged = function () {

            };

            $scope.pageChanged = function (page, recordsAPage) {
                let startItem = ((page - 1) * recordsAPage);
                $scope.availableThemes = $scope.allThemes.slice(startItem, startItem + recordsAPage);
            };
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.query = '';
            $scope.selectedQueryLayer = null;
            $scope.previewTheme = function (theme) {
                console.log('themeChanged');
                console.log(theme);
                var alreadyExistingTheme = MapData.Themes.find(x => { return x.cleanUrl === theme.cleanUrl });
                if (alreadyExistingTheme) {
                    theme = alreadyExistingTheme;
                }
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = _.cloneDeep(theme);
            };
            $scope.clearPreview = function () {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
                $scope.selectedQueryLayer = null;
            };
            $scope.ThemeChanged = function (theme) {
                $scope.selectedQueryLayer = null;
                $scope.previewTheme(theme);
                // added to give the selected theme an Active class
                $scope.selected = theme;
                $scope.isActive = function (theme) {
                    return $scope.selected === theme;
                };
            };

            $scope.QueryLayerChanged = function(queryLayer) {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
                $scope.selected = null;
                $scope.selectedQueryLayer = queryLayer;
                $scope.query = `FROM ${queryLayer.layer.name} WHERE ${queryLayer.layer.query}`;

                $scope.isActiveQueryLayer = function (queryLayer) {
                    return $scope.selectedQueryLayer === queryLayer;
                }
            }

            $scope.AddOrUpdateTheme = function () {
                PopupService.Success("Data is bijgewerkt.", null, null, {  timeOut: 1000 });
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();

            };

            $scope.delQueryLayer = function (queryLayer) {
                if ($scope.selectedQueryLayer === queryLayer) {
                    $scope.clearPreview();
                }
                const index = $scope.queryLayers.indexOf(queryLayer);
                if (index !== -1) {
                    ThemeService.DeleteQueryLayer(index);
                }
            }
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
