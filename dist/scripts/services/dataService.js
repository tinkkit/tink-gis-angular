'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var dataService = function dataService(MapData, map, GISService, ThemeHelper, WMSService, ThemeService, $q) {
        var _dataService = {};
        _dataService.Export = function () {
            var exportObject = {};
            var arr = MapData.Themes.map(function (theme) {
                var returnitem = {};
                returnitem.Naam = theme.Naam;
                returnitem.CleanUrl = theme.CleanUrl;
                returnitem.Type = theme.Type;
                returnitem.Visible = theme.Visible;
                returnitem.Layers = theme.AllLayers.filter(function (x) {
                    return x.enabled == true;
                }).map(function (layer) {
                    var returnlayer = {};
                    // returnlayer.enabled = layer.enabled; // will always be true... since we only export the enabled layers
                    returnlayer.visible = layer.visible;
                    returnlayer.name = layer.name;
                    returnlayer.id = layer.id;
                    return returnlayer;
                });
                return returnitem;
            });
            exportObject.Themes = arr;
            exportObject.Extent = map.getBounds();
            exportObject.IsKaart = true;

            return exportObject;
        };
        _dataService.Import = function (project) {
            console.log(project);
            _dataService.setExtent(project.extent);
            var themesArray = [];
            var promises = [];

            project.themes.forEach(function (theme) {
                if (theme.type == ThemeType.ESRI) {
                    var prom = GISService.GetThemeData(theme.cleanUrl + '?f=pjson');
                    promises.push(prom);
                    prom.success(function (data, statuscode, functie, getdata) {
                        themesArray.push(ThemeHelper.createThemeFromJson(data, getdata));
                    });
                } else {
                    // wms
                    var _prom = WMSService.GetCapabilities(theme.cleanUrl);
                    promises.push(_prom);
                    _prom.success(function (data, status, headers, config) {
                        themesArray.push(data);
                    }).error(function (data, status, headers, config) {
                        console.log('error!!!!!!!', data, status, headers, config);
                    });
                }
            });
            $q.all(promises).then(function () {
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
                            return x.name == layer.name;
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
                });
                ThemeService.AddAndUpdateThemes(orderedArray);
                console.log('all loaded');
                if (errorMessages.length > 0) {
                    alert(errorMessages.join('\n'));
                }
            });
        };
        _dataService.setExtent = function (extent) {

            map.fitBounds([[extent._northEast.lat, extent._northEast.lng], [extent._southWest.lat, extent._southWest.lng]]);
        };

        return _dataService;
    };
    module.$inject = ['MapData', 'map', 'GISService', 'ThemeHelper', 'WMSService', 'ThemeService', '$q'];
    module.factory('DataService', dataService);
})();
//# sourceMappingURL=dataService.js.map
