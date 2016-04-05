'use strict';
(function() {

    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function(MapData, map) {
        var _service = {};

        _service.StartDraw = function(DrawingOptie) {
            switch (MapData.DrawingType) {
                case DrawingOption.LIJN:
                case DrawingOption.AFSTAND:
                    MapData.DrawingObject = new L.Draw.Polyline(map);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.POLYGON:
                case DrawingOption.OPPERVLAKTE:
                    var polygon_options = {
                        showArea: true,
                        shapeOptions: {
                            stroke: true,
                            color: '#22528b',
                            weight: 4,
                            opacity: 0.6,
                            fill: true,
                            fillColor: null, //same as color by default
                            fillOpacity: 0.4,
                            clickable: true
                        }
                    }
                    MapData.DrawingObject = new L.Draw.Polygon(map, polygon_options);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.VIERKANT:
                    MapData.DrawingObject = new L.Draw.Rectangle(map);
                    MapData.DrawingObject.enable();
                    break;
                default:
                    break;
            }
        }
        return _service;
    };
    // module.$inject = ['MapData', 'map'];

    module.factory("DrawService", service);
})();