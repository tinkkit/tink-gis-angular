'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, HelperService, GisDataService, BaseLayersService, MapService, $http, map) {
        $scope.layerId = '';
        $scope.activeInteractieKnop = 'select';
        $scope.selectedLayer = {};
        $scope.VisibleLayers = MapService.VisibleLayers;
        map.on('click', function (e) {
            if (!IsDrawing) {
                cleanMapAndSearch();
                switch ($scope.activeInteractieKnop) {
                    case 'identify':
                        _.each(MapService.Themes, function (theme) {
                            theme.MapData.identify().on(map).at(e.latlng).layers('visible:' + $scope.selectedLayer.id).run(function (error, featureCollection) {
                                for (var x = 0; x < featureCollection.features.length; x++) {
                                    MapService.JsonFeatures.push(featureCollection.features[x]);
                                    var item = L.geoJson(featureCollection.features[x]).addTo(map);
                                    MapService.VisibleFeatures.push(item);
                                }
                                $scope.$apply();
                            });
                        });
                        break;
                    case 'select':
                        if (_.isEmpty($scope.selectedLayer)) {
                            console.log("Geen layer selected! kan dus niet opvragen");
                        }
                        else {
                            $scope.selectedLayer.theme.MapData.identify().on(map).at(e.latlng).layers('visible:' + $scope.selectedLayer.id).run(function (error, featureCollection) {
                                for (var x = 0; x < featureCollection.features.length; x++) {
                                    MapService.JsonFeatures.push(featureCollection.features[x]);
                                    var item = L.geoJson(featureCollection.features[x]).addTo(map);
                                    MapService.VisibleFeatures.push(item);
                                }
                                $scope.$apply();
                            });
                        }

                        break;
                    default:
                        console.log("MAG NOG NIET!!!!!!!!");
                        break;
                }
            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function (event) {
            IsDrawing = true;
            cleanMapAndSearch();
        });
        map.on('draw:created', function (event) {
            console.log('draw created');
            console.log(event);
            switch ($scope.activeInteractieKnop) {
                case 'identify':
                    console.log("MAG NIET!!!!!!!!");
                    break;
                case 'select':
                    if (_.isEmpty($scope.selectedLayer)) {
                        console.log("Geen layer selected! kan dus niet opvragen");
                    }
                    else {
                        $scope.selectedLayer.theme.MapData.query()
                            .layer($scope.selectedLayer.id)
                            .intersects(event.layer)
                            .run(function (error, featureCollection, response) {
                                for (var x = 0; x < featureCollection.features.length; x++) {
                                    MapService.JsonFeatures.push(featureCollection.features[x]);
                                    var item = L.geoJson(featureCollection.features[x]).addTo(map);
                                    MapService.VisibleFeatures.push(item);
                                }
                                $scope.$apply();
                            });
                    }
                    break;
                default:
                    console.log("MAG NOG NIET!!!!!!!!");
                    break;
            }
            IsDrawing = false;

        });
        var cleanMapAndSearch = function () {
            for (var x = 0; x < MapService.VisibleFeatures.length; x++) {
                map.removeLayer(MapService.VisibleFeatures[x]); //eerst de 
            }
            MapService.VisibleFeatures.length = 0;
            MapService.JsonFeatures.length = 0;
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
    theController.$inject = ['HelperService', 'GisDataService', 'BaseLayersService', 'MapService', '$http', 'map'];
})();