(function (module) {
    'use strict';
    module = angular.module('tink.gis.angular');
    var directiveName = "layer";
    var theDirective = function () {
        return {
            restrict: "E",
            scope: {
                layerData: "="
            },
            templateUrl: 'templates/layer.html',
            controllerAs: 'layerctrl',
        }
    };
    var theController = module.controller('layerctrl', function ($scope, $http, GisDataService) {
        $scope.changeVisibility = function (url) {
            GisDataService.changeVisibility(url);
        };
    })
    theController.$inject = ['GisDataService'];
    angular.module('tink.gis.angular').directive(directiveName, theDirective);
})();;'use strict';
(function(module) {
 
    module = angular.module('tink.gis.angular');
  
var theController = module.controller('mainlayerDirective', function($scope, $http, GisDataService)
{
     
      $scope.layers = GisDataService.layers;
      $scope.changeVisibility = function(url){
        
      GisDataService.changeVisibility(url);
                     
      };
     
})

    theController.$inject = ['GisDataService'];

module.directive('layerControl', function() {
  return {
   templateUrl:  'templates/mainlayerTemplate.html',
   controllerAs: 'layerControlctrl' ,  
  };
});
  

})();;'use strict';
(function (module) {
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['leaflet-directive']);
    }
    module.directive('tink-map', function () {
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
            }
        };
    });
})();;// Kan gebruikt worden om data door te geven tussen controllers en/of directives

