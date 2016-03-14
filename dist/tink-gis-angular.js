'use strict';
(function(module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$q', 'urls', 'MapService', 'MapData', 'GISService', 'LayerManagementService',
        function($scope, $modalInstance, ThemeHelper, $q, urls, MapService, MapData, GISService, LayerManagementService) {
            LayerManagementService.EnabledThemes.length = 0;
            LayerManagementService.AvailableThemes.length = 0;
            console.log(MapData.Themes);
            LayerManagementService.EnabledThemes = angular.copy(MapData.Themes);
            $scope.availableThemes = LayerManagementService.AvailableThemes;
            var init = function() {
                $scope.searchTerm = 'Laden...';
                var qwhenready = LayerManagementService.ProcessUrls(urls);
                qwhenready.then(function(allelagen) {
                    $scope.searchTerm = '';
                });
            } ();
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
                var alreadyAdded = LayerManagementService.EnabledThemes.find(function(x) { x.Url === $scope.selectedTheme.Url }) != undefined;
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
                                LayerManagementService.EnabledThemes.splice(index, 1);
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
                    if (alreadyAdded == false) { // it is a new theme!
                        LayerManagementService.EnabledThemes.push($scope.selectedTheme);
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
                $modalInstance.$close(LayerManagementService.EnabledThemes); // return the themes.
            };
            $scope.cancel = function() {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();;'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    module = angular.module('tink.gis');
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
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
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
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function (MapData, map, ThemeService, $modal) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.selectedLayers = [];
        vm.AddLayers = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/modals/addLayerModalTemplate.html',
                controller: 'addLayerController',
                resolve: {
                    backdrop: false,
                    keyboard: true,
                    urls: function () {
                        return MapData.ThemeUrls;
                    }
                }
            });
            addLayerInstance.result.then(function (selectedThemes) {
                ThemeService.AddAndUpdateThemes(selectedThemes);
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['MapData', 'map', 'ThemeService', '$modal'];
})();;/// <reference path="../services/mapService.js" />

'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function($scope, BaseLayersService, MapService, MapData, map, MapEvents) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = MapData.VisibleLayers;
        vm.selectedLayer = MapData.SelectedLayer;
        vm.drawingType = MapData.DrawingType
        vm.showMetenControls = false;
        vm.interactieButtonChanged = function(ActiveButton) {
            MapData.CleanAll();
            MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
            vm.activeInteractieKnop = ActiveButton;
            //make controls invis
            toggleDrawControls(false);
            vm.showMetenControls = false;
            switch (ActiveButton) {
                case ActiveInteractieButton.SELECT:
                    toggleDrawControls(true);
                    break;
                case ActiveInteractieButton.METEN:
                    vm.showMetenControls = true;
                    break;
            }
        };
        var toggleDrawControls = function(showControls) {
            if (showControls) {
                $('.leaflet-draw.leaflet-control').show();
            }
            else {
                $('.leaflet-draw.leaflet-control').hide();
            }
        };
        vm.drawingButtonChanged = function(drawOption) {
            MapData.CleanAll();
            MapData.RemoveDrawings();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            switch (MapData.DrawingType) {
                case DrawingOption.AFSTAND:
                    MapData.DrawingObject = new L.Draw.Polyline(map);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.OPPERVLAKTE:
                    var polygon_options = {
                        showArea: true,
                        shapeOptions: {
                            stroke: true,
                            color: '#22528b',
                            weight: 4,
                            opacity: 0.5,
                            fill: true,
                            fillColor: null, //same as color by default
                            fillOpacity: 0.6,
                            clickable: true
                        }
                    }
                    MapData.DrawingObject = new L.Draw.Polygon(map, polygon_options);
                    MapData.DrawingObject.enable();
                    break;
                default:
                    break;
            }
        };
        vm.layerChange = function() {
            MapData.CleanMap();
            // console.log("vm.sel: " + vm.selectedLayer.id + "/ MapData.SelectedLayer: " + MapData.Layer.SelectedLayer.id);
            MapData.SelectedLayer = vm.selectedLayer;
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
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map', 'MapEvents'];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.controller('themeController', ['$scope', 'MapService', 'ThemeService',
        function ($scope, MapService, ThemeService) {
            var vm = this;
            console.log("Theme geladen");
            vm.theme = $scope.theme;
            $scope.$on('groupCheckboxChangedEvent', function (event, groupLayer) { // stuur het door naar het thema
                MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            });
            $scope.$on('layerCheckboxChangedEvent', function (event, layer) { // stuur het door naar het thema
                MapService.UpdateLayerStatus(layer, vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            });
            vm.chkChanged = function () {
                MapService.UpdateThemeStatus(vm.theme);
                ThemeService.UpdateThemeVisibleLayers(vm.theme);
            };
            vm.deleteTheme = function () {
                ThemeService.DeleteTheme(vm.theme);
            }
        }]);
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis');
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
(function(module) {

    angular.module('tink.gis').directive('indeterminateCheckbox', [function() {
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
                    return scope.$eval(childList).map(function(x) { x[property] });
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
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis');
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
    module = angular.module('tink.gis');
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
    module = angular.module('tink.gis');
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/maptemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis');
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
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
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
            // maxZoom: 21,
            // minZoom: 10,
            layers: L.tileLayer('https://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' }),
            // layers: L.tileLayer('http://app10.p.gis.local/arcgissql/rest/services/P_Publiek/P_basemap_wgs84/MapServer', { id: 'kaart' }),
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
// L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

//Moet plaats voor zoeken!!! Enums in Angular hmm
var ThemeStatus = { // http://stijndewitt.com/2014/01/26/enums-in-javascript/
    UNMODIFIED: 0,
    NEW: 1,
    UPDATED: 2,
    DELETED: 3
};
var LayerType = {
    LAYER: 0,
    GROUP: 1
};
var ActiveInteractieButton = {
    IDENTIFY: "identify",
    SELECT: "select",
    METEN: "meten",
    WATISHIER: "watishier"
};
var DrawingOption = {
    NIETS: '',
    AFSTAND: 'afstand',
    OPPERVLAKTE: 'oppervlakte'
};;'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController',
        function($scope, ResultsData, map) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
        });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();;'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController',
        function($scope, ResultsData) {
            var vm = this;
            vm.features = ResultsData.JsonFeatures;
            vm.featureLayers = null;
            vm.selectedResult = null;
            vm.layerGroupFilter = "geenfilter";
            $scope.$watchCollection(function() { return ResultsData.JsonFeatures }, function(newValue, oldValue) {
                vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
                vm.layerGroupFilter = "geenfilter";
            });

            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                vm.selectedResult = newVal;
            });
            vm.deleteFeature = function(feature) {
                var featureIndex = ResultsData.JsonFeatures.indexOf(feature);
                if (featureIndex > -1) {
                    ResultsData.JsonFeatures.splice(featureIndex, 1);
                }
            };
            vm.deleteFeatureGroup = function(featureGroupName) {
                ResultsData.JsonFeatures.forEach(function(feature) {
                    if (feature.layerName === featureGroupName) {
                        vm.deleteFeature(feature);
                    }
                });
            };

            vm.showDetails = function(feature) {
                ResultsData.SelectedFeature = feature;
            }
            vm.exportToCSV = function() {
                var csvContent = "data:text/csv;charset=utf-8,";
                var dataString = "";
                var layName = "";

                ResultsData.JsonFeatures.forEach(function(feature, index) {
                    if (layName !== feature.layerName) {
                        layName = feature.layerName;
                        var tmparr = [];
                        for (var name in feature.properties) {
                            tmparr.push(name);
                        }
                        var layfirstline = tmparr.join(",");

                        csvContent += layName + "\n" + layfirstline + "\n";
                    }
                    var infoArray = _.values(feature.properties)
                    dataString = infoArray.join(",");
                    console.log(dataString);
                    // csvContent += dataString + "\n";
                    csvContent += index < ResultsData.JsonFeatures.length ? dataString + "\n" : dataString;

                });
                var encodedUri = encodeURI(csvContent);
                window.open(encodedUri);
            };


        });
    theController.$inject = ['$scope', 'ResultsData'];
})();;'use strict';
(function(module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController',
        function($scope, ResultsData, MapData) {
            var vm = this;
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            vm.props = [];
            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                if (newVal) {
                    vm.selectedResult = newVal;
                    var item = Object.getOwnPropertyNames(newVal.properties).map(function(k) { return ({ key: k, value: newVal.properties[k] }) });
                    vm.props = item;
                    vm.prevResult = null;
                    vm.nextResult = null;
                    var index = ResultsData.JsonFeatures.indexOf(newVal);
                    var layerName = newVal.layerName;
                    if (index > 0) { // check or prevResult exists
                        var prevItem = ResultsData.JsonFeatures[index - 1];
                        if (prevItem.layerName === layerName) {
                            vm.prevResult = prevItem;
                        }
                    }
                    if (index < ResultsData.JsonFeatures.length - 1) { // check for nextResult exists
                        var nextItem = ResultsData.JsonFeatures[index + 1];
                        if (nextItem.layerName === layerName) {
                            vm.nextResult = nextItem;
                        }
                    }
                }
                else {
                    vm.selectedResult = null;
                    vm.prevResult = null;
                    vm.nextResult = null;
                }
            });
            vm.toonFeatureOpKaart = function() {
                console.log(vm.selectedResult);
                MapData.PanToFeature(vm.selectedResult);
                // var bounds = L.latLngBounds(vm.selectedResult.mapItem);
                // map.fitBounds(bounds);//works!
                // map.setView(new L.LatLng(51.2192159, 4.4028818));

            };
            vm.volgende = function() {
                ResultsData.SelectedFeature = vm.nextResult;
            };
            vm.vorige = function() {
                ResultsData.SelectedFeature = vm.prevResult;

            };
            vm.close = function(feature) {
                vm.selectedResult = null;
                vm.prevResult = null;
                vm.nextResult = null;
                ResultsData.SelectedFeature = null;
            };

        });
    theController.$inject = ['$scope', 'ResultsData',];
})();;'use strict';
(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearch', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchTemplate.html',
            controller: 'searchController',
            controllerAs: 'srchctrl'
        };
    });
})();;'use strict';
(function(module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchResults', function() {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchResultsTemplate.html',
            controller: 'searchResultsController',
            controllerAs: 'srchrsltsctrl'
        };
    });
})();;'use strict';
(function(module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchSelected', function() {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchSelectedTemplate.html',
            controller: 'searchSelectedController',
            controllerAs: 'srchslctdctrl'
        };
    });
})();;'use strict';
(function() {
    var module = angular.module('tink.gis');
    var data = function() {
        var _data = {};
        _data.SelectedFeature = null;
        _data.JsonFeatures = [];
        _data.CleanSearch = function() {
            _data.JsonFeatures.length = 0;
            _data.SelectedFeature = null;
        };
        return _data;
    };
    module.factory('ResultsData', data);
})();


