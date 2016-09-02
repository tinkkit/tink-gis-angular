namespace TinkGis {

    'use strict';

    export class LayerJSON {
        id: any;
        name: string;
        parentLayerId: number;
        defaultVisibility: boolean;
        subLayerIds: number[];
        minScale: number;
        maxScale: number;
        constructor() {
        }
    }
    export abstract class Layer extends LayerJSON {
        queryable: boolean;

        visible: boolean;
        enabled: boolean;
        parent: Layer = null;
        theme: Theme;
        title: string;
        displayed: boolean;
        Layers: Array<Layer> = [];
        get legendUrl(): string {
            return "TODOOVERWRITEBIJCHILD abstract get is nog niet ondersteund door typescript"
        }

        get hasLayers(): boolean {
            if (this.Layers) {
                return this.Layers.length > 0;
            }
            return false;
        };
        get ShouldBeVisible(): boolean {
            if (this.IsEnabledAndVisible && !this.hasLayers) {
                if (!this.parent || this.parent.IsEnabledAndVisible) {
                    return true;
                }
            }
            return false;
        }
        get IsEnabledAndVisible(): boolean {
            if (this.enabled && this.visible) {
                if (!this.parent) {
                    return true;
                }
                else {
                    return this.parent.IsEnabledAndVisible;
                }
            }
            return false;
        }
        get AllLayers(): Array<Layer> {
            var allLay: Array<Layer> = this.Layers;
            this.Layers.forEach(lay => {
                allLay = allLay.concat(lay.AllLayers);
            });
            return allLay;
        };
        UpdateDisplayed = (currentScale) => {
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
        public toString = (): string => {

            return `Lay: (id: ${this.name})`;
        }
    }
    export class wmslayer extends Layer {
        id: string;
        constructor(info: any, parenttheme: Theme) {
            super();
            Object.assign(this, info);
            this.visible = true;
            this.enabled = true;
            this.displayed = true;
            this.theme = parenttheme;
            this.queryable = info.queryable;
            this.id = this.name; //names are the ids of the layer in wms
        }
        get legendUrl(): string {
            return this.theme.CleanUrl + '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + this.id;
        };
    }
    export class argislegend {
        constructor(label: string, url: string) {
            this.label = label;
            this.url = url;
        }
        label: string;
        url: string;
    }

    export class arcgislayer extends Layer {
        legend: Array<any>;
        id: number;
        constructor(info: LayerJSON, parenttheme: Theme) {
            super();
            Object.assign(this, info);
            this.visible = info.defaultVisibility;
            this.enabled = true;
            this.title = info.name;
            this.theme = parenttheme;
            this.displayed = true;
            this.queryable = false;
        }

        get legends(): Array<argislegend> {
            return this.legend.map(x => new argislegend(x.label, x.fullurl));
        }
    }

}