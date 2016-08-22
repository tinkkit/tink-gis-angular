'use strict';
class LayerRAW {
    id: number;
    name: string;
    parentLayerId: number;
    defaultVisibility: boolean;
    subLayerIds: number[];
    minScale: number;
    maxScale: number;
    constructor(layerJSON: any) {
        Object.assign(this, layerJSON);
    }
}
class Layer extends LayerRAW {
    visible: boolean;
    enabled: boolean;
    parent: any;
    theme: Theme;
    title: string;
    displayed: boolean;
    type: number;
    Layers: Array<Layer>;

    constructor(info: LayerRAW, parenttheme: Theme) {
        super(LayerRAW);
        this.visible = info.defaultVisibility;
        this.enabled = true;
        this.parent = null;
        this.title = info.name;
        this.theme = parenttheme;
        this.displayed = true;
        if (this.parentLayerId === -1 && this.subLayerIds !== null) {
            this.type = LayerType.GROUP;
        }
        else {
            this.type = LayerType.LAYER;
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
abstract class Theme {
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

    UpdateDisplayed(currentScale) {
        this.AllLayers.forEach(function (layer) {
            layer.UpdateDisplayed(currentScale);
        });
    }
    UpdateMap() {
        this.RecalculateVisibleLayerIds();
        this.MapData.setLayers(this.VisibleLayerIds);
    };
    RecalculateVisibleLayerIds() {
        this.VisibleLayerIds.length = 0;
        this.VisibleLayers.forEach(function (visLayer) {
            this.VisibleLayerIds.push(visLayer.id);
        });
        if (this.VisibleLayerIds.length === 0) {
            this.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
        }
    };
}

class ArcGIStheme extends Theme {
    constructor(rawdata: any, themeData: any) {
        super();
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
        _.each(rawlayers, function (layerInfo: LayerRAW) {
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
        _.each(this.Groups, function (layerGroup: Layer) {
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
        this.RecalculateVisibleLayerIds();
    }


}
(function () {
    var module = angular.module('tink.gis');
    var service = function () {
        var themeHelper: any = {};
        themeHelper.createThemeFromJson = function (rawdata, themeData) {
            let theme = new ArcGIStheme(rawdata, themeData)
            return theme;
        };
        return themeHelper;
    };
    module.factory('ThemeHelper', service);
})();