;//http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode
//http://proj4js.org/
'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function($http, map, MapData, HelperService, $rootScope) {
        var _service = {};
        _service.ReverseGeocode = function(event) {
            var lambert72Cords = HelperService.ConvertWSG84ToLambert72(event.latlng);
            var loc = lambert72Cords.x + "," + lambert72Cords.y;
            var urlloc = encodeURIComponent(loc);
            MapData.CleanWatIsHier();
            $http.get('http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode?location=' + urlloc + '&distance=50&outSR=&f=json').
                success(function(data, status, headers, config) {
                    if (!data.error) {
                        MapData.CreateWatIsHierMarker(data);
                        console.log(data);
                        MapData.CreateOrigineleMarker(event.latlng, true);
                    }
                    else {
                        MapData.CreateOrigineleMarker(event.latlng, false);
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log("ERROR!");
                    console.log(status);
                    console.log(headers);
                    console.log(data);
                });
        };
        _service.GetThemeData = function(url) {
            var prom = $http.get(url);
            return prom;
        };
        _service.GetThemeLayerData = function(mapServiceUrl) {
            var prom = $http.get(mapServiceUrl + 'layers?f=pjson');
            return prom;
        };
        return _service;
    };
    module.$inject = ["$http", 'map', 'MapData', 'HelperService', '$rootScope'];
    module.factory("GISService", service);
})();;'use strict';


