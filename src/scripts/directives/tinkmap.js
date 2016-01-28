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
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: function ($scope) {
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
                    center: $scope.parcenter,
                    layers: {
                        baselayers: $scope.parlayers

                    },
                    defaults: {
                        zoomControl: false
                    },
                    controls: {
                        scale: {
                            imperial: false
                        }
                    }
                });
           
                // var test = {
                //     luchtfoto: {
                //         name: 'luchtfoto',
                //         url: 'http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png',
                //         type: 'xyz',
                //         visible: true,
                //         layerOptions: {
                //             showOnSelector: true,
                //             tms: true
                //         }
                //     }
                // };
                $scope.changeBaseLayer = function (key) {
                    var thebaselayeritem = { themap: clone(Alllayers[key]) };
                    $scope.layers.baselayers = null;
                    thebaselayeritem.themap.visible = true;
                    $scope.layers.baselayers = thebaselayeritem;

                };
            }
        };
    });
})
    ();


