//http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode
//http://proj4js.org/
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, map, MapData, HelperService) {
        var _service = {};
        _service.ReverseGeocode = function (event) {
            var lambert72Cords = HelperService.ConvertWSG84ToLambert72(event.latlng);
            var loc = lambert72Cords.x + ',' + lambert72Cords.y;
            var urlloc = encodeURIComponent(loc);
            MapData.CleanWatIsHier();

            $http.get('http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode?location=' + urlloc + '&distance=50&outSR=&f=json').
                success(function (data, status, headers, config) {
                    if (!data.error) {
                        MapData.CreateWatIsHierMarker(data);
                        console.log(data);
                        MapData.CreateOrigineleMarker(event.latlng, true);
                    }
                    else {
                        MapData.CreateOrigineleMarker(event.latlng, false);
                    }
                }).
                error(function (data, status, headers, config) {
                    console.log('ERROR!', status, headers, data);
                });

        };
        _service.QuerySOLRGIS = function (searchterm) {
            var prom = $http.get('http://esb-app1-o.antwerpen.be/v1/giszoek/solr/search?q=*' + searchterm + '*&wt=json&indent=true');
            return prom;
        };
        _service.QuerySOLRLocatie = function (search) {
            var prom = $http.get('http://solr.o.antwerpen.be:8080/solr/gislocaties/select?q=*' + search + '*&wt=json&indent=true');
            return prom;
        };
        var baseurl = 'http://app10.p.gis.local/arcgissql/rest/';
        _service.GetThemeData = function (mapserver) {
            var prom = $http.get(baseurl + mapserver + '?f=pjson');
            return prom;
        };
        _service.GetThemeLayerData = function (cleanurl) {
            var prom = $http.get(cleanurl + '/layers?f=pjson');
            return prom;
        };
        _service.GetLegendData = function (cleanurl) {
            var prom = $http.get(cleanurl + '/legend?f=pjson');
            return prom;
        };
        return _service;
    };
    module.$inject = ['$http', 'map', 'MapData', 'HelperService', '$rootScope'];
    module.factory('GISService', service);
})();