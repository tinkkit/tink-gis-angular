/// <reference path="../services/mapService.js" />

'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function($scope, BaseLayersService, MapService, MapData, map, MapEvents, DrawService) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = MapData.VisibleLayers;
        vm.selectedLayer = MapData.SelectedLayer;
        vm.drawingType = MapData.DrawingType
        vm.showMetenControls = false;
        vm.showDrawControls = false;
        vm.interactieButtonChanged = function(ActiveButton) {
            MapData.CleanAll();
            MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
            vm.activeInteractieKnop = ActiveButton;
            vm.showMetenControls = false;
            vm.showDrawControls = false;
            switch (ActiveButton) {
                case ActiveInteractieButton.SELECT:
                    vm.showDrawControls = true;
                    vm.selectpunt();
                    break;
                case ActiveInteractieButton.METEN:
                    vm.showMetenControls = true;
                    vm.drawingButtonChanged(DrawingOption.AFSTAND);
                    break;
            }
        };
        // var toggleDrawControls = function(showControls) {
        //     if (showControls) {
        //         $('.leaflet-draw.leaflet-control').show();
        //     }
        //     else {
        //         $('.leaflet-draw.leaflet-control').hide();
        //     }
        // };
        vm.drawingButtonChanged = function(drawOption) {
            MapData.CleanAll();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            DrawService.StartDraw(drawOption);

        };
        vm.Loading = 0;
        vm.MaxLoading = 0;

        $scope.$watch(function() { return MapData.Loading; }, function(newVal, oldVal) {
            vm.Loading = newVal;
            if (oldVal == 0) {
                vm.MaxLoading = newVal;
            }
            // if (newVal < oldVal) {
            if (vm.MaxLoading < oldVal) {
                vm.MaxLoading = oldVal;
            }
            // }
            if (newVal == 0) {
                vm.MaxLoading = 0;
            }
            // $scope.$apply();
            console.log("MapLoading val: " + newVal + "/" + vm.MaxLoading);
        });
        vm.selectpunt = function() {
            MapData.CleanAll();
            MapData.DrawingType = DrawingOption.NIETS; // pff must be possible to be able to sync them...
            vm.drawingType = DrawingOption.NIETS;
        };
        vm.layerChange = function() {
            MapData.CleanAll();
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
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService'];
})();