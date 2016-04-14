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
                url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer',
                maxZoom: 20,
                minZoom: 0,
                continuousWorld: true
            });


        _baseLayersService.luchtfoto =
            L.esri.tiledMapLayer({
                url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/Luchtfoto_2011/MapServer',
                maxZoom: 12,
                minZoom: 0,
                continuousWorld: true
            });
        _baseLayersService.kaart.addTo(map);

        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();