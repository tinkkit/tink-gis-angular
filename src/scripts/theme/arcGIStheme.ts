// import {Theme} from './theme';
// import {Layer} from './layer';
'use strict';
namespace app {
    export class ArcGIStheme extends Theme {
        VisibleLayerIds: Array<number>;

        constructor(rawdata: any, themeData: any) {
            super();
            let rawlayers: any[] = rawdata.layers;
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
            var convertedLayers = rawlayers.map(x => new arcgislayer(x, this));
            convertedLayers.forEach(argislay => {
                if (argislay.parentLayerId === -1) {
                    this.Layers.push(argislay);
                }
                else {
                    var parentlayer = convertedLayers.find(x => x.id == argislay.parentLayerId);
                    argislay.parent = parentlayer;
                    parentlayer.Layers.push(argislay);
                }

            })
        }

        UpdateMap() {
            if (this.VisibleLayerIds.length !== 0) {
                this.MapData.setLayers(this.VisibleLayerIds);
            }
            else {
                this.MapData.setLayers([-1]);
            }
        };
    }
}