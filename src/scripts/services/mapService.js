'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function ($http, map) {
        var _mapService = {};
        _mapService.VisibleLayers = [];
        _mapService.jsonFeatures = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.getLayers = ['http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer?f=pjson', 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson'];
        _mapService.Themes = [];
        _.each(_mapService.getLayers, function (layerurl) {
            $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                _mapService.Themes.push(convertRawData(data, getdata));
            });
        });
        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayersIds.indexOf(layer.id);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1) {
                    theme.VisibleLayersIds.push(layer.id);
                    // theme.VisibleLayers.push(layer);
                    
                    _mapService.VisibleLayers.push(layer);
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayersIds.splice(indexOfLayerInVisibleLayers, 1);
                    // theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    var indexOfLayerInVisibleLayersOfMap = _mapService.VisibleLayers.indexOf(layer.id);
                    _mapService.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                }
            }
        };
        _mapService.UpdateGroupLayerStatus = function (groupLayer, theme) {
            _.each(groupLayer.Layers, function (childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };
        _mapService.UpdateThemeStatus = function (theme) {
            _.each(theme.Groups, function (layerGroup) {
                _mapService.UpdateGroupLayerStatus(layerGroup, theme);
            });
            _.each(theme.Layers, function (layer) {
                _mapService.UpdateLayerStatus(layer, theme);
            });
        };
        var convertRawData = function (rawdata, getdata) {
            var thema = {};
            var rawlayers = rawdata.layers;
            var cleanUrl = getdata.url.substring(0, getdata.url.indexOf('?'));
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.VisibleLayersIds = [-1];
            // thema.VisibleLayers = [-1];
            thema.Groups = [];
            thema.Visible = true;
            thema.MapData = L.esri.dynamicMapLayer({
                url: cleanUrl,
                opacity: 0.5,
                layers: thema.VisibleLayersIds,
                useCors: false
            }).addTo(map);
            _.each(rawlayers, function (x) {
                x.visible = false;
                x.parent = null;
                x.theme = thema;
                if (x.parentLayerId === -1) {
                    if (x.subLayerIds === null) {
                        thema.Layers.push(x);
                    } else {
                        thema.Groups.push(x);
                    }
                }
            });
            _.each(thema.Groups, function (layerGroup) {
                if (layerGroup.subLayerIds !== null) {
                    layerGroup.Layers = [];
                    _.each(rawlayers, function (rawlayer) {
                        if (layerGroup.id === rawlayer.parentLayerId) {
                            rawlayer.parent = layerGroup;
                            layerGroup.Layers.push(rawlayer);
                        }
                    });
                }
            });
            return thema;
        };
        return _mapService;
    };
    module.$inject = ['$http', 'map'];
    module.factory('MapService', mapService);
})();
