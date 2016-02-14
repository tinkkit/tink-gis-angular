'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, $http, map) {
        $scope.layerId = '';
        $scope.activeInteractieKnop = 'select';
        $scope.selectedLayer = {};
        $scope.SelectableLayers = MapService.VisibleLayers;
        map.on('click', function (event) {
            if (!IsDrawing) {
                console.log("click op map!");
                cleanMapAndSearch();
                switch ($scope.activeInteractieKnop) {
                    case 'identify':
                        MapService.Identify(event, null, 2);
                        break;
                    case 'select':
                        if (_.isEmpty($scope.selectedLayer)) {
                            console.log("Geen layer selected! kan dus niet opvragen");
                        }
                        else {
                            MapService.Identify(event, $scope.selectedLayer, 1); // click is gewoon een identify maar dan op selectedlayer.
                        }
                        break;
                    default:
                        console.log("MAG NOG NIET!!!!!!!!");
                        break;
                }
                $scope.$apply();

            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function (event) {
            IsDrawing = true;
            cleanMapAndSearch();
            console.log("wtdf");
        });
        map.on('draw:created', function (event) {
            console.log('draw created');
            console.log(event);
            if (_.isEmpty($scope.selectedLayer)) {
                console.log("Geen layer selected! kan dus niet opvragen");
            }
            else {
                MapService.Query(event, $scope.selectedLayer);
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
        $scope.identify = function () {
            cleanMapAndSearch();
            $scope.activeInteractieKnop = 'identify';
            $(".leaflet-draw.leaflet-control").hide();
        };
        $scope.select = function () {
            cleanMapAndSearch();
            $scope.activeInteractieKnop = 'select';
            $(".leaflet-draw.leaflet-control").show();
        };
        $scope.layerChange = function () {
            cleanMapAndSearch();
            console.log($scope.selectedLayer);
        };
        $scope.zoomIn = function () {
            map.zoomIn();
        };
        $scope.zoomOut = function () {
            map.zoomOut();
        };
        $scope.fullExtent = function () {
            map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
        };
        $scope.kaartIsGetoond = true;
        $scope.toonKaart = function () {
            $scope.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        $scope.toonLuchtfoto = function () {
            $scope.kaartIsGetoond = false;
            map.removeLayer(BaseLayersService.kaart);
            map.addLayer(BaseLayersService.luchtfoto);
        };
    });
    theController.$inject = ['BaseLayersService', 'MapService', '$http', 'map'];
})();