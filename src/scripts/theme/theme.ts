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

        MapData: any;


        Layers: Array<Layer> = [];
        get VisibleLayers(): Array<Layer> {
            if (this.Visible) {
                var allLay: Array<Layer> = this.AllLayers.filter(x => x.ShouldBeVisible);
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
        // abstract funct UpdateMap: void;

        // RecalculateVisibleLayerIds = () => {
        //     this.VisibleLayerIds.length = 0;
        //     this.VisibleLayers.forEach(visLayer => {
        //         this.VisibleLayerIds.push(visLayer.id);
        //     });
        //     if (this.VisibleLayerIds.length === 0) {
        //         this.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
        //     }
        // };
    }
}