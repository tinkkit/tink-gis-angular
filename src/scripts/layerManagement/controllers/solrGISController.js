'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('solrGISController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'ThemeService',
        function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, ThemeService) {
            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            LayerManagementService.AvailableThemes.length = 0;
            $scope.availableThemes = [];
            $scope.allThemes = [];
            var init = function () {
                $scope.searchTerm = '';
            } ();
            $scope.searchChanged = function () {
                if ($scope.searchTerm != null && $scope.searchTerm != '' && $scope.searchTerm.length > 2) {
                    $scope.clearPreview();

                    $scope.QueryGISSOLR($scope.searchTerm, 1);
                }
                else {
                    $scope.availableThemes.length = 0;
                    $scope.numberofrecordsmatched = 0;
                }
            };
            $scope.QueryGISSOLR = function (searchterm, page) {
                var prom = GISService.QuerySOLRGIS(searchterm, ((page - 1) * 5) + 1, 5);
                prom.then(function (data) {
                    $scope.currentPage = 1;
                    var allitems = data.facet_counts.facet_fields.parent;
                    var itemsMetData = data.grouped.parent.groups;
                    var aantalitems = allitems.length;
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
                                }
                                else {
                                    theme.layersCount = itemMetData.doclist.numFound;
                                }
                                itemMetData.doclist.docs.forEach(item => {
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
                                    }
                                    else {
                                        layer.isMatch = true;
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
                // console.log(page, recordsAPage);
                // $scope.QueryGISSOLR($scope.searchTerm, page);
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
            $scope.solrThemeChanged = function (theme) {
                GISService.GetThemeData(theme.url).then(function (data, statuscode, functie, getdata) {
                    if (!data.error) {
                        var convertedTheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                        $scope.previewTheme(convertedTheme);
                    } else {
                        console.log('ERROR:', data.error);
                    }
                });

                // added to give the selected theme an Active class
                $scope.selected = theme;
                $scope.isActive = function(theme) {
                    return $scope.selected === theme;
                };
            };
            $scope.AddOrUpdateTheme = function () {
                LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
                $scope.clearPreview();
            };

            $scope.ok = function () {
                // console.log(LayerManagementService.EnabledThemes);
                $modalInstance.$close(); // return the themes.
            };
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();
