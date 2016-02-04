'use strict';
(function (module) {
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['leaflet-directive']);
    }
    module.directive('tinkMap', function () {
        return {
            templateUrl: 'templates/tinkmaptemplate.html',
            replace: true,
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: function ($scope, leafletData) {

                function clone(obj) {
                    var copy;

                    // Handle the 3 simple types, and null or undefined
                    if (null == obj || "object" != typeof obj) return obj;

                    // Handle Date
                    if (obj instanceof Date) {
                        copy = new Date();
                        copy.setTime(obj.getTime());
                        return copy;
                    }

                    // Handle Array
                    if (obj instanceof Array) {
                        copy = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            copy[i] = clone(obj[i]);
                        }
                        return copy;
                    }

                    // Handle Object
                    if (obj instanceof Object) {
                        copy = {};
                        for (var attr in obj) {
                            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                        }
                        return copy;
                    }

                    throw new Error('Unable to copy obj! Its type isn\'t supported.');
                }
                var Alllayers = clone($scope.parlayers);
                angular.extend($scope, {
                    center: clone($scope.parcenter),
                    layers: {
                        baselayers: $scope.parlayers
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
                $scope.fullExtent = function () {
                    $scope.center.zoom = $scope.parcenter.zoom;
                    $scope.center.lat = $scope.parcenter.lat;
                    $scope.center.lng = $scope.parcenter.lng;
                };
                $scope.kaartIsGetoond = true;
                $scope.toonKaart = function () {
                    $scope.kaartIsGetoond = true;
                    $scope.changeTiles('kaart');
                };
                $scope.toonLuchtfoto = function () {
                    $scope.kaartIsGetoond = false;
                    $scope.changeTiles('luchtfoto');
                };
            }
        };
    });
})();