'use strict';
(function(module) {
    module = angular.module('tink.gis.angular')
        .controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$http', '$q', 'urls', 'MapService', function($scope, $modalInstance, ThemeHelper, $http, $q, urls, MapService) {
            var EnabledThemes = angular.copy(MapService.Themes);
            $scope.availableThemes = [];
            var processUrls = function(urls) {
                var promises = [];
                $scope.searchTerm = 'Laden...';
                _.each(urls, function(url) {
                    var AlreadyAddedTheme = null
                    EnabledThemes.forEach(function(theme) { // OPTI kan paar loops minder door betere zoek in array te doen
                        if (theme.Url == url) {
                            AlreadyAddedTheme = theme;
                        }
                    });
                    if (AlreadyAddedTheme == null) { // if we didn t get an alreadyadderdtheme we get the data
                        var prom = $http.get(url).success(function(data, statuscode, functie, getdata) {
                            var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                            $scope.availableThemes.push(convertedTheme);
                            convertedTheme.status = ThemeStatus.NEW;
                        });
                        promises.push(prom);
                    }
                    else { // ah we already got it then just push it.
                        AlreadyAddedTheme.status = ThemeStatus.UNMODIFIED;
                        $scope.availableThemes.push(AlreadyAddedTheme);
                    }
                });
                $q.all(promises).then(function(lagen) {
                    $scope.searchTerm = '';
                });
            };
            processUrls(urls);
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.themeChanged = function(theme) {
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
            };
            $scope.AddOrUpdateTheme = function() {
                var allChecked = true;
                var noneChecked = true;
                for (var x = 0; x < $scope.copySelectedTheme.AllLayers.length; x++) { // aha dus update gebeurt, we gaan deze toevoegen.
                    var copyLayer = $scope.copySelectedTheme.AllLayers[x];
                    var realLayer = $scope.selectedTheme.AllLayers[x];
                    realLayer.enabled = copyLayer.enabled;
                    if (copyLayer.enabled === false) { // check or all the checkboxes are checked
                        allChecked = false;
                    }
                    else {
                        noneChecked = false;
                    }
                };
                var alreadyAdded = EnabledThemes.find(function(x) { x.Url === $scope.selectedTheme.Url }) != undefined;
                if (noneChecked) {
                    //Niks is checked, dus we moeten deze 'deleten'.
                    $scope.selectedTheme.Added = false;
                    if ($scope.selectedTheme.status != ThemeStatus.NEW) { // als deze new is dan zette we deze gewoon op niets want we verwijderen die.
                        $scope.selectedTheme.status = ThemeStatus.DELETED;
                    }
                    else {
                        if (alreadyAdded) {
                            var index = EnabledThemes.indexOf($scope.selectedTheme);
                            if (index > -1) {
                                EnabledThemes.splice(index, 1);
                            }
                        }
                    }
                }
                else { // het is dus geen delete
                    if (allChecked) {
                        $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added 
                    }
                    else {
                        $scope.selectedTheme.Added = null; // if not all added then we put it to null
                    }

                    // var alreadyAdded = false;
                    // EnabledThemes.forEach(theme=> { // OPTI kan paar loops minder door betere zoek in array te doen
                    //     if (theme.Url == $scope.selectedTheme.Url) {
                    //         alreadyAdded = true;
                    //     }
                    // });
                    if (alreadyAdded == false) { // it is a new theme!
                        EnabledThemes.push($scope.selectedTheme);
                    } else { // already exist! It is an update!
                        if ($scope.selectedTheme.status != ThemeStatus.NEW) {
                            $scope.selectedTheme.status = ThemeStatus.UPDATED;
                            console.log("changed naar updated");
                        }
                        else {
                            console.log("Hij is al new, dus moet hij niet naar updated changen.");
                        }
                    }
                }

                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
            };

            $scope.ok = function() {
                $modalInstance.$close(EnabledThemes); // return the themes.
            };
            $scope.cancel = function() {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();; 'use strict';
(function(module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    module = angular.module('tink.gis.angular');
    module.controller('groupLayerController',
        function($scope) {
            var vm = this;
            vm.grouplayer = $scope.grouplayer;
            vm.chkChanged = function() {
                $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
            };
        });
})();; 'use strict';
(function(module) {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function($scope) {
        var vm = this;
        vm.layer = $scope.layer;
        vm.chkChanged = function() {
            $scope.$emit('layerCheckboxChangedEvent', $scope.layer); // stuur naar parent ofwel group ofwel theme
        };
    });
    theController.$inject = [];
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('layersController', function($http, map, MapService, $modal) {
        var vm = this;
        vm.themes = MapService.Themes;
        vm.selectedLayers = [];
        vm.AddLayers = function() {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/modals/addLayerModalTemplate.html',
                controller: 'addLayerController',
                resolve: {
                    backdrop: false,
                    keyboard: true,
                    urls: function() {
                        return MapService.ThemeUrls;
                    }
                }
            });
            addLayerInstance.result.then(function(selectedThemes) {
                MapService.AddAndUpdateThemes(selectedThemes);
            }, function(obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['$http', 'map', 'MapService', '$modal'];
})();;/// <reference path="../services/mapService.js" />

'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('mapController', function($scope, BaseLayersService, MapService, $http, map) {
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = 'select';
        vm.SelectableLayers = MapService.VisibleLayers;

        vm.selectedLayer = {};
        map.on('click', function(event) {
            console.log('click op map!');
            if (!IsDrawing) {
                cleanMapAndSearch();
                switch (vm.activeInteractieKnop) {
                    case 'identify':
                        MapService.Identify(event, 2);
                        break;
                    case 'select':
                        if (_.isEmpty(vm.selectedLayer)) {
                            console.log('Geen layer selected! kan dus niet opvragen');
                        }
                        else {
                            MapService.Select(event); // click is gewoon een identify maar dan op selectedlayer.
                        }
                        break;
                    default:
                        console.log('MAG NIET!!!!!!!!');
                        break;
                }
                // $scope.$apply();
            }
        });
        var IsDrawing = false;
        map.on('draw:drawstart', function(event) {
            console.log('draw started');
            IsDrawing = true;
            cleanMapAndSearch();
        });
        map.on('draw:created', function(event) {
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
        var cleanMapAndSearch = function() {
            for (var x = 0; x < MapService.VisibleFeatures.length; x++) {
                map.removeLayer(MapService.VisibleFeatures[x]); //eerst de 
            }
            MapService.VisibleFeatures.length = 0;
            MapService.JsonFeatures.length = 0;
            map.clearDrawings();
        };
        vm.identify = function() {
            cleanMapAndSearch();
            vm.activeInteractieKnop = 'identify';
            $('.leaflet-draw.leaflet-control').hide();
        };
        vm.select = function() {
            cleanMapAndSearch();
            vm.activeInteractieKnop = 'select';
            $('.leaflet-draw.leaflet-control').show();
        };
        vm.layerChange = function() {
            cleanMapAndSearch();
            MapService.SelectedLayer = vm.selectedLayer;
        };
        vm.zoomIn = function() {
            map.zoomIn();
        };
        vm.zoomOut = function() {
            map.zoomOut();
        };
        vm.fullExtent = function() {
            map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
        };
        vm.kaartIsGetoond = true;
        vm.toonKaart = function() {
            vm.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        vm.toonLuchtfoto = function() {
            vm.kaartIsGetoond = false;
            map.removeLayer(BaseLayersService.kaart);
            map.addLayer(BaseLayersService.luchtfoto);
        };
    });
    theController.$inject = ['BaseLayersService', 'MapService', '$http', 'map'];
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchController',
        function($scope, MapService, map) {
            var vm = this;
            vm.features = MapService.JsonFeatures;
        });
    theController.$inject = ['$scope', 'MapService', 'map'];
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.controller('themeController', ['$scope', 'MapService',
        function($scope, MapService) {
            var vm = this;
            vm.theme = $scope.theme;
            $scope.$on('groupCheckboxChangedEvent', function(event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
                MapService.UpdateThemeVisibleLayers(vm.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function(event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, vm.theme);
                MapService.UpdateThemeVisibleLayers(vm.theme);
            });
            vm.chkChanged = function() {
                MapService.UpdateThemeStatus(vm.theme);
                MapService.UpdateThemeVisibleLayers(vm.theme);
            };
            vm.deleteTheme = function() {
                MapService.DeleteTheme(vm.theme);
            }
        }]);
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkGrouplayer', function() {
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
})();; 'use strict';
(function(module) {

    angular.module('tink.gis.angular').directive('indeterminateCheckbox', [function() {
        return {
            scope: true,
            require: '?ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var childList = attrs.childList;
                var property = attrs.property;
                // Bind the onChange event to update children
                element.bind('change', function() {
                    scope.$apply(function() {
                        var isChecked = element.prop('checked');
                        // Set each child's selected property to the checkbox's checked property
                        angular.forEach(scope.$eval(childList), function(child) {
                            child[property] = isChecked;
                        });
                    });
                });
                //https://tech.small-improvements.com/2014/06/11/deep-watching-circular-data-structures-in-angular/
                function watchChildrenListWithProperty() {
                    return scope.$eval(childList).map(x => x[property]);
                }
                // Watch the children for changes
                scope.$watch(watchChildrenListWithProperty, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var hasChecked = false;
                        var hasUnchecked = false;
                        // Loop through the children
                        angular.forEach(newValue, function(child) {
                            if (child) {
                                hasChecked = true;
                            } else {
                                hasUnchecked = true;
                            }
                        });
                        // Determine which state to put the checkbox in
                        if (hasChecked && hasUnchecked) {
                            element.prop('checked', true);
                            element.prop('indeterminate', true);
                            if (modelCtrl) {
                                modelCtrl.$setViewValue(true);
                            }
                        } else {
                            element.prop('checked', hasChecked);
                            element.prop('indeterminate', false);
                            if (modelCtrl) {
                                modelCtrl.$setViewValue(hasChecked);
                            }
                        }
                    }
                }, true);
            }
        };
    }]);
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayer', function() {
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
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkLayers', function() {
        return {
            replace: true,
            templateUrl: 'templates/layersTemplate.html',
            controller: 'layersController',
            controllerAs: 'lyrsctrl'
        };
    });
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkMap', function() {
        return {
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkSearch', function() {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/searchTemplate.html',
            controller: 'searchController',
            controllerAs: 'srchctrl'
        };
    });
})();; 'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    module.directive('tinkTheme', function() {
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
})();; 'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal']); //'leaflet-directive'
    }
    module.constant('appConfig', {
        templateUrl: "/digipolis.stadinkaart.webui",
        apiUrl: "/digipolis.stadinkaart.api/",
        enableDebug: true,
        enableLog: true
    });
    module.directive('preventDefault', function() {
        return function(scope, element, attrs) {
            angular.element(element).bind('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });
            angular.element(element).bind('dblclick', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });
        };
    });
    var mapObject = function() {
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
        map.on('draw:created', function(event) {
            var layer = event.layer;
            drawnItems.addLayer(layer);
        });
        map.on('draw:drawstart', function(event) {
            console.log(drawnItems);
            map.clearDrawings();
        });
        map.clearDrawings = function() {
            drawnItems.clearLayers();
        }

        return map;
    }

    module.factory("map", mapObject);
})();
//Moet plaats voor zoeken!!! Enums in Angular hmm
var ThemeStatus = { // http://stijndewitt.com/2014/01/26/enums-in-javascript/
    UNMODIFIED: 0,
    NEW: 1,
    UPDATED: 2,
    DELETED: 3
    // properties: {
    //     1: { name: "small", value: 1, code: "S" },
    //     2: { name: "medium", value: 2, code: "M" },
    //     3: { name: "large", value: 3, code: "L" }
    // }
};; 'use strict';


