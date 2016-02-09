'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService, $http, map, LayersService) {
        $scope.themes = [];
<<<<<<< HEAD
    
        $scope.selectedLayers = [];
      
        
=======
        _.each(LayersService.getLayers, function (layerurl) {
            $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                $scope.themes.push(convertRawData(data, getdata));
            });
        });
        $scope.selectedLayers = [];
      
        var convertRawData = function (rawdata, getdata) {
            var rawlayers = rawdata.layers;
            var cleanUrl = getdata.url.substring(0, getdata.url.indexOf('?'));
            var thema = {};
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.VisibleLayersIds = [-1];
            
            // AGeaoService.options.layers = [$scope.layerId]
            
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
>>>>>>> 0d0884fdd5652cb6283cdd188f4fdf9fbe4570be
    });
    theController.$inject = ['GisDataService', '$http', 'map', 'LayersService'];
})();