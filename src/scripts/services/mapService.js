'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function($rootScope, MapData, map, ThemeHelper, $q, GISService, WMSService) {
        var _mapService = {};
        var getwms = WMSService.GetCapabilities('http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi');
        console.log(getwms);
        _mapService.Identify = function(event, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 2; }
            _.each(MapData.Themes, function(theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                else {
                    var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                }
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function(error, featureCollection) {
                        MapData.AddFeatures(featureCollection, theme);
                    });
                }
            });
        };

        _mapService.Select = function(event) {
            console.log(MapData.SelectedLayer);
            MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function(error, featureCollection) {
                MapData.AddFeatures(featureCollection);
            });
        };
        _mapService.WatIsHier = function(event) {
            GISService.ReverseGeocode(event);
        };

        _mapService.Query = function(event) {
            MapData.SelectedLayer.theme.MapData.query()
                .layer('visible: ' + MapData.SelectedLayer.id)
                .intersects(event.layer)
                .run(function(error, featureCollection, response) {
                    MapData.AddFeatures(featureCollection);
                });
        };
        _mapService.UpdateThemeStatus = function(theme) {
            _.each(theme.Groups, function(layerGroup) {
                _mapService.UpdateGroupLayerStatus(layerGroup, theme);
            });
            _.each(theme.Layers, function(layer) {
                _mapService.UpdateLayerStatus(layer, theme);
            });

        };
        _mapService.UpdateGroupLayerStatus = function(groupLayer, theme) {
            _.each(groupLayer.Layers, function(childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };

        _mapService.UpdateLayerStatus = function(layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1 && layer.enabled) { // alleen maar toevoegen wnnr layer enabled en niet aanwezig al in de array!
                    theme.VisibleLayers.push(layer);
                    MapData.VisibleLayers.push(layer);
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    var indexOfLayerInVisibleLayersOfMap = MapData.VisibleLayers.indexOf(layer);
                    MapData.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                }
            }
        };
        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeHelper', '$q', 'GISService', 'WMSService'];
    module.factory('MapService', mapService);
})();