(function() {

    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function() {
        var _baseLayersService = {};
        _baseLayersService.kaart = L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' });
        _baseLayersService.luchtfoto = L.tileLayer("http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png", { id: 'luchtfoto', tms: 'true' });
        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();; 'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', ['ui.sortable']]); //'leaflet-directive'
    }
    var layersService = function($http, map) {
        var _layersService = {};
        return _layersService;
    };
    module.$inject = ["$http", 'map'];
    module.factory("LayersService", layersService);
})();; 'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function($rootScope, $http, map, ThemeHelper, $q) {
        var _mapService = {};
        _mapService.VisibleLayers = [];
        _mapService.SelectableLayers = [];
        _mapService.VisibleFeatures = [];
        _mapService.JsonFeatures = [];
        _mapService.ThemeUrls = ['http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Afval/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Cultuur/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Jeugd/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Onderwijs/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/stad/MapServer?f=pjson'
        ];
        _mapService.Themes = [];
        var defaultlayer = { id: '', name: 'Alle Layers' };
        _mapService.VisibleLayers.unshift(defaultlayer);
        _mapService.SelectedLayer = defaultlayer;
        _mapService.AddAndUpdateThemes = function(themesBatch) {
            themesBatch.forEach(theme => {
                var existingTheme = _mapService.Themes.find(x => x.Url = theme.Url);
                switch (theme.status) {
                    case ThemeStatus.NEW:
                        _mapService.AddNewTheme(theme);
                        break;
                    case ThemeStatus.DELETED:
                        _mapService.DeleteTheme(existingTheme);
                        break;
                    case ThemeStatus.UNMODIFIED:
                        // niets doen niets veranderd!
                        break;
                    case ThemeStatus.UPDATED:
                        _mapService.UpdateTheme(theme, existingTheme);
                        _mapService.UpdateThemeVisibleLayers(existingTheme);
                        break;
                    default:
                        console.log("Er is iets fout, status niet bekend" + theme.status);
                        break;
                }
            });
        };
        _mapService.UpdateTheme = function(updatedTheme, existingTheme) {
            //lets update the existingTheme
            for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
                var updatedLayer = updatedTheme.AllLayers[x];
                var existingLayer = existingTheme.AllLayers[x];

                //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
                if (updatedLayer.enabled && updatedLayer.visible) {
                    //eerst checken dat ze nog niet bestaan!.
                    if (_mapService.VisibleLayers.indexOf(existingLayer) == -1) {
                        _mapService.VisibleLayers.push(existingLayer);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
                        existingTheme.VisibleLayers.push(existingLayer);
                    }
                }
                else {
                    //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
                    if (_mapService.VisibleLayers.indexOf(existingLayer) != -1) {
                        _mapService.VisibleLayers.splice(_mapService.VisibleLayers.indexOf(existingLayer), 1);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) != -1) {
                        existingTheme.VisibleLayers.splice(existingTheme.VisibleLayers.indexOf(existingLayer), 1);
                    }
                }
                existingLayer.enabled = updatedLayer.enabled;
                existingLayer.visible = updatedLayer.visible;
            };
            existingTheme.RecalculateVisibleLayerIds();
        };
        _mapService.AddNewTheme = function(theme) {
            _mapService.Themes.push(theme);
            _.each(theme.AllLayers, function(layer) {
                if (layer.enabled) {
                    _mapService.VisibleLayers.push(layer);
                    theme.VisibleLayers.push(layer);
                }

            });
            theme.RecalculateVisibleLayerIds();
            console.log(theme.VisibleLayerIds);
            theme.MapData = L.esri.dynamicMapLayer({
                url: theme.CleanUrl,
                opacity: 0.5,
                layers: theme.VisibleLayerIds,
                useCors: false
            }).addTo(map);
            theme.MapData.on('requeststart', function(obj) {
                console.log('requeststart');
            });
            theme.MapData.on('requestsuccess', function(obj) {
                console.log('requestsuccess');
            });

        };
        _mapService.DeleteTheme = function(theme) {
            theme.MapData.removeFrom(map);
            var themeIndex = _mapService.Themes.indexOf(theme);
            if (themeIndex > -1) {
                _mapService.Themes.splice(themeIndex, 1);
            }
            theme.VisibleLayers.forEach(visLayer => {
                var visLayerIndex = _mapService.VisibleLayers.indexOf(visLayer);
                if (visLayerIndex > -1) {
                    _mapService.VisibleLayers.splice(visLayerIndex, 1);
                }
            });
        };
        _mapService.Identify = function(event, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 2; }
            _.each(_mapService.Themes, function(theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                else {
                    var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                }
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function(error, featureCollection) {
                        AddFeatures(featureCollection);
                    });
                }

            });
        };
        _mapService.Select = function(event) {
            _.each(_mapService.Themes, function(theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = _mapService.SelectedLayer.theme == theme;
                if (identifOnThisTheme) {
                    theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + _mapService.SelectedLayer.id).run(function(error, featureCollection) {
                        AddFeatures(featureCollection);
                    });
                }


            });
        };
        var AddFeatures = function(features) {
            for (var x = 0; x < features.features.length; x++) {
                var featureItem = features.features[x];
                var myStyle = {
                    "fillOpacity": 0
                };
                _mapService.JsonFeatures.push(featureItem);
                var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                _mapService.VisibleFeatures.push(mapItem);
            }
            console.log(_mapService.JsonFeatures);
            $rootScope.$apply();
        };
        _mapService.Query = function(event, selectedLayer) {
            console.log(selectedLayer.id);
            selectedLayer.theme.MapData.query()
                .layer('visible: ' + selectedLayer.id)
                .intersects(event.layer)
                .run(function(error, featureCollection, response) {
                    AddFeatures(featureCollection);
                });
        };


        _mapService.UpdateLayerStatus = function(layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1 && layer.enabled) { // alleen maar toevoegen wnnr layer enabled en niet aanwezig al in de array!
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
        };
        _mapService.UpdateThemeVisibleLayers = function(theme) {
            theme.RecalculateVisibleLayerIds();
            theme.MapData.setLayers(theme.VisibleLayerIds);
        }
        _mapService.UpdateGroupLayerStatus = function(groupLayer, theme) {
            _.each(groupLayer.Layers, function(childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };
        _mapService.UpdateThemeStatus = function(theme) {
            _.each(theme.Groups, function(layerGroup) {
                _mapService.UpdateGroupLayerStatus(layerGroup, theme);
            });
            _.each(theme.Layers, function(layer) {
                _mapService.UpdateLayerStatus(layer, theme);
            });

        };

        return _mapService;
    };
    module.$inject = ['$rootScope', '$http', 'map', 'ThemeHelper', '$q'];
    module.factory('MapService', mapService);
})();


