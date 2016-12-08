L.Draw.Rectangle = L.Draw.Rectangle.extend({
    _getTooltipText: function () {
        var tooltipText = L.Draw.SimpleShape.prototype._getTooltipText.call(this),
            shape = this._shape,
            latLngs, area, subtext;

        if (shape) {
            latLngs = this._shape.getLatLngs();
            area = L.GeometryUtil.geodesicArea(latLngs);
            subtext = L.GeometryUtil.readableArea(area, this.options.metric);
        }

        return {
            text: tooltipText.text,
            subtext: ''
        };
    }
});
'use strict';
(function () {

    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function (MapData, map) {
        var _service = {};

        _service.StartDraw = function (DrawingOptie) {
            var options = {
                metric: false,
                showArea: false,
                shapeOptions: {
                    stroke: true,
                    color: '#22528b',
                    weight: 4,
                    opacity: 0.6,
                    // fill: true,
                    fillColor: null, //same as color by default
                    fillOpacity: 0.4,
                    clickable: false
                }
            }
            switch (MapData.DrawingType) {
                case DrawingOption.LIJN:
                case DrawingOption.AFSTAND:
                    MapData.DrawingObject = new L.Draw.Polyline(map, options);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.POLYGON:
                case DrawingOption.OPPERVLAKTE:
                    MapData.DrawingObject = new L.Draw.Polygon(map, options);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.VIERKANT:
                    MapData.DrawingObject = new L.Draw.Rectangle(map, options);
                    MapData.DrawingObject.enable();
                    break;
                default:
                    break;
            }
        };
        return _service;
    };
    // module.$inject = ['MapData', 'map'];

    module.factory("DrawService", service);
})();