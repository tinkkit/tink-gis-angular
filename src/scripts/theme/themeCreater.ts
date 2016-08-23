// import * as angular from 'angular';
// import {ArcGIStheme} from './arcGIStheme';
// interface ThemeCreater {
//     createARCGISThemeFromJson(data: any, url: string): any;
//     createWMSThemeFromJSON(data: any, url: string): any;
// }
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function () {
        class ThemeCreater {
            createARCGISThemeFromJson = function (rawdata, themeData) {
                let theme: app.ArcGIStheme = new app.ArcGIStheme(rawdata, themeData)
                return theme;
            };
            createWMSThemeFromJSON = function (data, url) {
                var wms = new app.wmstheme(data, url);
                return wms;
            };
        };

        return new ThemeCreater();
    };
    module.factory('ThemeCreater', service);
})();
// (function () {
//     var module = angular.module('tink.gis');
//     var service = function ($http, $window, map, helperService) {
//         var _service: any = {};

//         _service.GetCapabilities = function (url) {
//             var fullurl = url + '?request=GetCapabilities&service=WMS&callback=foo';
//             var prom = $http({
//                 method: 'GET',
//                 url: helperService.CreateProxyUrl(fullurl),
//                 timeout: 10000,
//                 transformResponse: function (data) {
//                     if (data) {
//                         data = helperService.UnwrapProxiedData(data);
//                         if (data.listOfHttpError) {
//                             console.log(data.listOfHttpError, fullurl);
//                         } else {
//                             var convertedToJson = JXON.stringToJs(data).wms_capabilities;

//                             var wms = new app.wmstheme(convertedToJson, url);
//                             return wms;
//                         }
//                     }
//                 }
//             }).success(function (data, status, headers, config) {
//                 // console.dir(data);  // XML document object
//             }).error(function (data, status, headers, config) {
//                 console.log('error: data, status, headers, config:', data, status, headers, config);
//             });
//             return prom;
//         };

//         return _service;
//     };
//     // module.$inject = ['HelperService'];

//     module.service('WMSService', ['$http', '$window', 'map', 'HelperService', service]);
// })();
