namespace TinkGis {
    'use strict';
    export abstract class Theme {
        Naam: string;
        name: string;
        Description: string;
        cleanUrl: string;
        Url: string;

        Visible: boolean;
        Added: boolean;
        enabled: boolean;

        Type: string;
        status: number;

        MapData: any;


        Layers: Array<Layer> = [];
        get VisibleLayers(): Array<Layer> {
            if (this.Visible) {
                var allLay: Array<Layer> = this.AllLayers.filter(x => x.ShouldBeVisible);
                return allLay;
            }
            return []; // if the theme is not visible then give 0 layers back
        };
        get EnabledLayers(): Array<Layer> {
            if (this.Visible) {
                var allLay: Array<Layer> = this.AllLayers.filter(x => x.enabled);
                return allLay;
            }
            return []; // if the theme is not visible then give 0 layers back
        };
        get VisibleLayerIds(): Array<any> {
            return this.VisibleLayers.map(x => x.id);
        };
        get AllLayers(): Array<Layer> {
            var allLay: Array<Layer> = this.Layers;
            this.Layers.forEach(lay => {
                allLay = allLay.concat(lay.AllLayers);
            });
            return allLay;
        };

        UpdateDisplayed = (currentScale) => {
            this.AllLayers.forEach(layer => {
                layer.UpdateDisplayed(currentScale);
            });
        }
        abstract UpdateMap(mapobject?: L.Map): void;
    }
    export class ArcGIStheme extends Theme {
        VisibleLayerIds: Array<number>;
        // SuffixUrl: string;
        constructor(rawdata: any, themeData: any) {
            super();
            let rawlayers: any[] = rawdata.layers;
            this.name = this.Naam = rawdata.documentInfo.Title;
            this.Description = rawdata.documentInfo.Subject;
            this.cleanUrl = themeData.cleanUrl;
            // let cleanurlSplitted = themeData.cleanUrl.split('/');
            this.Url = themeData.cleanUrl; // cleanurlSplitted[5] + '/' + cleanurlSplitted[6] + '/' + cleanurlSplitted[7] + '/' + cleanurlSplitted[8];
            this.Visible = true;
            this.Added = false;
            this.enabled = true;
            this.Type = ThemeType.ESRI;
            this.status = ThemeStatus.UNMODIFIED;
            this.MapData = {};
            let convertedLayers = rawlayers.map(x => new arcgislayer(x, this));
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
    export class wmstheme extends Theme {
        Version: string;
        VisibleLayerIds: Array<string>;
        GetFeatureInfoType: string;
        // MapData: L.TileLayer.WMS;
        constructor(data, url) {
            super();
            this.Version = data['version'];
            this.name = this.Naam = data.service.title;
            // this.Naam = data.service.title;
            // this.Title = returnjson.service.title;
            this.enabled = true;
            this.Visible = true;
            this.cleanUrl = url;
            this.Added = false;
            this.status = ThemeStatus.NEW;
            this.Description = data.service.abstract;
            this.Type = ThemeType.WMS;
            var layers = data.capability.layer;
            if (layers.layer) { // some are 1 level deeper
                layers = layers.layer;
            }
            if (layers.layer) { // some are 2 level deeper
                layers = layers.layer;
            }
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
            lays.forEach(layer => {
                if (layer.queryable == true) { // if it is queryable we have to check or it is compatible with text/xml since that is the only we support atm
                    if (data.capability.request.getfeatureinfo.format.some(x => x == "text/xml")) {
                        this.GetFeatureInfoType = "text/xml";
                    } else if (data.capability.request.getfeatureinfo.format.some(x => x == "text/plain")) {
                        this.GetFeatureInfoType = "text/plain";
                    }
                    if (!this.GetFeatureInfoType) {
                        layer.queryable = false;
                    }
                }
                let lay = new wmslayer(layer, this);
                this.Layers.push(lay);
            });
        }

        UpdateMap(map: L.Map) {
            if (this.VisibleLayerIds.length !== 0) {
                if (!map.hasLayer(this.MapData)) {
                    map.addLayer(this.MapData);
                }
                this.MapData.options.layers = this.MapData.wmsParams.layers = this.VisibleLayerIds.join(',');
                this.MapData.redraw();
            }
            else {
                if (map.hasLayer(this.MapData)) {
                    map.removeLayer(this.MapData);
                }

            }
            // map.addLayer(this.MapData);
        }
    }
}