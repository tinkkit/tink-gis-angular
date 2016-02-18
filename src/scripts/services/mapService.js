'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function ($rootScope, $http, map, ThemeHelper, $q) {
        var _mapService = {};
        _mapService.VisibleLayers = [];

        _mapService.SelectableLayers = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.ThemeUrls = ['http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Afval/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Cultuur/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Jeugd/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Onderwijs/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/stad/MapServer?f=pjson'
        ];
        _mapService.Themes = [];
        var defaultlayer = { id: '', name: 'Alle Layers' };
        _mapService.VisibleLayers.unshift(defaultlayer);
        _mapService.SelectedLayer = defaultlayer;
        _mapService.AddNewThemes = function (selectedThemes) { // dit moet met HTTP en ergens op een andere service ofzo vervangen worden later wnnr dit geimplementeerd moet worden.
            _.each(selectedThemes, function (theme) {
                _mapService.Themes.push(theme);
                theme.MapData = L.esri.dynamicMapLayer({
                    url: theme.CleanUrl,
                    opacity: 0.5,
                    // layers: theme.VisibleLayerIds,
                    useCors: false
                }).addTo(map);
                theme.MapData.on('requeststart', function (obj) {
                    console.log('requeststart');
                });
                theme.MapData.on('requestsuccess', function (obj) {
                    console.log('requestsuccess');
                });
                _.each(theme.GetAllLayers(), function (layer) {
                    _mapService.VisibleLayers.push(layer);
                });

            });
        };
        // _mapService.AddNewThemes = function (selectedThemes) { // dit moet met HTTP en ergens op een andere service ofzo vervangen worden later wnnr dit geimplementeerd moet worden.
        //     var promises = [];
        //     // _mapService.VisibleLayers.length = 0;
        //     // _mapService.Themes.length = 0;
        //     _.each(selectedThemes, function (layerurl) {
        //         var prom = $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
        //             var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
        //             _mapService.Themes.push(convertedTheme);
        //             _.each(convertedTheme.GetAllLayers(), function (layer) {
        //                 _mapService.VisibleLayers.push(layer);
        //             });
        //         });
        //         promises.push(prom);
        //     });
        //     $q.all(promises).then(function (lagen) {
        //         // console.log(lagen); // value gamma
        //         console.log("Alle layers geladen");
        //     });
        // };
        // loadAllLayers();
        _mapService.Identify = function (event, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 2; }
            _.each(_mapService.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                else {
                    var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                }
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                        AddFeatures(featureCollection);
                    });
                }

            });
        };
        _mapService.Select = function (event) {
            _.each(_mapService.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = _mapService.SelectedLayer.theme == theme;
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + _mapService.SelectedLayer.id).run(function (error, featureCollection) {
                        AddFeatures(featureCollection);
                    });
                }

            });
        };
        var AddFeatures = function (features) {
            for (var x = 0; x < features.features.length; x++) {
                var featureItem = features.features[x];
                var myStyle = {
                    "fillOpacity": 0
                };
                _mapService.JsonFeatures.push(featureItem);
                var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                _mapService.VisibleFeatures.push(mapItem);
            }
            console.log(_mapService.JsonFeatures);
            $rootScope.$apply();
        };
        _mapService.Query = function (event, selectedLayer) {
            console.log(selectedLayer.id);
            selectedLayer.theme.MapData.query()
                .layer('visible: ' + selectedLayer.id)
                .intersects(event.layer)
                .run(function (error, featureCollection, response) {
                    AddFeatures(featureCollection);
                });
        };


        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
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



        };
        _mapService.UpdateThemeVisibleLayers = function (theme) {
            console.log(theme.VisibleLayerIds);
            theme.RecalculateVisibleLayerIds();
            theme.MapData.setLayers(theme.VisibleLayerIds);
        }
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
    module.$inject = ['$rootScope', '$http', 'map', 'ThemeHelper', '$q'];
    module.factory('MapService', mapService);
})();