(function () {

    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function () {
        var _baseLayersService = {};
        // _baseLayersService.kaart = L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' });
        _baseLayersService.kaart = L.tileLayer('http://app10.p.gis.local/arcgissql/rest/services/P_Publiek/P_basemap/MapServer', { id: 'kaart' });
        _baseLayersService.luchtfoto = L.tileLayer("http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png", { id: 'luchtfoto', tms: 'true' });
        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();;'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function() {
        var _service = {};
        proj4.defs('LAMBERT72', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438'
            + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs');

        _service.ConvertWSG84ToLambert72 = function(coordinates) {
            var result = proj4('LAMBERT72', [(coordinates.lng || coordinates.x), (coordinates.lat || coordinates.y)]);
            return {
                x: result[0],
                y: result[1]
            };
        };
        _service.ConvertLambert72ToWSG84 = function(coordinates) {
            var x = (coordinates.lng || coordinates.x || coordinates[0]);
            var y = (coordinates.lat || coordinates.y || coordinates[1]);
            var result = proj4('LAMBERT72', 'WGS84', [x, y]);
            console.log(result);
            return {
                y: result[0],
                x: result[1]
            };
        };

        return _service;
    };
    // module.$inject = ["$http", 'map'];
    module.factory("HelperService", service);
})();;'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(MapData, $http, $q, GISService, ThemeHelper) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];
        _service.ProcessUrls = function(urls) {
            console.log("ProcesUrls");
            var promises = [];
            console.log(_service.AvailableThemes);
            _.each(urls, function(url) {
                var AlreadyAddedTheme = null
                _service.EnabledThemes.forEach(function(theme) { // OPTI kan paar loops minder door betere zoek in array te doen
                    if (theme.Url == url) {
                        AlreadyAddedTheme = theme;
                    }
                });
                if (AlreadyAddedTheme == null) { // if we didn t get an alreadyadderdtheme we get the data
                    var prom = GISService.GetThemeData(url + '?f=pjson');
                    prom.success(function(data, statuscode, functie, getdata) {
                        var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                        _service.AvailableThemes.push(convertedTheme);
                        convertedTheme.status = ThemeStatus.NEW;
                    });
                    promises.push(prom);
                }
                else { // ah we already got it then just push it.
                    AlreadyAddedTheme.status = ThemeStatus.UNMODIFIED;
                    _service.AvailableThemes.push(AlreadyAddedTheme);
                }
            });
            // $q.all(promises).then(function(lagen) {
            //     console.log(lagen);
            // });
            return $q.all(promises);
        };
        _service.SetAditionalLayerInfo = function(theme) {
            console.log(theme.CleanUrl);
            var prom = GISService.GetThemeLayerData(theme.CleanUrl);
            prom.success(function(data, statuscode, functie, getdata) {
                theme.AllLayers.forEach(function (layer) { {
                    var layerid = layer.id;
                    var layerInfo = data.layers[layerid];
                    var displayField = layerInfo.displayField;
                    layer.displayField = layerInfo.displayField;
                }                });
            });
        };
        return _service;
    };
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeHelper'];
    module.factory("LayerManagementService", service);
})();;'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', ['ui.sortable']]); //'leaflet-directive'
    }
    var layersService = function ($http, map) {
        var _layersService = {};
        return _layersService;
    };
    module.$inject = ["$http", 'map'];
    module.factory("LayersService", layersService);
})();;'use strict';
(function() {
    var module = angular.module('tink.gis');
    var mapData = function(map, $rootScope, HelperService, ResultsData) {
        var _data = {};

        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.IsDrawing = false;
        _data.ThemeUrls = ['http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Afval/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Cultuur/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Jeugd/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Onderwijs/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/stad/MapServer/'
        ];
        _data.Themes = [];
        var defaultlayer = { id: '', name: 'Alle Layers' };
        _data.SelectedLayer = defaultlayer;
        _data.VisibleLayers.unshift(defaultlayer);
        _data.ActiveInteractieKnop = ActiveInteractieButton.SELECT;
        _data.DrawingType = DrawingOption.NIETS;
        _data.DrawingObject = null;
        _data.RemoveDrawings = function() {
            if (_data.DrawingObject) {
                _data.DrawingObject.disable();
                // map.removeLayer(_data.DrawingObject);
                _data.DrawingObject = null;
            }
        };
        var WatIsHierMarker = null;
        var WatIsHierOriginalMarker = null;

        _data.CleanAll = function() {
            _data.RemoveDrawings();
            _data.CleanMap();
            _data.CleanWatIsHier();
            ResultsData.CleanSearch();
        };
        _data.CleanWatIsHier = function() {
            if (WatIsHierOriginalMarker) {
                WatIsHierOriginalMarker.clearAllEventListeners();
                WatIsHierOriginalMarker.closePopup();
                map.removeLayer(WatIsHierOriginalMarker);
                WatIsHierOriginalMarker = null;
            }
            if (WatIsHierMarker) {
                map.removeLayer(WatIsHierMarker);
                WatIsHierMarker = null;
            }
            straatNaam = null;
        };
        _data.CreateOrigineleMarker = function(latlng, addressFound) {
            if (addressFound) {
                var foundMarker = L.AwesomeMarkers.icon({
                    icon: 'fa-map-marker',
                    markerColor: 'orange'

                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: foundMarker, opacity: 0.5 }).addTo(map);
            }
            else {
                var notFoundMarker = L.AwesomeMarkers.icon({
                    // icon: 'fa-frown-o',
                    icon: 'fa-question',
                    markerColor: 'red',
                    spin: true
                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: notFoundMarker }).addTo(map);
            }
            var convertedxy = HelperService.ConvertWSG84ToLambert72(latlng);
            if (straatNaam) {
                var html =
                    '<div class="container container-low-padding">' +
                    '<div class="row row-no-padding">' +
                    '<div class="col-sm-4">' +
                    '<img src="https://placehold.it/100x50" />' +
                    '</div>' +
                    '<div class="col-sm-8">' +
                    '<div class="col-sm-12"><b>' + straatNaam + '</b></div>' +
                    // '<div class="row">' +
                    '<div class="col-sm-3">WGS84:</div><div class="col-sm-8" style="text-align: left;">' + latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' +
                    '<div class="col-sm-3">Lambert:</div><div class="col-sm-8" style="text-align: left;">' + convertedxy.x.toFixed(1) + ', ' + convertedxy.y.toFixed(1) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' +
                    // '<div class="row">Lambert (x,y):' + convertedxy.x.toFixed(1) + ',' + convertedxy.y.toFixed(1) + '</div>' +
                    '</div>' +
                    '</div>' +

                    '</div>';
                // var html = '<tink-Theme></tink-Theme>'
                WatIsHierOriginalMarker.bindPopup(html, { minWidth: 300 }).openPopup();
            }
            else {
                WatIsHierOriginalMarker.bindPopup(
                    'WGS84 (x,y):' + latlng.lat.toFixed(6) + ',' + latlng.lng.toFixed(6) +
                    '<br>Lambert (x,y):' + convertedxy.x.toFixed(1) + ',' + convertedxy.y.toFixed(1)).openPopup();
            }


            WatIsHierOriginalMarker.on('popupclose', function(event) {
                _data.CleanWatIsHier();
            });
        };
        var straatNaam = null;
        _data.CreateWatIsHierMarker = function(data) {
            var convertedBackToWSG84 = HelperService.ConvertLambert72ToWSG84(data.location)
            straatNaam = data.address.Street + " (" + data.address.Postal + ")";
            var greenIcon = L.icon({
                iconUrl: 'styles/fa-dot-circle-o_24_0_000000_none.png',
                iconSize: [24, 24],
                // iconAnchor: [0, 0]
            });


            WatIsHierMarker = L.marker([convertedBackToWSG84.x, convertedBackToWSG84.y], { icon: greenIcon }).addTo(map);

        };
        _data.CleanMap = function() {
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                map.removeLayer(_data.VisibleFeatures[x]); //eerst de
            }
            _data.VisibleFeatures.length = 0;
            map.clearDrawings();
        };
        _data.PanToFeature = function(feature) {
            var tmplayer = feature.mapItem._layers[Object.keys(feature.mapItem._layers)[0]]
            map.panTo(tmplayer.getBounds().getCenter());
            map.fitBounds(tmplayer.getBounds());
        };
        _data.AddFeatures = function(features, theme) {
            for (var x = 0; x < features.features.length; x++) {
                var featureItem = features.features[x];
                var layer = theme.AllLayers[featureItem.layerId];
                // featureItem.layer = layer;
                // featureItem.theme = theme;
                featureItem.layerName = layer.name;
                featureItem.displayValue = featureItem.properties[layer.displayField];
                var myStyle = {
                    'fillOpacity': 0
                };
                var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                _data.VisibleFeatures.push(mapItem);
                featureItem.mapItem = mapItem;
                ResultsData.JsonFeatures.push(featureItem);
            }
            $rootScope.$apply();
        };
        return _data;
    };
    module.$inject = ['ResultsData'];
    module.factory('MapData', mapData);
})();


