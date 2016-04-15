'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function (map, ThemeHelper, MapData, LayerManagementService, $rootScope, DataService) {
        var _service = {};
        _service.AddAndUpdateThemes = function (themesBatch) {
            console.log("Themes batch for add and updates...");
            console.log(themesBatch);
            console.log("...");
            themesBatch.forEach(theme => {
                var existingTheme = MapData.Themes.find(x => { return x.CleanUrl == theme.CleanUrl });
                console.log(theme);
                console.log(theme.status);
                switch (theme.status) {
                    case ThemeStatus.NEW:
                        if (theme.Type == ThemeType.ESRI) {
                            LayerManagementService.SetAditionalLayerInfo(theme);
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
                        console.log("Er is iets fout, status niet bekend!!!: " + theme.status);
                        break;
                }
                //Theme is proccessed, now make it unmodified again
                theme.status = ThemeStatus.UNMODIFIED;


            });
            DataService.Export();
            console.log("regfresh of sortableThemes");
            $("#sortableThemes").sortable("refresh");

            MapData.SetZIndexes();
        };
        _service.UpdateThemeVisibleLayers = function (theme) {
            theme.UpdateMap();
        };
        _service.UpdateTheme = function (updatedTheme, existingTheme) {
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
                }
                else {
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
            };
            existingTheme.RecalculateVisibleLayerIds();
        };
        _service.AddNewTheme = function (theme) {
            MapData.Themes.unshift(theme)

            _.each(theme.AllLayers, function (layer) {
                if (layer.enabled && layer.visible && layer.type === LayerType.LAYER) {
                    console.log(layer.id);
                    theme.VisibleLayers.push(layer);
                    if (theme.Type == ThemeType.ESRI) {
                        MapData.VisibleLayers.push(layer);
                    }
                }

            });
            theme.RecalculateVisibleLayerIds();

            switch (theme.Type) {
                case ThemeType.ESRI:
                    theme.MapData = L.esri.digiDynamicMapLayer({
                        maxZoom: 20,
                        minZoom: 1,
                        url: theme.CleanUrl,
                        opacity: 1,
                        layers: theme.VisibleLayerIds,
                        continuousWorld: true,
                        useCors: true
                    }).addTo(map);

                    // theme.MapData = L.esri.tiledMapLayer({
                    //     url: theme.CleanUrl,
                    //     layers: theme.VisibleLayerIds,
                    //     useCors: true
                    // }).addTo(map);
                    theme.MapData.on('load', function (e) {
                        // console.log(MapData.Zindex);
                        // console.log("Load Fired for " + theme.Naam);
                        if (theme.MapData._currentImage) {
                            theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log("Zindex on " + theme.Naam + " set to " + theme.MapData.ZIndex);
                        }
                    });
                    // theme.MapData.on('loading', function(e) {
                    //     console.log('loading ' + theme.Naam);
                    // });
                    // theme.MapData.on('requeststart', function(obj) {
                    //     MapData.Loading++;
                    //     console.log(MapData.Loading + 'requeststart ' + theme.Naam);
                    //     $rootScope.$apply();


                    // });
                    // theme.MapData.on('requestend', function(obj) {
                    //     if (MapData.Loading > 0) {
                    //         MapData.Loading--;
                    //     }
                    //     console.log(MapData.Loading + 'requestend ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    break;
                case ThemeType.WMS:
                    theme.MapData = L.tileLayer.betterWms(theme.CleanUrl, {
                        maxZoom: 20,
                        minZoom: 1,
                        format: 'image/png',
                        layers: theme.VisibleLayerIds,
                        transparent: true,
                        continuousWorld: true,
                        useCors: true
                    }).addTo(map);
                    // theme.MapData.on('tileloadstart', function(obj) {
                    //     MapData.Loading++;
                    //     console.log(MapData.Loading + 'tileloadstart ' + theme.Naam);
                    //     $rootScope.$apply();


                    // });
                    // theme.MapData.on('tileerror', function(obj) {
                    //     // if (MapData.Loading > 0) {
                    //         MapData.Loading--;
                    //     // }
                    //     console.log('!!!!!!!!! ' + MapData.Loading + 'tileerror ' + theme.Naam);
                    //     $rootScope.$apply();


                    // });
                    // theme.MapData.on('tileload', function(obj) {
                    //     // if (MapData.Loading > 0) {
                    //         MapData.Loading--;
                    //     // }
                    //     console.log(MapData.Loading + 'tileload ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    theme.MapData.on('load', function (e) {
                        console.log("LOAD VAN " + theme.Naam);
                        console.log(theme.MapData);
                        if (theme.MapData._tileContainer.children) {
                            [].slice.call(theme.MapData._tileContainer.childNodes).forEach(imgNode => {
                                imgNode.style.zIndex = theme.MapData.ZIndex;
                            });
                            // theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log("Zindex on " + theme.Naam + " set to " + theme.MapData.ZIndex);
                        }
                    });
                    break;
                default:
                    console.log("UNKNOW TYPE");
                    break;
            }

            // _mapService.UpdateThemeVisibleLayers(theme);


        };
        _service.DeleteTheme = function (theme) {
            // theme.MapData.removeFrom(map);
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



        return _service;
    };
    module.$inject = ['map', 'ThemeHelper', 'MapData', 'LayerManagementService', '$rootScope', 'DataService'];
    module.factory('ThemeService', service);
})();
