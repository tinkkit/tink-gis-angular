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


;angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/tinkmaptemplate.html',
    " <div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <p class=nav-aside-title>Section title</p> <ul> <li> <a href=#> <span>Menu item</span> </a> </li> <li> <a href=#> <span>Menu item with badge</span>\n" +
    "<span class=badge>2</span> </a> </li> <li> <a href=#> <span>Menu item with submenu items</span> </a> <ul> <li> <a href=#> <span>Submenu item</span> </a> </li> <li> <a href=#> <span>Submenu item with badge</span>\n" +
    "<span class=badge>8</span> </a> </li> </ul> </li> <li> <a href=#> <i class=\"fa fa-fw fa-cogs\"></i>\n" +
    "<span>Menu item with icon</span> </a> </li> </ul> </div> </aside> </div> <div id=content> <div class=wrapper> <leaflet class=leafletmap center=center layers=layers controls defaults=defaults> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=\"btn active\"><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input id=zoekbalk1 placeholder=\"Welke locatie of adres zoek je?\">\n" +
    "<input class=invisible placeholder=\"Welke locatie of adres zoek je?\"> </div> <div class=\"ll btn-group ll kaarttypes\"> <button class=\"btn active\" ng-click=\"changeLayer('kaart')\">Kaart</button>\n" +
    "<button class=btn ng-click=\"changeLayer('luchtfoto')\">Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-crosshairs\"></i></button> </div> <div class=\"ll localiseerbtn\"> <button type=button class=btn><i class=\"fa fa-male\"></i></button> </div> </leaflet> </div> </div>"
  );

}]);
