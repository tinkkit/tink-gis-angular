'use strict';

(function () {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function baseLayersService(map) {
        var _baseLayersService = {};
        _baseLayersService.basemap2Naam = "geen";
        _baseLayersService.basemap1Naam = "Geen";

        _baseLayersService.setBaseMap = function (id, naam, url) {
            var maxZoom = arguments.length <= 3 || arguments[3] === undefined ? 19 : arguments[3];
            var minZoom = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

            var layer = L.esri.tiledMapLayer({ url: url, maxZoom: maxZoom, minZoom: minZoom, continuousWorld: true });
            if (id == 1) {
                if (_baseLayersService.basemap1) {
                    map.removeLayer(_baseLayersService.basemap1);
                }
                _baseLayersService.basemap1Naam = naam;
                _baseLayersService.basemap1 = layer;
                _baseLayersService.basemap1.addTo(map);
            } else if (id == 2) {
                if (_baseLayersService.basemap2) {
                    map.removeLayer(_baseLayersService.basemap2);
                }
                _baseLayersService.basemap2 = layer;
                _baseLayersService.basemap2Naam = naam;
            }
        };
        _baseLayersService.setBaseMap(1, "Kaart", 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer');
        _baseLayersService.setBaseMap(2, "Luchtfoto", 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/Luchtfoto_2015/MapServer');
        return _baseLayersService;
    };

    module.factory('BaseLayersService', baseLayersService);
})();
