'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function mapService($rootScope, MapData, map, ThemeCreater, $q, GISService, ResultsData, HelperService) {
        var _mapService = {};
        _mapService.Identify = function (event, tolerance) {
            MapData.CleanSearch();
            if (typeof tolerance === 'undefined') {
                tolerance = 10;
            }
            _.each(MapData.Themes, function (theme) {
                // theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                if (identifOnThisTheme) {
                    switch (theme.Type) {
                        case ThemeType.ESRI:
                            var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                            ResultsData.RequestStarted++;
                            theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                                ResultsData.RequestCompleted++;
                                MapData.AddFeatures(featureCollection, theme);
                            });
                            break;
                        case ThemeType.WMS:
                            var layersVoorIdentify = theme.VisibleLayerIds;
                            theme.VisibleLayers.forEach(function (lay) {
                                console.log(lay);
                                if (lay.queryable == true) {

                                    ResultsData.RequestStarted++;
                                    theme.MapData.getFeatureInfo(event.latlng, lay.name).success(function (data, status, xhr) {
                                        data = HelperService.UnwrapProxiedData(data);
                                        ResultsData.RequestCompleted++;
                                        console.log('minus');
                                        // data = data.replace('<?xml version="1.0" encoding="UTF-8"?>', '').trim();
                                        // var xmlstring = JXON.xmlToString(data);
                                        var returnjson = JXON.stringToJs(data);
                                        var processedjson = null;
                                        if (returnjson.featureinforesponse) {
                                            processedjson = returnjson.featureinforesponse.fields;
                                        }
                                        var returnitem = {
                                            type: 'FeatureCollection',
                                            features: []
                                        };
                                        if (processedjson) {
                                            var featureArr = [];
                                            if ((typeof processedjson === 'undefined' ? 'undefined' : _typeof(processedjson)) === 'object') {
                                                featureArr.push(processedjson);
                                            } else {
                                                featureArr = processedjson;
                                            }

                                            featureArr.forEach(function (feat) {
                                                var tmpitem = {
                                                    layerName: lay.name,
                                                    name: lay.name,
                                                    layerId: lay.name,
                                                    properties: feat,
                                                    type: 'Feature'
                                                };
                                                returnitem.features.push(tmpitem);
                                            });
                                            console.log(lay.name + ' item info: ');
                                            console.log(returnitem);
                                            MapData.AddFeatures(returnitem, theme);
                                        } else {
                                            // we must still apply for the loading to get updated
                                            $rootScope.$apply();
                                        }
                                    });
                                }
                            });
                            break;
                        default:
                            console.log('UNKNOW TYPE!!!!:');
                            console.log(Theme.Type);
                            break;
                    }
                }
            });
        };

        _mapService.Select = function (event) {
            MapData.CleanSearch();
            console.log(event);
            if (MapData.SelectedLayer.id == '') {
                // alle layers selected
                MapData.Themes.filter(function (x) {
                    return x.Type == ThemeType.ESRI;
                }).forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    ResultsData.RequestStarted++;
                    theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + theme.VisibleLayerIds).run(function (error, featureCollection) {
                        ResultsData.RequestCompleted++;
                        MapData.AddFeatures(featureCollection, theme);
                    });
                });
            } else {
                ResultsData.RequestStarted++;
                MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function (error, featureCollection) {
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme);
                });
            }
        };
        _mapService.WatIsHier = function (event) {
            var prom = GISService.ReverseGeocode(event);
            prom.success(function (data, status, headers, config) {
                MapData.CleanWatIsHier();
                if (!data.error) {
                    var converted = HelperService.ConvertLambert72ToWSG84(data.location);
                    MapData.CreateDot(converted);
                    MapData.CreateOrigineleMarker(event.latlng, true, data.address.Street + ' (' + data.address.Postal + ')');
                } else {
                    MapData.CreateOrigineleMarker(event.latlng, false);
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        };

        _mapService.Query = function (box, layer) {
            MapData.CleanSearch();
            if (!layer) {
                layer = MapData.SelectedLayer;
            }
            if (!layer || layer.id == '') {
                // alle layers selected
                MapData.Themes.forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(function (lay) {
                            ResultsData.RequestStarted++;
                            theme.MapData.query().layer(lay.id).intersects(box).run(function (error, featureCollection, response) {
                                ResultsData.RequestCompleted++;
                                MapData.AddFeatures(featureCollection, theme, lay.id);
                            });
                        });
                    }
                });
            } else {
                ResultsData.RequestStarted++;
                layer.theme.MapData.query().layer(layer.id).intersects(box).run(function (error, featureCollection, response) {
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, layer.theme, layer.id);
                });
            }
        };

        _mapService.Find = function (query) {
            MapData.CleanSearch();
            if (MapData.SelectedLayer && MapData.SelectedLayer.id == '') {
                // alle layers selected
                MapData.Themes.forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(function (lay) {
                            ResultsData.RequestStarted++;
                            theme.MapData.find().fields(lay.displayField).layers(lay.id).text(query).run(function (error, featureCollection, response) {
                                ResultsData.RequestCompleted++;
                                MapData.AddFeatures(featureCollection, theme, lay.id);
                            });
                        });
                    }
                });
            } else {
                ResultsData.RequestStarted++;
                MapData.SelectedLayer.theme.MapData.find().fields(MapData.SelectedLayer.displayField).layers(MapData.SelectedLayer.id).text(query).run(function (error, featureCollection, response) {
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme, MapData.SelectedLayer.id);
                });
            }
        };

        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeCreater', '$q', 'GISService', 'ResultsData', 'HelperService'];
    module.factory('MapService', mapService);
})();