;'use strict';
(function() {
    var module = angular.module('tink.gis');
    var mapEvents = function(map, MapService, MapData) {
        var _mapEvents = {};
        map.on('draw:drawstart', function(event) {
            console.log('draw started');
            MapData.IsDrawing = true;
            MapData.CleanMap();
        });
        var berkenOmtrek = function(layer) {
            // Calculating the distance of the polyline
            var tempLatLng = null;
            var totalDistance = 0.00000;
            _.each(layer._latlngs, function(latlng) {
                if (tempLatLng == null) {
                    tempLatLng = latlng;
                    return;
                }
                console.log(tempLatLng.distanceTo(latlng) + " m");
                totalDistance += tempLatLng.distanceTo(latlng);
                tempLatLng = latlng;
            });
            return totalDistance.toFixed(2);
        };
        map.on('click', function(event) {
            console.log('click op map! Is drawing: ' + MapData.IsDrawing);
            if (!MapData.IsDrawing) {
                MapData.CleanAll();
                switch (MapData.ActiveInteractieKnop) {
                    case ActiveInteractieButton.IDENTIFY:
                        MapService.Identify(event, 2);
                        break;
                    case ActiveInteractieButton.SELECT:
                        if (MapData.SelectedLayer.id === '') {
                            console.log('Geen layer selected! kan dus niet opvragen');
                        }
                        else {
                            MapService.Select(event);
                        }
                        break;
                    case ActiveInteractieButton.WATISHIER:
                        MapService.WatIsHier(event);
                        break;
                    case ActiveInteractieButton.METEN:

                        break;
                    default:
                        console.log('MAG NIET!!!!!!!!');
                        break;
                }
            }
            else {
                // MapData.DrawingObject = event;
                console.log("DrawingObject: ");
                console.log(MapData.DrawingObject);
                switch (MapData.DrawingType) {
                    case DrawingOption.AFSTAND:
                        break;
                    case DrawingOption.OPPERVLAKTE:
                        break;
                    default:
                        console.log("Aant drawen zonder een gekent type!!!!!!");
                        break;
                }
            }
        });


        map.on('draw:created', function(e) {
            console.log('draw created');
            console.log(e)
            switch (MapData.ActiveInteractieKnop) {
                case ActiveInteractieButton.SELECT:
                    if (MapData.SelectedLayer.id == '') {
                        console.log('Geen layer selected! kan dus niet opvragen');
                    }
                    else {
                        MapService.Query(event);
                    }
                    break;
                case ActiveInteractieButton.METEN:
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            var omtrek = berkenOmtrek(e.layer);
                            var popup = e.layer.bindPopup('Afstand (m): ' + omtrek + ' ');
                            popup.on('popupclose', function(event) {
                                MapData.CleanAll();
                            });
                            e.layer.openPopup();
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            var omtrek = berkenOmtrek(e.layer);
                            var popuptekst = '<p>Opp  (km<sup>2</sup>): ' + (LGeo.area(e.layer) / 1000000).toFixed(2) + '</p>'
                                + '<p>Omtrek (m): ' + omtrek + ' </p>';
                            var popup = e.layer.bindPopup(popuptekst);
                            popup.on('popupclose', function(event) {
                                MapData.CleanAll();
                            });
                            e.layer.openPopup();
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    console.log('MAG NIET!!!!!!!!');
                    break;
            }
            MapData.IsDrawing = false;
        });


        return _mapEvents;
    };
    module.factory('MapEvents', mapEvents);
})();


