'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function (map) {
        var themeHelper = {};
        themeHelper.createThemeFromJson = function (rawdata, getdata) {
            var thema = {};
            var rawlayers = rawdata.layers;
            var cleanUrl = getdata.url.substring(0, getdata.url.indexOf('?'));
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.VisibleLayersIds = [-1];
            thema.Groups = [];
            thema.Visible = true;
            thema.MapData = L.esri.dynamicMapLayer({
                url: cleanUrl,
                opacity: 0.5,
                layers: thema.VisibleLayersIds,
                useCors: false
            }).addTo(map);
            _.each(rawlayers, function (x) {
                x.visible = false;
                x.parent = null;
                x.theme = thema;
                if (x.parentLayerId === -1) {
                    if (x.subLayerIds === null) {
                        thema.Layers.push(x);
                    } else {
                        thema.Groups.push(x);
                    }
                }
            });
            _.each(thema.Groups, function (layerGroup) {
                if (layerGroup.subLayerIds !== null) {
                    layerGroup.Layers = [];
                    _.each(rawlayers, function (rawlayer) {
                        if (layerGroup.id === rawlayer.parentLayerId) {
                            rawlayer.parent = layerGroup;
                            layerGroup.Layers.push(rawlayer);
                        }
                    });
                }
            });
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['$http', 'map'];
    module.factory('ThemeHelper', service);
})();
