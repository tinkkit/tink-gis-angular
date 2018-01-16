var TinkGis;
(function (TinkGis) {
    'use strict';
    class Theme {
        constructor() {
            this.Layers = [];
            this.UpdateDisplayed = (currentScale) => {
                this.EnabledLayers.forEach(layer => {
                    console.log("updating displayed status for layer: ", layer);
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
        get VisibleAndDisplayedLayerIds() {
            if (this.Visible) {
                var allLay = this.AllLayers.filter(x => x.ShouldBeVisible && x.displayed).map(x => x.id);
                return allLay;
            }
            return [];
        }
        get EnabledLayers() {
            if (this.Visible) {
                var allLay = this.AllLayers.filter(x => x.enabled);
                return allLay;
            }
            return [];
        }
        get VisibleLayerIds() {
            return this.VisibleLayers.map(x => x.id);
        }
        get AllLayers() {
            var allLay = this.Layers;
            this.Layers.forEach(lay => {
                allLay = allLay.concat(lay.AllLayers);
            });
            return allLay;
        }
    }
    TinkGis.Theme = Theme;
    class ArcGIStheme extends Theme {
        constructor(rawdata, themeData) {
            super();
            let rawlayers = rawdata.layers;
            this.name = this.Naam = rawdata.documentInfo.Title;
            this.Description = rawdata.documentInfo.Subject;
            this.cleanUrl = themeData.cleanUrl;
            this.Opacity = themeData.opacity;
            this.Url = themeData.cleanUrl;
            this.Visible = true;
            this.Added = false;
            this.enabled = true;
            this.Type = ThemeType.ESRI;
            this.status = ThemeStatus.UNMODIFIED;
            this.MapData = {};
            let convertedLayers = rawlayers.map(x => new TinkGis.arcgislayer(x, this));
            convertedLayers.forEach(argislay => {
                if (argislay.parentLayerId === -1) {
                    this.Layers.push(argislay);
                }
                else {
                    var parentlayer = convertedLayers.find(x => x.id === argislay.parentLayerId);
                    argislay.parent = parentlayer;
                    parentlayer.Layers.push(argislay);
                }
            });
        }
        UpdateMap() {
            if (this.VisibleLayerIds.length !== 0) {
                this.MapData.setLayers(this.VisibleLayerIds);
            }
            else {
                this.MapData.setLayers([-1]);
            }
        }
        SetOpacity(opacity) {
            this.Opacity = opacity;
            this.MapData.setOpacity(opacity);
        }
    }
    TinkGis.ArcGIStheme = ArcGIStheme;
    class wmstheme extends Theme {
        constructor(data, url) {
            super();
            this.Version = data.version;
            this.name = this.Naam = data.service.title;
            this.enabled = true;
            this.Visible = true;
            this.cleanUrl = url;
            this.Added = false;
            this.status = ThemeStatus.NEW;
            this.Description = data.service.abstract;
            this.Type = ThemeType.WMS;
            var layers = data.capability.layer;
            if (layers.layer) {
                layers = layers.layer;
            }
            if (layers.layer) {
                layers = layers.layer;
            }
            var lays = [];
            if (layers) {
                if (layers.length === undefined) {
                    lays.push(layers);
                }
                else {
                    lays = layers;
                }
            }
            else {
                lays.push(data.capability.layer);
            }
            lays.forEach(layer => {
                if (layer.queryable === true) {
                    if (data.capability.request.getfeatureinfo.format.some(x => x === "text/xml")) {
                        this.GetFeatureInfoType = "text/xml";
                    }
                    else if (data.capability.request.getfeatureinfo.format.some(x => x === "text/plain")) {
                        this.GetFeatureInfoType = "text/plain";
                    }
                    if (!this.GetFeatureInfoType) {
                        layer.queryable = false;
                    }
                }
                let lay = new TinkGis.wmslayer(layer, this);
                this.Layers.push(lay);
            });
        }
        UpdateMap(map) {
            if (this.VisibleLayerIds.length !== 0) {
                if (!map.hasLayer(this.MapData)) {
                    map.addLayer(this.MapData);
                }
                this.MapData.options.layers = this.MapData.wmsParams.layers = this.VisibleLayerIds.join(",");
                this.MapData.redraw();
            }
            else {
                if (map.hasLayer(this.MapData)) {
                    map.removeLayer(this.MapData);
                }
            }
        }
    }
    TinkGis.wmstheme = wmstheme;
})(TinkGis || (TinkGis = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE9BQU8sQ0E2S2hCO0FBN0tELFdBQVUsT0FBTyxFQUFDLENBQUM7SUFDZixZQUFZLENBQUM7SUFDYjtRQUFBO1lBa0JJLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1lBaUMxQixvQkFBZSxHQUFHLENBQUMsWUFBWTtnQkFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSztvQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUE7UUFFTCxDQUFDO1FBdkNHLElBQUksYUFBYTtZQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksTUFBTSxHQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN6RSxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUM7WUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUNELElBQUksMkJBQTJCO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksTUFBTSxHQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQztZQUNELE1BQU0s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