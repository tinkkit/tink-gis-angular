'use strict';
(function () {
    var module = angular.module('tink.gis');
    var mapEvents = function (map, MapService, MapData, UIService) {
        var _mapEvents = {};
        map.on('draw:drawstart', function (event) {
            console.log('draw started');
            MapData.IsDrawing = true;
            // MapData.CleanDrawings();
        });

        map.on('draw:drawstop', function (event) {
            console.log('draw stopped');
            MapData.IsDrawing = false;
            // MapData.CleanDrawings();
        });

        var berkenOmtrek = function (layer) {
            // Calculating the distance of the polyline
            var tempLatLng = null;
            var totalDistance = 0.00000;
            _.each(layer._latlngs, function (latlng) {
                if (tempLatLng == null) {
                    tempLatLng = latlng;
                    return;
                }
                totalDistance += tempLatLng.distanceTo(latlng);
                tempLatLng = latlng;
            });
            return totalDistance.toFixed(2);
        };

        map.on('zoomend', function (event) {
            console.log('Zoomend!!!');
            MapData.UpdateDisplayed();
            MapData.Apply();
        });

        map.on('click', function (event) {
            if (event.originalEvent instanceof MouseEvent) {
                console.log('click op map! Is drawing: ' + MapData.IsDrawing);
                if (!MapData.IsDrawing) {
                    MapData.CleanMap();
                    switch (MapData.ActiveInteractieKnop) {
                        case ActiveInteractieButton.IDENTIFY:
                            MapData.LastIdentifyBounds = map.getBounds();
                            MapService.Identify(event, 10);
                            UIService.OpenLeftSide();
                            break;
                        case ActiveInteractieButton.SELECT:
                            if (MapData.DrawingType === DrawingOption.NIETS) {
                                MapService.Select(event);
                                UIService.OpenLeftSide();
                            } // else a drawing finished
                            break;
                        case ActiveInteractieButton.WATISHIER:
                            MapService.WatIsHier(event);
                            break;
                        case ActiveInteractieButton.METEN:

                            break;
                        default:
                            console.log('MAG NIET!!!!!!!!');
                            break;
                    }
                }
                else {
                    // MapData.DrawingObject = event;
                    console.log("DrawingObject: ");
                    console.log(MapData.DrawingObject);
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            break;
                        default:
                            console.log("Aant drawen zonder een gekent type!!!!!!");
                            break;
                    }
                }
            }
        });


        map.on('draw:created', function (e) {
            console.log('draw created');
            switch (MapData.ActiveInteractieKnop) {
                case ActiveInteractieButton.SELECT:
                    switch (MapData.DrawingType) {
                        case DrawingOption.LIJN:
                            break;
                        case DrawingOption.VIERKANT:
                            break;
                        case DrawingOption.POLYGON:
                            break;
                        default:
                            break;
                    }
                    MapService.Query(e.layer);
                    UIService.OpenLeftSide();
                    break;
                case ActiveInteractieButton.METEN:
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            var omtrek = berkenOmtrek(e.layer);
                            var popup = e.layer.bindPopup('Afstand (m): ' + omtrek + ' ');
                            popup.on('popupclose', function (event) {
                                MapData.CleanMap();
                            });
                            e.layer.openPopup();
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            var omtrek = berkenOmtrek(e.layer);
                            var popuptekst = '<p>Opp  (m<sup>2</sup>): ' + (LGeo.area(e.layer)).toFixed(2) + '</p>'
                                + '<p>Omtrek (m): ' + omtrek + ' </p>';
                            var popup = e.layer.bindPopup(popuptekst);
                            popup.on('popupclose', function (event) {
                                MapData.CleanMap();
                            });
                            e.layer.openPopup();
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    console.log('MAG NIET!!!!!!!!');
                    break;
            }
            MapData.IsDrawing = false;
        });


        return _mapEvents;
    };
    module.$inject = ['map', 'MapService', 'MapData', 'UIService'];

    module.factory('MapEvents', mapEvents);
})();


