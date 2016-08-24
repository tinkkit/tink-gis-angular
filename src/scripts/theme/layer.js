'use strict';
var app;
(function (app) {
    class LayerJSON {
        constructor() {
        }
    }
    app.LayerJSON = LayerJSON;
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
        get IsRealyVisible() {
            return this.enabled && this.visible && !this.hasLayers;
        }
        ;
        get hasLayers() {
            if (this.Layers) {
                return this.Layers.length > 0;
            }
            return false;
        }
        ;
        get AllLayers() {
            var allLay = this.Layers;
            this.Layers.forEach(lay => {
                allLay = allLay.concat(lay.AllLayers);
            });
            return allLay;
        }
        ;
    }
    app.Layer = Layer;
    class wmslayer extends Layer {
        constructor(info, parenttheme) {
            super();
            Object.assign(this, info);
            this.visible = true;
            this.enabled = true;
            this.displayed = true;
            this.theme = parenttheme;
            this.queryable = info.queryable;
            this.id = this.name;
        }
    }
    app.wmslayer = wmslayer;
    class arcgislayer extends Layer {
        constructor(info, parenttheme) {
            super();
            Object.assign(this, info);
            this.visible = info.defaultVisibility;
            this.enabled = true;
            this.title = info.name;
            this.theme = parenttheme;
            this.displayed = true;
        }
    }
    app.arcgislayer = arcgislayer;
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixJQUFVLEdBQUcsQ0FzRlo7QUF0RkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUVYO1FBUUk7UUFDQSxDQUFDO0lBQ0wsQ0FBQztJQVZZLGFBQVMsWUFVckIsQ0FBQTtJQUNELG9CQUFvQyxTQUFTO1FBQTdDO1lBQW9DLGVBQVM7WUFPekMsV0FBTSxHQUFRLElBQUksQ0FBQztZQVduQixXQUFNLEdBQWlCLEVBQUUsQ0FBQztZQVMxQixvQkFBZSxHQUFHLENBQUMsWUFBWTtnQkFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDakYsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDMUIsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDM0IsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQyxDQUFDO1lBQ0ssYUFBUSxHQUFHO2dCQUVkLE1BQU0sQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztZQUNyQyxDQUFDLENBQUE7UUFDTCxDQUFDO1FBeENHLElBQUksY0FBYztZQUVkLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzNELENBQUM7O1FBT0QsSUFBSSxTQUFTO1lBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDOztRQUdELElBQUksU0FBUztZQUNULElBQUksTUFBTSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ25CLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQzs7SUFnQkwsQ0FBQztJQTFDcUIsU0FBSyxRQTBDMUIsQ0FBQTtJQUNELHVCQUE4QixLQUFLO1FBRy9CLFlBQVksSUFBUyxFQUFFLFdBQWtCO1lBQ3JDLE9BQU8sQ0FBQztZQUNSLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDeEIsQ0FBQztJQUNMLENBQUM7SUFiWSxZQUFRLFdBYXBCLENBQUE7SUFDRCwwQkFBaUMsS0FBSztRQUVsQyxZQUFZLElBQWUsRUFBRSxXQUFrQjtZQUMzQyxPQUFPLENBQUM7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7WUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFJMUIsQ0FBQztJQUNMLENBQUM7SUFkWSxlQUFXLGNBY3ZCLENBQUE7QUFFTCxDQUFDLEVBdEZTLEdBQUcsS0FBSCxHQUFHLFFBc0ZaIn0=