'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function($rootScope, MapData, map, ThemeCreater, $q, GISService, ResultsData, GisHelperService, PopupService) {
        var _mapService = {};
        _mapService.MaxFeatures = 1000;
        _mapService.getJsonFromXML = function(data) {
            var json = null;
            if (typeof data != "string") {
                data = JXON.xmlToString(data); // only if not yet string
            }
            data = data.replace(/wfs:/g, '');
            data = data.replace(/gml:/g, '');
            data = data.replace(/dsi:/g, '');
            var returnjson = JXON.stringToJs(data);
            if (returnjson.featureinforesponse) {
                json = returnjson.featureinforesponse.fields;
            }
            if (returnjson.featurecollection){
                
                var test = JSON.stringify(returnjson.featurecollection.featuremember);
                // json = returnjson.featurecollection.featuremember;
                for (var key in returnjson.featurecollection.featuremember){
                    json = returnjson.featurecollection.featuremember[key];
                }
            }
            return json;
        }
        _mapService.getJsonFromPlain = function(data) {
            var json = null;
            var splittedtext = data.trim().split("--------------------------------------------");
            var contenttext = null;
            if (splittedtext.length >= 2) {
                contenttext = splittedtext[1];
                var splittedcontent = contenttext.trim().split(/\n|\r/g);
                if (splittedcontent.length > 0) { //more then 0 lines so lets make an object from the json
                    json = {};
                }
                splittedcontent.forEach(line => {
                    var splittedline = line.split("=");
                    json[splittedline[0].trim()] = splittedline[1].trim()
                })
            }
            return json;
        }
        _mapService.Identify = function(event, tolerance) {
            MapData.CleanSearch();
            if (typeof tolerance === 'undefined') { tolerance = 3; }
            _.each(MapData.Themes, function(theme) {
                // theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                // if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                if (theme.VisibleLayerIds.length === 0 || (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1)) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                if (identifOnThisTheme) {
                    switch (theme.Type) {
                        case ThemeType.ESRI:
                            var visanddisplayedlayers = theme.VisibleAndDisplayedLayerIds;
                            var layersVoorIdentify = 'all:' + visanddisplayedlayers;
                            if(visanddisplayedlayers.length == 0) {
                                layersVoorIdentify = 'visible:-1';
                            }
                            ResultsData.RequestStarted++;
                            theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function(error, featureCollection) {
                                ResultsData.RequestCompleted++;
                                MapData.AddFeatures(featureCollection, theme);

                            });
                            break;
                        case ThemeType.WMS:
                            var layersVoorIdentify = theme.VisibleLayerIds;
                            theme.VisibleLayers.forEach(lay => {
                                console.log(lay);
                                if (lay.queryable == true) {

                                    ResultsData.RequestStarted++;
                                    theme.MapData.getFeatureInfo(event.latlng, lay.name, theme.GetFeatureInfoType).then(function(data, status, xhr) {
                                        if (data) {
                                            data = GisHelperService.UnwrapProxiedData(data);
                                        }
                                        ResultsData.RequestCompleted++;
                                        var processedjson = null;
                                        switch (theme.GetFeatureInfoType) {
                                            case "text/xml":
                                                processedjson = _mapService.getJsonFromXML(data);
                                                break;
                                            case "text/plain":
                                                processedjson = _mapService.getJsonFromPlain(data);
                                                break;
                                            default:
                                                break;
                                        }

                                        var returnitem = {
                                            type: 'FeatureCollection',
                                            features: []
                                        };
                                        if (processedjson) {
                                            var featureArr = [];
                                            if (typeof processedjson === 'object') {
                                                featureArr.push(processedjson);
                                            } else {
                                                featureArr = processedjson;
                                            }

                                            featureArr.forEach(feat => {
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
                                            $rootScope.$applyAsync();
                                        }
                                    }).then(function(exception) {
                                        ResultsData.RequestCompleted++;

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

            _.each(MapData.QueryLayers, function(queryLayer) {
                if (queryLayer.theme.MapData) {
                    var visanddisplayedlayers = queryLayer.layer.layerId;
                    var layersVoorIdentify = 'all:' + visanddisplayedlayers;
                    
                    ResultsData.RequestStarted++;

                    queryLayer.theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function(error, featureCollection) {
                        ResultsData.RequestCompleted++;
                        MapData.AddFeatures(featureCollection, queryLayer.theme);
                    });
                }
            });

        };
        _mapService.IdentifyProm = function(theme, latlng, layerids) {

            var promise = new Promise(
                function(resolve, reject) {
                    ResultsData.RequestStarted++;
                    theme.MapData.identify()
                        .on(map)
                        .layers('visible: ' + layerids)
                        .at(latlng)
                        .run(function(error, featureCollection, response) {
                            ResultsData.RequestCompleted++;
                            resolve({ error, featureCollection, response });
                        });
                });
            return promise;
        };
        _mapService.Select = function(event) {
            // MapData.CleanSearch();
            console.log(event);
            if (MapData.SelectedLayer.id === '') { // alle layers selected
                var allproms = [];
                MapData.Themes.filter(x => x.Type == ThemeType.ESRI).forEach(theme => { // dus doen we de qry op alle lagen.
                    if (theme.VisibleLayerIds.length !== 0 && theme.VisibleLayerIds[0] !== -1) {
                        // ResultsData.RequestStarted++;
                        var prom = _mapService.IdentifyProm(theme, event.latlng, theme.VisibleLayerIds);
                        allproms.push(prom); -
                        prom.then(function(arg) {
                            MapData.AddFeatures(arg.featureCollection, theme);
                        });
                    }
                });
                if (MapData.ExtendedType != null) {
                    Promise.all(allproms).then(function AcceptHandler(results) {
                        MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                        MapData.processedFeatureArray = [];

                    });
                }

            } else {
                ResultsData.RequestStarted++;
                MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function(error, featureCollection) {
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme);
                    if (MapData.ExtendedType != null) {
                        MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                        MapData.processedFeatureArray = [];
                    }
                });
                
            }

            _.each(MapData.QueryLayers, function(queryLayer) {
                if (queryLayer.theme.MapData) {
                    var visanddisplayedlayers = queryLayer.layer.layerId;
                    var layersVoorIdentify = 'all:' + visanddisplayedlayers;
                    
                    ResultsData.RequestStarted++;
                    queryLayer.theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).run(function(error, featureCollection) {
                        ResultsData.RequestCompleted++;
                        MapData.AddFeatures(featureCollection, queryLayer.theme);
                    });
                }
            });

        };
        _mapService.LayerQuery = function(theme, layerid, geometry) {

            var promise = new Promise(
                function(resolve, reject) {
                    ResultsData.RequestStarted++;
                    if(geometry.mapItem != undefined) 
                    {
                        geometry = geometry.mapItem;
                    }
                    theme.MapDataWithCors.query()
                        .layer(layerid)
                        .intersects(geometry)
                        .run(function(error, featureCollection, response) {
                            ResultsData.RequestCompleted++;
                            if (featureCollection) {
                                validateFeatureCollectionGeometry(featureCollection.features);
                            }
                            resolve({ error, featureCollection, response });
                        });
                });
            return promise;
        };

        var validateFeatureCollectionGeometry = function(features) {
            if (_mapService.MaxFeatures >= features.length) { //This might not be necessary as I added 'toFixed(8)' when converting coordinates
                for (let index = 0; index < features.length; index++) {
                    const element = features[index];
                    if (element.geometry == null && element.properties.X != null && element.properties.Y != null) {
                        const search = element.properties.X.toFixed(8) + "," + element.properties.Y.toFixed(8);
                        var lambertCheck = GisHelperService.getLambartCordsFromString(search);
                        var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84({
                        x: lambertCheck.x,
                        y: lambertCheck.y
                        });
                        element.geometry = { coordinates: [xyWGS84.y, xyWGS84.x],
                                        type: "Point"};
                    }                                
                }
            }
            
        }

        _mapService.LayerQueryCount = function(theme, layerid, geometry) {
            var promise = new Promise(
                function(resolve, reject) {
                    ResultsData.RequestStarted++;
                    theme.MapDataWithCors.query()
                        .layer(layerid)
                        .intersects(geometry)
                        .count(function(error, count, response) {
                            ResultsData.RequestCompleted++;
                            resolve({ error, count, response });
                        });
                });
            return promise;
        };

        _mapService.AdvancedQueryCount = function(theme, layerid, query) {
            var promise = new Promise(
                function(resolve, reject) {
                    ResultsData.RequestStarted++;
                    theme.MapData.query()
                        .layer(layerid)
                        .where(query)
                        .count(function(error, count, response) {
                            ResultsData.RequestCompleted++;
                            resolve({ error, count, response });
                        });
                });
            return promise;
        }

        _mapService.AdvancedLayerQuery = function (theme, layerid, query) {
            var promise = new Promise(
                function(resolve, reject) {
                    ResultsData.RequestStarted++;
                    theme.MapData.query()
                        .layer(layerid)
                        .where(query)
                        .run(function(error, featureCollection, response) {
                            ResultsData.RequestCompleted++;
                            if (featureCollection != null) {
                                validateFeatureCollectionGeometry(featureCollection.features);
                            }
                            resolve({ error, featureCollection, response });
                        });
                });
            return promise;
        }

        _mapService.AdvancedQuery = function(layer, query) {
            if (!layer) {
                PopupService.Warning("Geen geldige laag", "Kon geen laag vinden om in te zoeken");
            } else {
                var prom = _mapService.AdvancedQueryCount(layer.theme, layer.id, query);
                prom.then(function(arg) {
                    if (arg.count > _mapService.MaxFeatures) {
                        PopupService.Warning("U selecteerde " + arg.count + " resultaten.", "Bij meer dan " + _mapService.MaxFeatures + " resultaten kan het laden wat langer duren en zijn de resultaten niet zichtbaar op de kaart en in de lijst. Exporteren naar CSV blijft mogelijk.");
                    }
                    var prom = _mapService.AdvancedLayerQuery(layer.theme, layer.id, query);
                        prom.then(function(arg) {
                            if (arg.error == undefined){
                                MapData.AddFeatures(arg.featureCollection, layer.theme, layer.id, arg.featureCollection.length);
                                if (MapData.ExtendedType != null) {
                                    MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                                    MapData.processedFeatureArray = [];
                                }
                            } else {
                                PopupService.ErrorWithException("Fout bij het uitvoeren van de query", "Code: " + arg.error.error.code + "<br/>Message:" +arg.error.error.message + "<br/>Bent u zeker dat u een geldige query opstelde?<br/>");
                            }
                        });
                });
            }
        }

        _mapService.AutoCompleteQuery = function(layer, field, query) {
            if (!layer) {
                PopupService.Warning("Geen geldige laag", "Kon geen laag vinden om in te zoeken");
            } else {
                if (!field) {
                    PopupService.Warning("Geen veld van laag geselecteerd", "Selecteer een veld om autocomplete te kunnen starten");
                } else {
                    var promise = new Promise(
                        function(resolve, reject) {
                            ResultsData.RequestStarted++;
                            layer.theme.MapData.query()
                                .layer(layer.id)
                                .where(query)
                                .returnGeometry(false)
                                .fields(field.name)
                                .distinct()
                                .run(function(error, featureCollection, response) {
                                    ResultsData.RequestCompleted++;
                                    resolve({ error, featureCollection, response });
                                });
                        });
                        console.log(promise);
                    return promise;
                }
            }
        }

        _mapService.startAutoComplete = function(layer, field, query) {
            return this.AutoCompleteQuery(layer, field, query);
        }

        _mapService.Query = function(box, layer) {
            if (!layer) {
                layer = MapData.SelectedLayer;
            }
            if (!layer || layer.id === '') { // alle layers selected
                var featureCount = 0;
                var allcountproms = [];
                MapData.Themes.forEach(theme => { // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(lay => {
                            var layerCountProm = _mapService.LayerQueryCount(theme, lay.id, box);
                            layerCountProm.then(function(arg) {
                                featureCount += arg.count;
                            });
                            allcountproms.push(layerCountProm);
                        });
                    }
                });
                Promise.all(allcountproms).then(function AcceptHandler(results) {
                    console.log(results, featureCount);
                    if (featureCount > _mapService.MaxFeatures) {
                        PopupService.Warning("U selecteerde " + featureCount + " resultaten.", "Bij meer dan " + _mapService.MaxFeatures + " resultaten kan het laden wat langer duren en zijn de resultaten niet zichtbaar op de kaart en in de lijst. Exporteren naar CSV blijft mogelijk.");
                    }
                    var allproms = [];
                        MapData.Themes.forEach(theme => { // dus doen we de qry op alle lagen.
                            if (theme.Type === ThemeType.ESRI) {
                                theme.VisibleLayers.forEach(lay => {
                                    var prom = _mapService.LayerQuery(theme, lay.id, box);
                                    allproms.push(prom);
                                    prom.then(function(arg) {
                                        MapData.AddFeatures(arg.featureCollection, theme, lay.id, featureCount);
                                    });

                                });
                            }
                        });
                        if (MapData.ExtendedType != null) {
                            Promise.all(allproms).then(function AcceptHandler(results) {
                                MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                                MapData.processedFeatureArray = [];

                            });
                        }
                });
                

            } else {
                var prom = _mapService.LayerQueryCount(layer.theme, layer.id, box);
                prom.then(function(arg) {
                    if (arg.count > _mapService.MaxFeatures) {
                        PopupService.Warning("U selecteerde " + arg.count + " resultaten.", "Bij meer dan " + _mapService.MaxFeatures + " resultaten kan het laden wat langer duren en zijn de resultaten niet zichtbaar op de kaart en in de lijst. Exporteren naar CSV blijft mogelijk.");
                    }
                    var prom = _mapService.LayerQuery(layer.theme, layer.id, box);
                        prom.then(function(arg) {
                            MapData.AddFeatures(arg.featureCollection, layer.theme, layer.id, arg.featureCollection.length);
                            if (MapData.ExtendedType != null) {
                                MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                                MapData.processedFeatureArray = [];
                            }
                        });
                });

            }

            _.each(MapData.QueryLayers, function(queryLayer) {
                if (queryLayer.theme && queryLayer.theme.Type == ThemeType.ESRI)
                {
                    var prom = new Promise(
                        function(resolve, reject) {
                            ResultsData.RequestStarted++;
                            if (box.mapItem != undefined)
                            {
                                box = box.mapItem;
                            }

                            queryLayer.layer.mapData.query()
                                .where(queryLayer.layer.mapData.options.where)
                                .layer(queryLayer.layer.layerId)
                                .intersects(box)
                                .run(function(error, featureCollection, response) {
                                    ResultsData.RequestCompleted++;
                                    resolve({ error, featureCollection, response });
                                });
                        }
                    )

                    prom.then(function(arg) {
                            MapData.AddFeatures(arg.featureCollection, queryLayer.theme, queryLayer.layer.layerId, arg.featureCollection.length);
                        });
                }
            });

        };
        _mapService.WatIsHier = function(event) {
            var prom = GISService.ReverseGeocode(event);
            prom.success(function(data, status, headers, config) {
                MapData.CleanWatIsHier();
                if (data.length > 0) {
                    var converted = GisHelperService.ConvertLambert72ToWSG84(data[0].xy);
                    MapData.CreateDot(converted);
                    MapData.CreateOrigineleMarker(event.latlng, true, data[0].straatnm.split('_')[0] + ' ' + data[0].huisnr + ' (' + data[0].postcode + ' ' + data[0].district + ')');
                } else {
                    MapData.CreateOrigineleMarker(event.latlng, false);
                }
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        };
        //"Lro_Stad"
        //percelen
        //CAPAKEY
        //11810K1905/00B002
        //.FindAdvanced("Lro_Stad", "percelen", "CAPAKEY", "11810K1905/00B002");
        _mapService.FindAdvanced = function(themeName, layerName, field, parameter) {
            var prom = $q.defer();
            var theme = MapData.Themes.find(x => x.Naam == themeName);
            if (!theme) {
                throw "No loaded theme found with the name: " + themeName;
            }
            var layer = theme.AllLayers.find(x => x.name == layerName);
            if (!layer) {
                throw "No layer found with the name: " + layerName + " on the theme with name: " + themeName;
            }
            ResultsData.RequestStarted++;
            theme.MapData.find()
                .fields(field)
                .layers(layer.id)
                .text(parameter)
                .run(function(error, featureCollection, response) {
                    if (error) {
                        prom.reject(error);
                    } else {
                        prom.resolve(featureCollection, response);
                        ResultsData.RequestCompleted++;
                        MapData.AddFeatures(featureCollection, theme, layer.id);
                    }
                });
            return prom.promise;
        }
        _mapService.Find = function(query) {
            MapData.CleanSearch();
            if (MapData.SelectedFindLayer && MapData.SelectedFindLayer.id === '') { // alle layers selected
                MapData.Themes.forEach(theme => { // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(lay => {
                            ResultsData.RequestStarted++;
                            theme.MapData.find()
                                .fields(lay.displayField)
                                .layers(lay.id)
                                .text(query)
                                .run(function(error, featureCollection, response) {
                                    ResultsData.RequestCompleted++;
                                    MapData.AddFeatures(featureCollection, theme, lay.id);
                                });
                        });
                    }
                });
            } else {
                ResultsData.RequestStarted++;
                MapData.SelectedFindLayer.theme.MapData.find()
                    .fields(MapData.SelectedFindLayer.displayField)
                    .layers(MapData.SelectedFindLayer.id)
                    .text(query)
                    .run(function(error, featureCollection, response) {
                        ResultsData.RequestCompleted++;
                        MapData.AddFeatures(featureCollection, MapData.SelectedFindLayer.theme, MapData.SelectedFindLayer.id);
                    });
            }
        };


        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeCreater', '$q', 'GISService', 'ResultsData', 'GisHelperService', 'PopupService'];
    module.factory('MapService', mapService);
})();