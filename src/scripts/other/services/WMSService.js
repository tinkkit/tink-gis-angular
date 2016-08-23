//http://proj4js.org/
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, map, MapData, HelperService, $q) {
        var _service = {};
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
        return _service;
    };
    module.$inject = ['$http', 'map', 'MapData', 'HelperService', '$q'];
    module.factory('WMSService', service);
})();