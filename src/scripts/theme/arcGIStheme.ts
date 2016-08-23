// import {Theme} from './theme';
// import {Layer} from './layer';
'use strict';
namespace app {
    export class ArcGIStheme extends Theme {
        VisibleLayerIds: Array<number>;

        constructor(rawdata: any, themeData: any) {
            super();
            let rawlayers = rawdata.layers;
            this.Naam = rawdata.documentInfo.Title;
            this.name = rawdata.documentInfo.Title;
            this.Description = rawdata.documentInfo.Subject;
            this.CleanUrl = themeData.cleanUrl;
            this.Url = themeData.url;
            this.Visible = true;
            this.Added = false;
            this.enabled = true;
            this.Type = ThemeType.ESRI;
            this.status = ThemeStatus.NEW;
            this.MapData = {};
            rawlayers.forEach((layerInfo) => {
                let layer = new arcgislayer(layerInfo, this);
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
        UpdateMap() {
            this.RecalculateVisibleLayerIds();
            this.MapData.setLayers(this.VisibleLayerIds);
        };
    }
}