'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('wmsUrlController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'PopupService',
        function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, PopupService) {
            $scope.urlIsValid = false;

            $scope.themeloading = false;
            $scope.urlChanged = function () {
                $scope.clearPreview();
                if ($scope.url != null && $scope.url.startsWith('http')) {
                    $scope.urlIsValid = true;
                }
                else {
                    $scope.urlIsValid = false;
                }
            };
            $scope.laadUrl = function () {
                $scope.url = $scope.url.trim().replace('?', '');
                createWMS($scope.url);
            };
            var createWMS = function (url) {
                $scope.clearPreview();
                var wms = MapData.Themes.find(x => x.CleanUrl == url);
                if (wms == undefined) {
                    var getwms = WMSService.GetThemeData(url);
                    $scope.themeloading = true;
                    getwms.success(function (data, status, headers, config) {
                        $scope.themeloading = false;
                        if (data) {
                            var wmstheme = ThemeCreater.createWMSThemeFromJSON(data, url);
                            $scope.previewTheme(wmstheme);
                        }
                        else {
                            $scope.error = "Fout bij het laden van WMS.";
                            PopupService.Error("Ongeldige WMS", "De opgegeven url is geen geldige WMS url. (" + url + ")");
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.error = "Fout bij het laden van WMS.";
                        $scope.themeloading = false;
                    });
                }
                else {
                    $scope.previewTheme(wms);
                }
            }
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.previewTheme = function (theme) {
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
            };
            $scope.clearPreview = function () {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
                $scope.error = null;
            };

            $scope.AddOrUpdateTheme = function () {
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();
            };
        }]);
})();