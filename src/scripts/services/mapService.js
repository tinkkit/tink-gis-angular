'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function ($rootScope, MapData, map, ThemeHelper, $q, GISService, WMSService, ResultsData) {
        var _mapService = {};
        _mapService.Identify = function (event, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 10; }
            _.each(MapData.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                if (identifOnThisTheme) {
                    switch (theme.Type) {
                        case ThemeType.ESRI:
                            var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                            ResultsData.Loading++;
                            theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                                ResultsData.Loading--;
                                MapData.AddFeatures(featureCollection, theme);
                            });
                            break;
                        case ThemeType.WMS:
                            var layersVoorIdentify = theme.VisibleLayerIds;
                            theme.VisibleLayers.forEach(lay => {
                                console.log(lay);
                                if (lay.queryable == true) {

                                    ResultsData.Loading++;
                                    theme.MapData.getFeatureInfo(event.latlng, lay.name).success(function (data, status, xhr) {
                                        ResultsData.Loading--;
                                        console.log("minus");
                                        var xmlstring = JXON.xmlToString(data);
                                        var returnjson = JXON.stringToJs(xmlstring);
                                        var processedjson = null;
                                        if (returnjson.featureinforesponse) {
                                            processedjson = returnjson.featureinforesponse.fields;
                                        }
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
                                                    layerName: lay.name,
                                                    name: lay.name,
                                                    layerId: lay.name,
                                                    properties: feat,
                                                    type: "Feature"
                                                }
                                                returnitem.features.push(tmpitem);
                                            });
                                            console.log(lay.name + " item info: ");
                                            console.log(returnitem);
                                            MapData.AddFeatures(returnitem, theme);
                                        }
                                        else {
                                            // we must still apply for the loading to get updated
                                            $rootScope.$apply();
                                        }

                                    });
                                }

                            });
                            break;
                        default:
                            console.log("UNKNOW TYPE!!!!:");
                            console.log(Theme.Type);
                            break;
                    }
                }


            });
        };

        _mapService.Select = function (event) {
            if (MapData.SelectedLayer.id == '') { // alle layers selected
                MapData.Themes.filter(x => x.Type == ThemeType.ESRI).forEach(theme => { // dus doen we de qry op alle lagen.
                    ResultsData.Loading++;
                    theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + theme.VisibleLayerIds).run(function (error, featureCollection) {
                        ResultsData.Loading--;
                        MapData.AddFeatures(featureCollection, theme);

                    });
                });
            }
            else {
                ResultsData.Loading++;
                MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function (error, featureCollection) {
                    ResultsData.Loading--;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme);

                });
            }

        };
        _mapService.WatIsHier = function (event) {
            GISService.ReverseGeocode(event);
        };

        _mapService.Query = function (event) {
            if (MapData.SelectedLayer.id == '') { // alle layers selected
                MapData.Themes.forEach(theme => { // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(lay => {
                            ResultsData.Loading++;
                            theme.MapData.query()
                                .layer(lay.id)
                                .intersects(event.layer)
                                .run(function (error, featureCollection, response) {
                                    ResultsData.Loading--;
                                    MapData.AddFeatures(featureCollection, theme, lay.id);
                                });
                        });
                    }
                });
            }
            else {
                ResultsData.Loading++;
                MapData.SelectedLayer.theme.MapData.query()
                    .layer(MapData.SelectedLayer.id)
                    .intersects(event.layer)
                    .run(function (error, featureCollection, response) {
                        ResultsData.Loading--;
                        MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme, MapData.SelectedLayer.id);
                    });
            }
        };
        _mapService.UpdateThemeStatus = function (theme) {
            _.each(theme.Groups, function (layerGroup) {
                _mapService.UpdateGroupLayerStatus(layerGroup, theme);
            });
            _.each(theme.Layers, function (layer) {
                _mapService.UpdateLayerStatus(layer, theme);
            });

        };
        _mapService.UpdateGroupLayerStatus = function (groupLayer, theme) {
            _.each(groupLayer.Layers, function (childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };

        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1 && layer.enabled) { // alleen maar toevoegen wnnr layer enabled en niet aanwezig al in de array!
                    theme.VisibleLayers.push(layer);
                    if (theme.Type == ThemeType.ESRI) {
                        MapData.VisibleLayers.push(layer);
                    }
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    if (theme.Type == ThemeType.ESRI) {
                        var indexOfLayerInVisibleLayersOfMap = MapData.VisibleLayers.indexOf(layer);
                        MapData.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                    }
                }
            }
        };
        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeHelper', '$q', 'GISService', 'WMSService', 'ResultsData'];
    module.factory('MapService', mapService);
})();


