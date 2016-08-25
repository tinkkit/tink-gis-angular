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
        get hasLayers() {
            if (this.Layers) {
                return this.Layers.length > 0;
            }
            return false;
        }
        ;
        get ShouldBeVisible() {
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
        get IsEnabledAndVisible() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixJQUFVLEdBQUcsQ0F5R1o7QUF6R0QsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUVYO1FBUUk7UUFDQSxDQUFDO0lBQ0wsQ0FBQztJQVZZLGFBQVMsWUFVckIsQ0FBQTtJQUNELG9CQUFvQyxTQUFTO1FBQTdDO1lBQW9DLGVBQVM7WUFNekMsV0FBTSxHQUFVLElBQUksQ0FBQztZQVVyQixXQUFNLEdBQWlCLEVBQUUsQ0FBQztZQThCMUIsb0JBQWUsR0FBRyxDQUFDLFlBQVk7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ2pGLEVBQUUsQ0FBQyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQzFCLENBQUM7b0JBQ0QsSUFBSSxDQUFDLENBQUM7d0JBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUNLLGFBQVEsR0FBRztnQkFFZCxNQUFNLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7WUFDckMsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQW5ERyxJQUFJLFNBQVM7WUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFD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