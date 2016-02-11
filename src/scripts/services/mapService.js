'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function ($http, map, ThemeHelper) {
        var _mapService = {};
        _mapService.VisibleLayers = [];
        _mapService.jsonFeatures = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.getLayers = ['http://geodata.antwerpen.be/ArcGISSql/rest/services/P_Stad/Mobiliteit/MapServer?f=pjson', 'http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer?f=pjson', 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson'];
        _mapService.Themes = [];
        _.each(_mapService.getLayers, function (layerurl) {
            $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                _mapService.Themes.push(ThemeHelper.createThemeFromJson(data, getdata));
            });
        });
        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayersIds.indexOf(layer.id);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1) {
                    theme.VisibleLayersIds.push(layer.id);
                    _mapService.VisibleLayers.push(layer);
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayersIds.splice(indexOfLayerInVisibleLayers, 1);
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
        return _mapService;
    };
    module.$inject = ['$http', 'map', 'ThemeHelper'];
    module.factory('MapService', mapService);
})();
