var TinkGis;
(function (TinkGis) {
    'use strict';
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
        get EnabledLayers() {
            if (this.Visible) {
                var allLay = this.AllLayers.filter(x => x.enabled);
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
    TinkGis.Theme = Theme;
    class ArcGIStheme extends Theme {
        constructor(rawdata, themeData) {
            super();
            let rawlayers = rawdata.layers;
            this.name = this.Naam = rawdata.documentInfo.Title;
            this.Description = rawdata.documentInfo.Subject;
            this.CleanUrl = themeData.cleanUrl;
            let cleanurlSplitted = themeData.cleanUrl.split('/');
            this.Url = cleanurlSplitted[5] + '/' + cleanurlSplitted[6] + '/' + cleanurlSplitted[7] + '/' + cleanurlSplitted[8];
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
                    var parentlayer = convertedLayers.find(x => x.id == argislay.parentLayerId);
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
        ;
    }
    TinkGis.ArcGIStheme = ArcGIStheme;
    class wmstheme extends Theme {
        constructor(data, url) {
            super();
            this.Version = data['version'];
            this.name = data.service.title;
            this.Naam = data.service.title;
            this.enabled = true;
            this.Visible = true;
            this.CleanUrl = url;
            this.Added = false;
            this.status = ThemeStatus.NEW;
            this.Description = data.service.abstract;
            this.Type = ThemeType.WMS;
            var layers = data.capability.layer.layer;
            var lays = [];
            if (layers) {
                if (layers.length == undefined) {
                    lays.push(layers);
                }
                else {
                    lays = layers;
                }
            }
            else {
                lays.push(data.capability.layer);
            }
            layers.forEach(layer => {
                let lay = new TinkGis.wmslayer(layer, this);
                this.Layers.push(lay);
            });
        }
        UpdateMap(map) {
            map.removeLayer(this.MapData);
            map.addLayer(this.MapData);
        }
    }
    TinkGis.wmstheme = wmstheme;
})(TinkGis || (TinkGis = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE9BQU8sQ0FtSWhCO0FBbklELFdBQVUsT0FBTyxFQUFDLENBQUM7SUFDZixZQUFZLENBQUM7SUFDYjtRQUFBO1lBaUJJLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1lBMEIxQixvQkFBZSxHQUFHLENBQUMsWUFBWTtnQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSztvQkFDeEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUE7UUFFTCxDQUFDO1FBL0JHLElBQUksYUFBYTtZQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksTUFBTSxHQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN6RSxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUM7WUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2QsQ0FBQzs7UUFDRCxJQUFJLGFBQWE7WUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLE1BQU0sR0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakUsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDO1lBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNkLENBQUM7O1FBQ0QsSUFBSSxlQUFlO1lBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7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