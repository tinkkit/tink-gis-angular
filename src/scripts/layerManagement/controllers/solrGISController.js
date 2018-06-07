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
                $scope.searchTerm = searchTerm.replace(/ /g,'').replace(/_/g,'').replace(/-/g,'');
                if ($scope.searchTerm.length > 2) {
                    if ($scope.searchTerm != null && $scope.searchTerm != '') {
                        $scope.$parent.solrLoading = true;
                        $scope.QueryGISSOLR($scope.searchTerm, 1);
                    }
                }
                else {
                    if($scope.searchTerm == '*'){ 
                        $scope.searchTerm = 'arcgis';
                        $scope.$parent.solrLoading = true;
                        $scope.QueryGISSOLR('arcgis', 1);
                     
                    } else {
                        $scope.availableThemes.length = 0;
                        $scope.numberofrecordsmatched = 0;
                        $scope.$parent.solrCount = null;
                        $scope.loading = false;
                        $scope.$parent.solrLoading = false;
                    }
            
                }
            });
            var generateUrl = function (themeName, type) {
                var url = "";
                switch (type.toLowerCase()) {
                    case "p_sik":
                        url = Gis.BaseUrl + 'arcgis/rest/services/P_Sik/' + themeName + '/MapServer';
                        break;
                    case "p_stad":
                        url = Gis.BaseUrl + 'arcgissql/rest/services/P_Stad/' + themeName + '/MapServer';
                        break;
                    case "p_publiek":
                        url = Gis.PublicBaseUrl + 'arcgissql/rest/services/P_Publiek/' + themeName + '/MapServer';
                        break;
                    default:
                        throw error("invalid type: " + type + ". p_sik p_stad p_publiek only valid now.");
                }
                return url;
            }
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
                                var afterservicespart = itemMetData.groupValue.split('/services/')[1].split('/'); //  ["P_Stad", "ATLAS", "14"]
                                var url = itemMetData.groupValue.split('/').splice(0,itemMetData.groupValue.split('/').length - 1).join('/') + '/Mapserver' // url without id
                                var themeName = afterservicespart[1];
                                var layerId = afterservicespart[2];
                                var layerName = itemMetData.doclist.docs[0].parentname;
                                var theme = themes.find(x => x.name == themeName);
                                if (!theme) {
                                    var theme = {
                                        layers: [],
                                        layersCount: 0,
                                        name: themeName,
                                        cleanUrl: url,  // Gis.BaseUrl + 'arcgissql/rest/services/P_Stad/' + themeName + '/MapServer',
                                        url: url// 'services/P_Stad/' + themeName + '/MapServer'
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
                                itemMetData.doclist.docs.slice(0,5).forEach(item => {
                                    var feature = item.titel.join(' ');
                                    // id: item.id
                                    layer.features.push(feature);
                                });
                                break;
                            case "Layer":
                                var afterservicespart = itemMetData.groupValue.split('/services/')[1].split('/');
                                var themeName = afterservicespart[1];
                                var type = itemMetData.groupValue.split('/')[0];
                                var url = itemMetData.groupValue + '/Mapserver'; //generateUrl(themeName, type);

                                var theme = themes.find(x => x.name == themeName)
                                if (!theme) {
                                    theme = {
                                        layers: [],
                                        layersCount: itemMetData.doclist.numFound,
                                        name: themeName,
                                        cleanUrl: url,
                                        url: url //'services/' + type +'/' + themeName + '/MapServer'
                                    }
                                    themes.push(theme);
                                } else {
                                    theme.layersCount = itemMetData.doclist.numFound;
                                }
                                itemMetData.doclist.docs.forEach(item => {
                                    if (item.titel[0].replace(/ /g,'').replace(/_/g,'').replace(/-/g,'').toLowerCase().includes(searchterm.toLowerCase())) {
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
                var alreadyExistingTheme = MapData.Themes.find(x => { return x.cleanUrl === theme.cleanUrl });
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

                GISService.GetThemeData(theme.cleanUrl).then(function (data, status, functie, getdata) {
                    if(data) {
                        if (!data.error) {
                            var convertedTheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                            $scope.previewTheme(convertedTheme, layername);
                        } else {
                            PopupService.ErrorFromHTTP(data.error, status, theme.cleanUrl);
                            $scope.error = "Fout bij het laden van de mapservice.";
                        }
                    } else {
                        var callback = function () { 
                            var win = window.open('https://um.antwerpen.be/main.aspx', '_blank');
                            win.focus();
                         };
                         var options = {};
                         options.timeOut = 10000;
                        PopupService.Warning("U hebt geen rechten om het thema " + theme.name  + " te raadplegen.", "Klik hier om toegang aan te vragen.", callback, options);
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
                PopupService.Success("Data is bijgewerkt.", null, null, {  timeOut: 1000 });
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