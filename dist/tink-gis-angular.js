


'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope, $http, GisDataService) {
        console.log('layerController CTOR');
        // $scope.changeVisibility = function (url) {
        //     GisDataService.changeVisibility(url);
        // };
        
    })
    theController.$inject = ['GisDataService'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, GisDataService) {
        console.log("layersController CTOR");
        // $scope.layers = GisDataService.mapData.layers.overlays;
        // $scope.changeVisibility = function (url) {
        //     GisDataService.changeVisibility(url);
        // };
    })
    theController.$inject = ['GisDataService'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, HelperService, GisDataService, BaseLayersService, map, MapService) {
        console.log('mapController ctor');

        map = L.map('map', {
            center: [51.2192159, 4.4028818],
            zoom: 16,
            layers: [BaseLayersService.kaart]
        });
        L.control.scale({ imperial: false }).addTo(map);
        var AGeaoService = L.esri.dynamicMapLayer({
            url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer',
            opacity: 0.5,
            layers: [1],
            useCors: false
        }).addTo(map);

        // console.log(AGeaoService);
        // AGeaoService.options.layers = [3];
        map.on('click', function (e) {
            console.log('click op de map');
            for (var x = 0; x < MapService.visibleFeatures.length; x++) {
                map.removeLayer(MapService.visibleFeatures[x]);
            }
            AGeaoService.identify().on(map).at(e.latlng).layers('visible:1').run(function (error, featureCollection) {
                for (var x = 0; x < featureCollection.features.length; x++) {
                    console.log(featureCollection.features[x]);
                    MapService.visibleFeatures.push(L.geoJson(featureCollection.features[x]).addTo(map));
                }
            });
        });
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
    theController.$inject = ['HelperService', 'GisDataService', 'BaseLayersService', 'map', 'MapService'];
})();;(function (module) {
    'use strict';
    module = angular.module('tink.gis.angular');
    module.directive('layer', function () {
        return {
            restrict: 'E',
            scope: {
                layerData: '='
            },
            templateUrl: 'templates/layer.html',
            controller: 'layerController',
        }
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinklayers', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/layerstemplate.html',
            controller: 'layersController'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkmap', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/maptemplate.html',
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: 'mapController'
        };
    });
})();;try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
}
module.constant('appConfig', {
    templateUrl: "/digipolis.stadinkaart.webui",
    apiUrl: "/digipolis.stadinkaart.api/",
    enableDebug: true,
    enableLog: true
});
module.directive('preventDefault', function () {
    return function (scope, element, attrs) {
        angular.element(element).bind('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
        angular.element(element).bind('dblclick', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

    }
});

var helperService = function () {
    var map = {};
    return map;
}


module.factory("map", helperService);;// Kan gebruikt worden om data door te geven tussen controllers en/of directives

(function () {

    'use strict';
   try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', [ 'tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
}


    var gisDataService = function (HelperService) { //$http
 function initData() {
   //http://app11.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/identify?geometry=%7Bx%3A4.4029%2C+y%3A+51.2192%7D&geometryType=esriGeometryPoint&sr=4326&layers=all%3A1%2C6&layerDefs=&time=&layerTimeOptions=&tolerance=2&mapExtent=4.2%2C51%2C4.6%2C51.4&imageDisplay=imageDisplay%3D600%2C600%2C96&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=html
    return {
                layers: {
                    baselayers: {
                        kaart: {
                name: 'kaart',
                url: 'http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}',
                type: 'xyz',
                layerOptions: {
                    showOnSelector: true
                }
            },
            luchtfoto: {
                name: 'luchtfoto',
                url: "http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png",
                type: 'xyz',
                layerOptions: {
                    showOnSelector: true,
                    tms: true
                }
            }
                     },
                 overlays: {
                                 	perceel: {
                            name: 'geoservice',
                            type: 'agsFeature',
                            url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/6',
                            visible: true,
                                layerOptions: {
                                      showOnSelector: true,
                                 simplifyFactor: 0.5,
                                 precision: 5,
                                 minZoom: 17,
                                 maxZoom: 25,
             
                            },
                            group: 'Test',
                            // superGroup: 'SuperTest'
                        },
                    //      hoofdgebouw: {
                    //         name: 'Styling Polygons',
                    //         type: 'agsFeature',
                    //         url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/1',
                    //         visible: true,
                    //         layerOptions: {
                    //             simplifyFactor: 0.5,
                    //             precision: 5,
                    //             minZoom: 17,
                    //              maxZoom: 25,
                    //             style: function (feature) {
                    //    
                    //                     return { color: 'red', weight: 1 };
                    //             
                    //             }
                    //         },
                    //         group: 'Test'
                    //     },
           
                        }
                     },
                 
                
                
    }}
        var _mapData = function() { return HelperService.clone(initData()); };
        var _convertedMapDatatata = {};
    _convertedMapDatatata.layers = {};
 _convertedMapDatatata.layers.overlays = HelperService.findNested();



    

        function _changeVisibility(url) {

            var overlays = _mapData.layers.overlays;

            var res = HelperService.findNested(overlays, 'url');

            res.forEach(function (layer) {
                if (layer.url == url) {
                    layer.visible = !layer.visible;
        console.log('Changed url: ' + url + ' to: ' + layer.visible);
                    
                }
            }, this);
        }
        return {
            changeVisibility: _changeVisibility,
            mapData: _mapData(),
            convertedMapDatatata: _convertedMapDatatata
        };

    }
    gisDataService.$inject = ['HelperService'];
    module.factory('GisDataService', gisDataService);

})();
;'use strict';


(function () {

    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function () {
        var _baseLayersService = {};
        _baseLayersService.kaart = L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' });
        _baseLayersService.luchtfoto = L.tileLayer("http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png", { id: 'luchtfoto', tms: 'true' });
        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();;'use strict';


(function () {

  try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', [ 'tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
}
    var helperService = function () {
        console.log('Helperservice CTOR');
        var _helperService = {};

        _helperService.clone = function (obj) {
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
                    copy[i] = _helperService.clone(obj[i]);
                }
                return copy;
            }
            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = _helperService.clone(obj[attr]);
                }
                return copy;
            }
            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        }


        _helperService.findNested = function (obj, key) {
            if (_.has(obj, key)) // or just (key in obj)
                return [obj];
            // elegant:
            return _.flatten(_.map(obj, function (v) {
                return typeof v == 'object' ? _helperService.findNested(v, key) : [];
            }), true);


        }

        return _helperService;
    };

    module.factory("HelperService", helperService);
})();;'use strict';
(function () {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function (map) {
        var _mapService = {};



        _mapService.currentLayers = [6]
        _mapService.visibleFeatures = [];

        return _mapService;
    };

    mapService.$inject = ['map'];

    module.factory('MapService', mapService);
})();;// (function() {
// 
//     'use strict';
// 
//     var componentName = "ErrorHandler";
//     var theComponent = function(appService) {
// 
//         function _handle(errorResponse) {
// 
//             // ToDo : vervang onderstaande door eigen error handling, indien gewenst
// 
//             var message = "fout bij call naar " + errorResponse.config.url + " (" + errorResponse.config.method + ") - " + errorResponse.status + " ";
//             if (errorResponse.data) {
//                 if (errorResponse.data.message)
//                     message += errorResponse.data.message;
//                 else
//                     message += errorResponse.statusText;
//             } else {
//                 message += errorResponse.statusText;
//             }
//             appService.logger.error(message);
//         }
// 
//         function _getErrorMessage(errorResponse, defaultMessage) {
//             defaultMessage = defaultMessage || "unknown error";
//             if (errorResponse.data) {
//                 if (errorResponse.data.listOfHttpError) {
//                     if (errorResponse.data.listOfHttpError.message) {
//                         return errorResponse.data.listOfHttpError.message;
//                     } else {
//                         if (errorResponse.statusText)
//                             return errorResponse.statusText;
//                         else
//                             return defaultMessage;
//                     }
//                 } else {
//                     if (errorResponse.data.message) {
//                         return errorResponse.data.message;
//                     } else {
//                         if (errorResponse.statusText)
//                             return errorResponse.statusText;
//                         else
//                             return defaultMessage;
//                     }
//                 }
//             } else {
//                 if (errorResponse.statusText)
//                     return errorResponse.statusText;
//                 else
//                     return defaultMessage;
//             }
//         }
// 
//         /* +++++ public interface +++++ */
// 
//         appService.logger.creation(componentName);
// 
//         return {
//             handle: _handle,
//             getErrorMessage: _getErrorMessage,
//         };
// 
//     };
// 
//     theComponent.$inject = ['AppService'];
// 
//     angular.module('tink.gis.angular').factory(componentName, theComponent);
// 
// })();;// (function() {
// 
//     'use strict';
// 
//     var componentName = "Logger";
//     var theComponent = function($log, appConfig) {
// 
//         function _success(message) {
//             if (appConfig.enableLog) {
//                 $log.log(message);
//             }
//         }
// 
//         function _debug(message) {
//             if (appConfig.enableLog) {
//                 if (appConfig.enableDebug) {
//                     $log.debug(message);
//                 }
//             }
//         }
// 
//         function _info(message) {
//             if (appConfig.enableLog) {
//                 $log.info(message);
//             }
//         }
// 
//         function _warn(message) {
//             if (appConfig.enableLog) {
//                 $log.warn(message);
//             }
//         }
// 
//         function _error(message) {
//             if (appConfig.enableLog) {
//                 $log.error(message);
//             }
//         }
// 
//         function _creation(name) {
//             _debug(name + " : gecreëerd.");
//         }
// 
//         function _initialization(name) {
//             _debug(name + " : geïnitialiseerd.");
//         }
// 
//         /* +++++ public interface +++++ */
// 
//         return {
//             success: _success,
//             debug: _debug,
//             info: _info,
//             warn: _warn,
//             error: _error,
//             creation: _creation,
//             init: _initialization
//         };
// 
//     };
//     theComponent.$inject = ['$log', 'appConfig'];
//     angular.module('tink.gis.angular').factory(componentName, theComponent);
// 
// })()
;angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/layer.html',
    "<input style=\"opacity: 1;position: relative;z-index:100\" type=checkbox ng-model=layerData.visible ng-change=changeVisibility(layerData.url)>\n" +
    "{{layerData.name}}"
  );


  $templateCache.put('templates/layerstemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\" style=\"height: 100%; position: absolute\"> <aside> <div class=nav-aside-section> <tink-accordion data-start-open=true> <div ng-repeat=\"theme in layers\"> <tink-accordion-panel> <data-header>  </data-header> <data-content>  <tink-accordion data-start-open=true> <div ng-repeat=\"group in theme.groups\"> <tink-accordion-panel> <data-header>  </data-header> <data-content> <div ng-repeat=\"layerhup in layers\"> <layer layer-data=layerhup></layer> </div> </data-content> </tink-accordion-panel> </div> </tink-accordion> </data-content> </tink-accordion-panel> </div> </tink-accordion> </div> </aside> </div>"
  );


  $templateCache.put('templates/maptemplate.html',
    "<div id=content> <div class=wrapper> <leaflet id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=\"btn active\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input id=zoekbalk1 placeholder=\"Welke locatie of adres zoek je?\">\n" +
    "<input class=invisible placeholder=\"Welke locatie of adres zoek je?\"> </div> <div class=\"ll btn-group ll kaarttypes\"> <button class=btn ng-class=\"{active: kaartIsGetoond==true}\" ng-click=toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: kaartIsGetoond==false}\" ng-click=toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </leaflet> </div> </div>"
  );


  $templateCache.put('templates/tinkmaptemplate.html',
    ""
  );

}]);
