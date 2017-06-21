'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('solrGISController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'ThemeService', 'PopupService',
        function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, ThemeService, PopupService) {
            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            LayerManagementService.AvailableThemes.length = 0;
            $scope.availableThemes = [];
            $scope.allThemes = [];
            $scope.loading = false;
            $scope.error = null;
            var init = function () {
                $scope.searchTerm = '';

            }();
            $scope.$on("searchChanged", function (event, searchTerm) {
                $scope.searchTerm = searchTerm;
                if ($scope.searchTerm.length > 2) {
                    if ($scope.searchTerm != null && $scope.searchTerm != '') {
                        $scope.$parent.solrLoading = true;
                        $scope.QueryGISSOLR($scope.searchTerm, 1);
                    }
                }
                else {
                    $scope.availableThemes.length = 0;
                    $scope.numberofrecordsmatched = 0;
                    $scope.$parent.solrCount = null;
                    $scope.loading = false;
                    $scope.$parent.solrLoading = false;
                }
            });
            $scope.QueryGISSOLR = function (searchterm, page) {
                $scope.loading = true;

                var prom = GISService.QuerySOLRGIS(searchterm, ((page - 1) * 5) + 1, 5);
                prom.then(function (data) {
                    $scope.loading = false;
                    $scope.$parent.solrLoading = false;
                    $scope.currentPage = 1;
                    var allitems = data.facet_counts.facet_fields.parent;
                    var itemsMetData = data.grouped.parent.groups;
                    $scope.$parent.solrCount = itemsMetData.length;
                    // var aantalitems = allitems.length;
                    var x = 0;
                    var themes = [];
                    itemsMetData.forEach(itemMetData => {
                        switch (itemMetData.doclist.docs[0].type) {
                            case "Feature":
                                var themeName = itemMetData.groupValue.split('/').slice(1, 2).join('/');
                                var layerId = itemMetData.groupValue.split('/')[2];
                                var layerName = itemMetData.doclist.docs[0].parentname;
                                var theme = themes.find(x => x.name == themeName)
                                if (!theme) {
                                    var theme = {
                                        layers: [],
                                        layersCount: 0,
                                        name: themeName,
                                        cleanUrl: Gis.BaseUrl + 'arcgissql/rest/services/P_Stad/' + themeName + '/MapServer',
                                        url: 'services/P_Stad/' + themeName + '/MapServer'
                                    }
                                    themes.push(theme);
                                }
                                var layer = theme.layers.find(x => x.id == layerId);
                                if (!layer) {
                                    layer = {
                                        naam: layerName,
                                        id: layerId,
                                        features: [],
                                        featuresCount: itemMetData.doclist.numFound,
                                        isMatch: false
                                    };
                                    theme.layers.push(layer);
                                } else {
                                    layer.featuresCount = itemMetData.doclist.numFound;
                                }
                                itemMetData.doclist.docs.forEach(item => {
                                    var feature = item.titel.join(' ');
                                    // id: item.id
                                    layer.features.push(feature);
                                });
                                break;
                            case "Layer":
                                var themeName = itemMetData.groupValue.split('/')[1];
                                var theme = themes.find(x => x.name == themeName)
                                if (!theme) {
                                    theme = {
                                        layers: [],
                                        layersCount: itemMetData.doclist.numFound,
                                        name: themeName,
                                        cleanUrl: Gis.BaseUrl + 'arcgissql/rest/services/P_Stad/' + themeName + '/MapServer',
                                        url: 'services/P_Stad/' + themeName + '/MapServer'
                                    }
                                    themes.push(theme);
                                } else {
                                    theme.layersCount = itemMetData.doclist.numFound;
                                }
                                itemMetData.doclist.docs.forEach(item => {
                                    if (item.titel[0].includes(searchterm)) {
                                        var layer = theme.layers.find(x => x.id == item.key);
                                        if (!layer) {
                                            layer = {
                                                naam: item.titel[0],
                                                id: item.key,
                                                isMatch: true,
                                                featuresCount: 0,
                                                features: []
                                            };
                                            theme.layers.push(layer);
                                        } else {
                                            layer.isMatch = true;
                                        }
                                    }
                                });
                                break;
                            default:
                                console.log("UNKOWN TYPE:", item)
                                break;
                        }
                    });
                    $scope.availableThemes = themes.slice(0, 5);
                    $scope.allThemes = themes;
                    $scope.numberofrecordsmatched = themes.length;
                    console.log(data);
                }, function (reason) {
                    console.log(reason);
                });
            };
            $scope.pageChanged = function (page, recordsAPage) {
                let startItem = ((page - 1) * recordsAPage);
                $scope.availableThemes = $scope.allThemes.slice(startItem, startItem + recordsAPage)
            };
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.previewTheme = function (theme, layername) {
                var alreadyExistingTheme = MapData.Themes.find(x => { return x.CleanUrl === theme.CleanUrl });
                if (alreadyExistingTheme) {
                    theme = alreadyExistingTheme;
                }
                if (layername) {
                    var layer = theme.AllLayers.find(x => x.name == layername);
                    if (layer) {
                        theme.enabled = true;
                        layer.enabled = true;
                        layer.AllLayers.forEach(x => x.enabled = true);
                        if (layer.parent) {
                            layer.parent.enabled = true;
                        }
                    }
                }
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
            };
            $scope.clearPreview = function () {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
                $scope.error = null;
            };
            $scope.solrThemeChanged = function (theme, layername) {
                $scope.clearPreview();
                $scope.themeloading = true;

                GISService.GetThemeData(theme.url).then(function (data, status, functie, getdata) {
                    if (!data.error) {
                        var convertedTheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                        $scope.previewTheme(convertedTheme, layername);
                    } else {
                        PopupService.ErrorFromHTTP(data.error, status, theme.url);
                        $scope.error = "Fout bij het laden van de mapservice.";
                    }
                    $scope.themeloading = false;

                }, function (data, status, functie, getdata) {
                    $scope.error = "Fout bij het laden van de mapservice.";
                    $scope.themeloading = false;
                });
                // added to give the selected theme an Active class
                $scope.selected = theme;
                $scope.isActive = function (theme) {
                    return $scope.selected === theme;
                };
            };
            $scope.AddOrUpdateTheme = function () {
                PopupService.Success("Data is bijgewerkt.");
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();
            };
            $scope.ok = function () {
                $modalInstance.$close();
            };
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed');
            };

        }
    ]);
})();