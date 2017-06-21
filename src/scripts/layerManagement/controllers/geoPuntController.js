'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tinµk.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('geoPuntController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'PopupService',
        function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, PopupService) {
            $scope.loading = false;
            $scope.themeloading = false;
            $scope.currentPage = 1;

            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            LayerManagementService.EnabledThemes.length = 0;
            LayerManagementService.AvailableThemes.length = 0;
            LayerManagementService.EnabledThemes = angular.copy(MapData.Themes);
            $scope.availableThemes = [];
            var init = function () {
                $scope.searchTerm = '';
            }();
            if (!L.Browser.mobile) {
                $scope.$on("searchChanged", function (event, searchTerm) {
                    $scope.searchTerm = searchTerm;
                    if ($scope.searchTerm.length > 2) {
                        $scope.clearPreview();
                        $scope.searchIsUrl = false;
                        $scope.$parent.geopuntLoading = true;
                        $scope.QueryGeoPunt($scope.searchTerm, 1);
                    }
                    else {
                        $scope.availableThemes.length = 0;
                        $scope.numberofrecordsmatched = 0;
                        $scope.$parent.geopuntCount = null;
                        $scope.loading = false;
                        $scope.$parent.geopuntLoading = false;
                    }
                });
            }

            $scope.QueryGeoPunt = function (searchTerm, page) {
                $scope.loading = true;
                $scope.clearPreview();
                var prom = GeopuntService.getMetaData(searchTerm, ((page - 1) * 5) + 1, 5);
                prom.then(function (metadata) {

                    if ($scope.currentPage == 0) {
                        $scope.currentPage = 1;
                    }
                    $scope.loading = false;
                    $scope.$parent.geopuntLoading = false;
                    $scope.availableThemes = metadata.results;
                    $scope.currentrecord = metadata.currentrecord;
                    $scope.nextrecord = metadata.nextrecord;
                    $scope.numberofrecordsmatched = metadata.numberofrecordsmatched;
                    $scope.$parent.geopuntCount = metadata.numberofrecordsmatched;
                }, function (reason) {
                    console.log(reason);
                });
            };
            $scope.pageChanged = function (page, recordsAPage) {
                $scope.QueryGeoPunt($scope.searchTerm, page);
            };
            $scope.geopuntThemeChanged = function (theme) {
                var questionmarkPos = theme.Url.trim().indexOf('?');
                var url = theme.Url.trim();
                if (questionmarkPos != -1) {
                    url = theme.Url.trim().substring(0, questionmarkPos);
                }
                createWMS(url);
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
                        } else {
                            PopupService.Error("Fout bij het laden van de WMS", "Er is een fout opgetreden bij opvragen van de wms met de url: " + url);
                            $scope.error = "Fout bij het laden van WMS.";
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.error = "Fout bij het laden van WMS.";
                        $scope.themeloading = false;
                    });
                } else {
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
                PopupService.Success("Data is bijgewerkt.");
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();
            };
        }
    ]);
})();