


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
 
    })
    theController.$inject = ['GisDataService'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, HelperService, GisDataService, BaseLayersService, map, MapService, $http) {
        $scope.layerId = '';
        $scope.activeInteractieKnop = 'identify';
        $scope.selectedlayer = [];

        map = L.map('map', {
            center: [51.2192159, 4.4028818],
            zoom: 16,
            layers: [BaseLayersService.kaart],
            zoomControl: false
        });
        map.doubleClickZoom.disable();
        $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson')
            .success(function (data) {
                $scope.Layers = data.layers;
            });
        L.control.scale({ imperial: false }).addTo(map);
        var AGeaoService = L.esri.dynamicMapLayer({
            url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer',
            opacity: 0.5,
            layers: [],
            useCors: false
        }).addTo(map);
        map.on('click', function (e) {
            console.log('click op de map');
            cleanMapAndSearch();
            AGeaoService.identify().on(map).at(e.latlng).layers('visible:' + $scope.layerId).run(function (error, featureCollection) {
                for (var x = 0; x < featureCollection.features.length; x++) {
                    MapService.jsonFeatures.push(featureCollection.features[x]);
                    console.log(featureCollection.features[x]);

                    var item = L.geoJson(featureCollection.features[x]).addTo(map);
                    MapService.visibleFeatures.push(item);
                }
                $scope.$apply();
            });
        });
        var cleanMapAndSearch = function () {
            for (var x = 0; x < MapService.visibleFeatures.length; x++) {
                map.removeLayer(MapService.visibleFeatures[x]);
            }
            MapService.visibleFeatures.length = 0;
            MapService.jsonFeatures.length = 0;
        };
        $scope.identify = function () {
            cleanMapAndSearch();
            $scope.activeInteractieKnop = 'identify';
            $scope.layerId = '';
            AGeaoService.options.layers = [$scope.layerId]
        };
        $scope.select = function () {
            cleanMapAndSearch();
            $scope.activeInteractieKnop = 'select';
            $scope.layerId = '0';
            $scope.selectedlayer.id = '0'
            AGeaoService.options.layers = [$scope.layerId]

        };
        $scope.layerChange = function () {
            $scope.layerId = $scope.selectedlayer.id;
            AGeaoService.options.layers = [$scope.layerId]
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
    theController.$inject = ['HelperService', 'GisDataService', 'BaseLayersService', 'map', 'MapService', '$http'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController', function ($scope, MapService) {
        $scope.features = MapService.jsonFeatures;
    });
    theController.$inject = ['MapService'];
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
    module.directive('tinkLayers', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/layersTemplate.html',
            controller: 'layersController'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkMap', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: 'mapController'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkSearch', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/searchTemplate.html',
            controller: 'searchController'
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
module.factory("map", helperService);
console.log('init done');;'use strict';
(function () {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var gisDataService = function (HelperService, $http) { //$http
        //    //http://app11.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/identify?geometry=%7Bx%3A4.4029%2C+y%3A+51.2192%7D&geometryType=esriGeometryPoint&sr=4326&layers=all%3A1%2C6&layerDefs=&time=&layerTimeOptions=&tolerance=2&mapExtent=4.2%2C51%2C4.6%2C51.4&imageDisplay=imageDisplay%3D600%2C600%2C96&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=html
        var _layerData = {};
        $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson').success(function (data) {
            // you can do some processing here
            console.log('GOT THE DATA!');
            _layerData = data;
        });
        return {
            layerData: _layerData,
            layers: _layerData.layers
        };
    }
    gisDataService.$inject = ['HelperService', '$http'];
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
        _mapService.IdentifiedItems = [];
        _mapService.visibleFeatures = [];
        _mapService.jsonFeatures = [];

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


  $templateCache.put('templates/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> Layers <tink-accordion data-start-open=true> <div ng-repeat=\"theme in layers\"> <tink-accordion-panel> <data-header>  </data-header> <data-content>  <tink-accordion data-start-open=true> <div ng-repeat=\"group in theme.groups\"> <tink-accordion-panel> <data-header>  </data-header> <data-content> <div ng-repeat=\"layerhup in layers\"> <layer layer-data=layerhup></layer> </div> </data-content> </tink-accordion-panel> </div> </tink-accordion> </data-content> </tink-accordion-panel> </div> </tink-accordion> </div> </aside> </div>"
  );


  $templateCache.put('templates/mapTemplate.html',
    "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=identify() ng-class=\"{active: activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=select() ng-class=\"{active: activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: activeInteractieKnop=='dunno'}\" prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in Layers track by layer.id\" ng-model=selectedlayer ng-change=layerChange() ng-class=\"{invisible: activeInteractieKnop!='select'}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: kaartIsGetoond==true}\" ng-click=toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: kaartIsGetoond==false}\" ng-click=toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-layers></tink-layers> <tink-search> </tink-search></div>"
  );


  $templateCache.put('templates/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> Zoek <div ng-repeat=\"feature in features \"> layerid: {{feature.layerId}} <pre>{{feature.properties | json }}</pre> </div> </div> </aside> </div>"
  );

}]);
