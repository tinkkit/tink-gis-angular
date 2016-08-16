//http://proj4js.org/
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, map, MapData, HelperService, $q) {
        var _service = {};
        _service.ReverseGeocode = function (event) {
            var lambert72Cords = HelperService.ConvertWSG84ToLambert72(event.latlng);
            var loc = lambert72Cords.x + ',' + lambert72Cords.y;
            var urlloc = encodeURIComponent(loc);
            MapData.CleanWatIsHier();
            var url = Gis.BaseUrl + 'arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode?location=' + urlloc + '&distance=50&outSR=&f=json';
            $http.get(url).
                success(function (data, status, headers, config) {
                    // data = HelperService.UnwrapProxiedData(data);
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
        _service.QuerySOLRGIS = function (search) {
            var prom = $q.defer();
            // select?q=school&wt=json&indent=true&facet=true&facet.field=parent&group=true&group.field=parent&group.limit=2
            var url = 'https://esb-app1-o.antwerpen.be/v1/giszoek/solr/search?q=*' + search + '*&wt=json&indent=true&facet=true&rows=999&facet.field=parent&group=true&group.field=parent&group.limit=5&solrtype=gis';
            $http.get(url)
                .success(function (data, status, headers, config) {
                    // data = HelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function (data, status, headers, config) {
                    prom.reject(null);
                    console.log('ERROR!', data, status, headers, config);
                });
            return prom.promise;
        };
        _service.QuerySOLRLocatie = function (search) {
            var prom = $q.defer();
            var url = 'https://esb-app1-o.antwerpen.be/v1/giszoek/solr/search?q=*' + search + '*&wt=json&indent=true&solrtype=gislocaties';
            $http.get(url)
                .success(function (data, status, headers, config) {
                    // data = HelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function (data, status, headers, config) {
                    prom.reject(null);
                    console.log('ERROR!', data, status, headers, config);
                });
            return prom.promise;
        };
        var completeUrl = function (url) {
            var baseurl = Gis.BaseUrl + 'arcgissql/rest/';
            if (!url.contains('arcgissql/rest/')) {
                url = baseurl + url;
            }
            return url
        }
        _service.GetThemeData = function (mapserver) {
            var prom = $q.defer();

            var url = completeUrl(mapserver) + '?f=pjson';
            $http.get(url)
                .success(function (data, status, headers, config) {
                    // data = HelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function (data, status, headers, config) {
                    prom.reject(null);
                    console.log('ERROR!', data, status, headers, config);
                });
            return prom.promise;
        };
        _service.GetThemeLayerData = function (cleanurl) {
            var prom = $q.defer();

            var url = completeUrl(cleanurl) + '/layers?f=pjson';
            $http.get(url)
                .success(function (data, status, headers, config) {
                    // data = HelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function (data, status, headers, config) {
                    prom.reject(null);
                    console.log('ERROR!', data, status, headers, config);
                });
            return prom.promise;
        };
        _service.GetLegendData = function (cleanurl) {
            var prom = $q.defer();

            var url = completeUrl(cleanurl) + '/legend?f=pjson';
            $http.get(url)
                .success(function (data, status, headers, config) {
                    // data = HelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function (data, status, headers, config) {
                    prom.reject(null);
                    console.log('ERROR!', data, status, headers, config);
                });
            return prom.promise;
        };
        return _service;
    };
    module.$inject = ['$http', 'map', 'MapData', 'HelperService', '$q'];
    module.factory('GISService', service);
})();