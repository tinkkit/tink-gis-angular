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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE9BQU8sQ0FvSGhCO0FBcEhELFdBQVUsT0FBTztJQUViLFlBQVksQ0FBQztJQUViO1FBUUk7UUFDQSxDQUFDO0tBQ0o7SUFWWSxpQkFBUyxZQVVyQixDQUFBO0lBQ0QsV0FBNEIsU0FBUSxTQUFTO1FBQTdDOztZQUtJLFdBQU0sR0FBVSxJQUFJLENBQUM7WUFJckIsV0FBTSxHQUFpQixFQUFFLENBQUM7WUFpQzFCLG9CQUFlLEdBQUcsQ0FBQyxZQUFZO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXpDLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDakUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQzFCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUNNLGFBQVEsR0FBRztnQkFFZCxNQUFNLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7WUFDckMsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQTlDRyxJQUFJLFNBQVM7WUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFBQSxDQUFDO1FBQ0Ys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