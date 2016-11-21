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
        var berekendAfstand = function (arrayOfPoints) {
            var totalDistance = 0.00000;
            for (let x = 0; x != arrayOfPoints.length - 1; x++) { // do min 1 because we the last point don t have to calculate distance to the next one
                var currpoint = arrayOfPoints[x];
                var nextpoint = arrayOfPoints[x + 1];
                totalDistance += currpoint.distanceTo(nextpoint);
            }
            return totalDistance.toFixed(2);
        }
        var berkenOmtrek = function (arrayOfPoints) {
            var totalDistance = 0.00000;
            for (let x = 0; x != arrayOfPoints.length; x++) {
                var currpoint = arrayOfPoints[x];
                if (x == arrayOfPoints.length - 1) {
                    var nextpoint = arrayOfPoints[0]; // if it is the last point, check the distance to the first point
                } else {
                    var nextpoint = arrayOfPoints[x + 1];
                }
                totalDistance += currpoint.distanceTo(nextpoint); // from this point to the next point the distance and sum it
            }
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
                            var afstand = berekendAfstand(e.layer._latlngs);
                            var popup = e.layer.bindPopup('Afstand (m): ' + afstand + ' ');
                            popup.on('popupclose', function (event) {
                                MapData.CleanMap();
                            });
                            e.layer.openPopup();
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            var omtrek = berkenOmtrek(e.layer._latlngs[0]);
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
        var gpsmarker = null;
        map.on('locationfound', function (e) {
            // var radius = e.accuracy / 2;
            _mapEvents.ClearGPS();
            var gpsicon = L.divIcon({ className: 'fa fa-crosshairs fa-2x blue', style: 'color: blue' });
            gpsmarker = L.marker(e.latlng, { icon: gpsicon }).addTo(map);
            // var popup = marker.bindPopup("GPS").openPopup();
            // popup.on('popupclose', function (e) {
            //     map.removeLayer(marker);
            // })
            // L.circle(e.latlng, radius).addTo(map);
        });
        _mapEvents.ClearGPS = function () {
            if (gpsmarker) {
                gpsmarker.removeFrom(map);
            }
        }
        map.on('locationerror', function (e) {
            console.log('LOCATIONERROR', e);
        });

        return _mapEvents;
    };
    module.$inject = ['map', 'MapService', 'MapData', 'UIService'];

    module.factory('MapEvents', mapEvents);
})();


