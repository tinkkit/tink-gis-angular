'use strict';
(function (module) {
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['leaflet-directive']);
    }
    module.directive('tinkMap', function () {
        return {
            templateUrl: "templates/tinkmaptemplate.html",
            scope: { 
                layers: "=",
                center:  "="
              },
            controller: function ($scope) {
                 var ourlayers = $scope.layers;
             

                $scope.changeLayer = function (layername) {
                    $scope.layers = ourlayers[layername];
                };
                angular.extend($scope, {
                    defaults: {
                        zoomControl: false
                    },
                    controls: {
                        scale: {
                            imperial: false
                        }
                    }
                });
                if ($scope.center == undefined) {
                    angular.extend($scope, {
                        center: $scope.center
                    });

                }
                if ($scope.layers == undefined || $scope.layers.baselayers == undefined) {
                    angular.extend($scope, {
                        layers: {
                            baselayers: {
                                kaart: ourlayers.kaart,
                                luchtfoto: ourlayers.luchtfoto
                            },
                            
                        }
                        
                    });
                }

            }
        }
    })
})
    ();