(function () {

    'use strict';

    var componentName = "GisDataService";
    var theComponent = function ($http) {

        var _mapData = initData();
        var _layers = [];
        var layerDataService = {};

        $http.get('../scripts/layerControl/layerControlData.json').then(function (res) {
            res.data.forEach(function (layer) {
                _layers.push(layer);
            }, this);
        });

        function _add() {

            layerDataService.add = function (item) {
                _layers.push(item);
            };


            return layerDataService.add;
        };

        function _list() {

            return _layers;

        }



        function fn(obj, key) {
            if (_.has(obj, key)) // or just (key in obj)
                return [obj];
            // elegant:
            return _.flatten(_.map(obj, function (v) {
                return typeof v == "object" ? fn(v, key) : [];
            }), true);


        }

        function _changeVisibility(url) {

            var overlays = _mapData.layers.overlays;

            var res = fn(overlays, "url");

            res.forEach(function (layer) {
                if (layer.url == url) {
                    layer.visible = !layer.visible;
                }
            }, this);
  
           
           
            //    for (var property in overlays) {
            //         if (overlays.hasOwnProperty(property)) {
            //              for (var childProperty in property) {
            //                   if (property.hasOwnProperty(childProperty)) {
            //                         if(property.name == "url")
            //                         {
            //                             return property.visible = !property.visible;
            //                         }
            //                   }
            //              }
            //         }
            //         
            //       }
        }


        return {
            add: _add,
            list: _list,
            layers: _layers,
            changeVisibility: _changeVisibility,
            mapData: _mapData


        };

    }

    // theComponent.$inject = ['GisDataService'];

    angular.module('tink.gis.angular').factory(componentName, theComponent);

})();
;(function() {

    'use strict';

    var componentName = "ErrorHandler";
    var theComponent = function(appService) {

        function _handle(errorResponse) {

            // ToDo : vervang onderstaande door eigen error handling, indien gewenst

            var message = "fout bij call naar " + errorResponse.config.url + " (" + errorResponse.config.method + ") - " + errorResponse.status + " ";
            if (errorResponse.data) {
                if (errorResponse.data.message)
                    message += errorResponse.data.message;
                else
                    message += errorResponse.statusText;
            } else {
                message += errorResponse.statusText;
            }
            appService.logger.error(message);
        }

        function _getErrorMessage(errorResponse, defaultMessage) {
            defaultMessage = defaultMessage || "unknown error";
            if (errorResponse.data) {
                if (errorResponse.data.listOfHttpError) {
                    if (errorResponse.data.listOfHttpError.message) {
                        return errorResponse.data.listOfHttpError.message;
                    } else {
                        if (errorResponse.statusText)
                            return errorResponse.statusText;
                        else
                            return defaultMessage;
                    }
                } else {
                    if (errorResponse.data.message) {
                        return errorResponse.data.message;
                    } else {
                        if (errorResponse.statusText)
                            return errorResponse.statusText;
                        else
                            return defaultMessage;
                    }
                }
            } else {
                if (errorResponse.statusText)
                    return errorResponse.statusText;
                else
                    return defaultMessage;
            }
        }

        /* +++++ public interface +++++ */

        appService.logger.creation(componentName);

        return {
            handle: _handle,
            getErrorMessage: _getErrorMessage,
        };

    };

    theComponent.$inject = ['AppService'];

    angular.module('tink.gis.angular').factory(componentName, theComponent);

})();;(function() {

    'use strict';

    var componentName = "Logger";
    var theComponent = function($log, appConfig) {

        function _success(message) {
            if (appConfig.enableLog) {
                $log.log(message);
            }
        }

        function _debug(message) {
            if (appConfig.enableLog) {
                if (appConfig.enableDebug) {
                    $log.debug(message);
                }
            }
        }

        function _info(message) {
            if (appConfig.enableLog) {
                $log.info(message);
            }
        }

        function _warn(message) {
            if (appConfig.enableLog) {
                $log.warn(message);
            }
        }

        function _error(message) {
            if (appConfig.enableLog) {
                $log.error(message);
            }
        }

        function _creation(name) {
            _debug(name + " : gecreëerd.");
        }

        function _initialization(name) {
            _debug(name + " : geïnitialiseerd.");
        }

        /* +++++ public interface +++++ */

        return {
            success: _success,
            debug: _debug,
            info: _info,
            warn: _warn,
            error: _error,
            creation: _creation,
            init: _initialization
        };

    };

    theComponent.$inject = ['$log', 'appConfig'];

    angular.module('AppService').factory(componentName, theComponent);

})();;angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/layer.html',
    " <input style=\"opacity: 1;position: relative;z-index:100\" type=checkbox ng-model=layerData.visible ng-change=changeVisibility(layerData.url)>\n" +
    "{{layerData.name}} "
  );


  $templateCache.put('templates/layertemplate.html',
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<tink-accordion data-start-open=\"true\">\r" +
    "\n" +
    "\t<div ng-repeat=\"theme in layers\">  \r" +
    "\n" +
    "<tink-accordion-panel>\r" +
    "\n" +
    "\t <data-header>\r" +
    "\n" +
    "   <input style=\"opacity: 1;position: relative;z-index:100\"; type=\"checkbox\" ng-model=\"theme.visible\">\r" +
    "\n" +
    "\t {{theme.name}}\r" +
    "\n" +
    "  </data-header>\r" +
    "\n" +
    "    <data-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\r" +
    "\n" +
    "\t\r" +
    "\n" +
    "\t \r" +
    "\n" +
    "\t <div ng-repeat=\"group in theme.groups\">\r" +
    "\n" +
    "\t\t<input style=\"opacity: 1;position: relative;z-index:100\"; type=\"checkbox\" ng-model=\"group.visible\">\r" +
    "\n" +
    "\t\t {{group.name}}\r" +
    "\n" +
    "\t\t \r" +
    "\n" +
    "\t\t <div ng-repeat=\"layer in group.layers\">\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "               <layer  layer=\"layer\"></layer>\r" +
    "\n" +
    "\t\t </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t \r" +
    "\n" +
    "\t </div>\r" +
    "\n" +
    "\t \r" +
    "\n" +
    "\t \r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  </data-content>\r" +
    "\n" +
    "  </tink-accordion-panel>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</tink-accordion>"
  );


  $templateCache.put('templates/overlayBasetemplate.html',
    "<!--theme-->\r" +
    "\n" +
    "<tink-accordion data-start-open=\"true\">\r" +
    "\n" +
    "    <div ng-repeat=\"theme in layers\">\r" +
    "\n" +
    "        <tink-accordion-panel>\r" +
    "\n" +
    "            <data-header>\r" +
    "\n" +
    "                <input style=\"opacity: 1;position: relative;z-index:100\" ; type=\"checkbox\" ng-model=\"theme.visible\"> {{theme.name}}\r" +
    "\n" +
    "            </data-header>\r" +
    "\n" +
    "            <data-content>\r" +
    "\n" +
    "                <!--group-->\r" +
    "\n" +
    "                <tink-accordion data-start-open=\"true\">\r" +
    "\n" +
    "                    <div ng-repeat=\"group in theme.groups\">\r" +
    "\n" +
    "                        <tink-accordion-panel>\r" +
    "\n" +
    "                            <data-header>\r" +
    "\n" +
    "                                <input style=\"opacity: 1;position: relative;z-index:100\" ; type=\"checkbox\" ng-model=\"group.visible\"> {{group.name}}\r" +
    "\n" +
    "                            </data-header>\r" +
    "\n" +
    "                            <data-content>\r" +
    "\n" +
    "                                <div ng-repeat=\"layerhup in group.layers\">\r" +
    "\n" +
    "                                    <layer layer-data=\"layerhup\"></layer>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "                            </data-content>\r" +
    "\n" +
    "                        </tink-accordion-panel>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </tink-accordion>\r" +
    "\n" +
    "            </data-content>\r" +
    "\n" +
    "        </tink-accordion-panel>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</tink-accordion>"
  );


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
