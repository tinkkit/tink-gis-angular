


'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, HelperService, GisDataService) {
        console.log('mapController CTOR');

        var Alllayers = HelperService.clone($scope.parlayers);
        angular.extend($scope, {
            center: HelperService.clone($scope.parcenter),
            layers: {
                baselayers: $scope.parlayers,
                overlays: GisDataService.list
            },       
            // tiles: $scope.parlayers.kaart,
            defaults: {
                zoomControl: false
            },
            controls: {
                scale: {
                    imperial: false
                }
            }
        });
        $scope.zoomIn = function () {
            $scope.center.zoom++;
        };
        $scope.zoomOut = function () {
            $scope.center.zoom--;
        };
        $scope.changeBaseLayer = function (layerName) {
            var baselayers = $scope.layers.baselayers;
            var switchLayerName;
            if (layerName == "luchtfoto") {
                switchLayerName = "kaart"
            }
            else {
                switchLayerName = "luchtfoto"
            }

            delete baselayers[switchLayerName];
            baselayers[layerName] = Alllayers[layerName];
        };

        $scope.fullExtent = function () {
            $scope.center.zoom = $scope.parcenter.zoom;
            $scope.center.lat = $scope.parcenter.lat;
            $scope.center.lng = $scope.parcenter.lng;
        };
        $scope.kaartIsGetoond = true;
        $scope.toonKaart = function () {
            $scope.kaartIsGetoond = true;
            $scope.changeBaseLayer('kaart');
        };
        $scope.toonLuchtfoto = function () {
            $scope.kaartIsGetoond = false;
            $scope.changeBaseLayer('luchtfoto');
        };
    });
    theController.$inject = ['HelperService'];
    theController.$inject = ['GisDataService'];

})();