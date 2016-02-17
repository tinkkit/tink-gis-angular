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
            var vm = this;
            vm.grouplayer = $scope.grouplayer;
            vm.chkChanged = function () {
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
        var vm = this;
        vm.layer = $scope.layer;
        vm.chkChanged = function () {
            $scope.$emit('layerCheckboxChangedEvent', $scope.layer); // stuur naar parent ofwel group ofwel theme
        };
    });
    theController.$inject = [];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function ($http, map, MapService) {
        var vm = this;
        vm.themes = MapService.Themes;
        vm.selectedLayers = [];
    });
    theController.$inject = ['$http', 'map', 'MapService'];
})();;/// <reference path="../services/mapService.js" />

'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, $http, map) {
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = 'select';
        vm.Data = {};
        vm.SelectableLayers = MapService.VisibleLayers;
    
        // vm.Data.selectedLayer = MapService.SelectedLayer;
        MapService.SelectedLayer = vm.Data.selectedLayer;
        map.on('click', function (event) {
            console.log('click op map!');
            if (!IsDrawing) {
                cleanMapAndSearch();
                switch (vm.activeInteractieKnop) {
                    case 'identify':
                        MapService.Identify(event, null, 2);
                        break;
                    case 'select':
                        if (_.isEmpty(vm.selectedLayer)) {
                            console.log('Geen layer selected! kan dus niet opvragen');
                        }
                        else {
                            MapService.Identify(event, vm.selectedLayer, 1); // click is gewoon een identify maar dan op selectedlayer.
                        }
                        break;
                    default:
                        console.log('MAG NOG NIET!!!!!!!!');
                        break;
                }
                $scope.$apply();

            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function (event) {
            console.log('draw started');
            IsDrawing = true;
            cleanMapAndSearch();
        });
        map.on('draw:created', function (event) {
            console.log('draw created');
            console.log(event);
            if (_.isEmpty(vm.selectedLayer)) {
                console.log('Geen layer selected! kan dus niet opvragen');
            }
            else {
                MapService.Query(event, vm.selectedLayer);
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
        vm.identify = function () {
            cleanMapAndSearch();
            vm.activeInteractieKnop = 'identify';
            $('.leaflet-draw.leaflet-control').hide();
        };
        vm.select = function () {
            cleanMapAndSearch();
            vm.activeInteractieKnop = 'select';
            $('.leaflet-draw.leaflet-control').show();
        };
        vm.layerChange = function () {
            cleanMapAndSearch();
            console.log("SELECTEDLAYER:");
            console.log(vm.Data.selectedLayer);
            console.log(MapService.SelectedLayer);

        };
        vm.zoomIn = function () {
            map.zoomIn();
        };
        vm.zoomOut = function () {
            map.zoomOut();
        };
        vm.fullExtent = function () {
            map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
        };
        vm.kaartIsGetoond = true;
        vm.toonKaart = function () {
            vm.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        vm.toonLuchtfoto = function () {
            vm.kaartIsGetoond = false;
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
            var vm = this;
            vm.theme = $scope.theme;
            $scope.$on('groupCheckboxChangedEvent', function (event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function (event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, vm.theme);
            });
            vm.chkChanged = function () {
                MapService.UpdateThemeStatus(vm.theme);
                console.log(vm.theme.Visible);
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
            controller: 'groupLayerController',
            controllerAs: 'grplyrctrl'
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
            controllerAs: 'lyrctrl'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayers', function () {
        return {
            replace: true,
            templateUrl: 'templates/layersTemplate.html',
            controller: 'layersController',
            controllerAs: 'lyrsctrl'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
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
            controllerAs: 'srchctrl'
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
            controller: 'themeController',
            controllerAs: 'thmctrl'
        };
    });
})();;'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', 'ui.sortable','tink.modal']); //'leaflet-directive'
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
})();;'use strict';


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
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi','tink.modal']); //'leaflet-directive'
    }
    var mapService = function ($rootScope, $http, map, ThemeHelper, $q) {
        var _mapService = {};
        _mapService.VisibleLayers = [];

        _mapService.SelectableLayers = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.getLayerUrls = ['http://app10.a.gis.local/arcgissql/rest/services/A_Stedenbouw/stad/MapServer/?f=pjson'];  //'http://app10.p.gis.local/arcgissql/rest/services/P_Stedenbouw/stad/MapServer?f=pjson',
        _mapService.Themes = [];
        var defaultlayer = { id: '', name: 'Alle Layers' };
        _mapService.VisibleLayers.unshift(defaultlayer);
        _mapService.SelectedLayer = defaultlayer;
        var loadAllLayers = function () { // dit moet met HTTP en ergens op een andere service ofzo vervangen worden later wnnr dit geimplementeerd moet worden.
            var promises = [];
            // _mapService.VisibleLayers.length = 0;

            _.each(_mapService.getLayerUrls, function (layerurl) {
                var prom = $http.get(layerurl).success(function (data, statuscode, functie, getdata) {
                    var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                    _mapService.Themes.push(convertedTheme);
                    _.each(convertedTheme.GetAllLayers(), function (layer) {
                        _mapService.VisibleLayers.push(layer);
                    });
                });
                promises.push(prom);
            });
            $q.all(promises).then(function (lagen) {
                // console.log(lagen); // value gamma
                console.log("Alle layers geladen");
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
                        AddFeatures(featureCollection);
                    });
                }

            });
        };
        _mapService.Select = function (event) {
            _.each(_mapService.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = _mapService.SelectedLayer.theme == theme;
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + _mapService.SelectedLayer.id).tolerance(tolerance).run(function (error, featureCollection) {
                        AddFeatures(featureCollection);
                    });
                }

            });
        };
        var AddFeatures = function (features) {
            for (var x = 0; x < features.features.length; x++) {
                var featureItem = features.features[x];
                var myStyle = {
                    "fillOpacity": 0
                };
                _mapService.JsonFeatures.push(featureItem);
                var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                _mapService.VisibleFeatures.push(mapItem);
            }
            console.log(_mapService.SelectedLayer);
            $rootScope.$apply();
        };
        _mapService.Query = function (event, selectedLayer) {
            console.log(selectedLayer.id);
            selectedLayer.theme.MapData.query()
                .layer('visible: ' + selectedLayer.id)
                .intersects(event.layer)
                .run(function (error, featureCollection, response) {
                    AddFeatures(featureCollection);
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
                if (thema.VisibleLayerIds.length === 0) {
                    thema.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                }
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
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=grplyrctrl.grouplayer.visible ng-change=chkChanged()>{{grplyrctrl.grouplayer.name}} <div ng-repeat=\"layer in grplyrctrl.grouplayer.Layers\"> <tink-layer layer=layer> </tink-layer> </div> </div>"
  );


  $templateCache.put('templates/layerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=lyrctrl.layer.visible ng-change=lyrctrl.chkChanged()>{{layer.name | limitTo: 20}} </div>"
  );


  $templateCache.put('templates/layerstemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <ul ui-sortable ng-model=lyrsctrl.themes> <div ng-repeat=\"theme in lyrsctrl.themes\"> <tink-theme theme=theme> </tink-theme> </div> </ul> </div> </aside> </div>"
  );


  $templateCache.put('templates/maptemplate.html',
    "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=identify() ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=select() ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.activeInteractieKnop=='dunno'}\" prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers\" ng-model=mapctrl.selectedLayer ng-change=mapctrl.layerChange() ng-class=\"{invisible: mapctrl.activeInteractieKnop!='select'}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==true}\" ng-click=mapctrl.toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==false}\" ng-click=mapctrl.toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=mapctrl.zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-layers></tink-layers> <tink-search></tink-search> </div>"
  );


  $templateCache.put('templates/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> Zoek <div ng-repeat=\"feature in searchctrl.features \"> layerid: {{feature.theme.Naam}} <pre>{{feature.properties | json }}</pre> </div> </div> </aside> </div>"
  );


  $templateCache.put('templates/themeTemplate.html',
    "<div><input class=visible-box type=checkbox ng-model=thmctrl.theme.Visible ng-change=thmctrl.chkChanged()>{{thmctrl.theme.Naam}} <div class=layercontroller-checkbox ng-repeat=\"layer in thmctrl.theme.Layers\"> sqdfqdsf <tink-layer layer=layer> </tink-layer> </div> <div class=layercontroller-checkbox ng-repeat=\"group in thmctrl.theme.Groups\"> <tink-grouplayer grouplayer=group> </tink-grouplayer> </div> </div>"
  );

}]);
