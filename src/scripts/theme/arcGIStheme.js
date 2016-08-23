'use strict';
var app;
(function (app) {
    class ArcGIStheme extends app.Theme {
        constructor(rawdata, themeData) {
            super();
            let rawlayers = rawdata.layers;
            this.Naam = rawdata.documentInfo.Title;
            this.name = rawdata.documentInfo.Title;
            this.Description = rawdata.documentInfo.Subject;
            this.Layers = [];
            this.AllLayers = [];
            this.Groups = [];
            this.CleanUrl = themeData.cleanUrl;
            this.Url = themeData.url;
            this.VisibleLayers = [];
            this.VisibleLayerIds = [];
            this.Visible = true;
            this.Added = false;
            this.enabled = true;
            this.Type = ThemeType.ESRI;
            this.status = ThemeStatus.NEW;
            this.MapData = {};
            rawlayers.forEach((layerInfo) => {
                let layer = new app.Layer(layerInfo, this);
                this.AllLayers.push(layer);
                if (layer.parentLayerId === -1) {
                    if (layer.subLayerIds === null) {
                        this.Layers.push(layer);
                    }
                    else {
                        this.Groups.push(layer);
                    }
                }
            });
            this.Groups.forEach((layerGroup) => {
                if (layerGroup.subLayerIds !== null) {
                    layerGroup.Layers = [];
                    this.AllLayers.forEach((layer) => {
                        if (layerGroup.id === layer.parentLayerId) {
                            layer.parent = layerGroup;
                            layerGroup.Layers.push(layer);
                        }
                    });
                }
            });
            this.RecalculateVisibleLayerIds();
        }
    }
    app.ArcGIStheme = ArcGIStheme;
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjR0lTdGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcmNHSVN0aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxZQUFZLENBQUM7QUFDYixJQUFVLEdBQUcsQ0E4Q1o7QUE5Q0QsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLDBCQUFpQyxTQUFLO1FBQ2xDLFlBQVksT0FBWSxFQUFFLFNBQWM7WUFDcEMsT0FBTyxDQUFDO1lBQ1IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztZQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVM7Z0JBQ3hCLElBQUksS0FBSyxHQUFHLElBQUksU0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1QixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVTtnQkFDM0IsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxVQUFVLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLO3dCQUN6QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOzRCQUN4QyxLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQzs0QkFDMUIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ2xDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7SUE1Q1ksZUFBVyxjQTRDdkIsQ0FBQTtBQUNMLENBQUMsRUE5Q1MsR0FBRyxLQUFILEdBQUcsUUE4Q1oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQge1RoZW1lfSBmcm9tICcuL3RoZW1lJztcclxuLy8gaW1wb3J0IHtMYXllcn0gZnJvbSAnLi9sYXllcic7XHJcbid1c2Ugc3RyaWN0JztcclxubmFtZXNwYWNlIGFwcCB7XHJcbiAgICBleHBvcnQgY2xhc3MgQXJjR0lTdGhlbWUgZXh0ZW5kcyBUaGVtZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocmF3ZGF0YTogYW55LCB0aGVtZURhdGE6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICBsZXQgcmF3bGF5ZXJzID0gcmF3ZGF0YS5sYXllcnM7XHJcbiAgICAgICAgICAgIHRoaXMuTmFhbSA9IHJhd2RhdGEuZG9jdW1lbnRJbmZvLlRpdGxlO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSByYXdkYXRhLmRvY3VtZW50SW5mby5UaXRsZTtcclxuICAgICAgICAgICAgdGhpcy5EZXNjcmlwdGlvbiA9IHJhd2RhdGEuZG9jdW1lbnRJbmZvLlN1YmplY3Q7XHJcbiAgICAgICAgICAgIHRoaXMuTGF5ZXJzID0gW107IC8vIGRlIGxheWVycyBkaXJlY3Qgb25kZXIgaGV0IHRoZW1lIHpvbmRlciBzdWJsYXllcnNcclxuICAgICAgICAgICAgdGhpcy5BbGxMYXllcnMgPSBbXTsgLy8gYWxsZSBMYXllcnMgZGllIGhpaiBoZWVmdCBpbmNsdWRpbmcgc3ViZ3JvdXBsYXllcnNcclxuICAgICAgICAgICAgdGhpcy5Hcm91cHMgPSBbXTsgLy8gbGF5ZXJncm91cHMgZGllIG5vZyBlZW5zIGxheWVycyB6ZWxmIGhlYmJlblxyXG4gICAgICAgICAgICB0aGlzLkNsZWFuVXJsID0gdGhlbWVEYXRhLmNsZWFuVXJsO1xyXG4gICAgICAgICAgICB0aGlzLlVybCA9IHRoZW1lRGF0YS51cmw7XHJcbiAgICAgICAgICAgIHRoaXMuVmlzaWJsZUxheWVycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLlZpc2libGVMYXllcklkcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLlZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLkFkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuVHlwZSA9IFRoZW1lVHlwZS5FU1JJO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFRoZW1lU3RhdHVzLk5FVztcclxuICAgICAgICAgICAgdGhpcy5NYXBEYXRhID0ge307XHJcbiAgICAgICAgICAgIHJhd2xheWVycy5mb3JFYWNoKChsYXllckluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBsYXllciA9IG5ldyBMYXllcihsYXllckluZm8sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5BbGxMYXllcnMucHVzaChsYXllcik7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIucGFyZW50TGF5ZXJJZCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGF5ZXIuc3ViTGF5ZXJJZHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5MYXllcnMucHVzaChsYXllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Hcm91cHMucHVzaChsYXllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5Hcm91cHMuZm9yRWFjaCgobGF5ZXJHcm91cCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxheWVyR3JvdXAuc3ViTGF5ZXJJZHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXllckdyb3VwLkxheWVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQWxsTGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXllckdyb3VwLmlkID09PSBsYXllci5wYXJlbnRMYXllcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllci5wYXJlbnQgPSBsYXllckdyb3VwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJHcm91cC5MYXllcnMucHVzaChsYXllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuUmVjYWxjdWxhdGVWaXNpYmxlTGF5ZXJJZHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=