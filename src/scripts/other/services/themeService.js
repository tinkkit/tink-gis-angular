'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(map, ThemeCreater, MapData, GISService, $q) {
        var _service = {};
        _service.AddAndUpdateThemes = function(themesBatch) {
            console.log('Themes batch for add and updates...');
            console.log(themesBatch);
            themesBatch.forEach(theme => {
                var existingTheme = MapData.Themes.find(x => { return x.cleanUrl == theme.cleanUrl });
                console.log('addorupdate or del theme, ', theme, theme.status);
                switch (theme.status) {
                    case ThemeStatus.NEW:
                        if (theme.Type == ThemeType.ESRI) {
                            GISService.GetAditionalLayerInfo(theme);
                            theme.UpdateDisplayed(MapData.GetScale());
                        }
                        _service.AddNewTheme(theme);
                        break;
                    case ThemeStatus.DELETED:
                        _service.DeleteTheme(existingTheme);
                        break;
                    case ThemeStatus.UNMODIFIED:
                        // niets doen niets veranderd!
                        break;
                    case ThemeStatus.UPDATED:
                        _service.UpdateTheme(theme, existingTheme);
                        _service.UpdateThemeVisibleLayers(existingTheme);
                        break;
                    default:
                        console.log('Er is iets fout, status niet bekend!!!: ' + theme.status);
                        break;
                }
                //Theme is proccessed, now make it unmodified again
                theme.status = ThemeStatus.UNMODIFIED;


            });
            // console.log('refresh of sortableThemes');
            $('#sortableThemes').sortable('refresh');

            MapData.SetZIndexes();
        };
        _service.UpdateThemeVisibleLayers = function(theme) {
            MapData.ResetVisibleLayers();
            theme.UpdateMap(map);
        };

        _service.updateQueryVisibility = function(index, showQuery) {
            let queryLayer = MapData.QueryLayers[index];
            if (queryLayer.showLayer === true)
            {
                map.addLayer(queryLayer.layer.mapData);
            } else {
                map.removeLayer(queryLayer.layer.mapData);
            }
        }
        _service.UpdateTheme = function(updatedTheme, existingTheme) {
            //lets update the existingTheme
            for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
                var updatedLayer = updatedTheme.AllLayers[x];
                var existingLayer = existingTheme.AllLayers[x];

                //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
                if (updatedLayer.enabled && updatedLayer.visible) {
                    //eerst checken dat ze nog niet bestaan!.
                    if (existingTheme.Type == ThemeType.ESRI && MapData.VisibleLayers.indexOf(existingLayer) == -1) {
                        MapData.VisibleLayers.push(existingLayer);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
                        existingTheme.VisibleLayers.push(existingLayer);
                    }
                } else {
                    //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
                    if (existingTheme.Type == ThemeType.ESRI && MapData.VisibleLayers.indexOf(existingLayer) != -1) {
                        MapData.VisibleLayers.splice(MapData.VisibleLayers.indexOf(existingLayer), 1);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) != -1) {
                        existingTheme.VisibleLayers.splice(existingTheme.VisibleLayers.indexOf(existingLayer), 1);
                    }
                }
                existingLayer.enabled = updatedLayer.enabled;
                existingLayer.visible = updatedLayer.visible;
            }
            // existingTheme.RecalculateVisibleLayerIds();
        };
        _service.AddNewTheme = function(theme) {
            MapData.Themes.unshift(theme);
            if (theme.Type == ThemeType.ESRI) {
                MapData.VisibleLayers = MapData.VisibleLayers.concat(theme.VisibleLayers)
            }
            switch (theme.Type) {
                case ThemeType.ESRI:
                    var visLayerIds = theme.VisibleLayerIds;
                    if (visLayerIds.length == 0) {
                        visLayerIds.push(-1);
                    }
                    if(theme.Opacity === null || theme.Opacity === undefined) {
                        theme.Opacity = 1;
                    }
                    theme.MapData = L.esri.dynamicMapLayer({
                        maxZoom: 20,
                        minZoom: 0,
                        url: theme.cleanUrl,
                        opacity: theme.Opacity,
                        layers: visLayerIds,
                        continuousWorld: true,
                        useCors: false,
                        f: 'image'
                    }).addTo(map);
                    // theme.SetOpacity(theme.Opacity);
                    theme.MapDataWithCors = L.esri.dynamicMapLayer({
                        maxZoom: 20,
                        minZoom: 0,
                        url: theme.cleanUrl,
                        opacity: 1,
                        layers: visLayerIds,
                        continuousWorld: true,
                        useCors: true,
                        f: 'image'
                    });
                    theme.MapData.on('authenticationrequired', function(e) {
                        debugger;
                        serverAuth(function(error, response) {
                            debugger;
                            e.authenticate(response.token);
                        });
                    });
                    theme.MapData.on('load', function(e) {
                        if (theme.MapData._currentImage) {
                            theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log('Zindex on ' + theme.Naam + ' set to ' + theme.MapData.ZIndex);
                        }
                    });

                    break;
                case ThemeType.WMS:
                    theme.MapData = L.tileLayer.betterWms(theme.cleanUrl, {
                        maxZoom: 20,
                        minZoom: 0,
                        format: 'image/png',
                        layers: theme.VisibleLayerIds.join(','),
                        transparent: true,
                        continuousWorld: true,
                        useCors: true
                    }).addTo(map);

                    theme.MapData.on('load', function(e) {
                        console.log('LOAD VAN ' + theme.Naam);
                        console.log(theme.MapData);
                        if (theme.MapData._container.childNodes) {
                            [].slice.call(theme.MapData._container.childNodes).forEach(imgNode => {
                                imgNode.style.zIndex = theme.MapData.ZIndex;
                            });
                            // theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log('Zindex on ' + theme.Naam + ' set to ' + theme.MapData.ZIndex);
                        }
                    });
                    break;
                default:
                    console.log('UNKNOW TYPE');
                    break;
            }
        };

        _service.AddQueryLayerFromImport = function(name, layerId, query, theme) {
            // only gets called from externservice.import ==> extra mapData object is necessary to use identify call on dynamicmaplayer, is not available on featurelayer
            theme.MapData = L.esri.dynamicMapLayer({
                maxZoom: 20,
                minZoom: 0,
                url: theme.cleanUrl,
                opacity: theme.Opacity,
                layers: layerId,
                continuousWorld: true,
                useCors: false,
                f: 'image'
            })
            _service.AddQueryLayer(name, layerId, query, theme);
        };

        _service.AddQueryLayer = function(name, layerId, query, theme) {
            let existingQueryLayer = MapData.QueryLayers.find(queryLayer => queryLayer.layer.baseUrl === theme.cleanUrl && queryLayer.layer.layerId === layerId);
            // currently only allowed to add 1 querylayer for a specific layer
            if (existingQueryLayer) {
                if (existingQueryLayer.layer.mapData) {
                    existingQueryLayer.layer.mapData.setWhere(query);
                    existingQueryLayer.layer.query = query;
                }
            } else {
                let queryLayer = {
                    layer: {
                        baseUrl: theme.cleanUrl,
                        name: name,
                        layerId: layerId,
                        query: query
                    },
                    showLayer: true
                };
    
                var promLegend = GISService.GetLegendData(queryLayer.layer.baseUrl);
                var promLayerInfo = GISService.GetLayerSpecification(queryLayer.layer.baseUrl + '/' + queryLayer.layer.layerId);

                var allpromises = $q.all([promLegend, promLayerInfo]);

                allpromises.then(function(data) {
                    var layerInfo = data[0].layers.find(x => x.layerId == layerId);
                    if (layerInfo && layerInfo.legend && layerInfo.legend[0]) {
                        var legendFullUrl =  `data:${layerInfo.legend[0].contentType};base64, ${layerInfo.legend[0].imageData}`;
                        queryLayer.layer.legendUrl = legendFullUrl;
                    }
                    var drawingSymbol = data[1].drawingInfo.renderer.symbol;

                    var fillColor = '';
                    var color = '';
                    var fill = false;
                    var weight = 1;
                    //check geometrytype to determine style
                    switch(data[1].geometryType) {
                        case 'esriGeometryPolyline':
                            color = _service.RGBToHex(drawingSymbol.color[0], drawingSymbol.color[1], drawingSymbol.color[2]);
                            weight = drawingSymbol.width;
                            break;
                        case 'esriGeometryPolygon':
                            fillColor = _service.RGBToHex(drawingSymbol.color[0], drawingSymbol.color[1], drawingSymbol.color[2]);
                            color = _service.RGBToHex(drawingSymbol.outline.color[0], drawingSymbol.outline.color[1], drawingSymbol.outline.color[2]);
                            fill = drawingSymbol.color[3] > 0 ? true : false;
                            weight = drawingSymbol.outline.width;
                            break;
                        default: 
                            break;
                    }

                    //determine polygon & polyline styling 
                    var style = {
                        color: color,
                        fill: fill,
                        weight: weight,
                        fillColor: fillColor,
                        fillOpacity: 1
                    };

                    queryLayer.layer.mapData = L.esri.featureLayer({
                        maxZoom: 20,
                        minZoom: 0,
                        url: queryLayer.layer.baseUrl + '/' + queryLayer.layer.layerId + '/query',
                        where: query,
                        continuousWorld: true,
                        useCors: false,
                        f: 'image',
                        style: (feature, layer) => {
                            //is used to style polygon and polyline
                            return style;
                        },
                        pointToLayer: (geoJson, latlng) => {
                            //is usesd to style points
                            return MapData.CreateFeatureLayerMarker(latlng, queryLayer.layer.legendUrl);
                        },
                    }).addTo(map);
        
                    queryLayer.theme = theme;
                    MapData.QueryLayers.push(queryLayer);
                });
            }
        }

        _service.DeleteQueryLayer = function (index) {
            if (index > -1) {
                let queryLayer = MapData.QueryLayers[index];
                if (queryLayer) {
                    map.removeLayer(queryLayer.layer.mapData);
                    MapData.QueryLayers.splice(index, 1);
                }
            }
        }

        _service.CleanThemes = function() {
            while (MapData.Themes.length != 0) {
                console.log('DELETING THIS THEME', MapData.Themes[0]);
                _service.DeleteTheme(MapData.Themes[0]);
            }
        };

        _service.DeleteTheme = function(theme) {
            map.removeLayer(theme.MapData); // this one works with ESRI And leaflet
            var themeIndex = MapData.Themes.indexOf(theme);
            if (themeIndex > -1) {
                MapData.Themes.splice(themeIndex, 1);
            }
            theme.VisibleLayers.forEach(visLayer => {
                var visLayerIndex = MapData.VisibleLayers.indexOf(visLayer);
                if (visLayerIndex > -1) {
                    MapData.VisibleLayers.splice(visLayerIndex, 1);
                }
            });
            MapData.CleanSearch();
        };

        _service.RGBToHex = function(red, green, blue) {
            return "#" + _service.ComponentToHex(red) + _service.ComponentToHex(green) + _service.ComponentToHex(blue);
        }

        _service.ComponentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }



        return _service;
    };
    module.$inject = ['map', 'ThemeCreater', 'MapData', 'GISService'];
    module.factory('ThemeService', service);
})();