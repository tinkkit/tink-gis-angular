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
        // get IsRealyVisible(): boolean {
        //     return this.enabled && this.visible && !this.hasLayers;
        // };
        enabled: boolean;
        parent: Layer = null;
        theme: Theme;
        title: string;
        displayed: boolean;
        get hasLayers(): boolean {
            if (this.Layers) {
                return this.Layers.length > 0;
            }
            return false;
        };
        Layers: Array<Layer> = [];
        get ShouldBeVisible(): boolean {
            if (this.enabled && this.visible && !this.hasLayers) {
                if (!this.parent) {
                    return true;
                }
                else if (this.parent.IsEnabledAndVisible) {
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
        queryable: boolean;
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
    }
    export class arcgislayer extends Layer {
        id: number;
        constructor(info: LayerJSON, parenttheme: Theme) {
            super();
            Object.assign(this, info);
            this.visible = info.defaultVisibility;
            this.enabled = true;
            this.title = info.name;
            this.theme = parenttheme;
            this.displayed = true;
            // if (this.subLayerIds !== null) {
            //     this.type = LayerType.GROUP;
            // }
        }
    }

}
