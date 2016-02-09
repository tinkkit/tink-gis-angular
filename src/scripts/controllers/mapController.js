'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, HelperService, GisDataService, BaseLayersService, MapService, $http, map) {
        $scope.layerId = '';
        $scope.activeInteractieKnop = 'identify';
        $scope.selectedlayer = [];
        // map.on('click', function (e) {
        //     console.log('click op de map');
        //     // cleanMapAndSearch();
        //     // AGeaoService.identify().on(map).at(e.latlng).layers('visible:' + $scope.layerId).run(function (error, featureCollection) {
        //     //     for (var x = 0; x < featureCollection.features.length; x++) {
        //     //         MapService.jsonFeatures.push(featureCollection.features[x]);
        //     //         var item = L.geoJson(featureCollection.features[x]).addTo(map);
        //     //         MapService.visibleFeatures.push(item);
        //     //     }
        //     //     $scope.$apply();
        //     // });
        // });
        
            // $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer?f=pjson')
        //     .success(function (data) {
        //         $scope.Layers = data.layers;
        //     });
        
        var cleanMapAndSearch = function () {
            for (var x = 0; x < MapService.visibleFeatures.length; x++) {
                map.removeLayer(MapService.visibleFeatures[x]);
            }
            MapService.visibleFeatures.length = 0;
            MapService.jsonFeatures.length = 0;
        };
        $scope.identify = function () {
            cleanMapAndSearch();
            $scope.activeInteractieKnop = 'identify';
            $scope.layerId = '';
            AGeaoService.options.layers = [$scope.layerId]
        };
        $scope.select = function () {
            cleanMapAndSearch();
            $scope.activeInteractieKnop = 'select';
            $scope.layerId = '0';
            $scope.selectedlayer.id = '0'
            AGeaoService.options.layers = [$scope.layerId]

        };
        $scope.layerChange = function () {
            $scope.layerId = $scope.selectedlayer.id;
            AGeaoService.options.layers = [$scope.layerId]
        };
        $scope.zoomIn = function () {
            map.zoomIn();
        };
        $scope.zoomOut = function () {
            map.zoomOut();
        };
        $scope.fullExtent = function () {
            map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
        };
        $scope.kaartIsGetoond = true;
        $scope.toonKaart = function () {
            $scope.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        $scope.toonLuchtfoto = function () {
            $scope.kaartIsGetoond = false;
            map.removeLayer(BaseLayersService.kaart);
            map.addLayer(BaseLayersService.luchtfoto);
        };
    });
    theController.$inject = ['HelperService', 'GisDataService', 'BaseLayersService', 'MapService', '$http', 'map'];
})();