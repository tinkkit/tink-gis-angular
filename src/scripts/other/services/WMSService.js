//http://proj4js.org/
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, HelperService, $q, PopupService) {
        var _service = {};
        _service.GetThemeData = function (url) {
            var fullurl = url + '?request=GetCapabilities&service=WMS&callback=foo';
            var proxiedurl = HelperService.CreateProxyUrl(fullurl);
            var prom = $http({
                method: 'GET',
                url: proxiedurl,
                timeout: 10000,
                transformResponse: function (data) {
                    if (data) {
                        data = HelperService.UnwrapProxiedData(data);
                        if (data.listOfHttpError) {
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
                PopupService.ErrorFromHttp(data, status, fullurl);
            });
            return prom;
        };
        return _service;
    };
    module.$inject = ['$http', 'HelperService', '$q', 'PopupService'];
    module.factory('WMSService', service);
})();