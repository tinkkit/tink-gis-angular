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
