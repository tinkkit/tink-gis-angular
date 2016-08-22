'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    class Layer {
        visible: string;
        enabled: boolean;
        parent: any;
        theme: Theme;
        title: string;
        displayed: boolean;
        type: number;
        maxScale: number;
        minScale: number;
        parentLayerId: number;
        subLayerIds: Array<Number>;
        constructor(info: any, parenttheme: Theme) {
            this.visible = info.defaultVisibility;
            this.enabled = true;
            this.parent = null;
            this.title = info.name;
            this.theme = parenttheme;
            this.displayed = true;
            this.type = LayerType.LAYER;
            this.maxScale = info.maxScale;
            this.minScale = info.minScale;
            this.parentLayerId = info.parentLayerId;
            this.subLayerIds = info.subLayerIds;
            if (this.parentLayerId === -1) {
                if (this.subLayerIds !== null) {
                    this.type = LayerType.GROUP;
                }
            }
        }
        UpdateDisplayed(currentScale) {
            if (this.maxScale > 0 || this.minScale > 0) {
                console.log('MinMaxandCurrentScale', this.maxScale, this.minScale, currentScale);
                if (currentScale > this.maxScale && currentScale < this.minScale) {
                    this.displayed = true;
                }
                else {
                    this.displayed = false;
                }
            }
        };
    }

    class Theme {
        Naam: string;
        name: string;
        Description: string;
        CleanUrl: string;
        Url: string;

        Visible: boolean;
        Added: boolean;
        enabled: boolean;

        Type: string;
        status: number;

        VisibleLayerIds: Array<number>;
        Layers: Array<Layer>;
        VisibleLayers: Array<Layer>;
        AllLayers: Array<Layer>;
        Groups: Array<Layer>;

        MapData: any;
    }
    class ArcGIStheme extends Theme {
        super(rawdata: any, themeData: any) {
            var rawlayers = rawdata.layers;
            this.Naam = rawdata.documentInfo.Title;
            this.name = rawdata.documentInfo.Title;
            this.Description = rawdata.documentInfo.Subject;
            this.Layers = []; // de layers direct onder het theme zonder sublayers
            this.AllLayers = []; // alle Layers die hij heeft including subgrouplayers
            this.Groups = []; // layergroups die nog eens layers zelf hebben
            this.CleanUrl = themeData.cleanUrl;
            this.Url = themeData.url;
            this.VisibleLayers = [];
            this.VisibleLayerIds = [];
            this.Visible = true;
            this.Added = false;
            this.enabled = true;
            this.Type = ThemeType.ESRI;
            this.status = ThemeStatus.NEW;
            this.MapData = {};
            _.each(rawlayers, function (layerInfo) {
                let layer = new Layer(layerInfo, this);
                this.AllLayers.push(layer);
                if (layer.parentLayerId === -1) {
                    if (layer.subLayerIds === null) {
                        this.Layers.push(layer);
                    } else {
                        this.Groups.push(layer);
                    }
                }
            });
        }
    }
    var service = function () {
        var themeHelper = {};
        themeHelper.createThemeFromJson = function (rawdata, themeData) {
            var thema = {};
            try {

                _.each(rawlayers, function (x) {
                    let greeter = new Layer(x, this);

                    x.visible = x.defaultVisibility;
                    x.enabled = true;
                    x.parent = null;
                    x.title = x.name;
                    x.theme = thema;
                    x.displayed = true;
                    x.type = LayerType.LAYER;

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
                console.log('Error when creating theme from url: ' + themeData.url + ' Exeption: ' + ex + ' Data: ');
                console.log(rawdata);
            }
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['map'];
    module.factory('ThemeHelper', service);
})();
