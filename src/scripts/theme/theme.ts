import {Layer} from './layer';
'use strict';
export abstract class Theme {
    Naam: string;
    name: string;
    Description: string;
    CleanUrl: string;
    Url: string;

    Visible: boolean;
    Added: boolean;
    enabled: boolean;

    Type: string;
    status: number;

    VisibleLayerIds: Array<number>;
    Layers: Array<Layer>;
    VisibleLayers: Array<Layer>;
    AllLayers: Array<Layer>;
    Groups: Array<Layer>;

    MapData: any;

    UpdateDisplayed = (currentScale) => {
        this.AllLayers.forEach(layer => {
            layer.UpdateDisplayed(currentScale);
        });
    }
    UpdateMap = () => {
        this.RecalculateVisibleLayerIds();
        this.MapData.setLayers(this.VisibleLayerIds);
    };
    RecalculateVisibleLayerIds = () => {
        this.VisibleLayerIds.length = 0;
        this.VisibleLayers.forEach(visLayer => {
            this.VisibleLayerIds.push(visLayer.id);
        });
        if (this.VisibleLayerIds.length === 0) {
            this.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
        }
    };
}