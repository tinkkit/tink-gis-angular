'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    module = angular.module('tink.gis.angular');
    module.controller('groupLayerController',
        function ($scope) {
            $scope.visChanged = function () {
                $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
            };
        });
})();;'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope) {
        $scope.visChanged = function () {
            $scope.$emit('layerCheckboxChangedEvent', $scope.layer); // stuur naar parent ofwel group ofwel theme
        };
    });
    theController.$inject = [];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($scope, $http, map, MapService) {
        $scope.themes = MapService.Themes;
        $scope.selectedLayers = [];
    });
    theController.$inject = ['$http', 'map', 'MapService'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, $http, map) {
        $scope.layerId = '';
        $scope.activeInteractieKnop = 'select';
        $scope.selectedLayer = {};
        $scope.SelectableLayers = MapService.VisibleLayers;
        map.on('click', function (event) {
            if (!IsDrawing) {
                console.log("click op map!");
                cleanMapAndSearch();
                switch ($scope.activeInteractieKnop) {
                    case 'identify':
                        MapService.Identify(event, null, 2);
                        break;
                    case 'select':
                        if (_.isEmpty($scope.selectedLayer)) {
                            console.log("Geen layer selected! kan dus niet opvragen");
                        }
                        else {
                            MapService.Identify(event, $scope.selectedLayer, 1); // click is gewoon een identify maar dan op selectedlayer.
                        }
                        break;
                    default:
                        console.log("MAG NOG NIET!!!!!!!!");
                        break;
                }
                $scope.$apply();

            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function (event) {
            IsDrawing = true;
            cleanMapAndSearch();
            console.log("wtdf");
        });
        map.on('draw:created', function (event) {
            console.log('draw created');
            console.log(event);
            if (_.isEmpty($scope.selectedLayer)) {
                console.log("Geen layer selected! kan dus niet opvragen");
            }
            else {
                MapService.Query(event, $scope.selectedLayer);
                $scope.$apply();
            }
            IsDrawing = false;
        });
        var cleanMapAndSearch = function () {
            for (var x = 0; x < MapService.VisibleFeatures.length; x++) {
                map.removeLayer(MapService.VisibleFeatures[x]); //eerst de 
            }
            MapService.VisibleFeatures.length = 0;
            MapService.JsonFeatures.length = 0;
            map.clearDrawings();

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
    theController.$inject = ['BaseLayersService', 'MapService', '$http', 'map'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function ($scope, MapService, map) {
            var vm = this;
            vm.features = MapService.JsonFeatures;
        });
    theController.$inject = ['$scope', 'MapService', 'map'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.controller('themeController', ['$scope', 'MapService',
        function ($scope, MapService) {
            $scope.$on('groupCheckboxChangedEvent', function (event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, $scope.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function (event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, $scope.theme);
            });
            $scope.visChanged = function () {
                MapService.UpdateThemeStatus($scope.theme);
                console.log($scope.theme.Visible);
            };
        }]);
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkGrouplayer', function () {
        return {
            replace: true,
            scope: {
                grouplayer: '='
            },
            templateUrl: 'templates/groupLayerTemplate.html',
            controller: 'groupLayerController'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayer', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layerTemplate.html',
            controller: 'layerController',
        }
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayers', function () {
        return {
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
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            scope: {
                parlayers: '=',
                parcenter: '='
            },
            controller: 'mapController'
        };
    });
})();           ;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkSearch', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/searchTemplate.html',
            controller: 'searchController',
            controllerAs: 'vm'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkTheme', function () {
        return {
            replace: true,
            scope: {
                theme: '='
            },
            templateUrl: 'templates/themeTemplate.html',
            controller: 'themeController'
        };
    });
})();;(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', 'ui.sortable']); //'leaflet-directive'
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
        };
    });
    var mapObject = function () {
        var map = L.map('map', {
            center: [51.2192159, 4.4028818],
            zoom: 16,
            layers: L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' }),
            zoomControl: false,
            drawControl: true
        });
        console.log(map);
        map.doubleClickZoom.disable();
        L.control.scale({ imperial: false }).addTo(map);
        var drawnItems = L.featureGroup().addTo(map);
        map.on('draw:created', function (event) {
            var layer = event.layer;
            drawnItems.addLayer(layer);
        });
        map.on('draw:drawstart', function (event) {
            console.log(drawnItems);
            map.clearDrawings();
        });
        map.clearDrawings = function () {
            drawnItems.clearLayers();
        }

        return map;
    }
    module.factory("map", mapObject);
})();;// 'use strict';
// (function () {
//     try {
//         var module = angular.module('tink.gis.angular');
//     } catch (e) {
//         var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
//     }
// 
//     var gisDataService = function (HelperService, $http) { //$http
//         //    //http://app11.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/identify?geometry=%7Bx%3A4.4029%2C+y%3A+51.2192%7D&geometryType=esriGeometryPoint&sr=4326&layers=all%3A1%2C6&layerDefs=&time=&layerTimeOptions=&tolerance=2&mapExtent=4.2%2C51%2C4.6%2C51.4&imageDisplay=imageDisplay%3D600%2C600%2C96&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=html
//         var _layerData = {};
//         $http.get('http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/?f=pjson').success(function (data) {
//             console.log('GOT THE DATA!');
//             _layerData = data;
//         });
//         return {
//             layerData: _layerData,
//             layers: _layerData.layers
//         };
//     }
//     gisDataService.$inject = ['HelperService', '$http'];
// 
//     module.factory('GisDataService', gisDataService);
// })();
// 
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
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', ['ui.sortable']]); //'leaflet-directive'
    }
    var layersService = function ($http, map) {
        var _layersService = {};
        return _layersService;
    };
    module.$inject = ["$http", 'map'];
    module.factory("LayersService", layersService);
})();;'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function ($rootScope, $http, map, ThemeHelper, $q) {
        var _mapService = {};
        _mapService.VisibleLayers = [];
        _mapService.VisibleLayers.push({ id: '', name: 'Alle Layers' });
        console.log("visLayerAdded");
        _mapService.SelectableLayers = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.getLayerUrls = ['http://app10.p.gis.local/arcgissql/rest/services/P_Stedenbouw/stad/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_GeoService/operationallayers/MapServer/?f=pjson'];
        _mapService.Themes = [];


        var loadAllLayers = function () { // dit moet met HTTP en ergens op een andere service ofzo vervangen worden later wnnr dit geimplementeerd moet worden.
            var promises = [];
            _.each(_mapService.getLayerUrls, function (layerurl) {
                var prom = $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                    var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                    _mapService.Themes.push(convertedTheme);
                    _.each(convertedTheme.GetAllLayers(), function (layer) {
                        _mapService.VisibleLayers.push(layer);
                    });
                    // _mapService.SelectableLayers = _mapService.SelectableLayers.concat(convertedTheme.AllLayers);
                });
                promises.push(prom);
            });
            $q.all(promises).then(function (values) {
                console.log(values); // value gamma
                console.log("Alle mappen geladen");
            });

        };
        loadAllLayers();
        _mapService.Identify = function (event, selectedLayer, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 2; }
            _.each(_mapService.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var layersVoorIdentify = "";
                var identifOnThisTheme = true;
                if (typeof selectedLayer === 'undefined' || selectedLayer == null) {
                    // geen selected layer oke dan qryen we voor alle vis layers
                    layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                }
                else {
                    // well selected layer, eerst zeker zijn dat deze hierbij hoort.
                    if (selectedLayer.id === -1) {
                        layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                    }
                    else {
                        if (selectedLayer.theme.Naam === theme.Naam) { // is het deze theme?
                            layersVoorIdentify = 'visible: ' + selectedLayer.id;
                        } else {
                            identifOnThisTheme = false; //overslaan het is een select van maar 1 laag en de laag is niet op deze theme
                        }
                    }
                }
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                        for (var x = 0; x < featureCollection.features.length; x++) {
                            var featureItem = featureCollection.features[x];
                            var myStyle = {
                                "fillOpacity": 0
                            };
                            _mapService.JsonFeatures.push(featureItem);
                            var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                            _mapService.VisibleFeatures.push(mapItem);
                        }
                        $rootScope.$apply();
                    });
                }

            });
        };
        _mapService.Query = function (event, selectedLayer) {
            selectedLayer.theme.MapData.query()
                .layer(selectedLayer.id)
                .intersects(event.layer)
                .run(function (error, featureCollection, response) {
                    for (var x = 0; x < featureCollection.features.length; x++) {
                        _mapService.JsonFeatures.push(featureCollection.features[x]);
                        var item = L.geoJson(featureCollection.features[x]).addTo(map);
                        _mapService.VisibleFeatures.push(item);
                    }
                });
        };


        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            console.log(!layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1) {
                    theme.VisibleLayers.push(layer);
                    _mapService.VisibleLayers.push(layer);
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    var indexOfLayerInVisibleLayersOfMap = _mapService.VisibleLayers.indexOf(layer);
                    _mapService.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                }
            }
            theme.RecalculateVisibleLayerIds();
        };
        _mapService.UpdateGroupLayerStatus = function (groupLayer, theme) {
            _.each(groupLayer.Layers, function (childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };
        _mapService.UpdateThemeStatus = function (theme) {
            _.each(theme.Groups, function (layerGroup) {
                _mapService.UpdateGroupLayerStatus(layerGroup, theme);
            });
            _.each(theme.Layers, function (layer) {
                _mapService.UpdateLayerStatus(layer, theme);
            });
        };

        return _mapService;
    };
    module.$inject = ['$rootScope', '$http', 'map', 'ThemeHelper', '$q'];
    module.factory('MapService', mapService);
})();
;'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function (map) {
        var themeHelper = {};
        themeHelper.createThemeFromJson = function (rawdata, getData) {
            var thema = {};
            var rawlayers = rawdata.layers;
            var cleanUrl = getData.url.substring(0, getData.url.indexOf('?'));
            thema.Naam = rawdata.documentInfo.Title;
            thema.Layers = [];
            thema.Groups = [];
            thema.VisibleLayers = []; // -1 is een truckje wnnr er geen ids zijn dat hij niet ALLEs queryt maar niks
            thema.VisibleLayerIds = []; // -1 is een truckje wnnr er geen ids zijn dat hij niet ALLEs queryt maar niks
            
            thema.GetAllLayers = function () {
                var alllayers = [];
                _.each(thema.Layers, function (layer) {
                    alllayers.push(layer);
                });
                _.each(thema.Groups, function (group) {
                    _.each(group.Layers, function (layer) {
                        alllayers.push(layer);
                    });
                });
                return alllayers;
            };
            thema.Visible = true;
            thema.MapData = L.esri.dynamicMapLayer({
                url: cleanUrl,
                opacity: 0.5,
                layers: thema.VisibleLayerIds,
                useCors: false
            }).addTo(map);
            thema.RecalculateVisibleLayerIds = function () {
                thema.VisibleLayerIds.length = 0;

                _.forEach(thema.VisibleLayers, function (visLayer) {
                    thema.VisibleLayerIds.push(visLayer.id);
                });
                if(thema.VisibleLayerIds.length === 0)
                {
                    thema.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                }
                console.log(thema.VisibleLayerIds);
            };
            _.each(rawlayers, function (x) {
                x.visible = true;

                x.parent = null;
                x.theme = thema;
                if (x.parentLayerId === -1) {
                    if (x.subLayerIds === null) {
                        thema.Layers.push(x);
                        thema.VisibleLayers.push(x);
                    } else {
                        thema.Groups.push(x);
                    }
                }
            });
            _.each(thema.Groups, function (layerGroup) {
                if (layerGroup.subLayerIds !== null) {
                    layerGroup.Layers = [];
                    _.each(rawlayers, function (rawlayer) {
                        if (layerGroup.id === rawlayer.parentLayerId) {
                            rawlayer.parent = layerGroup;
                            thema.VisibleLayers.push(rawlayer);
                            layerGroup.Layers.push(rawlayer);
                        }
                    });
                }
            });
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['map'];
    module.factory('ThemeHelper', service);
})();
;'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function (map, ThemeHelper) {
        var _service = {};
        return _service;
    };
    module.$inject = ['map', 'ThemeHelper'];
    module.factory('ThemeService', service);
})();
;// (function() {
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

  $templateCache.put('templates/groupLayerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=grouplayer.visible ng-change=visChanged()>{{grouplayer.name}} <div ng-repeat=\"layer in grouplayer.Layers\"> <tink-layer layer=layer> </tink-layer> </div> </div>"
  );


  $templateCache.put('templates/layerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=layer.visible ng-change=visChanged()>{{layer.name | limitTo: 20}} </div>"
  );


  $templateCache.put('templates/layerstemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <ul ui-sortable ng-model=themes> <div ng-repeat=\"theme in themes\"> <tink-theme theme=theme> </tink-theme> </div> </ul> </div> </aside> </div>"
  );


  $templateCache.put('templates/maptemplate.html',
    "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=identify() ng-class=\"{active: activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=select() ng-class=\"{active: activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: activeInteractieKnop=='dunno'}\" prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in SelectableLayers track by layer.id\" ng-model=selectedLayer ng-change=layerChange() ng-class=\"{invisible: activeInteractieKnop!='select'}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: kaartIsGetoond==true}\" ng-click=toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: kaartIsGetoond==false}\" ng-click=toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-layers></tink-layers> <tink-search></tink-search> </div>"
  );


  $templateCache.put('templates/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> Zoek <div ng-repeat=\"feature in vm.features \"> layerid: {{feature.theme.Naam}} <pre>{{feature.properties | json }}</pre> </div> </div> </aside> </div>"
  );


  $templateCache.put('templates/themeTemplate.html',
    "<div><input class=visible-box type=checkbox ng-model=theme.Visible ng-change=visChanged()>{{theme.Naam}} <div class=layercontroller-checkbox ng-repeat=\"layer in theme.Layers\"> <tink-layer layer=layer> </tink-layer> </div> <div class=layercontroller-checkbox ng-repeat=\"group in theme.Groups\"> <tink-grouplayer grouplayer=group> </tink-grouplayer> </div> </div>"
  );

}]);
