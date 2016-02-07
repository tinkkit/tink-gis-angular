'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, HelperService, GisDataService, BaseLayersService, map, MapService) {
        console.log('mapController ctor');

        map = L.map('map', {
            center: [51.2192159, 4.4028818],
            zoom: 16,
            layers: [BaseLayersService.kaart]
        });
        L.control.scale({ imperial: false }).addTo(map);
        var AGeaoService = L.esri.dynamicMapLayer({
            url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer',
            opacity: 0.5,
            layers: [1],
            useCors: false
        }).addTo(map);

        // console.log(AGeaoService);
        // AGeaoService.options.layers = [3];
        map.on('click', function (e) {
            console.log('click op de map');
            for (var x = 0; x < MapService.visibleFeatures.length; x++) {
                map.removeLayer(MapService.visibleFeatures[x]);
            }
            AGeaoService.identify().on(map).at(e.latlng).layers('visible:1').run(function (error, featureCollection) {
                for (var x = 0; x < featureCollection.features.length; x++) {
                    console.log(featureCollection.features[x]);
                    MapService.visibleFeatures.push(L.geoJson(featureCollection.features[x]).addTo(map));
                }
            });
        });
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
    theController.$inject = ['HelperService', 'GisDataService', 'BaseLayersService', 'map', 'MapService'];
})();