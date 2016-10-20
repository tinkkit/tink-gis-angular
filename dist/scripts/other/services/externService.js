'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    // module.$inject = ['MapData', 'map', 'GISService', 'ThemeCreater', 'WMSService', 'ThemeService', '$q','BaseLayersService'];

    var externService = function externService(MapData, map, GISService, ThemeCreater, WMSService, ThemeService, $q, BaseLayersService) {
        var _externService = {};
        _externService.GetAllThemes = function () {
            var legendItem = {};
            legendItem.EsriThemes = MapData.Themes.filter(function (x) {
                return x.Type == ThemeType.ESRI;
            });
            legendItem.WmsThemes = MapData.Themes.filter(function (x) {
                return x.Type == ThemeType.WMS;
            });
            return legendItem;
        };
        _externService.SetPrintPreview = function () {
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
        _externService.Export = function () {
            var exportObject = {};
            var arr = MapData.Themes.map(function (theme) {
                var returnitem = {};
                returnitem.Naam = theme.Naam;
                if (theme.Type == ThemeType.ESRI) {
                    returnitem.CleanUrl = theme.Url;
                } else {
                    returnitem.CleanUrl = theme.CleanUrl || theme.Url;
                }

                returnitem.Type = theme.Type;
                returnitem.Visible = theme.Visible;
                returnitem.Layers = theme.AllLayers.filter(function (x) {
                    return x.enabled == true;
                }).map(function (layer) {
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
            exportObject.Themes = arr;
            exportObject.Extent = map.getBounds();
            exportObject.IsKaart = true;

            return exportObject;
        };
        _externService.Import = function (project) {
            console.log(project);
            _externService.setExtent(project.extent);
            var themesArray = [];
            var promises = [];

            project.themes.forEach(function (theme) {
                if (theme.type == ThemeType.ESRI) {
                    theme.cleanUrl = Gis.Arcgissql + theme.cleanUrl;
                    var prom = GISService.GetThemeData(theme.cleanUrl);
                    promises.push(prom);
                    prom.then(function (data) {
                        var arcgistheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                        themesArray.push(arcgistheme);
                    });
                } else {
                    // wms
                    var _prom = WMSService.GetThemeData(theme.cleanUrl);
                    promises.push(_prom);
                    _prom.success(function (data, status, headers, config) {
                        var wmstheme = ThemeCreater.createWMSThemeFromJSON(data, theme.cleanUrl);
                        themesArray.push(wmstheme);
                    }).error(function (data, status, headers, config) {
                        console.log('error!!!!!!!', data, status, headers, config);
                    });
                }
            });
            var allpromises = $q.all(promises);
            allpromises.then(function () {
                var orderedArray = [];
                var errorMessages = [];
                project.themes.forEach(function (theme) {
                    var realTheme = themesArray.find(function (x) {
                        return x.CleanUrl == theme.cleanUrl;
                    });
                    realTheme.Visible = theme.visible;
                    console.log(theme, ' vs real theme: ', realTheme);
                    if (realTheme.AllLayers.length == theme.layers.length) {
                        realTheme.Added = true; //all are added 
                    } else {
                        realTheme.Added = null; // some are added, never false because else we woudn't save it.
                    }
                    realTheme.AllLayers.forEach(function (layer) {
                        layer.enabled = false; // lets disable all layers first
                    });
                    //lets check what we need to enable and set visiblity of, and also check what we don't find
                    theme.layers.forEach(function (layer) {
                        var realLayer = realTheme.AllLayers.find(function (x) {
                            return x.title == layer.name;
                        });
                        if (realLayer) {
                            realLayer.visible = layer.visible; // aha so there was a layer, lets save this
                            realLayer.enabled = true;
                        } else {
                            errorMessages.push('"' + layer.name + '" not found in mapserver: ' + realTheme.Naam + '.');
                        }
                    });
                });
                project.themes.forEach(function (theme) {
                    // lets order them, since we get themesArray filled by async calls, the order can be wrong, thats why we make an ordered array
                    var realTheme = themesArray.find(function (x) {
                        return x.CleanUrl == theme.cleanUrl;
                    });
                    orderedArray.unshift(realTheme);
                    realTheme.status = ThemeStatus.NEW; // and make sure they are new, ready to be added.
                });
                ThemeService.AddAndUpdateThemes(orderedArray);
                console.log('all loaded');
                if (errorMessages.length > 0) {
                    alert(errorMessages.join('\n'));
                }
            });
            return allpromises;
        };
        _externService.setExtent = function (extent) {
            map.fitBounds([[extent._northEast.lat, extent._northEast.lng], [extent._southWest.lat, extent._southWest.lng]]);
        };
        _externService.CleanMapAndThemes = function () {
            MapData.CleanMap();
            ThemeService.CleanThemes();
        };
        _externService.LoadConfig = function (config) {
            Gis.GeometryUrl = config.GeometryUrl;
            Gis.BaseUrl = config.BaseUrl;
            Style.Default = config.Style.Default;
            Style.HIGHLIGHT = config.Style.HIGHLIGHT;
            Style.BUFFER = config.Style.BUFFER;
            BaseLayersService.setBaseMap(1, config.BaseKaart1.Naam, config.BaseKaart1.Url, config.BaseKaart1.MaxZoom, config.BaseKaart1.MinZoom);
            BaseLayersService.setBaseMap(2, config.BaseKaart2.Naam, config.BaseKaart2.Url, config.BaseKaart2.MaxZoom, config.BaseKaart2.MinZoom);
        };

        return _externService;
    };
    module.factory('ExternService', externService);
})();
