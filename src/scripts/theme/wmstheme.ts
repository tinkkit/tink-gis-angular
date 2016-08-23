'use strict';
namespace app {
    export class wmstheme extends Theme {
        Version: string;
        VisibleLayerIds: Array<string>;

        constructor(data, url) {
            super();
            var returnjson = JXON.stringToJs(data).wms_capabilities;
            this.Version = returnjson['version'];
            this.name = returnjson.service.title;
            this.Naam = returnjson.service.title;
            // this.Title = returnjson.service.title;
            this.enabled = true;
            this.Visible = true;
            this.CleanUrl = url;
            this.Added = false;
            this.status = ThemeStatus.NEW;
            this.Description = returnjson.service.abstract;
            this.Type = ThemeType.WMS;
            var layers = returnjson.capability.layer.layer;
            var lays = [];
            if (layers) {
                if (layers.length == undefined) { // array, it has a length
                    lays.push(layers)
                }
                else {
                    lays = layers;
                }
            } else {
                lays.push(returnjson.capability.layer)
            }
            layers.forEach(layer => {
                let lay = new wmslayer(layer, this);
                this.Layers.push(lay);
                this.AllLayers.push(lay);
            });
            this.RecalculateVisibleLayerIds();

        }
        UpdateMap(map: L.Map) {
            this.RecalculateVisibleLayerIds();
            map.removeLayer(this.MapData);
            map.addLayer(this.MapData);
        }
    }

}