;'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function($rootScope, MapData, map, ThemeHelper, $q, GISService) {
        var _mapService = {};
        _mapService.Identify = function(event, tolerance) {
            if (typeof tolerance === 'undefined') { tolerance = 2; }
            _.each(MapData.Themes, function(theme) {
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
                        MapData.AddFeatures(featureCollection, theme);
                    });
                }
            });
        };

        _mapService.Select = function(event) {
            console.log(MapData.SelectedLayer);
            MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function(error, featureCollection) {
                MapData.AddFeatures(featureCollection);
            });
        };
        _mapService.WatIsHier = function(event) {
            GISService.ReverseGeocode(event);
        };

        _mapService.Query = function(event) {
            MapData.SelectedLayer.theme.MapData.query()
                .layer('visible: ' + MapData.SelectedLayer.id)
                .intersects(event.layer)
                .run(function(error, featureCollection, response) {
                    MapData.AddFeatures(featureCollection);
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
        _mapService.UpdateGroupLayerStatus = function(groupLayer, theme) {
            _.each(groupLayer.Layers, function(childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };

        _mapService.UpdateLayerStatus = function(layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && ((layer.parent && layer.parent.visible) || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1 && layer.enabled) { // alleen maar toevoegen wnnr layer enabled en niet aanwezig al in de array!
                    theme.VisibleLayers.push(layer);
                    MapData.VisibleLayers.push(layer);
                }
            }
            else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    var indexOfLayerInVisibleLayersOfMap = MapData.VisibleLayers.indexOf(layer);
                    MapData.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                }
            }
        };
        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeHelper', '$q'];
    module.factory('MapService', mapService);
})();


