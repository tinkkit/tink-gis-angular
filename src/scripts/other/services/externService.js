'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    // module.$inject = ['MapData', 'map', 'GISService', 'ThemeCreater', 'WMSService', 'ThemeService', '$q','BaseLayersService'];

    var externService = function(MapData, map, GISService, ThemeCreater, WMSService, ThemeService, $q, BaseLayersService, FeatureService, ResultsData, PopupService) {
        var _externService = {};
        _externService.GetAllThemes = function() {
            let legendItem = {};
            legendItem.EsriThemes = MapData.Themes.filter(x => x.Type == ThemeType.ESRI);
            legendItem.WmsThemes = MapData.Themes.filter(x => x.Type == ThemeType.WMS);
            return legendItem;
        };
        _externService.SetPrintPreview = function() {
            var cent = map.getCenter();
            var html = $('html');
            if (!html.hasClass('print')) {
                html.addClass('print');
            }
            if (html.hasClass('landscape')) {
                html.removeClass('landscape');
            }
            map.invalidateSize(false);
            map.setView(cent);
        };
        _externService.Export = function() {
            var exportObject = {};
            var arr = MapData.Themes.map(theme => {
                let returnitem = {};
                if (!theme.Naam) {
                    theme.Naam = "no_title_found";
                }
                returnitem.Naam = theme.Naam;
                // if (theme.Type == ThemeType.ESRI) {
                //     returnitem.cleanUrl = theme.Url;
                // } else {
                    returnitem.cleanUrl = theme.cleanUrl || theme.Url;
                // }
                returnitem.opacity = theme.Opacity
                returnitem.type = theme.Type;
                returnitem.visible = theme.Visible;
                returnitem.layers = theme.AllLayers.filter(x => { return x.enabled == true; }).map(layer => {
                    var returnlayer = {};
                    // returnlayer.enabled = layer.enabled; // will always be true... since we only export the enabled layers
                    returnlayer.visible = layer.visible;
                    if (theme.Type == ThemeType.ESRI) {
                        returnlayer.name = layer.name;
                        returnlayer.id = layer.id;
                    } else {
                        returnlayer.name = layer.title;
                        returnlayer.id = layer.title;
                    }
                    return returnlayer;
                });
                return returnitem;
            });
            exportObject.themes = arr;
            exportObject.extent = map.getBounds();
            exportObject.isKaart = true;
            return exportObject;
        };

        _externService.Import = function(project) {
            console.log(project);
            _externService.setExtent(project.extent);
            let themesArray = [];
            let promises = [];

            project.themes.forEach(theme => {
                if (theme.type == ThemeType.ESRI) {
                    let prom = GISService.GetThemeData(theme.cleanUrl);
                    promises.push(prom);
                    prom.then(function(data) {
                        if (data) {
                            if (!data.error) {
                                let arcgistheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                                themesArray.push(arcgistheme);
                            } else {
                                PopupService.ErrorWithException("Fout bij laden van mapservice", "Kan mapservice met volgende url niet laden: " + theme.cleanUrl, data.error);
                            }
                        } else {
                            var callback = function () { 
                                var win = window.open('https://um.antwerpen.be/main.aspx', '_blank');
                                win.focus();
                             };
                             var options = {};
                             options.timeOut = 10000;
                            PopupService.Warning("U hebt geen rechten om het thema " + theme.Naam  + " te raadplegen.", "Klik hier om toegang aan te vragen.", callback, options);
                        }
                    });
                } else {
                    // wms
                    let prom = WMSService.GetThemeData(theme.cleanUrl);
                    promises.push(prom);
                    prom.success(function(data, status, headers, config) {
                        let wmstheme = ThemeCreater.createWMSThemeFromJSON(data, theme.cleanUrl);
                        themesArray.push(wmstheme);
                    }).error(function(data, status, headers, config) {
                        console.log('error!!!!!!!', data, status, headers, config);

                    });
                }
            });



            var allpromises = $q.all(promises);

            allpromises.then(function() {
                var orderedArray = [];
                var errorMessages = [];
                project.themes.forEach(theme => {
                    var realTheme = themesArray.find(x => x.cleanUrl == theme.cleanUrl);
                    if (realTheme) {
                        console.log(theme, ' vs real theme: ', realTheme);
                        realTheme.Visible = theme.visible;

                        if (realTheme.AllLayers.length == theme.layers.length) {
                            realTheme.Added = true; //all are added 
                        } else {
                            realTheme.Added = null; // some are added, never false because else we woudn't save it.
                        }
                        realTheme.AllLayers.forEach(layer => {
                            layer.enabled = false; // lets disable all layers first
                        });
                        //lets check what we need to enable and set visiblity of, and also check what we don't find
                        theme.layers.forEach(layer => {
                            var realLayer = realTheme.AllLayers.find(x => x.title == layer.name);
                            if (realLayer) {
                                realLayer.visible = layer.visible; // aha so there was a layer, lets save this
                                realLayer.enabled = true;
                            } else {
                                errorMessages.push('"' + layer.name + '" not found in mapserver: ' + realTheme.Naam + '.');
                            }
                        });
                    }

                });
                project.themes.forEach(theme => { // lets order them, since we get themesArray filled by async calls, the order can be wrong, thats why we make an ordered array
                    var realTheme = themesArray.find(x => x.cleanUrl == theme.cleanUrl);
                    if (realTheme) {
                        orderedArray.unshift(realTheme);
                        realTheme.status = ThemeStatus.NEW; // and make sure they are new, ready to be added.
                    }
                });
                ThemeService.AddAndUpdateThemes(orderedArray);
                console.log('all loaded');
                if (errorMessages.length > 0) {
                    PopupService.Warning("Fout bij import", errorMessages.join('\n'));
                }
                if (FeatureService.defaultLayerName) {
                    var defaultLayer = MapData.VisibleLayers.find(x => x.name == FeatureService.defaultLayerName);
                    if (defaultLayer) {
                        MapData.SelectedLayer = defaultLayer;
                        MapData.SelectedFindLayer = defaultLayer;
                        MapData.DefaultLayer = defaultLayer;
                    }

                }

            });
            return allpromises;

        };
        _externService.setExtent = function(extent) {
            map.fitBounds([
                [extent._northEast.lat, extent._northEast.lng],
                [extent._southWest.lat, extent._southWest.lng]
            ]);
        };
        _externService.setExtendFromResults = function() {
            if (ResultsData.JsonFeatures && ResultsData.JsonFeatures.length > 0) {
                var featuregrp = L.featureGroup();
                ResultsData.JsonFeatures.forEach(feature => {
                    featuregrp.addLayer(feature.mapItem);
                });
                var featureBounds = featuregrp.getBounds();
                map.fitBounds(featureBounds);
            }
        };
        
        _externService.SetCityExtent = function() {
            var extent = {
                _northEast : {
                    lat: "51.3877433490741",
                    lng: "4.75561140002421"
                },
                _southWest: {
                    lat: "51.1324947954227",
                    lng: "3.95971169623321"
                }
            };

            _externService.setExtent(extent);
        }

        _externService.CleanMapAndThemes = function() {
            MapData.CleanMap();
            ThemeService.CleanThemes();
        };
        _externService.LoadConfig = function(config) {
            Gis.GeometryUrl = config.Gis.GeometryUrl;
            Gis.BaseUrl = config.Gis.BaseUrl;
            Style.Default = config.Style.Default;
            Style.HIGHLIGHT = config.Style.HIGHLIGHT;
            Style.BUFFER = config.Style.BUFFER;
            BaseLayersService.setBaseMap(1, config.BaseKaart1.Naam, config.BaseKaart1.Url, config.BaseKaart1.MaxZoom, config.BaseKaart1.MinZoom)
            BaseLayersService.setBaseMap(2, config.BaseKaart2.Naam, config.BaseKaart2.Url, config.BaseKaart2.MaxZoom, config.BaseKaart2.MinZoom)
        }
        return _externService;
    };
    module.factory('ExternService', externService);
})();