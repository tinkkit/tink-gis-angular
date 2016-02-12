'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function ($http, map, ThemeHelper, $q) {
        var _mapService = {};
        _mapService.VisibleLayers = [];
        _mapService.VisibleLayers.push({ id: -1, name: 'Alle Layers' });
        _mapService.SelectableLayers = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.getLayerUrls = ['http://app10.p.gis.local/arcgissql/rest/services/P_Stedenbouw/stad/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_GeoService/operationallayers/MapServer/?f=pjson'];
        _mapService.Themes = [];


        var loadAllLayers = function () { // dit moet met HTTP en ergens op een andere service ofzo vervangen worden later wnnr dit geimplementeerd moet worden.
            let promises = [];
            _.each(_mapService.getLayerUrls, function (layerurl) {
                var prom = $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                    var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                    _mapService.Themes.push(convertedTheme);
                    _.each(convertedTheme.GetAllLayers(), function (layer) {
                        _mapService.VisibleLayers.push(layer);
                    });
                    // _mapService.SelectableLayers = _mapService.SelectableLayers.concat(convertedTheme.AllLayers);
                });
                promises.push(prom);
            });
            $q.all(promises).then((values) => {
                console.log(values); // value gamma
                // console.log(_mapService.SelectableLayers); // value gamma
                console.log("Alle mappen geladen");
            });

        };
        loadAllLayers();
        _mapService.Identify = function (event, selectedLayer, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 2; }
            _.each(_mapService.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var layersVoorIdentify = "";
                var identifOnThisTheme = true;
                if (typeof selectedLayer === 'undefined' || selectedLayer == null) {
                    // geen selected layer oke dan qryen we voor alle vis layers
                    layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                }
                else {
                    // well selected layer, eerst zeker zijn dat deze hierbij hoort.
                    if (selectedLayer.id === -1) {
                        layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                    }
                    else {
                        if (selectedLayer.theme == theme) {
                            layersVoorIdentify = 'visible: ' + selectedLayer.id;
                        } else {
                            identifOnThisTheme = false; //overslaan het is een select van maar 1 laag en de laag is niet op deze theme
                        }
                    }
                }
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                        for (var x = 0; x < featureCollection.features.length; x++) {
                            var featureItem = featureCollection.features[x];
                            var myStyle = {
                                "fillOpacity": 0
                            };
                            _mapService.JsonFeatures.push(featureItem);
                            console.log(_mapService.JsonFeatures);
                            var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                            _mapService.VisibleFeatures.push(mapItem);
                        }
                    });
                }

            });
        };


        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            console.log(!layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1) {
                    theme.VisibleLayers.push(layer);
                    _mapService.VisibleLayers.push(layer);
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    var indexOfLayerInVisibleLayersOfMap = _mapService.VisibleLayers.indexOf(layer);
                    _mapService.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                }
            }
            theme.RecalculateVisibleLayerIds();
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
    module.$inject = ['$http', 'map', 'ThemeHelper', '$q'];
    module.factory('MapService', mapService);
})();
