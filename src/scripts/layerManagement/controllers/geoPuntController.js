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
            $scope.geopuntError = null;

            //Data, status and url for GeoPunt error
            $scope.data = null;
            $scope.status = null;
            $scope.url = null;
            $scope.canceller = null;

            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            LayerManagementService.EnabledThemes.length = 0;
            LayerManagementService.AvailableThemes.length = 0;
            // can throw errors with alot of data because of circular reference between theme and layer
            LayerManagementService.EnabledThemes = _.cloneDeep(MapData.Themes);
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

                if($scope.canceller) {
                    $scope.canceller.resolve("cancelled");
                }
                $scope.canceller = $q.defer();
                var prom = GeopuntService.getMetaData(searchTerm, ((page - 1) * 5) + 1, 5, $scope.canceller.promise);
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
                    $scope.canceller = null;
                }, function (reason) {
                    console.log(reason);
                    $scope.$parent.geopuntLoading = false;
                    $scope.$parent.geopuntCount = "!";
                    $scope.geopuntError = true;
                    $scope.loading = false;
                    $scope.data = reason.data;
                    $scope.status = reason.status;
                    $scope.url = reason.url;
                    $scope.canceller = null;
                });
            };
            $scope.pageChanged = function (page, recordsAPage) {
                $scope.QueryGeoPunt($scope.searchTerm, page);
            };
            $scope.geopuntThemeChanged = function (theme) {
                let themeUrl = '';
                if (theme.Url) {
                    themeUrl = theme.Url;
                } else {
                    if (theme.TMPMETADATA && theme.TMPMETADATA["dc:uri"] && theme.TMPMETADATA["dc:uri"][0] && theme.TMPMETADATA["dc:uri"][0]["_"]) {
                        themeUrl = theme.TMPMETADATA["dc:uri"][0]["_"];
                    }
                }
                var questionmarkPos = themeUrl.trim().indexOf('?');
                var url = themeUrl;
                if (questionmarkPos != -1) {
                    url = themeUrl.substring(0, questionmarkPos);
                }
                createWMS(url);
            };
            var createWMS = function (url) {
                $scope.clearPreview();
                var wms = MapData.Themes.find(x => x.cleanUrl == url);
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
                $scope.copySelectedTheme = _.cloneDeep(theme);
            };
            $scope.clearPreview = function () {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
                $scope.error = null;
                $scope.geopuntError = null;
            };

            $scope.AddOrUpdateTheme = function () {
                PopupService.Success("Data is bijgewerkt.", null, null, {  timeOut: 1000 });
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();
            };

            $scope.reportError = function() {
                var exception = { url: $scope.url, status: $scope.status, data: $scope.data };
                PopupService.ExceptionFunc(exception);
            };
        }
    ]);
})();