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
                    console.log('MinMaxandCurrentScale', this.maxScale, this.minScale, currentScale);
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
            this.enabled = true;
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
            this.enabled = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE9BQU8sQ0FxSGhCO0FBckhELFdBQVUsT0FBTyxFQUFDLENBQUM7SUFFZixZQUFZLENBQUM7SUFFYjtRQVFJO1FBQ0EsQ0FBQztJQUNMLENBQUM7SUFWWSxpQkFBUyxZQVVyQixDQUFBO0lBQ0Qsb0JBQW9DLFNBQVM7UUFBN0M7WUFBb0MsZUFBUztZQUt6QyxXQUFNLEdBQVUsSUFBSSxDQUFDO1lBSXJCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1lBaUMxQixvQkFBZSxHQUFHLENBQUMsWUFBWTtnQkFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDakYsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDMUIsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDM0IsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQyxDQUFDO1lBQ0ssYUFBUSxHQUFHO2dCQUVkLE1BQU0sQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztZQUNyQyxDQUFDLENBQUE7UUFDTCxDQUFDO1FBL0NHLElBQUksU0FBUztZQUNULEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQzs7UUFDRCxJQUFJLGVBQWU7WUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELElBQUksbUJBQW1CO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQztvQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztnQkFDM0MsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxJQUFJLFNBQVM7WUFDVCxJQUFJLE1BQU0sR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNuQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7O0lBZ0JMLENBQUM7SUF6RHFCLGFBQUssUUF5RDFCLENBQUE7SUFDRCx1QkFBOEIsS0FBSztRQUUvQixZQUFZLFNBQWMsRUFBRSxXQUFrQjtZQUMxQyxPQUFPLENBQUM7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hCLENBQUM7UUFDRCxJQUFJLFNBQVM7WUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsNkVBQTZFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN6SCxDQUFDOztJQUNMLENBQUM7SUFmWSxnQkFBUSxXQWVwQixDQUFBO0lBQ0Q7UUFDSSxZQUFZLEtBQWEsRUFBRSxHQUFXO1lBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ25CLENBQUM7SUFHTCxDQUFDO0lBUFksbUJBQVcsY0FPdkIsQ0FBQTtJQUVELDBCQUFpQyxLQUFLO1FBR2xDLFlBQVksU0FBb0IsRUFBRSxXQUFrQjtZQUNoRCxPQUFPLENBQUM7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7WUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDM0IsQ0FBQztRQUVELElBQUksT0FBTztZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0wsQ0FBQztJQWpCWSxtQkFBVyxjQWlCdkIsQ0FBQTtBQUVMLENBQUMsRUFySFMsT0FBTyxLQUFQLE9BQU8sUUFxSGhCIn0=