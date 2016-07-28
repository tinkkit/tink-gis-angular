'use strict';
(function() {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function(map) {
        var _baseLayersService = {};
        _baseLayersService.kaart =
            L.esri.tiledMapLayer({
                url: 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer',
                // url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap_wgs84/MapServer',
                maxZoom: 19,
                minZoom: 0,
                continuousWorld: true
            });


        _baseLayersService.luchtfoto =
            L.esri.tiledMapLayer({
                url: 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/Luchtfoto_2015/MapServer',
                maxZoom: 19,
                minZoom: 0,
                continuousWorld: true
            });
        _baseLayersService.kaart.addTo(map);

        return _baseLayersService;
    };

    module.factory('BaseLayersService', baseLayersService);
})();