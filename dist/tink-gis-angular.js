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
                            baselayers: $scope.parlayers[0]
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
                $scope.changeBaseLayer = function (layerName) {
                    var thebaselayeritem = { themap: clone(Alllayers[layerName]) };
                    // $scope.layers.baselayers = null;
                    // thebaselayeritem.themap.visible = true;
                    $scope.layers.baselayers = thebaselayeritem;

                };
                var tilesDict = $scope.parlayers;
                $scope.changeTiles = function (tiles) {
                     var  thetoaddedtile =   tilesDict[tiles];
                     $scope.layers.baselayers = thetoaddedtile;
                    //$scope.tiles = tilesDict[tiles];

                };
                // $scope.changeBaseLayer = function (layerName) {
                //     var baselayers = $scope.layers.baselayers;
                //     baselayers[layerName] = $scope.parlayers[layerName];
                // };
            }
       };
    });
})
    ();


;angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/tinkmaptemplate.html',
    " <div id=content> <div class=wrapper> <leaflet id=standaardmap class=leafletmap center=center layers=layers controls defaults=defaults> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=\"btn active\"><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input id=zoekbalk1 placeholder=\"Welke locatie of adres zoek je?\">\n" +
    "<input class=invisible placeholder=\"Welke locatie of adres zoek je?\"> </div> <div class=\"ll btn-group ll kaarttypes\"> <button class=btn ng-class=\"{active: kaartIsGetoond==true}\" ng-click=toonKaart()>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: kaartIsGetoond==false}\" ng-click=toonLuchtfoto()>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=zoomIn()><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=zoomOut()><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\"><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=fullExtent()><i class=\"fa fa-home\"></i></button> </div> <div class=\"ll localiseerbtn\"> <button type=button class=btn><i class=\"fa fa-male\"></i></button> </div> </leaflet> </div> </div>"
  );

}]);
