'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function($rootScope, MapData, map, ThemeHelper, $q, GISService, WMSService, ResultsData) {
        var _mapService = {};
        _mapService.Identify = function(event, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 10; }
            _.each(MapData.Themes, function(theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                if (identifOnThisTheme) {
                    switch (theme.Type) {
                        case ThemeType.ESRI:
                            var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                            theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function(error, featureCollection) {
                                console.log(featureCollection);
                                MapData.AddFeatures(featureCollection, theme);
                            });
                            break;
                        case ThemeType.WMS:
                            var layersVoorIdentify = theme.VisibleLayerIds;
                            theme.VisibleLayerIds.forEach(lay => {
                                theme.MapData.getFeatureInfo(event.latlng, lay).success(function(data, status, xhr) {
                                    var xmlstring = JXON.xmlToString(data);
                                    var returnjson = JXON.stringToJs(xmlstring);
                                    var processedjson = returnjson.featureinforesponse.fields;
                                    var returnitem = {
                                        type: "FeatureCollection",
                                        features: []
                                    }
                                    if (processedjson) {
                                        var featureArr = [];
                                        if (typeof processedjson === "object") {
                                            featureArr.push(processedjson)
                                        } else {
                                            featureArr = processedjson;
                                        }

                                        featureArr.forEach(feat => {
                                            var tmpitem = {
                                                layerName: lay,
                                                name: lay,
                                                layerId: lay,
                                                properties: feat,
                                                type: "Feature"
                                            }
                                            returnitem.features.push(tmpitem);
                                        });
                                        console.log(lay + " item info: ");
                                        console.log(returnitem);
                                        MapData.AddFeatures(returnitem, theme);
                                    }

                                });
                            });
                            // theme.MapData.getFeatureInfo(event.latlng, layersVoorIdentify).success(function(data, status, xhr) {
                            //     console.log(data);
                            //     var xmlstring = JXON.xmlToString(data);
                            //     var returnjson = JXON.stringToJs(xmlstring);
                            //     console.log(returnjson);
                            //     // var processedjson = returnjson.featureinforesponse.fields;
                            //     // var featureArr = [];
                            //     // if (typeof processedjson === Object) {
                            //     //     featureArr.push(processedjson)
                            //     // } else {
                            //     //     featureArr = processedjson;
                            //     // }
                            //     // console.log(processedjson);
                            // });

                            break;
                        default:
                            console.log("UNKNOW TYPE!!!!:");
                            console.log(Theme.Type);
                            break;
                    }
                }


            });
        };

        _mapService.Select = function(event) {
            ResultsData.Loading = true;
            console.log(MapData.SelectedLayer);
            MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function(error, featureCollection) {
                MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme);
                ResultsData.Loading = false;

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
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeHelper', '$q', 'GISService', 'WMSService', 'ResultsData'];
    module.factory('MapService', mapService);
})();


