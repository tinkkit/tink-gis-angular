'use strict';
(function () {
    // try {
    var module = angular.module('tink.gis');
    // } catch (e) {
    //     module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    // }
    var service = function ($http, $window, map, helperService) {
        var _service = {};

        _service.GetCapabilities = function (url) {
            var fullurl = url + '?request=GetCapabilities&service=WMS&callback=foo';
            var prom = $http({
                method: 'GET',
                url: helperService.CreateProxyUrl(fullurl),
                timeout: 10000,
                // params: {},  // Query Parameters (GET)
                transformResponse: function (data) {
                    var wmstheme = {};
                    if (data) {
                        data = helperService.UnwrapProxiedData(data);
                        if (data.listOfHttpError) {
                            console.log(data.listOfHttpError, fullurl);
                        }
                        else {
                            var returnjson = JXON.stringToJs(data).wms_capabilities;
                            console.log(returnjson);
                            wmstheme.Version = returnjson['version'];
                            wmstheme.name = returnjson.service.title;
                            wmstheme.Naam = returnjson.service.title;
                            // wmstheme.Title = returnjson.service.title;
                            wmstheme.enabled = true;
                            wmstheme.Visible = true;
                            wmstheme.Layers = [];
                            wmstheme.AllLayers = [];
                            wmstheme.Groups = []; // layergroups die nog eens layers zelf hebben
                            wmstheme.CleanUrl = url;
                            wmstheme.Added = false;
                            wmstheme.status = ThemeStatus.NEW;
                            wmstheme.Description = returnjson.service.abstract;
                            wmstheme.Type = ThemeType.WMS;
                            wmstheme.VisibleLayerIds = [];
                            wmstheme.VisibleLayers = [];
                            var createLayer = function (layer) {
                                var tmplayer = {};
                                tmplayer.visible = true;
                                tmplayer.enabled = true;
                                tmplayer.parent = null;
                                tmplayer.displayed = true;
                                tmplayer.theme = wmstheme;
                                tmplayer.name = layer.name;
                                tmplayer.title = layer.title;
                                tmplayer.queryable = layer.queryable;
                                tmplayer.type = LayerType.LAYER;
                                tmplayer.id = layer.name; //names are the ids of the layer in wms
                                wmstheme.Layers.push(tmplayer);
                                wmstheme.AllLayers.push(tmplayer);
                            };
                            var layers = returnjson.capability.layer.layer;
                            if (layers) {
                                if (layers.length != undefined) { // array, it has a length
                                    layers.forEach(layer => {
                                        createLayer(layer);
                                    });
                                }
                                else {
                                    createLayer(layers);

                                }

                            } else {
                                createLayer(returnjson.capability.layer);
                            }


                            wmstheme.UpdateMap = function () {
                                wmstheme.RecalculateVisibleLayerIds();
                                map.removeLayer(wmstheme.MapData);
                                map.addLayer(wmstheme.MapData);
                            };

                            wmstheme.RecalculateVisibleLayerIds = function () {
                                wmstheme.VisibleLayerIds.length = 0;
                                _.forEach(wmstheme.VisibleLayers, function (visLayer) {
                                    wmstheme.VisibleLayerIds.push(visLayer.id);
                                });
                                if (wmstheme.VisibleLayerIds.length === 0) {
                                    wmstheme.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                                }
                            };
                            wmstheme.RecalculateVisibleLayerIds();

                        }
                    }


                    return wmstheme;
                }
            }).success(function (data, status, headers, config) {
                console.dir(data);  // XML document object
            }).error(function (data, status, headers, config) {
                console.log('error: data, status, headers, config:');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
                $window.alert('error');
            });
            return prom;
        };

        return _service;
    };
    // module.$inject = ['HelperService'];

    module.service('WMSService', ['$http', '$window', 'map', 'HelperService', service]);
})();
