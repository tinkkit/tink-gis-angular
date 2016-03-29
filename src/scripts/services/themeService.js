'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(map, ThemeHelper, MapData, LayerManagementService) {
        var _service = {};
        _service.AddAndUpdateThemes = function(themesBatch) {
            console.log("Themes batch for add and updates...");
            console.log(themesBatch);
            console.log("...");
            themesBatch.forEach(theme => {
                var existingTheme = MapData.Themes.find(x => { return x.Url == theme.Url });
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
        };
        _service.UpdateThemeVisibleLayers = function(theme) {
            theme.RecalculateVisibleLayerIds();
            console.log(theme.VisibleLayerIds);
            theme.MapData.setLayers(theme.VisibleLayerIds);
        }
        _service.UpdateTheme = function(updatedTheme, existingTheme) {
            //lets update the existingTheme
            for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
                var updatedLayer = updatedTheme.AllLayers[x];
                var existingLayer = existingTheme.AllLayers[x];

                //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
                if (updatedLayer.enabled && updatedLayer.visible) {
                    //eerst checken dat ze nog niet bestaan!.
                    if (MapData.VisibleLayers.indexOf(existingLayer) == -1) {
                        MapData.VisibleLayers.push(existingLayer);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
                        existingTheme.VisibleLayers.push(existingLayer);
                    }
                }
                else {
                    //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
                    if (MapData.VisibleLayers.indexOf(existingLayer) != -1) {
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
        _service.AddNewTheme = function(theme) {
            MapData.Themes.push(theme);
            _.each(theme.AllLayers, function(layer) {
                if (layer.enabled && layer.visible && layer.type === LayerType.LAYER) {
                    console.log(layer.id);
                    MapData.VisibleLayers.push(layer);
                    theme.VisibleLayers.push(layer);
                }

            });
            theme.RecalculateVisibleLayerIds();
            console.log(theme.Type);
            console.log(theme);
            switch (theme.Type) {
                case ThemeType.ESRI:
                    theme.MapData = L.esri.dynamicMapLayer({
                        url: theme.CleanUrl,
                        opacity: 0.5,
                        layers: theme.VisibleLayerIds,
                        useCors: true
                    }).addTo(map);
                    break;  
                case ThemeType.WMS:
                    theme.MapData = L.tileLayer.wms(theme.CleanUrl, {
                        format: 'image/png',
                        layers: theme.VisibleLayerIds,
                        transparent: true,
                        useCors: true
                    }).addTo(map);
                    break;
                default:
                    console.log("UNKNOW TYPE");
                    break;
            }

            // _mapService.UpdateThemeVisibleLayers(theme);
            theme.MapData.on('requeststart', function(obj) {
                console.log('requeststart ' + theme.Naam);
            });
            theme.MapData.on('requestsuccess', function(obj) {
                console.log('requestsuccess ' + theme.Naam);
            });

        };
        _service.DeleteTheme = function(theme) {
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
        };



        return _service;
    };
    module.$inject = ['map', 'ThemeHelper', 'MapData', 'LayerManagementService'];
    module.factory('ThemeService', service);
})();
