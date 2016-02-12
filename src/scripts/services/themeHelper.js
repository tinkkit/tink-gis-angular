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
        themeHelper.createThemeFromJson = function (rawdata, getData) {
            var thema = {};
            var rawlayers = rawdata.layers;
            var cleanUrl = getData.url.substring(0, getData.url.indexOf('?'));
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.Groups = [];
            thema.VisibleLayers = []; // -1 is een truckje wnnr er geen ids zijn dat hij niet ALLEs queryt maar niks
            thema.VisibleLayerIds = []; // -1 is een truckje wnnr er geen ids zijn dat hij niet ALLEs queryt maar niks
            
            thema.GetAllLayers = function () {
                let alllayers = [];
                _.each(thema.Layers, function (layer) {
                    alllayers.push(layer);
                });
                _.each(thema.Groups, function (group) {
                    _.each(group.Layers, function (layer) {
                        alllayers.push(layer);
                    });
                });
                return alllayers;
            };
            thema.Visible = true;
            thema.MapData = L.esri.dynamicMapLayer({
                url: cleanUrl,
                opacity: 0.5,
                layers: thema.VisibleLayerIds,
                useCors: false
            }).addTo(map);
            thema.RecalculateVisibleLayerIds = function () {
                thema.VisibleLayerIds.length = 0;

                _.forEach(thema.VisibleLayers, function (visLayer) {
                    thema.VisibleLayerIds.push(visLayer.id);
                });
                if(thema.VisibleLayerIds.length === 0)
                {
                    thema.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                }
                console.log(thema.VisibleLayerIds);
            };
            _.each(rawlayers, function (x) {
                x.visible = true;

                x.parent = null;
                x.theme = thema;
                if (x.parentLayerId === -1) {
                    if (x.subLayerIds === null) {
                        thema.Layers.push(x);
                        thema.VisibleLayers.push(x);
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
                            thema.VisibleLayers.push(rawlayer);
                            layerGroup.Layers.push(rawlayer);
                        }
                    });
                }
            });
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['map'];
    module.factory('ThemeHelper', service);
})();
