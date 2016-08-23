// import {Layer} from './layer';
'use strict';
namespace app {
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

        VisibleLayerIds: Array<any> = [];
        Layers: Array<Layer> = [];
        VisibleLayers: Array<Layer> = [];
        AllLayers: Array<Layer> = [];
        Groups: Array<Layer> = [];

        MapData: any;

        UpdateDisplayed = (currentScale) => {
            this.AllLayers.forEach(layer => {
                layer.UpdateDisplayed(currentScale);
            });
        }
        abstract UpdateMap(mapobject?: L.Map): void;
        // abstract funct UpdateMap: void;

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
}