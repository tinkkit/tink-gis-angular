'use strict';
// import {Theme} from './theme';

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
        super(info);
        //osdf
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
