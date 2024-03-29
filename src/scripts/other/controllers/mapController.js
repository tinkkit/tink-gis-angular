"use strict";
(function (module) {
  module = angular.module("tink.gis");
  var theController = module.controller("mapController", function (
    $scope,
    ExternService,
    BaseLayersService,
    MapService,
    MapData,
    map,
    MapEvents,
    DrawService,
    GisHelperService,
    GISService,
    PopupService,
    $interval,
    TypeAheadService,
    UIService,
    tinkApi,
    FeatureService,
    $modal
  ) {
    //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
    var vm = this;
    vm.exportPNG = function () {
      var width = $("#map").width();
      var height = $("#map").height();
      $("#map").css("width", width);
      $("#map").css("height", height);

      vm.easyprinter.printMap("CurrentSize", "Export");

      $("#map").css("width", "100%");
      $("#map").css("height", "100%");
    };
    var init = (function () {
      console.log("Tink-Gis-Angular component init!!!!!!!!!");
      if (window.location.href.startsWith("http://localhost:9000/")) {
        var externproj = JSON.parse(
          '{"naam":"sorteerstraat 2","extent":{"_northEast":{"lat":"51.2302167641279","lng":"4.42211298202784"},"_southWest":{"lat":"51.2296967607896","lng":"4.42029424518419"}},"guid":"376edeed-60e1-44cc-93ff-4e149cc4d4bc","extentString":"51.2302167641279,4.42211298202784,51.2296967607896,4.42029424518419","isKaart":true,"uniqId":202,"creatorId":38,"creator":null,"createDate":"2021-02-09T10:33:01.774872","updaterId":38,"updater":null,"lastUpdated":"2021-02-09T10:33:01.774872","themes":[{"cleanUrl":"https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Afval/Mapserver","naam":"Afval","type":"esri","visible":true,"layers":[{"id":"5","name":"sorteerstraat_ondergronds","visible":true},{"id":"2","name":"papiermand","visible":false},{"id":"0","name":"Afval-inzameling","visible":true}],"opacity":1}],"queryLayers":[{"layerId":5,"name":"sorteerstraat_ondergronds","baseUrl":"https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Afval/Mapserver","where":"OBJECTID = \'20\' "}],"isReadOnly":false}'
        );
        ExternService.Import(externproj);

        PopupService.Success(
          "Dev autoload",
          "Velo en fietspad loaded because you are in DEV.",
          function () {
            alert("onclicktestje");
          }
        );
      }
      TypeAheadService.init();


      //   function manualPrint () {
      //   }
    })();
    vm.mobile = L.Browser.mobile;
    vm.ZoekenOpLocatie = true;
    vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
    $scope.$watch(
      function () {
        return MapData.ActiveInteractieKnop;
      },
      function (data) {
        vm.activeInteractieKnop = data;
      },
      true
    );
    vm.easyprinter = L.easyPrint({
      tileWait: 250,
      exportOnly: true,
      hidden: true,
      hideControlContainer: true
    }).addTo(map);
    vm.drawingType = MapData.DrawingType;
    $scope.$watch(
      function () {
        return MapData.DrawingType;
      },
      function (data) {
        vm.drawingType = data;
      },
      true
    );

    vm.SelectableLayers = function () {
      return MapData.VisibleLayers;
    };
    vm.selectedLayer = MapData.SelectedLayer;
    $scope.$watch(
      function () {
        return MapData.SelectedLayer;
      },
      function (newval, oldval) {
        vm.selectedLayer = newval;
      }
    );
    vm.selectedFindLayer = MapData.SelectedFindLayer;
    $scope.$watch(
      function () {
        return MapData.SelectedFindLayer;
      },
      function (newval, oldval) {
        vm.selectedFindLayer = newval;
      }
    );
    $scope.$watch(
      function () {
        return MapData.ShowMetenControls;
      },
      function (data) {
        vm.showMetenControls = data;
      },
      true
    );
    vm.showMetenControls = MapData.ShowMetenControls;
    $scope.$watch(
      function () {
        return MapData.ShowDrawControls;
      },
      function (data) {
        vm.showDrawControls = data;
      },
      true
    );
    vm.showDrawControls = MapData.ShowDrawControls;
    vm.zoekLoc = "";
    vm.addCursorAuto = function () {
      if (!$(".leaflet-container").hasClass("cursor-auto")) {
        $(".leaflet-container").addClass("cursor-auto");
      }
    };
    vm.resetButtonBar = function () {
      MapData.ActiveInteractieKnop = ActiveInteractieButton.NIETS;
      vm.activeInteractieKnop = ActiveInteractieButton.NIETS;
      MapData.DrawingType = DrawingOption.NIETS;
      MapData.ExtendedType = null;
      MapData.ShowMetenControls = false;
      MapData.ShowDrawControls = false;
    };
    vm.interactieButtonChanged = function (ActiveButton) {
      if (vm.activeInteractieKnop != ActiveButton) {
        MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
        vm.activeInteractieKnop = ActiveButton;
        MapData.ShowMetenControls = false;
        MapData.ShowDrawControls = false;
        switch (ActiveButton) {
          case ActiveInteractieButton.IDENTIFY:
          case ActiveInteractieButton.WATISHIER:
            MapData.ExtendedType = null;
            vm.addCursorAuto();
            break;
          case ActiveInteractieButton.SELECT:
            MapData.ShowDrawControls = true;
            MapData.DrawingType = DrawingOption.GEEN; // pff must be possible to be able to sync them...
            vm.selectpunt();
            break;
          case ActiveInteractieButton.METEN:
            MapData.ExtendedType = null;
            MapData.ShowMetenControls = true;
            MapData.DrawingType = DrawingOption.GEEN;
            break;
        }
      } else {
        vm.resetButtonBar();
      }
    };
    vm.zoekLaag = function (search) {
      MapData.CleanMap();
      MapService.Find(search);
      UIService.OpenLeftSide();
    };
    var setViewAndPutDot = function (loc) {
      MapData.PanToPoint(loc);
      MapData.CreateDot(loc);
    };
    //ng-keyup="$event.keyCode == 13 && mapctrl.zoekLocatie(mapctrl.zoekLoc)"
    vm.zoekXY = function (search) {
      search = search.trim();
      var WGS84Check = GisHelperService.getWGS84CordsFromString(search);
      if (WGS84Check.hasCordinates) {
        setViewAndPutDot(WGS84Check);
      } else {
        var lambertCheck = GisHelperService.getLambartCordsFromString(search);
        if (lambertCheck.hasCordinates) {
          var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84({
            x: lambertCheck.x,
            y: lambertCheck.y
          });
          setViewAndPutDot(xyWGS84);
        } else {
          console.log("NIET GEVONDEN");
        }
      }
    };
    vm.drawingButtonChanged = function (drawOption) {
      MapData.RemovedUnfinishedDrawings = false;
      // if there is an unfinished intake, remove first before starting new intake
      if (MapData.DrawingObject && MapData.DrawingObject._enabled) {
        MapData.RemovedUnfinishedDrawings = true;
        MapData.CleanDrawings();
      }

      if (MapData.ExtendedType == null) {
        // else we don t have to clean the map!

        if (
          drawOption == DrawingOption.LIJN ||
          drawOption == DrawingOption.POLYGON ||
          drawOption == DrawingOption.NIETS ||
          drawOption == DrawingOption.VIERKANT
        ) {
          MapData.CleanMap();
          MapData.CleanSearch();
        }
        if (
          drawOption == DrawingOption.AFSTAND ||
          drawOption == DrawingOption.OPPERVLAKTE
        ) {
          // MapData.CleanDrawings();
        }
      }

      MapData.DrawingType = drawOption;
      vm.drawingType = drawOption;
      DrawService.StartDraw(drawOption);
    };
    vm.Loading = 0;
    vm.MaxLoading = 0;

    vm.selectpunt = function () {
      MapData.DrawingType = DrawingOption.NIETS;
      vm.drawingType = DrawingOption.NIETS;
      if (MapData.ExtendedType == null) {
        // else we don t have to clean the map!
        MapData.CleanMap();
        MapData.CleanSearch();
      }
      vm.addCursorAuto();
    };

    vm.selectAdvanced = function () {
      MapData.DrawingType = DrawingOption.ZOEKEN;
      vm.drawingType = DrawingOption.ZOEKEN;
      if (MapData.ExtendedType == null) {
        // else we don t have to clean the map!
        MapData.CleanMap();
        MapData.CleanSearch();
      }
      var addLayerInstance = $modal.open({
        templateUrl: 'templates/search/searchAdvancedTemplate.html',
        controller: 'searchAdvancedController',
        resolve: {
          backdrop: false,
          keyboard: true
        }
      });
      addLayerInstance.result.then(function () {
        // ThemeService.AddAndUpdateThemes(selectedThemes);
      }, function (obj) {
        console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
      });
    };


    vm.layerChange = function () {
      // MapData.CleanMap();
      MapData.SelectedLayer = vm.selectedLayer;
    };
    vm.findLayerChange = function () {
      // MapData.CleanMap();
      MapData.SelectedFindLayer = vm.selectedFindLayer;
    };
    vm.zoomIn = function () {
      map.zoomIn();
    };
    vm.zoomOut = function () {
      map.zoomOut();
    };
    vm.fullExtent = function () {
      map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
    };
    vm.setCityView = function () {
      ExternService.SetCityExtent();
    }
    vm.IsBaseMap1 = true;
    vm.IsBaseMap2 = false;
    vm.IsBaseMapGeen = false;
    vm.toonBaseMap1 = function () {
      if (vm.IsBaseMapGeen == false && vm.IsBaseMap1 == true) {
        vm.IsBaseMapGeen = true;
        map.removeLayer(BaseLayersService.basemap1);
      } else {
        vm.IsBaseMap2 = false;
        vm.IsBaseMapGeen = false;
        map.removeLayer(BaseLayersService.basemap2);
        map.addLayer(BaseLayersService.basemap1);
      }
      vm.IsBaseMap1 = true;
    };
    vm.toonBaseMap2 = function () {
      if (vm.IsBaseMapGeen == false && vm.IsBaseMap2 == true) {
        vm.IsBaseMapGeen = true;
        map.removeLayer(BaseLayersService.basemap2);
      } else {
        vm.IsBaseMapGeen = false;
        vm.IsBaseMap1 = false;
        map.removeLayer(BaseLayersService.basemap1);
        map.addLayer(BaseLayersService.basemap2);
      }
      vm.IsBaseMap2 = true;
    };
    // vm.hideBaseMap1 = function(){
    //   vm.IsBaseMap1 = false;
    //   vm.IsBaseMapGeen = true;
    //   map.removeLayer(BaseLayersService.basemap1);
    //   map.removeLayer(BaseLayersService.basemap2);
    // }
    vm.baseMap1Naam = function () {
      return BaseLayersService.basemap1Naam;
    };
    vm.baseMap2Naam = function () {
      return BaseLayersService.basemap2Naam;
    };
    vm.cancelPrint = function () {
      let html = $("html");
      if (html.hasClass("print")) {
        html.removeClass("print");
      }
      vm.portrait(); // also put it back to portrait view
      tinkApi.sideNavToggle.recalculate("asideNavRight");
      tinkApi.sideNavToggle.recalculate("asideNavLeft");
    };
    vm.print = function () {
      window.print();
    };

    vm.printStyle = "portrait";
    var cssPagedMedia = (function () {
      var style = document.createElement("style");
      document.head.appendChild(style);
      return function (rule) {
        style.id = "tempstyle";
        style.innerHTML = rule;
      };
    })();

    cssPagedMedia.size = function (oriantation) {
      cssPagedMedia("@page {size: A4 " + oriantation + "}");
    };
    vm.setPrintStyle = function (oriantation) {
      vm.printStyle = oriantation;
      cssPagedMedia.size(oriantation);
    };
    vm.setPrintStyle("portrait");
    vm.printLegendPreview = false;
    vm.previewMap = function () {
      let html = $("html");
      vm.printLegendPreview = false;
      if (html.hasClass("preview-legend")) {
        html.removeClass("preview-legend");
      }
    };
    vm.previewLegend = function () {
      let html = $("html");
      vm.printLegendPreview = true;
      if (!html.hasClass("preview-legend")) {
        html.addClass("preview-legend");
      }
    };
    vm.portrait = function () {
      let html = $("html");
      vm.setPrintStyle("portrait");
      if (html.hasClass("landscape")) {
        html.removeClass("landscape");
      }
      map.invalidateSize(false);
    };
    vm.landscape = function () {
      let html = $("html");
      vm.setPrintStyle("landscape");
      if (!html.hasClass("landscape")) {
        html.addClass("landscape");
      }
      map.invalidateSize(false);
    };

    vm.ZoekenInLagen = function () {
      vm.ZoekenOpLocatie = false;
      $(".twitter-typeahead").addClass("hide-element");
    };

    vm.fnZoekenOpLocatie = function () {
      vm.ZoekenOpLocatie = true;
      if ($(".twitter-typeahead").hasClass("hide-element")) {
        $(".twitter-typeahead").removeClass("hide-element");
      } else {
        return vm.ZoekenOpLocatie;
      }
    };
    vm.gpstracking = false;
    var gpstracktimer = null;
    var gpsmarker = null;
    vm.zoomToGps = function () {
      vm.gpstracking = !vm.gpstracking;

      if (vm.gpstracking == false) {
        $interval.cancel(gpstracktimer);
        MapEvents.ClearGPS();
      } else {
        map.locate({ setView: true, maxZoom: 16 });
        gpstracktimer = $interval(function () {
          map.locate({ setView: false });
          console.log("gps refresh");
        }, 5000);
      }
    };
    map.on("locationfound", function (e) {
      MapEvents.ClearGPS();
      var gpsicon = L.divIcon({
        className: "fa fa-crosshairs fa-2x blue",
        style: "color: blue"
      });
      gpsmarker = L.marker(e.latlng, { icon: gpsicon }).addTo(map);
    });
    map.on("locationerror", function (e) {
      vm.gpstracking = false;
      $interval.cancel(gpstracktimer);
      MapEvents.ClearGPS();
      PopupService.Warning("Browser heeft geen toegang tot locatiegegevens");
    });
  });
  theController.$inject = [
    "BaseLayersService",
    "ExternService",
    "MapService",
    "MapData",
    "map",
    "MapEvents",
    "DrawService",
    "GisHelperService",
    "GISService",
    "PopupService",
    "$interval",
    "UIService",
    "tinkApi",
    "FeatureService",
    "$modal"
  ];
})();
