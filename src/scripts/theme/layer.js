var TinkGis;
(function (TinkGis) {
    'use strict';
    class LayerJSON {
        constructor() {
        }
    }
    TinkGis.LayerJSON = LayerJSON;
    class Layer extends LayerJSON {
        constructor() {
            super(...arguments);
            this.parent = null;
            this.Layers = [];
            this.UpdateDisplayed = (currentScale) => {
                if (this.maxScale > 0 || this.minScale > 0) {
                    if (currentScale >= this.maxScale && currentScale <= this.minScale) {
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
            return this.theme.cleanUrl + '?Service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + this.id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE9BQU8sQ0FvSGhCO0FBcEhELFdBQVUsT0FBTztJQUViLFlBQVksQ0FBQztJQUViO1FBUUk7UUFDQSxDQUFDO0tBQ0o7SUFWWSxpQkFBUyxZQVVyQixDQUFBO0lBQ0QsV0FBNEIsU0FBUSxTQUFTO1FBQTdDOztZQUtJLFdBQU0sR0FBVSxJQUFJLENBQUM7WUFJckIsV0FBTSxHQUFpQixFQUFFLENBQUM7WUFpQzFCLG9CQUFlLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV6QyxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ2pFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUMxQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDLENBQUE7WUFDTSxhQUFRLEdBQUcsR0FBVyxFQUFFO2dCQUUzQixNQUFNLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7WUFDckMsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQTlDRyxJQUFJLFNBQVM7WUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFBQSxDQUFDO1FBQ0YsSUFBSSxlQUFlO1lBQ2YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxJQUFJLG1CQUFtQjtZQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7Z0JBQzNDLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsSUFBSSxTQUFTO1lBQ1QsSUFBSSxNQUFNLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztLQWVKO0lBeERxQixhQUFLLFFBd0QxQixDQUFBO0lBQ0QsY0FBc0IsU0FBUSxLQUFLO1FBRS9CLFlBQVksU0FBYyxFQUFFLFdBQWtCO1lBQzFDLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7WUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN4QixDQUFDO1FBQ0QsSUFBSSxTQUFTO1lBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLDZFQUE2RSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDekgsQ0FBQztRQUFBLENBQUM7S0FDTDtJQWZZLGdCQUFRLFdBZXBCLENBQUE7SUFDRDtRQUNJLFlBQVksS0FBYSxFQUFFLEdBQVc7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDbkIsQ0FBQztLQUdKO0lBUFksbUJBQVcsY0FPdkIsQ0FBQTtJQUVELGlCQUF5QixTQUFRLEtBQUs7UUFHbEMsWUFBWSxTQUFvQixFQUFFLFdBQWtCO1lBQ2hELEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQzNCLENBQUM7UUFFRCxJQUFJLE9BQU87WUFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7S0FDSjtJQWpCWSxtQkFBVyxjQWlCdkIsQ0FBQTtBQUVMLENBQUMsRUFwSFMsT0FBTyxLQUFQLE9BQU8sUUFvSGhCIn0=