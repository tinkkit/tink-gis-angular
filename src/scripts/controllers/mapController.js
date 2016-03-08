/// <reference path="../services/mapService.js" />

'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function($scope, BaseLayersService, MapService, MapData, map, MapEvents) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded! 
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = MapData.VisibleLayers;
        vm.selectedLayer = MapData.SelectedLayer;
        vm.drawingType = MapData.DrawingType
        vm.showMetenControls = false;
        vm.interactieButtonChanged = function(ActiveButton) {
            MapData.CleanAll();
            MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
            vm.activeInteractieKnop = ActiveButton;
            //make controls invis 
            toggleDrawControls(false);
            vm.showMetenControls = false;
            switch (ActiveButton) {
                case ActiveInteractieButton.SELECT:
                    toggleDrawControls(true);
                    break;
                case ActiveInteractieButton.METEN:
                    vm.showMetenControls = true;
                    break;
            }
        };
        var toggleDrawControls = function(showControls) {
            if (showControls) {
                $('.leaflet-draw.leaflet-control').show();
            }
            else {
                $('.leaflet-draw.leaflet-control').hide();
            }
        };
        vm.drawingButtonChanged = function(drawOption) {
            MapData.CleanAll();
            MapData.RemoveDrawings();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            switch (MapData.DrawingType) {
                case DrawingOption.AFSTAND:
                    MapData.DrawingObject = new L.Draw.Polyline(map);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.OPPERVLAKTE:
                    var polygon_options = {
                        showArea: true,
                        shapeOptions: {
                            stroke: true,
                            color: '#22528b',
                            weight: 4,
                            opacity: 0.5,
                            fill: true,
                            fillColor: null, //same as color by default
                            fillOpacity: 0.6,
                            clickable: true
                        }
                    }
                    MapData.DrawingObject = new L.Draw.Polygon(map, polygon_options);
                    MapData.DrawingObject.enable();
                    break;
                default:
                    break;
            }
        };
        vm.layerChange = function() {
            MapData.CleanMap();
            // console.log("vm.sel: " + vm.selectedLayer.id + "/ MapData.SelectedLayer: " + MapData.Layer.SelectedLayer.id);
            MapData.SelectedLayer = vm.selectedLayer;
        };
        vm.zoomIn = function() {
            map.zoomIn();
        };
        vm.zoomOut = function() {
            map.zoomOut();
        };
        vm.fullExtent = function() {
            map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
        };
        vm.kaartIsGetoond = true;
        vm.toonKaart = function() {
            vm.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        vm.toonLuchtfoto = function() {
            vm.kaartIsGetoond = false;
            map.removeLayer(BaseLayersService.kaart);
            map.addLayer(BaseLayersService.luchtfoto);
        };
    });
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map', 'MapEvents'];
})();