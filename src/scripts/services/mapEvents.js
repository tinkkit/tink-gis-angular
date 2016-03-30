'use strict';
(function() {
    var module = angular.module('tink.gis');
    var mapEvents = function(map, MapService, MapData, DrawService) {
        var _mapEvents = {};
        map.on('draw:drawstart', function(event) {
            console.log('draw started');
            MapData.IsDrawing = true;
            // MapData.CleanDrawings();
        });
        var berkenOmtrek = function(layer) {
            // Calculating the distance of the polyline
            var tempLatLng = null;
            var totalDistance = 0.00000;
            _.each(layer._latlngs, function(latlng) {
                if (tempLatLng == null) {
                    tempLatLng = latlng;
                    return;
                }
                console.log(tempLatLng.distanceTo(latlng) + " m");
                totalDistance += tempLatLng.distanceTo(latlng);
                tempLatLng = latlng;
            });
            return totalDistance.toFixed(2);
        };

        map.on('zoomend', function(event) {
            console.log('Zoomend!!!');
            console.log(event);
            MapData.Themes.forEach(x => {
                console.log(x.MapData);
            });
        });

        map.on('click', function(event) {
            console.log('click op map! Is drawing: ' + MapData.IsDrawing);
            if (!MapData.IsDrawing) {
                MapData.CleanAll();
                switch (MapData.ActiveInteractieKnop) {
                    case ActiveInteractieButton.IDENTIFY:
                        MapService.Identify(event, 2);
                        break;
                    case ActiveInteractieButton.SELECT:
                        if (MapData.SelectedLayer.id === '') {
                            console.log('Geen layer selected! kan dus niet opvragen');
                        }
                        else {
                            MapService.Select(event);
                        }
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
        });


        map.on('draw:created', function(e) {
            console.log('draw created');
            console.log(e)
            switch (MapData.ActiveInteractieKnop) {
                case ActiveInteractieButton.SELECT:
                    if (MapData.SelectedLayer.id == '') {
                        console.log('Geen layer selected! kan dus niet opvragen');
                    }
                    else {
                        MapService.Query(event);
                    }
                    break;
                case ActiveInteractieButton.METEN:
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            var omtrek = berkenOmtrek(e.layer);
                            var popup = e.layer.bindPopup('Afstand (m): ' + omtrek + ' ');
                            popup.on('popupclose', function(event) {
                                MapData.CleanAll();
                            });
                            e.layer.openPopup();
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            var omtrek = berkenOmtrek(e.layer);
                            var popuptekst = '<p>Opp  (km<sup>2</sup>): ' + (LGeo.area(e.layer) / 1000000).toFixed(2) + '</p>'
                                + '<p>Omtrek (m): ' + omtrek + ' </p>';
                            var popup = e.layer.bindPopup(popuptekst);
                            popup.on('popupclose', function(event) {
                                MapData.CleanAll();
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
    module.factory('MapEvents', mapEvents);
})();