;'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function (map) {
        var themeHelper = {};
        themeHelper.createThemeFromJson = function (rawdata, getData) {
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
                _.each(rawlayers, function (x) {
                    x.visible = true;
                    x.enabled = true;
                    x.parent = null;
                    x.theme = thema;
                    x.type = LayerType.LAYER;
                    thema.AllLayers.push(x);
                    if (x.parentLayerId === -1) {
                        if (x.subLayerIds === null) {
                            thema.Layers.push(x);
                        } else {
                            thema.Groups.push(x);
                            x.type = LayerType.GROUP;

                        }
                    }
                });
                _.each(thema.Groups, function (layerGroup) {
                    if (layerGroup.subLayerIds !== null) {
                        layerGroup.Layers = [];
                        _.each(rawlayers, function (rawlayer) {
                            if (layerGroup.id === rawlayer.parentLayerId) {
                                rawlayer.parent = layerGroup;
                                layerGroup.Layers.push(rawlayer);
                            }
                        });
                    }
                });
                thema.RecalculateVisibleLayerIds = function () {
                    thema.VisibleLayerIds.length = 0;
                    _.forEach(thema.VisibleLayers, function (visLayer) {
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
;'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(map, ThemeHelper, MapData, LayerManagementService) {
        var _service = {};
        _service.AddAndUpdateThemes = function(themesBatch) {
            themesBatch.forEach(function(theme) {
                var existingTheme = MapData.Themes.find(function(x) { x.Url == theme.Url });
                switch (theme.status) {
                    case ThemeStatus.NEW:
                        LayerManagementService.SetAditionalLayerInfo(theme);
                        console.log(theme.CleanUrl);
                        _service.AddNewTheme(theme);
                        break;
                    case ThemeStatus.DELETED:
                        _service.DeleteTheme(existingTheme);
                        break;
                    case ThemeStatus.UNMODIFIED:
                        // niets doen niets veranderd!
                        break;
                    case ThemeStatus.UPDATED:
                        _service.UpdateTheme(theme, existingTheme);
                        _service.UpdateThemeVisibleLayers(existingTheme);
                        break;
                    default:
                        console.log("Er is iets fout, status niet bekend" + theme.status);
                        break;
                }
            });
        };
        _service.UpdateThemeVisibleLayers = function(theme) {
            theme.RecalculateVisibleLayerIds();
            console.log(theme.VisibleLayerIds);
            theme.MapData.setLayers(theme.VisibleLayerIds);
        }
        _service.UpdateTheme = function(updatedTheme, existingTheme) {
            //lets update the existingTheme
            for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
                var updatedLayer = updatedTheme.AllLayers[x];
                var existingLayer = existingTheme.AllLayers[x];

                //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
                if (updatedLayer.enabled && updatedLayer.visible) {
                    //eerst checken dat ze nog niet bestaan!.
                    if (MapData.VisibleLayers.indexOf(existingLayer) == -1) {
                        MapData.VisibleLayers.push(existingLayer);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
                        existingTheme.VisibleLayers.push(existingLayer);
                    }
                }
                else {
                    //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
                    if (MapData.VisibleLayers.indexOf(existingLayer) != -1) {
                        MapData.VisibleLayers.splice(MapData.VisibleLayers.indexOf(existingLayer), 1);
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
        _service.AddNewTheme = function(theme) {
            MapData.Themes.push(theme);
            _.each(theme.AllLayers, function(layer) {
                if (layer.enabled && layer.visible && layer.type === LayerType.LAYER) {
                    console.log(layer.id);
                    MapData.VisibleLayers.push(layer);
                    theme.VisibleLayers.push(layer);
                }

            });
            theme.RecalculateVisibleLayerIds();
            theme.MapData = L.esri.dynamicMapLayer({
                url: theme.CleanUrl,
                opacity: 0.5,
                layers: theme.VisibleLayerIds,
                // maxZoom: 21,
                // minZoom: 10,
                useCors: true
            }).addTo(map);
            // _mapService.UpdateThemeVisibleLayers(theme);
            theme.MapData.on('requeststart', function(obj) {
                console.log('requeststart');
            });
            theme.MapData.on('requestsuccess', function(obj) {
                console.log('requestsuccess');
            });

        };
        _service.DeleteTheme = function(theme) {
            theme.MapData.removeFrom(map);
            var themeIndex = MapData.Themes.indexOf(theme);
            if (themeIndex > -1) {
                MapData.Themes.splice(themeIndex, 1);
            }
            theme.VisibleLayers.forEach(function(visLayer) {
                var visLayerIndex = MapData.VisibleLayers.indexOf(visLayer);
                if (visLayerIndex > -1) {
                    MapData.VisibleLayers.splice(visLayerIndex, 1);
                }
            });
        };



        return _service;
    };
    module.$inject = ['map', 'ThemeHelper', 'MapData', 'LayerManagementService'];
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
//     angular.module('tink.gis').factory(componentName, theComponent);
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
//     angular.module('tink.gis').factory(componentName, theComponent);
//
// })()
;angular.module('tink.gis').run(['$templateCache', function($templateCache) {
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
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('identify')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('select')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('meten')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='meten'}\" prevent-default><i class=\"fa fa-expand\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('watishier')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='watishier'}\" prevent-default><i class=\"fa fa-thumb-tack\"></i></button>  </div> <div class=\"btn-group ll metenbtns\" ng-show=mapctrl.showMetenControls> <button ng-click=\"mapctrl.drawingButtonChanged('afstand')\" ng-class=\"{active: mapctrl.drawingType=='afstand'}\" type=button class=btn prevent-default><i class=\"fa fa-arrows-h\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('oppervlakte')\" ng-class=\"{active: mapctrl.drawingType=='oppervlakte'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers\" ng-model=mapctrl.selectedLayer ng-change=mapctrl.layerChange() ng-class=\"{invisible: mapctrl.activeInteractieKnop!='select' && mapctrl.SelectableLayers.length<=1}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==true}\" ng-click=mapctrl.toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==false}\" ng-click=mapctrl.toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=mapctrl.zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-search></tink-search> <tink-layers></tink-layers> </div>"
  );


  $templateCache.put('templates/modals/addLayerModalTemplate.html',
    "<div> <div class=modal-header> <button type=button style=float:right data-ng-click=cancel()><i class=\"fa fa-times\"></i></button> <h4 class=model-title>Laag toevoegen </h4></div> <div class=modal-content> <div class=row> <div class=col-md-4> <input class=searchbox ng-model=searchTerm ng-change=searchChanged() placeholder=\"Geef een trefwoord of een url in\"> <div ng-repeat=\"theme in availableThemes | filter: { Naam: searchTerm } | orderBy: 'Naam'\"> <div ng-click=themeChanged(theme)> {{theme.Naam}}\n" +
    "<i ng-if=\"theme.Added == true\" class=\"fa fa-check-circle\"></i>\n" +
    "<i ng-if=\"theme.Added == null\" class=\"fa fa-check-circle-o\"></i> </div> </div> </div> <div class=col-md-8> <div ng-if=\"copySelectedTheme !== null\"> <button ng-if=\"copySelectedTheme.Added != false\" data-ng-click=AddOrUpdateTheme()>Update</button> <p>{{copySelectedTheme.Description}}</p> <p><small><a ng-href={{copySelectedTheme.CleanUrl}} target=_blank>Details</a></small></p> <div class=layercontroller-checkbox> <input indeterminate-checkbox child-list=copySelectedTheme.AllLayers property=enabled type=checkbox ng-model=copySelectedTheme.enabled id={{copySelectedTheme.name}}> <label for={{copySelectedTheme.name}}> {{copySelectedTheme.name | limitTo: 20}}</label> <div ng-repeat=\"mainlayer in copySelectedTheme.Layers\"> <div class=layercontroller-checkbox> <input type=checkbox ng-model=mainlayer.enabled id={{mainlayer.name}}{{mainlayer.id}}> <label for={{mainlayer.name}}{{mainlayer.id}}> {{mainlayer.name | limitTo: 20}}</label> </div> </div> <div ng-repeat=\"groupLayer in copySelectedTheme.Groups\"> <div class=layercontroller-checkbox> <input indeterminate-checkbox child-list=groupLayer.Layers property=enabled type=checkbox ng-model=groupLayer.enabled id={{groupLayer.name}}{{groupLayer.id}}> <label for={{groupLayer.name}}{{groupLayer.id}}> {{groupLayer.name | limitTo: 20}}</label> <div ng-repeat=\"layer in groupLayer.Layers\"> <div class=layercontroller-checkbox> <input type=checkbox ng-model=layer.enabled ng-change=layer.chkChanged() id={{layer.name}}{{layer.id}}> <label for={{layer.name}}{{layer.id}}> {{layer.name | limitTo: 20}}</label> </div> </div> </div> </div> </div> <button ng-if=\"copySelectedTheme.Added == false\" data-ng-click=AddOrUpdateTheme()>Toevoegen</button> </div> </div> </div> </div> <div class=modal-footer> <button data-ng-click=ok()>Klaar</button> </div> </div>"
  );


  $templateCache.put('templates/search/searchResultsTemplate.html',
    "<div ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length > 0\"> <select ng-model=srchrsltsctrl.layerGroupFilter> <option value=geenfilter selected>Geen filter</option> <option ng-repeat=\"feat in srchrsltsctrl.featureLayers\" value={{feat}}>{{feat}}</option> </select> <ul ng-repeat=\"layerGroupName in srchrsltsctrl.featureLayers\"> <tink-accordion ng-if=\"srchrsltsctrl.layerGroupFilter=='geenfilter' || srchrsltsctrl.layerGroupFilter==layerGroupName \" data-start-open=true data-one-at-a-time=false> <tink-accordion-panel> <data-header> <p class=nav-aside-title>{{layerGroupName}}\n" +
    "<a ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=pull-right><i class=\"fa fa-trash\"></i></a> </p>  </data-header> <data-content> <li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=\"feature.hoverEdit = true\" ng-mouseleave=\"feature.hoverEdit = false\"> <a ng-if=!feature.hoverEdit ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue | limitTo : 23}}<br>DETAILS</a> <div ng-if=feature.hoverEdit> <a ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue}} <br>DETAILS</a>\n" +
    "<a ng-click=srchrsltsctrl.deleteFeature(feature)><i class=\"fa fa-trash\"></i></a> </div> </li> </data-content> </tink-accordion-panel> </tink-accordion> </ul> <a ng-click=srchrsltsctrl.exportToCSV()>Export to CSV</a> </div>"
  );


  $templateCache.put('templates/search/searchSelectedTemplate.html',
    "<div ng-if=srchslctdctrl.selectedResult> <div class=row> <div class=col-md-6> <button class=\"pull-left srchbtn\" ng-if=srchslctdctrl.prevResult ng-click=srchslctdctrl.vorige()>Vorige</button> </div> <div class=col-md-6> <button class=\"pull-right srchbtn\" ng-if=srchslctdctrl.nextResult ng-click=srchslctdctrl.volgende()>Volgende</button> </div> </div> <div class=row ng-repeat=\"prop in srchslctdctrl.props\"> <div class=col-md-5> {{ prop.key}} </div> <div class=col-md-7 ng-if=\"prop.value.toLowerCase() != 'null'\"> <a ng-if=\" prop.value.indexOf( 'https://')==0 || prop.value.indexOf( 'http://')==0 \" ng-href={{prop.value}} target=_blank>Link</a> <div ng-if=\"prop.value.indexOf( 'https://') !=0 && prop.value.indexOf( 'http://') !=0 \">{{ prop.value }}</div> </div> </div> <div class=row> <div class=col-md-6> <button class=\"pull-left srchbtn\" ng-click=\"srchslctdctrl.toonFeatureOpKaart() \">Tonen</button> </div> <div class=col-md-6> <button class=\"pull-right srchbtn\" ng-click=\" \">Buffer</button> </div> </div> <button class=srchbtn ng-click=\"srchslctdctrl.close(srchslctdctrl.selectedResult) \">Terug naar resultaten</button> </div>"
  );


  $templateCache.put('templates/search/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> <tink-search-results></tink-search-results> <tink-search-selected></tink-search-selected> </div> </aside> </div>"
  );


  $templateCache.put('templates/themeTemplate.html',
    "<div> <input class=visible-box type=checkbox id=chk{{thmctrl.theme.Naam}} ng-model=thmctrl.theme.Visible ng-change=thmctrl.chkChanged()> <label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} </label><button ng-click=thmctrl.deleteTheme()><i class=\"fa fa-trash\"></i></button> <div class=layercontroller-checkbox ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\"> <tink-layer layer=layer> </tink-layer> </div> <div class=layercontroller-checkbox ng-repeat=\"group in thmctrl.theme.Groups | filter: { enabled: true }\"> <tink-grouplayer grouplayer=group> </tink-grouplayer> </div> </div>"
  );

}]);
