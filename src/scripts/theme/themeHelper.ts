// import * as angular from 'angular';
// import {ArcGIStheme} from './arcGIStheme';
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function () {
        var themeHelper: any = {};
        themeHelper.createThemeFromJson = function (rawdata, themeData) {
            let theme: ArcGIStheme = new ArcGIStheme(rawdata, themeData)
            return theme;
        };
        return themeHelper;
    };
    module.factory('ThemeHelper', service);
})();
