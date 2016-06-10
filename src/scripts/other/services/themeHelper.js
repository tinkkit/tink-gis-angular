'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function () {
        var themeHelper = {};
        themeHelper.createThemeFromJson = function (rawdata, getData) {
            var thema = {};
            try {
                var rawlayers = rawdata.layers;
                var cleanUrl = getData.url.substring(0, getData.url.indexOf('?'));
                thema.Naam = rawdata.documentInfo.Title;
                thema.name = rawdata.documentInfo.Title;
                thema.Description = rawdata.documentInfo.Subject;
                thema.Layers = []; // de layers direct onder het theme zonder sublayers
                thema.AllLayers = []; // alle Layers die hij heeft including subgrouplayers
                thema.Groups = []; // layergroups die nog eens layers zelf hebben
                thema.CleanUrl = cleanUrl;
                thema.Url = getData.url;
                thema.VisibleLayers = [];
                thema.VisibleLayerIds = [];
                thema.Visible = true;
                thema.Added = false;
                thema.enabled = true;
                thema.Type = ThemeType.ESRI;
                thema.status = ThemeStatus.NEW;
                thema.MapData = {};
                _.each(rawlayers, function (x) {
                    x.visible = x.defaultVisibility;
                    x.enabled = true;
                    x.parent = null;
                    x.title = x.name;
                    x.theme = thema;
                    x.displayed = true;
                    x.UpdateDisplayed = function (currentScale) {
                        if (x.maxScale > 0 || x.minScale > 0) {
                            console.log('MinMaxandCurrentScale', x.maxScale, x.minScale, currentScale);
                            if (currentScale > x.maxScale && currentScale < x.minScale) {
                                x.displayed = true;
                            }
                            else {
                                x.displayed = false;

                            }
                        }
                    };
                    x.type = LayerType.LAYER;
                    thema.AllLayers.push(x);
                    if (x.parentLayerId === -1) {
                        if (x.subLayerIds === null) {
                            thema.Layers.push(x);
                        } else {
                            thema.Groups.push(x);
                            x.type = LayerType.GROUP;
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
                thema.UpdateDisplayed = function (currentScale) {
                    thema.AllLayers.forEach(function (layer) {
                        layer.UpdateDisplayed(currentScale);
                    });
                };
                thema.UpdateMap = function () {
                    thema.RecalculateVisibleLayerIds();
                    thema.MapData.setLayers(thema.VisibleLayerIds);
                };

                thema.RecalculateVisibleLayerIds = function () {
                    thema.VisibleLayerIds.length = 0;
                    thema.VisibleLayers.forEach(function (visLayer) {
                        thema.VisibleLayerIds.push(visLayer.id);
                    });
                    if (thema.VisibleLayerIds.length === 0) {
                        thema.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                    }
                };
                thema.RecalculateVisibleLayerIds();
            }
            catch (ex) {
                console.log('Error when creating theme from url: ' + getData.url + ' Exeption: ' + ex + ' Data: ');
                console.log(rawdata);
            }
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['map'];
    module.factory('ThemeHelper', service);
})();
