//http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode
//http://proj4js.org/


'use strict';
(function () {
    var module = angular.module('tink.gis.angular');
    var service = function ($http, map, MapData) {
        var _service = {};
        _service.ReverseGeocode = function (event) {
            console.log(event);
            var x = event.layerPoint.x;
            var y = event.layerPoint.y; 
            // var x = event.containerPoint.x; 
            // var y = event.containerPoint.y;
            // var x = 152572;
            // var y = 212092;
            var loc = x + "," + y;
            var urlloc = encodeURIComponent(loc);
            $http.get('http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode?location=' + urlloc + '&distance=50&outSR=&f=json').
                success(function (data, status, headers, config) {
                    console.log("success");
                    console.log(data);
                }).
                error(function (data, status, headers, config) {
                    console.log("ERROR!");
                    console.log(data);
                });
        };

        return _service;
    };
    module.$inject = ["$http", 'map', 'MapData'];
    module.factory("GISService", service);
})();