
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function (MapData, $http, $q, GISService, ThemeHelper) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];
        _service.ProcessUrls = function (urls) {
            var promises = [];
            _.each(urls, function (url) {
                var AlreadyAddedTheme = null;
                _service.EnabledThemes.forEach(theme => { // OPTI kan paar loops minder door betere zoek in array te doen
                    if (theme.CleanUrl == url) {
                        AlreadyAddedTheme = theme;
                    }
                });
                if (AlreadyAddedTheme == null) { // if we didn t get an alreadyadderdtheme we get the data
                    var prom = GISService.GetThemeData(url + '?f=pjson');
                    prom.then(function (data) {
                        var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata);
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
        _service.GetAditionalLayerInfo = function (theme) {
            var promLegend = GISService.GetLegendData(theme.CleanUrl);
            promLegend.then(function (data) {
                theme.AllLayers.forEach(layer => {
                    var layerid = layer.id;
                    var layerInfo = data.layers.find(x => x.layerId == layerid);
                    layer.legend = [];
                    if (layerInfo) {
                        layer.legend = layerInfo.legend;
                        layer.legend.forEach(legenditem => {
                            legenditem.fullurl = theme.CleanUrl + '/' + layerInfo.layerId + '/images/' + legenditem.url;
                        });
                    }
                });
            });
            var promLayerData = GISService.GetThemeLayerData(theme.CleanUrl);
            promLayerData.then(function (data) {
                theme.AllLayers.forEach(layer => {
                    var layerid = layer.id;
                    var layerInfo = data.layers.find(x => x.id == layerid);
                    layer.displayField = layerInfo.displayField;
                    layer.fields = layerInfo.fields;
                });
            });
        };
        return _service;
    };
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeHelper'];
    module.factory('LayerManagementService', service);
})();