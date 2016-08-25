'use strict';
var app;
(function (app) {
    class Theme {
        constructor() {
            this.Layers = [];
            this.UpdateDisplayed = (currentScale) => {
                this.AllLayers.forEach(layer => {
                    layer.UpdateDisplayed(currentScale);
                });
            };
        }
        get VisibleLayers() {
            if (this.Visible) {
                var allLay = this.AllLayers.filter(x => x.ShouldBeVisible);
                return allLay;
            }
            return [];
        }
        ;
        get VisibleLayerIds() {
            return this.VisibleLayers.map(x => x.id);
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
    app.Theme = Theme;
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxZQUFZLENBQUM7QUFDYixJQUFVLEdBQUcsQ0F1RFo7QUF2REQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQUE7WUFpQkksV0FBTSxHQUFpQixFQUFFLENBQUM7WUFtQjFCLG9CQUFlLEdBQUcsQ0FBQyxZQUFZO2dCQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLO29CQUN4QixLQUFLLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN4QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQTtRQWFMLENBQUM7UUFuQ0csSUFBSSxhQUFhO1lBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxNQUFNLEdBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDZCxDQUFDOztRQUNELElBQUksZUFBZTtZQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUM7O1FBQ0QsSUFBSSxTQUFTO1lBQ1QsSUFBSSxNQUFNLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRztnQkFDbkIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDOztJQW1CTCxDQUFDO0lBckRxQixTQUFLLFFBcUQxQixDQUFBO0FBQ0wsQ0FBQyxFQXZEUyxHQUFHLEtBQUgsR0FBRyxRQXVEWiJ9