; 'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function(map, ThemeHelper) {
        var _service = {};
        return _service;
    };
    module.$inject = ['map', 'ThemeHelper'];
    module.factory('ThemeService', service);
})();
; 'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function(map) {
        var themeHelper = {};
        themeHelper.createThemeFromJson = function(rawdata, getData) {
            var thema = {};
            try {
                var rawlayers = rawdata.layers;
                var cleanUrl = getData.url.substring(0, getData.url.indexOf('?'));
                thema.Naam = rawdata.documentInfo.Title;
                thema.name = rawdata.documentInfo.Title;
                thema.Description = rawdata.documentInfo.Subject;
                thema.Layers = []; // de layers direct onder het theme zonder sublayers
                thema.AllLayers = []; // alle Layers die hij heeft including subgrouplayers
                thema.Groups = []; // layergroups die nog eens layers zelf hebben
                thema.CleanUrl = cleanUrl;
                thema.Url = getData.url;
                thema.VisibleLayers = [];
                thema.VisibleLayerIds = [];
                thema.Visible = true;
                thema.Added = false;
                thema.enabled = true;
                thema.MapData = {};
                _.each(rawlayers, function(x) {
                    x.visible = true;
                    x.enabled = true;
                    x.parent = null;
                    x.theme = thema;
                    thema.AllLayers.push(x);
                    if (x.parentLayerId === -1) {
                        if (x.subLayerIds === null) {
                            thema.Layers.push(x);
                        } else {
                            thema.Groups.push(x);
                        }
                    }
                });
                _.each(thema.Groups, function(layerGroup) {
                    if (layerGroup.subLayerIds !== null) {
                        layerGroup.Layers = [];
                        _.each(rawlayers, function(rawlayer) {
                            if (layerGroup.id === rawlayer.parentLayerId) {
                                rawlayer.parent = layerGroup;
                                layerGroup.Layers.push(rawlayer);
                            }
                        });
                    }
                });
                thema.RecalculateVisibleLayerIds = function() {
                    thema.VisibleLayerIds.length = 0;
                    _.forEach(thema.VisibleLayers, function(visLayer) {
                        thema.VisibleLayerIds.push(visLayer.id);
                    });
                    if (thema.VisibleLayerIds.length === 0) {
                        thema.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                    }
                };
                // thema.GetAllLayers = function () {
                //     var alllayers = [];
                //     _.each(thema.Layers, function (layer) {
                //         alllayers.push(layer);
                //     });
                //     _.each(thema.Groups, function (group) {
                //         _.each(group.Layers, function (layer) {
                //             alllayers.push(layer);
                //         });
                //     });
                //     return alllayers;
                // };
                thema.RecalculateVisibleLayerIds();
            }
            catch (ex) {
                console.log("Error when creating theme from url: " + getData.url + " Exeption: " + ex + " Data: ")
                console.log(rawdata);
            }
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['map'];
    module.factory('ThemeHelper', service);
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
; angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
    'use strict';

    $templateCache.put('templates/groupLayerTemplate.html',
        "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox id={{grplyrctrl.grouplayer.name}}{{grplyrctrl.grouplayer.id}} ng-model=grplyrctrl.grouplayer.visible ng-change=grplyrctrl.chkChanged()> <label for={{grplyrctrl.grouplayer.name}}{{grplyrctrl.grouplayer.id}}>{{grplyrctrl.grouplayer.name}}</label> <div ng-repeat=\"layer in grplyrctrl.grouplayer.Layers | filter :  { enabled: true }\"> <tink-layer layer=layer> </tink-layer> </div> </div>"
    );


    $templateCache.put('templates/layerTemplate.html',
        "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=lyrctrl.layer.visible ng-change=lyrctrl.chkChanged() id={{layer.name}}{{layer.id}}> <label for={{layer.name}}{{layer.id}}> {{layer.name | limitTo: 20}}</label> </div>"
    );


    $templateCache.put('templates/layerstemplate.html',
        "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <ul ui-sortable ng-model=lyrsctrl.themes> <div ng-repeat=\"theme in lyrsctrl.themes\"> <tink-theme theme=theme> </tink-theme> </div> </ul> <button class=\"btn btn-primary addlayerbtn\" ng-click=lyrsctrl.AddLayers()>Voeg laag toe</button> </div> </aside> </div>"
    );


    $templateCache.put('templates/maptemplate.html',
        "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
        "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=mapctrl.identify() ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
        "<button type=button class=btn ng-click=mapctrl.select() ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
        "<button type=button class=btn ng-class=\"{active: mapctrl.activeInteractieKnop=='dunno'}\" prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers\" ng-model=mapctrl.selectedLayer ng-change=mapctrl.layerChange() ng-class=\"{invisible: mapctrl.activeInteractieKnop!='select'}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==true}\" ng-click=mapctrl.toonKaart() prevent-default>Kaart</button>\n" +
        "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==false}\" ng-click=mapctrl.toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=mapctrl.zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
        "<button type=button class=btn ng-click=mapctrl.zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
        "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
        "<button type=button class=btn ng-click=mapctrl.fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-layers></tink-layers> <tink-search> </tink-search></div>"
    );


    $templateCache.put('templates/searchTemplate.html',
        "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> Zoek <div ng-repeat=\"feature in srchctrl.features \"> layerid: {{feature.theme.Naam}} <pre>{{feature.properties | json }}</pre> </div> </div> </aside> </div>"
    );


    $templateCache.put('templates/themeTemplate.html',
        "<div> <input class=visible-box type=checkbox id=chk{{thmctrl.theme.Naam}} ng-model=thmctrl.theme.Visible ng-change=thmctrl.chkChanged()> <label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} </label><button ng-click=thmctrl.deleteTheme()><i class=\"fa fa-trash\"></i></button> <div class=layercontroller-checkbox ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\"> <tink-layer layer=layer> </tink-layer> </div> <div class=layercontroller-checkbox ng-repeat=\"group in thmctrl.theme.Groups | filter: { enabled: true }\"> <tink-grouplayer grouplayer=group> </tink-grouplayer> </div> </div>"
    );

}]);
