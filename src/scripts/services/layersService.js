'use strict';
(function () {

    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var layersService = function ($http,map) {
        var _layersService = {};
        _layersService.getLayers = ['http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer?f=pjson', 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson'];
        _layersService.getThemes = [];
        _.each(_layersService.getLayers, function (layerurl) {
            $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                _layersService.getThemes.push(convertRawData(data, getdata));
            });
        });
        var convertRawData = function (rawdata, getdata) {
            var rawlayers = rawdata.layers;
            var cleanUrl = getdata.url.substring(0, getdata.url.indexOf('?'));
            var thema = {};
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.VisibleLayersIds = [-1];
            thema.Groups = [];
            thema.MapData = L.esri.dynamicMapLayer({
                url: cleanUrl,
                opacity: 0.5,
                layers: thema.VisibleLayersIds,
                useCors: false
            }).addTo(map);
            _.each(rawlayers, function (x) {
                x.visible = false;
                if (x.parentLayerId === -1) {
                    if (x.subLayerIds === null) {
                        thema.Layers.push(x);
                    } else {
                        thema.Groups.push(x);
                    }
                }
            });
            _.each(thema.Groups, function (layerGroup) {
                if (layerGroup.subLayerIds !== null) {
                    layerGroup.Layers = [];
                    _.each(rawlayers, function (rawlayer) {
                        if (layerGroup.id === rawlayer.parentLayerId) {
                            layerGroup.Layers.push(rawlayer);
                        }
                    });
                }
            });
            return thema;
        }
        return _layersService;
    };
    module.$inject = ["$http", 'map'];
    module.factory("LayersService", layersService);
})();