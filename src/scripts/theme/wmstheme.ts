namespace TinkGis {

'use strict';
export class wmstheme extends Theme {
    Version: string;
    VisibleLayerIds: Array<string>;

    constructor(data, url) {
        super();
        this.Version = data['version'];
        this.name = data.service.title;
        this.Naam = data.service.title;
        // this.Title = returnjson.service.title;
        this.enabled = true;
        this.Visible = true;
        this.CleanUrl = url;
        this.Added = false;
        this.status = ThemeStatus.NEW;
        this.Description = data.service.abstract;
        this.Type = ThemeType.WMS;
        var layers = data.capability.layer.layer;
        var lays = [];
        if (layers) {
            if (layers.length == undefined) { // array, it has a length
                lays.push(layers)
            }
            else {
                lays = layers;
            }
        } else {
            lays.push(data.capability.layer)
        }
        layers.forEach(layer => {
            let lay = new wmslayer(layer, this);
            this.Layers.push(lay);
            // this.AllLayers.push(lay);
        });
    }
    UpdateMap(map: L.Map) {
        // this.RecalculateVisibleLayerIds();
        map.removeLayer(this.MapData);
        map.addLayer(this.MapData);
    }
}
}



