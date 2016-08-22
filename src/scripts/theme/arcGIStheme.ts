// import {Theme} from './theme';
// import {Layer} from './layer';
'use strict';
class ArcGIStheme extends Theme {
    constructor(rawdata: any, themeData: any) {
        super();
        let rawlayers = rawdata.layers; 
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
        rawlayers.forEach((layerInfo) => {
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
        this.Groups.forEach((layerGroup) => {
            if (layerGroup.subLayerIds !== null) {
                layerGroup.Layers = [];
                this.AllLayers.forEach((layer) => {
                    if (layerGroup.id === layer.parentLayerId) {
                        layer.parent = layerGroup;
                        layerGroup.Layers.push(layer);
                    }
                });
            }
        });
        this.RecalculateVisibleLayerIds();
    }
}