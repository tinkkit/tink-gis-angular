'use strict';
// import {Theme} from './theme';
namespace app {

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
        visible: boolean;
        enabled: boolean;
        parent: any;
        theme: Theme;
        title: string;
        displayed: boolean;
        type: number = LayerType.LAYER;
        Layers: Array<Layer>;
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
    }
    export class wmslayer extends Layer {
        queryable: boolean;
        id: string;
        constructor(info: any, parenttheme: Theme) {
            super();
            Object.assign(this, info);
            this.visible = true;
            this.enabled = true;
            this.parent = null;
            this.displayed = true;
            this.theme = parenttheme;
            this.queryable = info.queryable;
            this.id = this.name; //names are the ids of the layer in wms
        }
    }
    export class arcgislayer extends Layer {
        id: number;
        constructor(info: LayerJSON, parenttheme: Theme) {
            super();
            Object.assign(this, info);
            this.visible = info.defaultVisibility;
            this.enabled = true;
            this.parent = null;
            this.title = info.name;
            this.theme = parenttheme;
            this.displayed = true;
            if (this.subLayerIds !== null) {
                this.type = LayerType.GROUP;
            }
        }
    }

}
