'use strict';
(function () {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var gisDataService = function (HelperService, $http) { //$http
        //    //http://app11.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/identify?geometry=%7Bx%3A4.4029%2C+y%3A+51.2192%7D&geometryType=esriGeometryPoint&sr=4326&layers=all%3A1%2C6&layerDefs=&time=&layerTimeOptions=&tolerance=2&mapExtent=4.2%2C51%2C4.6%2C51.4&imageDisplay=imageDisplay%3D600%2C600%2C96&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=html
        var _layerData = {};
        $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson').success(function (data) {
            // you can do some processing here
            console.log('GOT THE DATA!');
            _layerData = data;
        });
        return {
            layerData: _layerData,
            layers: _layerData.layers
        };
    }
    gisDataService.$inject = ['HelperService', '$http'];
    module.factory('GisDataService', gisDataService);
})();
