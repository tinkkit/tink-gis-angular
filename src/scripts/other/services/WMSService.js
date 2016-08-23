//http://proj4js.org/
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, HelperService, $q) {
        var _service = {};
        _service.GetThemeData = function (url) {
            var fullurl = url + '?request=GetCapabilities&service=WMS&callback=foo';
            var prom = $http({
                method: 'GET',
                url: HelperService.CreateProxyUrl(fullurl),
                timeout: 10000,
                transformResponse: function (data) {
                    if (data) {
                        data = HelperService.UnwrapProxiedData(data);
                        if (data.listOfHttpError) {
                            console.log(data.listOfHttpError, fullurl);
                        }
                        else {
                            data = JXON.stringToJs(data).wms_capabilities;
                        }
                    }
                    return data;
                }
            }).success(function (data, status, headers, config) {
                // console.dir(data);  // XML document object
            }).error(function (data, status, headers, config) {
                console.log('error: data, status, headers, config:', data, status, headers, config);
            });
            return prom;
        };
        return _service;
    };
    module.$inject = ['$http', 'HelperService', '$q'];
    module.factory('WMSService', service);
})();