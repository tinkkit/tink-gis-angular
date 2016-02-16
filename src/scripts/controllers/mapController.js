/// <reference path="../services/mapService.js" />

'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, $http, map) {
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = 'select';
        vm.Data = {};
        vm.SelectableLayers = MapService.VisibleLayers;
    
        // vm.Data.selectedLayer = MapService.SelectedLayer;
        MapService.SelectedLayer = vm.Data.selectedLayer;
        map.on('click', function (event) {
            console.log('click op map!');
            if (!IsDrawing) {
                cleanMapAndSearch();
                switch (vm.activeInteractieKnop) {
                    case 'identify':
                        MapService.Identify(event, null, 2);
                        break;
                    case 'select':
                        if (_.isEmpty(vm.selectedLayer)) {
                            console.log('Geen layer selected! kan dus niet opvragen');
                        }
                        else {
                            MapService.Identify(event, vm.selectedLayer, 1); // click is gewoon een identify maar dan op selectedlayer.
                        }
                        break;
                    default:
                        console.log('MAG NOG NIET!!!!!!!!');
                        break;
                }
                $scope.$apply();

            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function (event) {
            console.log('draw started');
            IsDrawing = true;
            cleanMapAndSearch();
        });
        map.on('draw:created', function (event) {
            console.log('draw created');
            console.log(event);
            if (_.isEmpty(vm.selectedLayer)) {
                console.log('Geen layer selected! kan dus niet opvragen');
            }
            else {
                MapService.Query(event, vm.selectedLayer);
                $scope.$apply();
            }
            IsDrawing = false;
        });
        var cleanMapAndSearch = function () {
            for (var x = 0; x < MapService.VisibleFeatures.length; x++) {
                map.removeLayer(MapService.VisibleFeatures[x]); //eerst de 
            }
            MapService.VisibleFeatures.length = 0;
            MapService.JsonFeatures.length = 0;
            map.clearDrawings();

        };
        vm.identify = function () {
            cleanMapAndSearch();
            vm.activeInteractieKnop = 'identify';
            $('.leaflet-draw.leaflet-control').hide();
        };
        vm.select = function () {
            cleanMapAndSearch();
            vm.activeInteractieKnop = 'select';
            $('.leaflet-draw.leaflet-control').show();
        };
        vm.layerChange = function () {
            cleanMapAndSearch();
            console.log("SELECTEDLAYER:");
            console.log(vm.Data.selectedLayer);
            console.log(MapService.SelectedLayer);

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
    theController.$inject = ['BaseLayersService', 'MapService', '$http', 'map'];
})();