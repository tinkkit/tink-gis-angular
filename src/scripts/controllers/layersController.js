'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService, $http, map) {
        var geoService = {};
        var stedenBouw = {};
        $scope.themes = [];
        $scope.selectedLayers = [];
        $scope.test = function () {
            $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson').success(function (data, statuscode, functie, getdata) {
                geoService = convertRawData(data, getdata);
                $scope.themes.push(geoService);
                console.log(geoService);

            });
            $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer?f=pjson').success(function (data, statuscode, functie, getdata) {
                console.log(getdata.url);
                stedenBouw = convertRawData(data, getdata);
                $scope.themes.push(stedenBouw);
                console.log(stedenBouw);
            });
        };
        var convertRawData = function (rawdata, getdata) {
            var rawlayers = rawdata.layers;
            var cleanUrl = getdata.url.substring(0, getdata.url.indexOf('?'));
            var thema = {};
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.Groups = [];
            thema.MapData = L.esri.dynamicMapLayer({
                url: cleanUrl,
                opacity: 0.5,
                layers: [],
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
    });
    theController.$inject = ['GisDataService', '$http', 'map'];
})();