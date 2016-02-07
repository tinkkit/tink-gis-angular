'use strict';


(function () {

    var module = angular.module('tink.gis.angular');
    var baseLayersService = function () {
        var _baseLayersService = {};
        _baseLayersService.kaart = L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' });
        _baseLayersService.luchtfoto = L.tileLayer("http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png", { id: 'luchtfoto', tms: 'true' });
        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();