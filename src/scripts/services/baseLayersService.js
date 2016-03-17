'use strict';
(function() {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function() {
        var _baseLayersService = {};
        _baseLayersService.kaart = L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' });
        // _baseLayersService.kaart = L.esri.dynamicMapLayer({ url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/Basemap_stadsplan/MapServer' ,id: 'kaart' });
        _baseLayersService.luchtfoto = L.tileLayer("http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png", { id: 'luchtfoto', tms: 'true' });
        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();