'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function ($scope, ExternService, BaseLayersService, MapService, MapData, map, MapEvents, DrawService, HelperService, GISService, PopupService, $interval, TypeAheadService, UIService, tinkApi, FeatureService) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        var init = function () {
            console.log('Tink-Gis-Angular component init!!!!!!!!!');
            if (window.location.href.startsWith('http://localhost:9000/')) {
                var externproj = JSON.parse('{"naam":"Velo en fietspad!!","extent":{"_northEast":{"lat":"51.2336102032025","lng":"4.41993402409611"},"_southWest":{"lat":"51.1802290498612","lng":"4.38998297870121"}},"guid":"bfc88ea3-8581-4204-bdbc-b5f54f46050d","extentString":"51.2336102032025,4.41993402409611,51.1802290498612,4.38998297870121","isKaart":true,"uniqId":3,"creatorId":6,"creator":null,"createDate":"2016-08-22T10:55:15.525994","updaterId":6,"updater":null,"lastUpdated":"2016-08-22T10:55:15.525994","themes":[{"cleanUrl":"services/P_Stad/Mobiliteit/MapServer","naam":"Mobiliteit","type":"esri","visible":true,"layers":[{"id":"9","name":"fietspad","visible":true},{"id":"6","name":"velo","visible":true},{"id":"0","name":"Fiets en voetganger","visible":true}]}],"isReadOnly":false}');
                ExternService.Import(externproj);

                PopupService.Success("Dev autoload", 'Velo en fietspad loaded because you are in DEV.', function () { alert('onclicktestje'); })
            }
            TypeAheadService.init();
        }();
        vm.ZoekenOpLocatie = true;
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        $scope.$watch(function () { return MapData.ActiveInteractieKnop; }, function (data) {
            vm.activeInteractieKnop = data;
        }, true);
        vm.drawingType = MapData.DrawingType;
        $scope.$watch(function () { return MapData.DrawingType; }, function (data) {
            vm.drawingType = data;
        }, true);

        vm.SelectableLayers = function () {
            return MapData.VisibleLayers;
        };
        vm.selectedLayer = MapData.SelectedLayer
        $scope.$watch(function () { return MapData.SelectedLayer; }, function (newval, oldval) {
            vm.selectedLayer = newval;
        });
        vm.selectedFindLayer = MapData.SelectedFindLayer
        $scope.$watch(function () { return MapData.SelectedFindLayer; }, function (newval, oldval) {
            vm.selectedFindLayer = newval;
        });
        $scope.$watch(function () { return MapData.ShowMetenControls; }, function (data) {
            vm.showMetenControls = data;
        }, true);
        vm.showMetenControls = MapData.ShowMetenControls;
        $scope.$watch(function () { return MapData.ShowDrawControls; }, function (data) {
            vm.showDrawControls = data;
        }, true);
        vm.showDrawControls = MapData.ShowDrawControls;
        vm.zoekLoc = '';
        vm.addCursorAuto = function () {
            if (!$('.leaflet-container').hasClass('cursor-auto')) {
                $('.leaflet-container').addClass('cursor-auto');
            }
        };
        vm.resetButtonBar = function () {
            MapData.ActiveInteractieKnop = ActiveInteractieButton.NIETS;
            vm.activeInteractieKnop = ActiveInteractieButton.NIETS;
            MapData.DrawingType = DrawingOption.NIETS;
            MapData.ExtendedType = null;
            MapData.ShowMetenControls = false;
            MapData.ShowDrawControls = false;

        }
        vm.interactieButtonChanged = function (ActiveButton) {
            if (vm.activeInteractieKnop != ActiveButton) {
                if (ActiveButton == "identify" || "watishier") {
                    MapData.ExtendedType = null;
                    vm.addCursorAuto();
                }
                MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
                vm.activeInteractieKnop = ActiveButton;
                MapData.ShowMetenControls = false;
                MapData.ShowDrawControls = false;
                switch (ActiveButton) {
                    case ActiveInteractieButton.SELECT:
                        MapData.ShowDrawControls = true;
                        MapData.DrawingType = DrawingOption.GEEN; // pff must be possible to be able to sync them...

                        break;
                    case ActiveInteractieButton.METEN:
                        MapData.ExtendedType = null;
                        MapData.ShowMetenControls = true;
                        MapData.DrawingType = DrawingOption.GEEN;
                        break;
                }
            }
            else {
                vm.resetButtonBar()
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
            var WGS84Check = HelperService.getWGS84CordsFromString(search);
            if (WGS84Check.hasCordinates) {
                setViewAndPutDot(WGS84Check);
            } else {
                var lambertCheck = HelperService.getLambartCordsFromString(search);
                if (lambertCheck.hasCordinates) {
                    var xyWGS84 = HelperService.ConvertLambert72ToWSG84({ x: lambertCheck.x, y: lambertCheck.y });
                    setViewAndPutDot(xyWGS84);
                } else {
                    console.log('NIET GEVONDEN');
                }
            }
        };
        vm.drawingButtonChanged = function (drawOption) {
            if (MapData.ExtendedType == null) { // else we don t have to clean the map!

                if (drawOption == DrawingOption.LIJN || drawOption == DrawingOption.POLYGON || drawOption == DrawingOption.NIETS || drawOption == DrawingOption.VIERKANT) {
                    MapData.CleanMap();
                    MapData.CleanSearch();
                }
                if (drawOption == DrawingOption.AFSTAND || drawOption == DrawingOption.OPPERVLAKTE) {
                    // MapData.CleanDrawings();
                }
            }

            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            DrawService.StartDraw(drawOption);

        };
        vm.Loading = 0;
        vm.MaxLoading = 0;


        vm.selectpunt = function () {
            MapData.DrawingType = DrawingOption.NIETS; // pff must be possible to be able to sync them...
            vm.drawingType = DrawingOption.NIETS;
            if (MapData.ExtendedType == null) { // else we don t have to clean the map!
                MapData.CleanMap();
                MapData.CleanSearch();
            }
            vm.addCursorAuto();


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
        vm.IsBaseMap1 = true;
        vm.toonBaseMap1 = function () {
            vm.IsBaseMap1 = true;
            map.removeLayer(BaseLayersService.basemap2);
            map.addLayer(BaseLayersService.basemap1);
        };
        vm.toonBaseMap2 = function () {
            vm.IsBaseMap1 = false;
            map.removeLayer(BaseLayersService.basemap1);
            map.addLayer(BaseLayersService.basemap2);
        };
        vm.baseMap1Naam = function () {
            return BaseLayersService.basemap1Naam;
        }
        vm.baseMap2Naam = function () {
            return BaseLayersService.basemap2Naam;
        }
        vm.cancelPrint = function () {
            let html = $('html');
            if (html.hasClass('print')) {
                html.removeClass('print');
            }
            vm.portrait(); // also put it back to portrait view
            tinkApi.sideNavToggle.recalculate("asideNavRight");
            tinkApi.sideNavToggle.recalculate("asideNavLeft");
        }
        vm.print = function () {
            window.print();
        }
        vm.printStyle = 'portrait';
        var cssPagedMedia = (function () {
            var style = document.createElement('style');
            document.head.appendChild(style);
            return function (rule) {
                style.id = 'tempstyle';
                style.innerHTML = rule;
            };
        }());

        cssPagedMedia.size = function (oriantation) {
            cssPagedMedia('@page {size: A4 ' + oriantation + '}');
        };
        vm.setPrintStyle = function (oriantation) {
            vm.printStyle = oriantation;
            cssPagedMedia.size(oriantation);
        };
        vm.setPrintStyle('portrait');
        vm.printLegendPreview = false;
        vm.previewMap = function () {
            let html = $('html');
            vm.printLegendPreview = false;
            if (html.hasClass('preview-legend')) {
                html.removeClass('preview-legend');
            }
        };
        vm.previewLegend = function () {
            let html = $('html');
            vm.printLegendPreview = true;
            if (!html.hasClass('preview-legend')) {
                html.addClass('preview-legend');
            }
        };
        vm.portrait = function () {
            let html = $('html');
            vm.setPrintStyle('portrait');
            if (html.hasClass('landscape')) {
                html.removeClass('landscape');
            }
            map.invalidateSize(false);
        }
        vm.landscape = function () {
            let html = $('html');
            vm.setPrintStyle('landscape');
            if (!html.hasClass('landscape')) {
                html.addClass('landscape');
            }
            map.invalidateSize(false);
        }

        vm.ZoekenInLagen = function () {
            vm.ZoekenOpLocatie = false;
            $('.twitter-typeahead').addClass('hide-element');
        }

        vm.fnZoekenOpLocatie = function () {
            vm.ZoekenOpLocatie = true;
            if ($(".twitter-typeahead").hasClass("hide-element")) {
                $('.twitter-typeahead').removeClass('hide-element');
            }
            else {
                return vm.ZoekenOpLocatie;
            }
        }
        vm.gpstracking = false;
        var gpstracktimer = null;
        vm.zoomToGps = function () {
            vm.gpstracking = !vm.gpstracking;

            if (vm.gpstracking == false) {
                $interval.cancel(gpstracktimer);
                MapEvents.ClearGPS();
            }
            else {
                map.locate({ setView: true, maxZoom: 16 });
                gpstracktimer = $interval(function () {
                    map.locate({ setView: false });
                    console.log('gps refresh');
                }, 5000);
            }
        }

    });
    theController.$inject = ['BaseLayersService', 'ExternService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService', 'HelperService', 'GISService', 'PopupService', '$interval', 'UIService', 'tinkApi', 'FeatureService'];
})();
