var TinkGis;
(function (TinkGis) {
    'use strict';
    class LayerJSON {
        constructor() {
        }
    }
    TinkGis.LayerJSON = LayerJSON;
    class Layer extends LayerJSON {
        constructor(...args) {
            super(...args);
            this.parent = null;
            this.Layers = [];
            this.UpdateDisplayed = (currentScale) => {
                if (this.maxScale > 0 || this.minScale > 0) {
                    if (currentScale > this.maxScale && currentScale < this.minScale) {
                        this.displayed = true;
                    }
                    else {
                        this.displayed = false;
                    }
                }
            };
            this.toString = () => {
                return `Lay: (id: ${this.name})`;
            };
        }
        get hasLayers() {
            if (this.Layers) {
                return this.Layers.length > 0;
            }
            return false;
        }
        ;
        get ShouldBeVisible() {
            if (this.IsEnabledAndVisible && !this.hasLayers) {
                if (!this.parent || this.parent.IsEnabledAndVisible) {
                    return true;
                }
            }
            return false;
        }
        get IsEnabledAndVisible() {
            if (this.theme.enabled && this.enabled && this.visible) {
                if (!this.parent) {
                    return true;
                }
                else {
                    return this.parent.IsEnabledAndVisible;
                }
            }
            return false;
        }
        get AllLayers() {
            var allLay = this.Layers;
            this.Layers.forEach(lay => {
                allLay = allLay.concat(lay.AllLayers);
            });
            return allLay;
        }
        ;
    }
    TinkGis.Layer = Layer;
    class wmslayer extends Layer {
        constructor(layerData, parenttheme) {
            super();
            Object.assign(this, layerData);
            this.visible = true;
            this.enabled = false;
            this.displayed = true;
            this.theme = parenttheme;
            this.queryable = layerData.queryable;
            this.id = this.name;
        }
        get legendUrl() {
            return this.theme.CleanUrl + '?Service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + this.id;
        }
        ;
    }
    TinkGis.wmslayer = wmslayer;
    class argislegend {
        constructor(label, url) {
            this.label = label;
            this.url = url;
        }
    }
    TinkGis.argislegend = argislegend;
    class arcgislayer extends Layer {
        constructor(layerData, parenttheme) {
            super();
            Object.assign(this, layerData);
            this.visible = layerData.defaultVisibility;
            this.enabled = false;
            this.title = layerData.name;
            this.theme = parenttheme;
            this.displayed = true;
            this.queryable = false;
        }
        get legends() {
            return this.legend.map(x => new argislegend(x.label, x.fullurl));
        }
    }
    TinkGis.arcgislayer = arcgislayer;
})(TinkGis || (TinkGis = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE9BQU8sQ0FxSGhCO0FBckhELFdBQVUsT0FBTyxFQUFDLENBQUM7SUFFZixZQUFZLENBQUM7SUFFYjtRQVFJO1FBQ0EsQ0FBQztJQUNMLENBQUM7SUFWWSxpQkFBUyxZQVVyQixDQUFBO0lBQ0Qsb0JBQW9DLFNBQVM7UUFBN0M7WUFBb0MsZUFBUztZQUt6QyxXQUFNLEdBQVUsSUFBSSxDQUFDO1lBSXJCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1lBaUMxQixvQkFBZSxHQUFHLENBQUMsWUFBWTtnQkFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV6QyxFQUFFLENBQUMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUMxQixDQUFDO29CQUNELElBQUksQ0FBQyxDQUFDO3dCQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDLENBQUM7WUFDSyxhQUFRLEdBQUc7Z0JBRWQsTUFBTSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO1lBQ3JDLENBQUMsQ0FBQTtRQUNMLENBQUM7UUEvQ0csSUFBSSxTQUFTO1lBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDOztRQUNELElBQUksZUFBZTtZQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsSUFBSSxtQkFBbUI7WUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDO2dCQUMzQyxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELElBQUksU0FBUztZQUNULElBQUksTUFBTSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ25CLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQzs7SUFnQkwsQ0FBQztJQXpEcUIsYUFBSyxRQXlEMUIsQ0FBQTtJQUNELHVCQUE4QixLQUFLO1FBRS9CLFlBQVksU0FBYyxFQUFFLFdBQWtCO1lBQzFDLE9BQU8sQ0FBQztZQUNSLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDeEIsQ0FBQztRQUNELElBQUksU0FBUztZQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyw2RUFBNkUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3pILENBQUM7O0lBQ0wsQ0FBQztJQWZZLGdCQUFRLFdBZXBCLENBQUE7SUFDRDtRQUNJLFlBQVksS0FBYSxFQUFFLEdBQVc7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDbkIsQ0FBQztJQUdMLENBQUM7SUFQWSxtQkFBVyxjQU92QixDQUFBO0lBRUQsMEJBQWlDLEtBQUs7UUFHbEMsWUFBWSxTQUFvQixFQUFFLFdBQWtCO1lBQ2hELE9BQU8sQ0FBQztZQUNSLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1lBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUMzQixDQUFDO1FBRUQsSUFBSSxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7SUFDTCxDQUFDO0lBakJZLG1CQUFXLGNBaUJ2QixDQUFBO0FBRUwsQ0FBQyxFQXJIUyxPQUFPLEtBQVAsT0FBTyxRQXFIaEIifQ==