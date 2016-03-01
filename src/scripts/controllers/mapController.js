/// <reference path="../services/mapService.js" />

'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, MapData, map) {
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = ActiveInteractieButton.SELECT;
        vm.SelectableLayers = MapData.VisibleLayers;

        vm.selectedLayer = MapData.SelectedLayer;
        map.on('click', function (event) {
            console.log('click op map!');
            if (!IsDrawing) {
                MapData.CleanMap();
                switch (vm.activeInteractieKnop) {
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
                    default:
                        console.log('MAG NIET!!!!!!!!');
                        break;
                }
            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function (event) {
            console.log('draw started');
            IsDrawing = true;
            MapData.CleanMap();
        });
        map.on('draw:created', function (event) {
            console.log('draw created');
            console.log(event);
            if (_.isEmpty(MapData.SelectedLayer)) {
                console.log('Geen layer selected! kan dus niet opvragen');
            }
            else {
                MapService.Query(event);
            }
            IsDrawing = false;
        });

        vm.identify = function () {
            MapData.CleanMap();
            vm.activeInteractieKnop = ActiveInteractieButton.IDENTIFY;
            $('.leaflet-draw.leaflet-control').hide();
        };
        vm.select = function () {
            MapData.CleanMap();
            vm.activeInteractieKnop = ActiveInteractieButton.SELECT;
            $('.leaflet-draw.leaflet-control').show();
        };
        vm.watIsHier = function () {
            MapData.CleanMap();
            vm.activeInteractieKnop = ActiveInteractieButton.WATISHIER;
            $('.leaflet-draw.leaflet-control').hide();
        };
        vm.meten = function () {
            MapData.CleanMap();
            vm.activeInteractieKnop = ActiveInteractieButton.METEN;
            $('.leaflet-draw.leaflet-control').hide();
        };
        vm.layerChange = function () {
            MapData.CleanMap();
            MapData.SelectedLayer = vm.selectedLayer;
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
        vm.kaartIsGetoond = true;
        vm.toonKaart = function () {
            vm.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        vm.toonLuchtfoto = function () {
            vm.kaartIsGetoond = false;
            map.removeLayer(BaseLayersService.kaart);
            map.addLayer(BaseLayersService.luchtfoto);
        };
    });
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map'];
})();