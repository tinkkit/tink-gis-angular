'use strict';

var TinkGis;
(function (TinkGis) {
    (function () {
        var module = angular.module('tink.gis');
        var service = function service() {
            var ThemeCreater = {};
            ThemeCreater.createARCGISThemeFromJson = function (rawdata, themeData) {
                var theme = new TinkGis.ArcGIStheme(rawdata, themeData);
                return theme;
            };
            ThemeCreater.createWMSThemeFromJSON = function (data, url) {
                var wms = new TinkGis.wmstheme(data, url);
                return wms;
            };
            return ThemeCreater;
        };
        module.factory('ThemeCreater', service);
    })();
})(TinkGis || (TinkGis = {}));
