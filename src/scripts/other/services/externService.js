'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var externService = function (MapData, map, GISService, ThemeCreater, WMSService, ThemeService, $q) {
        var _externService = {};
        _externService.GetAllThemes = function () {
            let legendItem = {};
            legendItem.EsriThemes = MapData.Themes.filter(x => x.Type == ThemeType.ESRI);
            legendItem.WmsThemes = MapData.Themes.filter(x => x.Type == ThemeType.WMS);
            return legendItem;
        };
        _externService.Export = function () {
            var exportObject = {};
            var arr = MapData.Themes.map(theme => {
                let returnitem = {};
                returnitem.Naam = theme.Naam;
                if (theme.CleanUrl) {
                    returnitem.CleanUrl = theme.CleanUrl;
                }
                else {
                    returnitem.CleanUrl = theme.Url;
                }
                returnitem.Type = theme.Type;
                returnitem.Visible = theme.Visible;
                returnitem.Layers = theme.AllLayers.filter(x => { return x.enabled == true; }).map(layer => {
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
            let themesArray = [];
            let promises = [];

            project.themes.forEach(theme => {
                if (theme.type == ThemeType.ESRI) {
                    theme.cleanUrl = Gis.BaseUrl + 'arcgissql/rest/' + theme.cleanUrl;
                    let prom = GISService.GetThemeData(theme.cleanUrl);
                    promises.push(prom);
                    prom.then(function (data) {
                        let arcgistheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                        themesArray.push(arcgistheme);
                    });
                } else {
                    // wms
                    let prom = WMSService.GetThemeData(theme.cleanUrl);
                    promises.push(prom);
                    prom.success(function (data, status, headers, config) {
                        let wmstheme = ThemeCreater.createWMSThemeFromJSON(data, theme.cleanUrl);
                        themesArray.push(wmstheme);
                    }).error(function (data, status, headers, config) {
                        console.log('error!!!!!!!', data, status, headers, config);

                    });
                }

            });
            $q.all(promises).then(function () {
                var orderedArray = [];
                var errorMessages = [];
                project.themes.forEach(theme => {
                    var realTheme = themesArray.find(x => x.CleanUrl == theme.cleanUrl);
                    realTheme.Visible = theme.visible;
                    console.log(theme, ' vs real theme: ', realTheme);
                    if (realTheme.AllLayers.length == theme.layers.length) {
                        realTheme.Added = true; //all are added 
                    }
                    else {
                        realTheme.Added = null; // some are added, never false because else we woudn't save it.
                    }
                    realTheme.AllLayers.forEach(layer => {
                        layer.enabled = false;  // lets disable all layers first
                    });
                    //lets check what we need to enable and set visiblity of, and also check what we don't find
                    theme.layers.forEach(layer => {
                        var realLayer = realTheme.AllLayers.find(x => x.title == layer.name);
                        if (realLayer) {
                            realLayer.visible = layer.visible; // aha so there was a layer, lets save this
                            realLayer.enabled = true;
                        }
                        else {
                            errorMessages.push('"' + layer.name + '" not found in mapserver: ' + realTheme.Naam + '.');
                        }
                    });
                });
                project.themes.forEach(theme => { // lets order them, since we get themesArray filled by async calls, the order can be wrong, thats why we make an ordered array
                    var realTheme = themesArray.find(x => x.CleanUrl == theme.cleanUrl);
                    orderedArray.unshift(realTheme);
                });
                ThemeService.AddAndUpdateThemes(orderedArray);
                console.log('all loaded');
                if (errorMessages.length > 0) {
                    alert(errorMessages.join('\n'));
                }
            });

        };
        _externService.setExtent = function (extent) {
            map.fitBounds([[extent._northEast.lat, extent._northEast.lng], [extent._southWest.lat, extent._southWest.lng]]);
        };
        _externService.CleanMapAndThemes = function () {
            MapData.CleanMap();
            ThemeService.CleanThemes();
        };


        return _externService;
    };
    module.$inject = ['MapData', 'map', 'GISService', 'ThemeCreater', 'WMSService', 'ThemeService', '$q'];
    module.factory('ExternService', externService);
})();
