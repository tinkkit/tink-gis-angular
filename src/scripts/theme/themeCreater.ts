'use strict';
namespace TinkGis {

    (function () {
        var module = angular.module('tink.gis');
        var service = function () {
            var ThemeCreater: any = {};
            ThemeCreater.createARCGISThemeFromJson = function (rawdata, themeData) {
                let theme = new ArcGIStheme(rawdata, themeData)
                return theme;
            };
            ThemeCreater.createWMSThemeFromJSON = function (data, url) {
                var wms = new wmstheme(data, url);
                return wms;
            };

            return ThemeCreater;
        };
        module.factory('ThemeCreater', service);
    })();
}