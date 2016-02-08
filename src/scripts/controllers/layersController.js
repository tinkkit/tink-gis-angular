'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService, $http) {
        var geoService = {};
        var stedenBouw = {};
        $scope.themes = [];
        $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson').success(function (data) {
            geoService = convertRawData(data);
            $scope.themes.push(geoService);
            console.log(geoService);

        });
        $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer?f=pjson').success(function (data) {
            stedenBouw = convertRawData(data);
            $scope.themes.push(stedenBouw);
            console.log(stedenBouw);
        });
        var convertRawData = function (rawdata) {
            var rawlayers = rawdata.layers;
            var thema = {};
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.Groups = [];
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
    theController.$inject = ['GisDataService', '$http'];
})();