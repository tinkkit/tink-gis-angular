"use strict";
(function () {
  var module = angular.module("tink.gis");
  var mapEvents = function (map, MapService, MapData, UIService, $rootScope) {
    var _mapEvents = {};
    map.on("draw:drawstart", function (event) {
      console.log("draw started");
      MapData.IsDrawing = true;
      // MapData.CleanDrawings();
    });

    map.on("draw:drawstop", function (event) {
      console.log("draw stopped");
      MapData.IsDrawing = false;
      if (MapData.RemovedUnfinishedDrawings === false) {
        $rootScope.$applyAsync(function () {
          MapData.DrawingType = DrawingOption.GEEN;
        });
      }
      // MapData.CleanDrawings();
    });
    var berekendAfstand = function (arrayOfPoints) {
      var totalDistance = 0.0;
      for (let x = 0; x != arrayOfPoints.length - 1; x++) {
        // do min 1 because we the last point don t have to calculate distance to the next one
        var currpoint = arrayOfPoints[x];
        var nextpoint = arrayOfPoints[x + 1];
        totalDistance += currpoint.distanceTo(nextpoint);
      }
      return totalDistance.toFixed(2);
    };
    var berkenOmtrek = function (arrayOfPoints) {
      var totalDistance = 0.0;
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

    map.on("zoom", function (event) {
      console.log("Zoomend!!!");
      MapData.UpdateDisplayed();
      MapData.Apply();
    });
    _mapEvents.removeCursorAuto = function () {
      if ($(".leaflet-container").hasClass("cursor-auto")) {
        $(".leaflet-container").removeClass("cursor-auto");
      }
    };
    map.on("click", function (event) {
      if (event.originalEvent instanceof MouseEvent) {
        console.log("click op map! Is drawing: " + MapData.IsDrawing);
        if (!MapData.IsDrawing) {
          switch (MapData.ActiveInteractieKnop) {
            case ActiveInteractieButton.IDENTIFY:
              MapData.CleanMap();
              MapData.LastIdentifyBounds = map.getBounds();
              MapService.Identify(event, 3);
              UIService.OpenLeftSide();
              $rootScope.$applyAsync(function () {
                MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
              });

              _mapEvents.removeCursorAuto();
              break;
            case ActiveInteractieButton.SELECT:
              if (
                MapData.DrawingType != DrawingOption.GEEN &&
                MapData.ExtendedType == null
              ) {
                if (MapData.DrawingType != DrawingOption.VIERKANT) {
                  MapData.CleanMap();
                }
                MapData.CleanSearch();
              }
              if (MapData.DrawingType === DrawingOption.NIETS) {
                MapService.Select(event);
                if (MapData.ExtendedType === null) {
                  MapData.SetDrawPoint(event.latlng);
                }
                UIService.OpenLeftSide();
                _mapEvents.removeCursorAuto();
                $rootScope.$applyAsync(function () {
                  MapData.DrawingType = DrawingOption.GEEN;
                  MapData.ShowDrawControls = false;
                  MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
                });
              }
              break;
            case ActiveInteractieButton.WATISHIER:
              MapData.CleanWatIsHier();
              MapService.WatIsHier(event);
              $rootScope.$applyAsync(function () {
                MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
                _mapEvents.removeCursorAuto();
              });
              break;
            case ActiveInteractieButton.METEN:
              break;
            case ActiveInteractieButton.GEEN:
              break;
            default:
              console.log("MAG NIET!!!!!!!!");
              break;
          }
        } else {
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

    map.on("draw:created", function (e) {
      console.log("draw created");
      switch (MapData.ActiveInteractieKnop) {
        case ActiveInteractieButton.SELECT:
          if (MapData.ExtendedType == null) {
            MapData.DrawLayer = e.layer; // it is used for buffering etc so we don t want it to be added when we are extending (when extendingtype is add or remove)
          }
          MapService.Query(e.layer);
          UIService.OpenLeftSide();
          break;
        case ActiveInteractieButton.METEN:
          switch (MapData.DrawingType) {
            case DrawingOption.AFSTAND:
              var afstand = berekendAfstand(e.layer._latlngs);
              var popup = e.layer.bindPopup("Afstand (m): " + afstand + " ");
              popup.on("popupclose", function (event) {
                map.removeLayer(e.layer);
                // MapData.CleanDrawings();
                // MapData.CleanMap();
              });
              e.layer.openPopup();
              break;
            case DrawingOption.OPPERVLAKTE:
              var omtrek = berkenOmtrek(e.layer._latlngs[0]);
              MapData.CreatePerimeterMarker(
                omtrek,
                LGeo.area(e.layer).toFixed(2),
                e
              );
              break;
            default:
              break;
          }
          break;
        default:
          console.log("MAG NIET!!!!!!!!");
          break;
      }
      $rootScope.$applyAsync(function () {
        MapData.DrawingType = DrawingOption.GEEN;
        MapData.ShowDrawControls = false;
        MapData.ShowMetenControls = false;
        MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
      });
      MapData.IsDrawing = false;
    });
    var gpsmarker = null;

    _mapEvents.ClearGPS = function () {
      if (gpsmarker) {
        gpsmarker.removeFrom(map);
      }
    };
    map.on("locationerror", function (e) {
      console.log("LOCATIONERROR", e);
    });

    return _mapEvents;
  };
  module.$inject = ["map", "MapService", "MapData", "UIService", "$rootScope"];

  module.factory("MapEvents", mapEvents);
})();
