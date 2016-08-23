
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function (MapData, $http, $q, GISService, ThemeCreater) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];
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
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeCreater'];
    module.factory('LayerManagementService', service);
})();