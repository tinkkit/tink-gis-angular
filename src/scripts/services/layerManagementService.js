/// <reference path="../../../typings/tsd.d.ts"/>

'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(MapData, $http, $q, GISService, ThemeHelper) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];
        _service.ProcessUrls = function(urls) {
            console.log("ProcesUrls");
            var promises = [];
            _.each(urls, function(url) {
                var AlreadyAddedTheme = null;
                _service.EnabledThemes.forEach(theme => { // OPTI kan paar loops minder door betere zoek in array te doen
                    if (theme.CleanUrl == url) {
                        AlreadyAddedTheme = theme;
                    }
                });
                if (AlreadyAddedTheme == null) { // if we didn t get an alreadyadderdtheme we get the data
                    var prom = GISService.GetThemeData(url + '?f=pjson');
                    prom.success(function(data, statuscode, functie, getdata) {
                        var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                        _service.AvailableThemes.push(convertedTheme);
                        convertedTheme.status = ThemeStatus.NEW;
                    });
                    promises.push(prom);
                }
                else { // ah we already got it then just push it.
                    AlreadyAddedTheme.status = ThemeStatus.UNMODIFIED;
                    _service.AvailableThemes.push(AlreadyAddedTheme);
                }
            });
            // $q.all(promises).then(function(lagen) {
            //     console.log(lagen);
            // });
            return $q.all(promises);
        };
        _service.SetAditionalLayerInfo = function(theme) {
            console.log(theme.CleanUrl);
            var prom = GISService.GetThemeLayerData(theme.CleanUrl);
            prom.success(function(data, statuscode, functie, getdata) {
                theme.AllLayers.forEach(layer => {
                    var layerid = layer.id;
                    var layerInfo = data.layers[layerid];
                    var displayField = layerInfo.displayField;
                    layer.displayField = layerInfo.displayField;
                });
            });
        };
        return _service;
    };
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeHelper'];
    module.factory("LayerManagementService", service);
})();