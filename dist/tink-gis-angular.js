'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$q', 'urls', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', function ($scope, $modalInstance, ThemeHelper, $q, urls, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService) {
        $scope.searchIsUrl = false;
        $scope.pagingCount = null;
        $scope.numberofrecordsmatched = 0;
        // $scope.currentPage = 1;
        LayerManagementService.EnabledThemes.length = 0;
        LayerManagementService.AvailableThemes.length = 0;
        LayerManagementService.EnabledThemes = angular.copy(MapData.Themes);
        $scope.availableThemes = [];
        var init = function () {
            // $scope.searchTerm = 'Laden...';
            // var qwhenready = LayerManagementService.ProcessUrls(urls);
            // qwhenready.then(function(allelagen) {
            // $scope.searchTerm = 'http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
            $scope.searchTerm = '';
            $scope.searchIsUrl = false;
            // });
        }();

        $scope.searchChanged = function () {
            if ($scope.searchTerm != null && $scope.searchTerm != '' && $scope.searchTerm.length > 2) {
                $scope.clearPreview();
                if ($scope.searchTerm.startsWith('http')) {
                    $scope.searchIsUrl = true;
                } else {
                    $scope.searchIsUrl = false;
                }
                $scope.QueryGeoPunt($scope.searchTerm, 1);
            } else {
                $scope.availableThemes.length = 0;
                $scope.numberofrecordsmatched = 0;
            }
        };
        $scope.QueryGeoPunt = function (searchTerm, page) {
            var prom = GeopuntService.getMetaData(searchTerm, (page - 1) * 5 + 1, 5);
            prom.then(function (metadata) {
                $scope.availableThemes = metadata.results;
                $scope.currentrecord = metadata.currentrecord;
                $scope.nextrecord = metadata.nextrecord;
                $scope.numberofrecordsmatched = metadata.numberofrecordsmatched;
                // $scope.numberofrecordsreturned = metadata.numberofrecordsreturned;
                // $scope.currentPage = Math.ceil($scope.pagingStart / $scope.recordsAPage)
                console.log(metadata);
            }, function (reason) {
                console.log(reason);
            });
        };
        $scope.pageChanged = function (page, recordsAPage) {
            $scope.QueryGeoPunt($scope.searchTerm, page);
        };
        $scope.laadUrl = function () {
            $scope.searchTerm = $scope.searchTerm.trim().replace('?', '');
            if (MapData.Themes.find(function (x) {
                return x.CleanUrl == $scope.searchTerm;
            }) == undefined) {
                var getwms = WMSService.GetCapabilities($scope.searchTerm);
                getwms.success(function (data, status, headers, config) {
                    $scope.previewTheme(data);
                }).error(function (data, status, headers, config) {
                    $window.alert('error');
                });
            } else {
                alert('Deze is al toegevoegd aan de map.');
            }
        };
        $scope.selectedTheme = null;
        $scope.copySelectedTheme = null;
        $scope.previewTheme = function (theme) {
            console.log('themeChanged');
            console.log(theme);
            $scope.selectedTheme = theme;
            $scope.copySelectedTheme = angular.copy(theme);
        };
        $scope.clearPreview = function () {
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
        };
        $scope.geopuntThemeChanged = function (theme) {
            // alert(theme.Type != 'WMS' && theme.Type != 'ESRI');
            // if (theme.Type != 'wms' && theme.Type != 'esri') {
            var url = theme.Url.trim().replace('?', '');
            if (MapData.Themes.find(function (x) {
                return x.CleanUrl == url;
            }) == undefined) {
                var getwms = WMSService.GetCapabilities(url);
                getwms.success(function (data, status, headers, config) {

                    $scope.previewTheme(data);
                }).error(function (data, status, headers, config) {
                    $window.alert('error');
                });
            } else {
                alert('Deze is al toegevoegd aan de map.');
            }
            // }
        };
        $scope.AddOrUpdateTheme = function () {
            console.log('AddOrUpdateTheme');
            var allChecked = true;
            var noneChecked = true;
            for (var x = 0; x < $scope.copySelectedTheme.AllLayers.length; x++) {
                // aha dus update gebeurt, we gaan deze toevoegen.
                var copyLayer = $scope.copySelectedTheme.AllLayers[x];
                var realLayer = $scope.selectedTheme.AllLayers[x];
                realLayer.enabled = copyLayer.enabled;
                if (copyLayer.enabled === false) {
                    // check or all the checkboxes are checked
                    allChecked = false;
                } else {
                    noneChecked = false;
                }
            }
            var alreadyAdded = LayerManagementService.EnabledThemes.find(function (x) {
                return x.CleanUrl === $scope.selectedTheme.CleanUrl;
            }) != undefined;
            if (noneChecked) {
                //Niks is checked, dus we moeten deze 'deleten'.
                $scope.selectedTheme.Added = false;
                if ($scope.selectedTheme.status != ThemeStatus.NEW) {
                    // als deze new is dan zette we deze gewoon op niets want we verwijderen die.
                    $scope.selectedTheme.status = ThemeStatus.DELETED;
                } else {
                    if (alreadyAdded) {
                        var index = LayerManagementService.EnabledThemes.indexOf($scope.selectedTheme);
                        if (index > -1) {
                            LayerManagementService.EnabledThemes.splice(index, 1);
                        }
                    }
                }
            } else {
                // het is dus geen delete
                if (allChecked) {
                    $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added
                } else {
                        $scope.selectedTheme.Added = null; // if not all added then we put it to null
                    }
                if (alreadyAdded == false) {
                    // it is a new theme!
                    LayerManagementService.EnabledThemes.push($scope.selectedTheme);
                } else {
                    // already exist! It is an update!
                    if ($scope.selectedTheme.status != ThemeStatus.NEW) {
                        $scope.selectedTheme.status = ThemeStatus.UPDATED;
                        console.log('changed naar updated');
                    } else {
                        console.log('Hij is al new, dus moet hij niet naar updated changen.');
                    }
                }
            }
            console.log('AddOrUpdateTheme');

            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
        };

        $scope.ok = function () {
            console.log(LayerManagementService.EnabledThemes);
            $modalInstance.$close(LayerManagementService.EnabledThemes); // return the themes.
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
        };
    }]);
})();
//# sourceMappingURL=addLayerController.js.map
;'use strict';

(function (module) {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    module = angular.module('tink.gis');
    module.controller('groupLayerController', function ($scope) {
        var vm = this;
        vm.grouplayer = $scope.grouplayer;
        vm.chkChanged = function () {
            $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
        };
    });
})();
//# sourceMappingURL=groupLayerController.js.map
;'use strict';

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
})();
//# sourceMappingURL=layerController.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function ($scope, MapData, map, ThemeService, $modal) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.selectedLayers = [];

        vm.sortableOptions = {
            // update: function(e, ui) {
            //     console.log("UPDATEZINDEXES");
            //     MapData.SetZIndexes();
            // },
            stop: function stop(e, ui) {
                // console.log("stop");
                MapData.SetZIndexes();
            }
        };
        $scope.$watch(function () {
            return MapData.Themes;
        }, function (newVal, oldVal) {
            console.log("WATCH OP MAPDATATHEMES IN LAYERSCONTROLLER");
            MapData.SetZIndexes(newVal);
        });
        vm.AddLayers = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/modals/addLayerModalTemplate.html',
                controller: 'addLayerController',
                resolve: {
                    backdrop: false,
                    keyboard: true,
                    urls: function urls() {
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
})();
//# sourceMappingURL=layersController.js.map
;/// <reference path="../services/mapService.js" />

'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, MapData, map, MapEvents, DrawService) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = MapData.VisibleLayers;
        vm.selectedLayer = MapData.SelectedLayer;
        vm.drawingType = MapData.DrawingType;
        vm.showMetenControls = false;
        vm.showDrawControls = false;
        vm.interactieButtonChanged = function (ActiveButton) {
            MapData.CleanMap();
            MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
            vm.activeInteractieKnop = ActiveButton;
            vm.showMetenControls = false;
            vm.showDrawControls = false;
            switch (ActiveButton) {
                case ActiveInteractieButton.SELECT:
                    vm.showDrawControls = true;
                    vm.selectpunt();
                    break;
                case ActiveInteractieButton.METEN:
                    vm.showMetenControls = true;
                    vm.drawingButtonChanged(DrawingOption.AFSTAND);
                    break;
            }
        };
        // var toggleDrawControls = function(showControls) {
        //     if (showControls) {
        //         $('.leaflet-draw.leaflet-control').show();
        //     }
        //     else {
        //         $('.leaflet-draw.leaflet-control').hide();
        //     }
        // };
        vm.drawingButtonChanged = function (drawOption) {
            MapData.CleanMap();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            DrawService.StartDraw(drawOption);
        };
        vm.Loading = 0;
        vm.MaxLoading = 0;

        $scope.$watch(function () {
            return MapData.Loading;
        }, function (newVal, oldVal) {
            vm.Loading = newVal;
            if (oldVal == 0) {
                vm.MaxLoading = newVal;
            }
            // if (newVal < oldVal) {
            if (vm.MaxLoading < oldVal) {
                vm.MaxLoading = oldVal;
            }
            // }
            if (newVal == 0) {
                vm.MaxLoading = 0;
            }
            // $scope.$apply();
            console.log("MapLoading val: " + newVal + "/" + vm.MaxLoading);
        });
        vm.selectpunt = function () {
            MapData.CleanMap();
            MapData.DrawingType = DrawingOption.NIETS; // pff must be possible to be able to sync them...
            vm.drawingType = DrawingOption.NIETS;
        };
        vm.layerChange = function () {
            MapData.CleanMap();
            // console.log("vm.sel: " + vm.selectedLayer.id + "/ MapData.SelectedLayer: " + MapData.Layer.SelectedLayer.id);
            MapData.SelectedLayer = vm.selectedLayer;
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
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService'];
})();
//# sourceMappingURL=mapController.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.controller('themeController', ['$scope', 'MapService', 'ThemeService', function ($scope, MapService, ThemeService) {
        var vm = this;
        console.log('Theme geladen');
        vm.theme = $scope.theme;
        $scope.$on('groupCheckboxChangedEvent', function (event, groupLayer) {
            // stuur het door naar het thema
            MapService.UpdateGroupLayerStatus(groupLayer, vm.theme);
            ThemeService.UpdateThemeVisibleLayers(vm.theme);
        });
        $scope.$on('layerCheckboxChangedEvent', function (event, layer) {
            // stuur het door naar het thema
            MapService.UpdateLayerStatus(layer, vm.theme);
            ThemeService.UpdateThemeVisibleLayers(vm.theme);
        });
        vm.chkChanged = function () {
            MapService.UpdateThemeStatus(vm.theme);
            ThemeService.UpdateThemeVisibleLayers(vm.theme);
        };
        vm.deleteTheme = function () {
            swal({
                title: 'Verwijderen?',
                text: 'U staat op het punt om ' + vm.theme.Naam + ' te verwijderen.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Verwijder',
                closeOnConfirm: true
            }, function () {
                ThemeService.DeleteTheme(vm.theme);
                $scope.$apply();
            });
            console.log(vm.theme);
        };
    }]);
})();
//# sourceMappingURL=themeController.js.map
;'use strict';

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
})();
//# sourceMappingURL=groupLayerDirective.js.map
;'use strict';

(function (module) {

    angular.module('tink.gis').directive('indeterminateCheckbox', [function () {
        return {
            scope: true,
            require: '?ngModel',
            link: function link(scope, element, attrs, modelCtrl) {
                var childList = attrs.childList;
                var property = attrs.property;
                // Bind the onChange event to update children
                element.bind('change', function () {
                    scope.$apply(function () {
                        var isChecked = element.prop('checked');
                        // Set each child's selected property to the checkbox's checked property
                        angular.forEach(scope.$eval(childList), function (child) {
                            child[property] = isChecked;
                        });
                    });
                });
                //https://tech.small-improvements.com/2014/06/11/deep-watching-circular-data-structures-in-angular/
                function watchChildrenListWithProperty() {
                    return scope.$eval(childList).map(function (x) {
                        return x[property];
                    });
                }
                // Watch the children for changes
                scope.$watch(watchChildrenListWithProperty, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var hasChecked = false;
                        var hasUnchecked = false;
                        // Loop through the children
                        angular.forEach(newValue, function (child) {
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
})();
//# sourceMappingURL=indeterminateCheckbox.js.map
;'use strict';

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
})();
//# sourceMappingURL=layerDirective.js.map
;'use strict';

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
})();
//# sourceMappingURL=layersDirective.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/mapTemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();
//# sourceMappingURL=mapDirective.js.map
;'use strict';

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
})();
//# sourceMappingURL=themeDirective.js.map
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    module.constant('appConfig', {
        templateUrl: '/digipolis.stadinkaart.webui',
        apiUrl: '/digipolis.stadinkaart.api/',
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
    JXON.config({
        // valueKey: '_',                // default: 'keyValue'
        // attrKey: '$',                 // default: 'keyAttributes'
        attrPrefix: '', // default: '@'
        // lowerCaseTags: false,         // default: true
        // trueIsEmpty: false,           // default: true
        autoDate: false // default: true
        // ignorePrefixedNodes: false,   // default: true
        // parseValues: false            // default: true
    });
    var init = function () {
        // var abc = _.forEach([], function (x){});
        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    }();
    var mapObject = function mapObject() {
        var crsLambert = new L.Proj.CRS('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438' + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs', {
            origin: [-35872700, 41422700],
            resolutions: [66.1459656252646, 52.91677250021167, 39.687579375158755, 26.458386250105836, 13.229193125052918, 6.614596562526459, 5.291677250021167, 3.9687579375158752, 3.3072982812632294, 2.6458386250105836, 1.9843789687579376, 1.3229193125052918, 0.6614596562526459, 0.5291677250021167, 0.39687579375158755, 0.33072982812632296, 0.26458386250105836, 0.19843789687579377, 0.13229193125052918, 0.06614596562526459, 0.026458386250105836]
        });

        var map = L.map('map', {
            crs: crsLambert,
            zoomControl: false,
            drawControl: false

        }).setView([51.2192159, 4.4028818], 5);

        // The min/maxZoom values provided should match the actual cache thats been published. This information can be retrieved from the service endpoint directly.
        // L.esri.tiledMapLayer({
        //     url: 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer',
        //     maxZoom: 20,
        //     minZoom: 1,
        //     continuousWorld: true
        // }).addTo(map);

        map.doubleClickZoom.disable();
        // L.control.scale({ imperial: false }).addTo(map);
        var drawnItems = L.featureGroup().addTo(map);
        map.on('draw:created', function (event) {
            var layer = event.layer;
            drawnItems.addLayer(layer);
        });
        map.on('draw:drawstart', function (event) {
            //console.log(drawnItems);
            //map.clearDrawings();
        });
        map.clearDrawings = function () {
            console.log('clearingDrawings');
            console.log(drawnItems);
            drawnItems.clearLayers();
        };

        return map;
    };
    module.factory('map', mapObject);
})();

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
    IDENTIFY: 'identify',
    SELECT: 'select',
    METEN: 'meten',
    WATISHIER: 'watishier'
};
var DrawingOption = {
    NIETS: '',
    AFSTAND: 'afstand',
    OPPERVLAKTE: 'oppervlakte',
    LIJN: 'lijn',
    VIERKANT: 'vierkant',
    POLYGON: 'polygon'
};
var ThemeType = {
    ESRI: 'esri',
    WMS: 'wms'
};
var Style = {
    DEFAULT: {
        fillOpacity: 0,
        color: 'blue',
        weight: 5
    },
    HIGHLIGHT: {
        weight: 7,
        color: 'red',
        fillOpacity: 0.5
    }
};
//# sourceMappingURL=moduleInit.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController', function ($scope, ResultsData, map) {
        var vm = this;
        vm.features = ResultsData.JsonFeatures;
        vm.EmptyResult = ResultsData.EmptyResult;
        vm.Loading = ResultsData.Loading;
        vm.MaxLoading = 0;
        $scope.$watch(function () {
            return ResultsData.Loading;
        }, function (newVal, oldVal) {
            vm.Loading = newVal;
            if (oldVal == 0) {
                vm.MaxLoading = newVal;
            }
            if (newVal < oldVal) {
                if (vm.MaxLoading < oldVal) {
                    vm.MaxLoading = oldVal;
                }
            }
            if (newVal == 0) {
                vm.MaxLoading = 0;
            }
            console.log("Loading val: " + newVal + "/" + vm.MaxLoading);
        });
    });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();
//# sourceMappingURL=searchController.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController', function ($scope, ResultsData, map, SearchService) {
        var vm = this;
        vm.features = ResultsData.JsonFeatures;
        vm.featureLayers = null;
        vm.selectedResult = null;
        vm.layerGroupFilter = 'geenfilter';
        $scope.$watchCollection(function () {
            return ResultsData.JsonFeatures;
        }, function (newValue, oldValue) {
            vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
            vm.layerGroupFilter = 'geenfilter';
        });
        $scope.$watch(function () {
            return ResultsData.SelectedFeature;
        }, function (newVal, oldVal) {
            vm.selectedResult = newVal;
        });
        vm.deleteFeature = function (feature) {
            SearchService.DeleteFeature(feature);
        };
        vm.aantalFeaturesMetType = function (type) {
            return vm.features.filter(function (x) {
                return x.layerName == type;
            }).length;
        };
        vm.HoveredFeature = null;
        vm.HoverOver = function (feature) {
            if (vm.HoveredFeature) {
                vm.HoveredFeature.hoverEdit = false;
            }
            feature.hoverEdit = true;
            vm.HoveredFeature = feature;
        };
        vm.deleteFeatureGroup = function (featureGroupName) {
            SearchService.DeleteFeatureGroup(featureGroupName);
        };
        vm.showDetails = function (feature) {
            ResultsData.SelectedFeature = feature;
        };
        vm.exportToCSV = function () {
            SearchService.ExportToCSV();
        };
    });
    theController.$inject = ['$scope', 'ResultsData', 'map'];
})();
//# sourceMappingURL=searchResultsController.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController', function ($scope, ResultsData, MapData, SearchService) {
        var vm = this;
        vm.selectedResult = null;
        vm.prevResult = null;
        vm.nextResult = null;
        vm.props = [];
        $scope.$watch(function () {
            return ResultsData.SelectedFeature;
        }, function (newVal, oldVal) {
            if (oldVal && oldVal != newVal && oldVal.mapItem) {
                // there must be an oldval and it must not be the newval and it must have an mapitem (to dehighlight)
                var tmplayer = oldVal.mapItem._layers[Object.keys(oldVal.mapItem._layers)[0]];
                if (tmplayer._latlngs) {
                    // with s so it is an array, so not a point so we can set the style
                    tmplayer.setStyle(Style.DEFAULT);
                }
            }
            if (newVal) {
                if (newVal.mapItem) {
                    var tmplayer = newVal.mapItem._layers[Object.keys(newVal.mapItem._layers)[0]];
                    if (tmplayer._latlngs) {
                        // with s so it is an array, so not a point so we can set the style
                        tmplayer.setStyle(Style.HIGHLIGHT);
                    }
                }
                vm.selectedResult = newVal;
                var item = Object.getOwnPropertyNames(newVal.properties).map(function (k) {
                    return { key: k, value: newVal.properties[k] };
                });
                vm.props = item;
                vm.prevResult = SearchService.GetPrevResult();
                vm.nextResult = SearchService.GetNextResult();
            } else {
                vm.selectedResult = null;
                vm.prevResult = null;
                vm.nextResult = null;
            }
        });
        vm.toonFeatureOpKaart = function () {
            if (vm.selectedResult.theme.Type === 'esri') {
                MapData.PanToFeature(vm.selectedResult);
            } else {
                // wms we go to the last identifybounds
                MapData.GoToLastClickBounds();
            }
        };
        vm.volgende = function () {
            ResultsData.SelectedFeature = vm.nextResult;
        };
        vm.vorige = function () {
            ResultsData.SelectedFeature = vm.prevResult;
        };
        vm.delete = function () {
            var prev = SearchService.GetPrevResult();
            var next = SearchService.GetNextResult();
            SearchService.DeleteFeature(vm.selectedResult);
            if (next) {
                ResultsData.SelectedFeature = next;
            } else if (prev) {
                ResultsData.SelectedFeature = prev;
            } else {
                ResultsData.SelectedFeature = null;
            }
        };
        vm.close = function (feature) {
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            ResultsData.SelectedFeature = null;
        };
    });
    theController.$inject = ['$scope', 'ResultsData'];
})();
//# sourceMappingURL=searchSelectedController.js.map
;'use strict';

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
})();
//# sourceMappingURL=searchDirective.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchResults', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchResultsTemplate.html',
            controller: 'searchResultsController',
            controllerAs: 'srchrsltsctrl'
        };
    });
})();
//# sourceMappingURL=searchResultsDirective.js.map
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchSelected', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchSelectedTemplate.html',
            controller: 'searchSelectedController',
            controllerAs: 'srchslctdctrl'
        };
    });
})();
//# sourceMappingURL=searchSelectedDirective.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var data = function data() {
        var _data = {};
        _data.SelectedFeature = null;
        _data.JsonFeatures = [];
        _data.Loading = 0;
        _data.EmptyResult = false;
        _data.CleanSearch = function () {
            _data.JsonFeatures.length = 0;
            _data.SelectedFeature = null;
        };
        return _data;
    };
    module.factory('ResultsData', data);
})();
//# sourceMappingURL=resultsData.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service(ResultsData, map) {
        var _service = {};
        _service.DeleteFeature = function (feature) {
            var featureIndex = ResultsData.JsonFeatures.indexOf(feature);
            if (featureIndex > -1) {
                if (feature.mapItem) {
                    map.removeLayer(feature.mapItem);
                }
                ResultsData.JsonFeatures.splice(featureIndex, 1);
            }
        };
        _service.DeleteFeatureGroup = function (featureGroupName) {
            var toDelFeatures = [];
            ResultsData.JsonFeatures.forEach(function (feature) {
                if (feature.layerName === featureGroupName) {
                    toDelFeatures.push(feature);
                }
            });
            toDelFeatures.forEach(function (feat) {
                _service.DeleteFeature(feat);
            });
        };
        _service.ExportToCSV = function () {
            var csvContent = ""; // "data:text/csv;charset=utf-8,";
            var dataString = "";
            var layName = "";
            csvContent += 'Laag;' + "\n";

            ResultsData.JsonFeatures.forEach(function (feature, index) {
                if (layName !== feature.layerName) {
                    layName = feature.layerName;
                    var tmparr = [];
                    for (var name in feature.properties) {
                        tmparr.push(name);
                    }
                    var layfirstline = tmparr.join(";");

                    csvContent += layName + ";" + layfirstline + "\n";
                }
                var infoArray = _.values(feature.properties);
                infoArray.unshift(layName);
                dataString = infoArray.join(";");
                console.log(dataString);
                // csvContent += dataString + "\n";
                csvContent += index < ResultsData.JsonFeatures.length ? dataString + "\n" : dataString;
            });
            var a = document.createElement('a');
            a.href = 'data:attachment/csv,' + encodeURIComponent(csvContent);
            a.target = '_blank';
            a.download = 'exportsik.csv';

            document.body.appendChild(a);
            a.click();
            // var encodedUri = encodeURI(csvContent);
            // window.open(encodedUri, 'exportsik.csv');
        };
        _service.GetNextResult = function () {
            var index = ResultsData.JsonFeatures.indexOf(ResultsData.SelectedFeature);
            var layerName = ResultsData.SelectedFeature.layerName;
            if (index < ResultsData.JsonFeatures.length - 1) {
                // check for nextResult exists
                var nextItem = ResultsData.JsonFeatures[index + 1];
                if (nextItem.layerName === layerName) {
                    return nextItem;
                }
            }
            return null;
        };
        _service.GetPrevResult = function () {
            var index = ResultsData.JsonFeatures.indexOf(ResultsData.SelectedFeature);
            var layerName = ResultsData.SelectedFeature.layerName;
            if (index > 0) {
                // check or prevResult exists
                var prevItem = ResultsData.JsonFeatures[index - 1];
                if (prevItem.layerName === layerName) {
                    return prevItem;
                }
            }
            return null;
        };

        return _service;
    };
    module.factory("SearchService", service);
})();
//# sourceMappingURL=searchService.js.map
;//http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode
//http://proj4js.org/
'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($http, map, MapData, HelperService, $rootScope) {
        var _service = {};
        _service.ReverseGeocode = function (event) {
            var lambert72Cords = HelperService.ConvertWSG84ToLambert72(event.latlng);
            var loc = lambert72Cords.x + "," + lambert72Cords.y;
            var urlloc = encodeURIComponent(loc);
            MapData.CleanWatIsHier();
            $http.get('http://app10.p.gis.local/arcgissql/rest/services/COMLOC_CRAB_NAVTEQ/GeocodeServer/reverseGeocode?location=' + urlloc + '&distance=50&outSR=&f=json').success(function (data, status, headers, config) {
                if (!data.error) {
                    MapData.CreateWatIsHierMarker(data);
                    console.log(data);
                    MapData.CreateOrigineleMarker(event.latlng, true);
                } else {
                    MapData.CreateOrigineleMarker(event.latlng, false);
                }
            }).error(function (data, status, headers, config) {
                console.log("ERROR!");
                console.log(status);
                console.log(headers);
                console.log(data);
            });
        };
        _service.GetThemeData = function (url) {
            var prom = $http.get(url);
            return prom;
        };
        _service.GetThemeLayerData = function (mapServiceUrl) {
            var prom = $http.get(mapServiceUrl + 'layers?f=pjson');
            return prom;
        };
        return _service;
    };
    module.$inject = ["$http", 'map', 'MapData', 'HelperService', '$rootScope'];
    module.factory("GISService", service);
})();
//# sourceMappingURL=GISService.js.map
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var service = function service($http, $window, map) {
        var _service = {};

        _service.GetCapabilities = function (url) {
            var posturl = '?request=GetCapabilities&service=WMS&callback=foo';
            var prom = $http({
                method: 'GET',
                url: url + posturl,
                timeout: 10000,
                // params: {},  // Query Parameters (GET)
                transformResponse: function transformResponse(data) {
                    var wmstheme = {};
                    if (data) {
                        var returnjson = JXON.stringToJs(data).wms_capabilities;
                        console.log(returnjson);
                        wmstheme.Version = returnjson['version'];
                        wmstheme.name = returnjson.service.title;
                        wmstheme.Naam = returnjson.service.title;
                        // wmstheme.Title = returnjson.service.title;
                        wmstheme.enabled = true;
                        wmstheme.Visible = true;
                        wmstheme.Layers = [];
                        wmstheme.AllLayers = [];
                        wmstheme.Groups = []; // layergroups die nog eens layers zelf hebben
                        wmstheme.CleanUrl = url;
                        wmstheme.Added = false;
                        wmstheme.status = ThemeStatus.NEW;
                        wmstheme.Description = returnjson.service.abstract;
                        wmstheme.Type = ThemeType.WMS;
                        wmstheme.VisibleLayerIds = [];
                        wmstheme.VisibleLayers = [];
                        var createLayer = function createLayer(layer) {
                            var tmplayer = {};
                            tmplayer.visible = true;
                            tmplayer.enabled = true;
                            tmplayer.parent = null;
                            tmplayer.theme = wmstheme;
                            tmplayer.name = layer.name;
                            tmplayer.title = layer.title;
                            tmplayer.queryable = layer.queryable;
                            tmplayer.type = LayerType.LAYER;
                            tmplayer.id = layer.name; //names are the ids of the layer in wms
                            wmstheme.Layers.push(tmplayer);
                            wmstheme.AllLayers.push(tmplayer);
                        };
                        var layers = returnjson.capability.layer.layer;
                        if (layers) {
                            layers.forEach(function (layer) {
                                createLayer(layer);
                            });
                        } else {
                            createLayer(returnjson.capability.layer);
                        }

                        wmstheme.UpdateMap = function () {
                            wmstheme.RecalculateVisibleLayerIds();
                            map.removeLayer(wmstheme.MapData);
                            map.addLayer(wmstheme.MapData);
                        };

                        wmstheme.RecalculateVisibleLayerIds = function () {
                            wmstheme.VisibleLayerIds.length = 0;
                            _.forEach(wmstheme.VisibleLayers, function (visLayer) {
                                wmstheme.VisibleLayerIds.push(visLayer.id);
                            });
                            if (wmstheme.VisibleLayerIds.length === 0) {
                                wmstheme.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                            }
                        };
                        wmstheme.RecalculateVisibleLayerIds();
                    }

                    return wmstheme;
                }
            }).success(function (data, status, headers, config) {
                console.dir(data); // XML document object
            }).error(function (data, status, headers, config) {
                console.log('error: data, status, headers, config:');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
                $window.alert('error');
            });
            return prom;
        };

        return _service;
    };
    module.factory('WMSService', service);
})();
//# sourceMappingURL=WMSService.js.map
;'use strict';

(function () {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function baseLayersService(map) {
        var _baseLayersService = {};
        _baseLayersService.kaart = L.esri.tiledMapLayer({
            url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer',
            maxZoom: 19,
            minZoom: 0,
            continuousWorld: true
        });

        _baseLayersService.luchtfoto = L.esri.tiledMapLayer({
            url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/Luchtfoto_2015/MapServer',
            maxZoom: 19,
            minZoom: 0,
            continuousWorld: true
        });
        _baseLayersService.kaart.addTo(map);

        return _baseLayersService;
    };

    module.factory("BaseLayersService", baseLayersService);
})();
//# sourceMappingURL=baseLayersService.js.map
;'use strict';

(function () {

    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function service(MapData, map) {
        var _service = {};

        _service.StartDraw = function (DrawingOptie) {
            switch (MapData.DrawingType) {
                case DrawingOption.LIJN:
                case DrawingOption.AFSTAND:
                    MapData.DrawingObject = new L.Draw.Polyline(map);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.POLYGON:
                case DrawingOption.OPPERVLAKTE:
                    var polygon_options = {
                        showArea: true,
                        shapeOptions: {
                            stroke: true,
                            color: '#22528b',
                            weight: 4,
                            opacity: 0.6,
                            fill: true,
                            fillColor: null, //same as color by default
                            fillOpacity: 0.4,
                            clickable: true
                        }
                    };
                    MapData.DrawingObject = new L.Draw.Polygon(map, polygon_options);
                    MapData.DrawingObject.enable();
                    break;
                case DrawingOption.VIERKANT:
                    MapData.DrawingObject = new L.Draw.Rectangle(map);
                    MapData.DrawingObject.enable();
                    break;
                default:
                    break;
            }
        };
        return _service;
    };
    // module.$inject = ['MapData', 'map'];

    module.factory("DrawService", service);
})();
//# sourceMappingURL=drawService.js.map
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var externService = function externService(MapData, map, GISService, ThemeHelper, WMSService, ThemeService, $q) {
        var _externService = {};
        _externService.Export = function () {
            var exportObject = {};
            var arr = MapData.Themes.map(function (theme) {
                var returnitem = {};
                returnitem.Naam = theme.Naam;
                returnitem.CleanUrl = theme.CleanUrl;
                returnitem.Type = theme.Type;
                returnitem.Visible = theme.Visible;
                returnitem.Layers = theme.AllLayers.filter(function (x) {
                    return x.enabled == true;
                }).map(function (layer) {
                    var returnlayer = {};
                    // returnlayer.enabled = layer.enabled; // will always be true... since we only export the enabled layers
                    returnlayer.visible = layer.visible;
                    returnlayer.name = layer.name;
                    returnlayer.id = layer.id;
                    return returnlayer;
                });
                return returnitem;
            });
            exportObject.Themes = arr;
            exportObject.Extent = map.getBounds();
            exportObject.IsKaart = true;

            return exportObject;
        };
        _externService.Import = function (project) {
            console.log(project);
            _externService.setExtent(project.extent);
            var themesArray = [];
            var promises = [];

            project.themes.forEach(function (theme) {
                if (theme.type == ThemeType.ESRI) {
                    var prom = GISService.GetThemeData(theme.cleanUrl + '?f=pjson');
                    promises.push(prom);
                    prom.success(function (data, statuscode, functie, getdata) {
                        themesArray.push(ThemeHelper.createThemeFromJson(data, getdata));
                    });
                } else {
                    // wms
                    var _prom = WMSService.GetCapabilities(theme.cleanUrl);
                    promises.push(_prom);
                    _prom.success(function (data, status, headers, config) {
                        themesArray.push(data);
                    }).error(function (data, status, headers, config) {
                        console.log('error!!!!!!!', data, status, headers, config);
                    });
                }
            });
            $q.all(promises).then(function () {
                var orderedArray = [];
                var errorMessages = [];
                project.themes.forEach(function (theme) {
                    var realTheme = themesArray.find(function (x) {
                        return x.CleanUrl == theme.cleanUrl;
                    });
                    realTheme.Visible = theme.visible;
                    console.log(theme, ' vs real theme: ', realTheme);
                    if (realTheme.AllLayers.length == theme.layers.length) {
                        realTheme.Added = true; //all are added
                    } else {
                            realTheme.Added = null; // some are added, never false because else we woudn't save it.
                        }
                    realTheme.AllLayers.forEach(function (layer) {
                        layer.enabled = false; // lets disable all layers first
                    });
                    //lets check what we need to enable and set visiblity of, and also check what we don't find
                    theme.layers.forEach(function (layer) {
                        var realLayer = realTheme.AllLayers.find(function (x) {
                            return x.name == layer.name;
                        });
                        if (realLayer) {
                            realLayer.visible = layer.visible; // aha so there was a layer, lets save this
                            realLayer.enabled = true;
                        } else {
                            errorMessages.push('"' + layer.name + '" not found in mapserver: ' + realTheme.Naam + '.');
                        }
                    });
                });
                project.themes.forEach(function (theme) {
                    // lets order them, since we get themesArray filled by async calls, the order can be wrong, thats why we make an ordered array
                    var realTheme = themesArray.find(function (x) {
                        return x.CleanUrl == theme.cleanUrl;
                    });
                    orderedArray.unshift(realTheme);
                });
                ThemeService.AddAndUpdateThemes(orderedArray);
                console.log('all loaded');
                if (errorMessages.length > 0) {
                    alert(errorMessages.join('\n'));
                }
            });
        };
        _externService.setExtent = function (extent) {

            map.fitBounds([[extent._northEast.lat, extent._northEast.lng], [extent._southWest.lat, extent._southWest.lng]]);
            map.setZoom(map.getZoom() + 1);
        };
        _externService.CleanMapAndThemes = function () {
            MapData.CleanMap();
            ThemeService.CleanThemes();
        };

        return _externService;
    };
    module.$inject = ['MapData', 'map', 'GISService', 'ThemeHelper', 'WMSService', 'ThemeService', '$q'];
    module.factory('ExternService', externService);
})();
//# sourceMappingURL=externService.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($http, map, MapData, $rootScope, $q) {
        var _service = {};
        _service.getMetaData = function () {
            var searchterm = arguments.length <= 0 || arguments[0] === undefined ? 'water' : arguments[0];
            var startpos = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
            var recordsAPage = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

            var url = 'https://metadata.geopunt.be/zoekdienst/srv/dut/csw?service=CSW&version=2.0.2&request=GetRecords&namespace=xmlns%28csw=http://www.opengis.net/cat/csw%29&resultType=results&outputSchema=http://www.opengis.net/cat/csw/2.0.2&outputFormat=application/xml&startPosition=' + startpos + '&maxRecords=' + recordsAPage + '&typeNames=csw:Record&elementSetName=full&constraintLanguage=CQL_TEXT&constraint_language_version=1.1.0&constraint=AnyText+LIKE+%27%25' + searchterm + '%25%27AND%20Type%20=%20%27service%27%20AND%20Servicetype%20=%27view%27';
            console.log("GETTING METADATA WITH ULR:", url);
            var prom = $q.defer();
            $http.get(url).success(function (data, status, headers, config) {
                if (data) {
                    var returnjson = JXON.stringToJs(data);
                    var getResults = returnjson['csw:getrecordsresponse']['csw:searchresults'];
                    var returnObject = {};
                    returnObject.searchTerm = searchterm;
                    returnObject.currentrecord = startpos;
                    returnObject.recordsAPage = recordsAPage;
                    returnObject.nextrecord = getResults.nextrecord;
                    returnObject.numberofrecordsmatched = getResults.numberofrecordsmatched;
                    returnObject.numberofrecordsreturned = getResults.numberofrecordsreturned;
                    returnObject.results = [];
                    if (returnObject.numberofrecordsmatched != 0) {
                        // only foreach when there are items
                        getResults['csw:record'].forEach(function (record) {
                            if (record['dc:uri'] instanceof Array == false) {
                                var tmpdata = record['dc:uri'];
                                record['dc:uri'] = [];
                                record['dc:uri'].push(tmpdata);
                            }
                            var tmptheme = {};
                            tmptheme.Added = false;
                            tmptheme.Naam = record['dc:title'];
                            var wmsinfo = record['dc:uri'].find(function (x) {
                                return x.protocol == 'WMS' || x.protocol == 'OGC:WMS';
                            });
                            if (wmsinfo) {
                                tmptheme.Url = wmsinfo.keyValue;
                                tmptheme.Type = ThemeType.WMS;
                            } else {
                                tmptheme.Type = 'DONTKNOW';
                            }
                            tmptheme.TMPMETADATA = record;
                            returnObject.results.push(tmptheme);
                        });
                    }

                    prom.resolve(returnObject);
                    // console.log(getResults['csw:record']);
                } else {
                        prom.reject(null);
                        console.log('EMPTY RESULT');
                    }
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                console.log("ERROR!", data, status, headers, config);
            });
            return prom.promise;
        };
        return _service;
    };
    module.$inject = ["$http", 'map', 'MapData', '$rootScope', '$q'];
    module.factory("GeopuntService", service);
})();
//# sourceMappingURL=geopuntService.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service() {
        var _service = {};
        proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438' + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs');
        // proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs');

        _service.ConvertWSG84ToLambert72 = function (coordinates) {
            var result = proj4('EPSG:31370', [coordinates.lng || coordinates.x, coordinates.lat || coordinates.y]);
            return {
                x: result[0],
                y: result[1]
            };
        };
        _service.ConvertLambert72ToWSG84 = function (coordinates) {
            var x = coordinates.lng || coordinates.x || coordinates[0];
            var y = coordinates.lat || coordinates.y || coordinates[1];
            var result = proj4('EPSG:31370', 'WGS84', [x, y]);
            return {
                y: result[0],
                x: result[1]
            };
        };

        return _service;
    };
    // module.$inject = ["$http", 'map'];
    module.factory('HelperService', service);
})();
//# sourceMappingURL=helperService.js.map
;/// <reference path="../../../typings/tsd.d.ts"/>

'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service(MapData, $http, $q, GISService, ThemeHelper) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];
        _service.ProcessUrls = function (urls) {
            var promises = [];
            _.each(urls, function (url) {
                var AlreadyAddedTheme = null;
                _service.EnabledThemes.forEach(function (theme) {
                    // OPTI kan paar loops minder door betere zoek in array te doen
                    if (theme.CleanUrl == url) {
                        AlreadyAddedTheme = theme;
                    }
                });
                if (AlreadyAddedTheme == null) {
                    // if we didn t get an alreadyadderdtheme we get the data
                    var prom = GISService.GetThemeData(url + '?f=pjson');
                    prom.success(function (data, statuscode, functie, getdata) {
                        var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata);
                        _service.AvailableThemes.push(convertedTheme);
                        convertedTheme.status = ThemeStatus.NEW;
                    });
                    promises.push(prom);
                } else {
                    // ah we already got it then just push it.
                    AlreadyAddedTheme.status = ThemeStatus.UNMODIFIED;
                    _service.AvailableThemes.push(AlreadyAddedTheme);
                }
            });
            // $q.all(promises).then(function(lagen) {
            //     console.log(lagen);
            // });
            return $q.all(promises);
        };
        _service.SetAditionalLayerInfo = function (theme) {
            var prom = GISService.GetThemeLayerData(theme.CleanUrl);
            prom.success(function (data, statuscode, functie, getdata) {
                theme.AllLayers.forEach(function (layer) {
                    var layerid = layer.id;
                    var layerInfo = data.layers[layerid];
                    layer.displayField = layerInfo.displayField;
                    layer.fields = layerInfo.fields;
                });
            });
        };
        return _service;
    };
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeHelper'];
    module.factory('LayerManagementService', service);
})();
//# sourceMappingURL=layerManagementService.js.map
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', ['ui.sortable']]); //'leaflet-directive'
    }
    var layersService = function layersService($http, map) {
        var _layersService = {};
        return _layersService;
    };
    module.$inject = ["$http", 'map'];
    module.factory("LayersService", layersService);
})();
//# sourceMappingURL=layersService.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var mapData = function mapData(map, $rootScope, HelperService, ResultsData) {
        var _data = {};

        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.Loading = 0;
        _data.IsDrawing = false;
        _data.ThemeUrls = ['http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Afval/MapServer/', 'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Cultuur/MapServer/', 'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Jeugd/MapServer/', 'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Onderwijs/MapServer/', 'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/stad/MapServer/'];
        _data.Themes = [];
        _data.defaultlayer = { id: '', name: 'Alle Layers' };
        _data.SelectedLayer = _data.defaultlayer;
        _data.VisibleLayers.unshift(_data.defaultlayer);
        _data.ActiveInteractieKnop = ActiveInteractieButton.IDENTIFY;
        _data.DrawingType = DrawingOption.NIETS;
        _data.DrawingObject = null;
        _data.LastIdentifyBounds = null;
        _data.CleanDrawings = function () {
            if (_data.DrawingObject) {
                if (_data.DrawingObject.layer) {
                    // if the layer (drawing) is created
                    _data.DrawingObject.layer._popup = null; // remove popup first because else it will fire close event which will do an other clean of the drawings which is not needed
                }
                _data.DrawingObject.disable();
                _data.DrawingObject = null;
                map.clearDrawings();
            }
        };
        var WatIsHierMarker = null;
        var WatIsHierOriginalMarker = null;
        _data.CleanMap = function () {
            _data.CleanDrawings();
            _data.CleanWatIsHier();
            _data.CleanSearch();
        };
        _data.CleanWatIsHier = function () {
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
        _data.CreateOrigineleMarker = function (latlng, addressFound) {
            if (addressFound) {
                var foundMarker = L.AwesomeMarkers.icon({
                    icon: 'fa-map-marker',
                    markerColor: 'orange'

                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: foundMarker, opacity: 0.5 }).addTo(map);
            } else {
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
                var html = '<div class="container container-low-padding">' + '<div class="row row-no-padding">' + '<div class="col-sm-4">' + '<a href="templates/external/streetView.html?lat=' + latlng.lat + '&lng=' + latlng.lng + '" + target="_blank" >' + '<img src="https://maps.googleapis.com/maps/api/streetview?size=100x50&location=' + latlng.lat + ',' + latlng.lng + '&pitch=-0.76" />' + '</a>' + '</div>' + '<div class="col-sm-8">' + '<div class="col-sm-12"><b>' + straatNaam + '</b></div>' + '<div class="col-sm-3">WGS84:</div><div class="col-sm-8" style="text-align: left;">' + latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' + '<div class="col-sm-3">Lambert:</div><div class="col-sm-8" style="text-align: left;">' + convertedxy.x.toFixed(1) + ', ' + convertedxy.y.toFixed(1) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' + '</div>' + '</div>' + '</div>';
                WatIsHierOriginalMarker.bindPopup(html, { minWidth: 300 }).openPopup();
            } else {
                var html = '<div class="container container-low-padding">' + '<div class="row row-no-padding">' + '<div class="col-sm-3">WGS84:</div><div class="col-sm-8" style="text-align: left;">' + latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' + '<div class="col-sm-3">Lambert:</div><div class="col-sm-8" style="text-align: left;">' + convertedxy.x.toFixed(1) + ', ' + convertedxy.y.toFixed(1) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' + '</div>' + '</div>';
                WatIsHierOriginalMarker.bindPopup(html, { minWidth: 200 }).openPopup();
                // WatIsHierOriginalMarker.bindPopup(
                //     'WGS84 (x,y):' + latlng.lat.toFixed(6) + ',' + latlng.lng.toFixed(6) +
                //     '<br>Lambert (x,y):' + convertedxy.x.toFixed(1) + ',' + convertedxy.y.toFixed(1)).openPopup();
            }

            WatIsHierOriginalMarker.on('popupclose', function (event) {
                _data.CleanWatIsHier();
            });
        };
        var straatNaam = null;
        _data.CreateWatIsHierMarker = function (data) {
            var convertedBackToWSG84 = HelperService.ConvertLambert72ToWSG84(data.location);
            straatNaam = data.address.Street + ' (' + data.address.Postal + ')';
            var greenIcon = L.icon({
                iconUrl: 'styles/fa-dot-circle-o_24_0_000000_none.png',
                iconSize: [24, 24]
            });

            WatIsHierMarker = L.marker([convertedBackToWSG84.x, convertedBackToWSG84.y], { icon: greenIcon }).addTo(map);
        };
        _data.CleanSearch = function () {
            ResultsData.CleanSearch();
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                map.removeLayer(_data.VisibleFeatures[x]); //eerst de
            }
            _data.VisibleFeatures.length = 0;
        };
        _data.PanToFeature = function (feature) {
            var tmplayer = feature.mapItem._layers[Object.keys(feature.mapItem._layers)[0]];
            if (tmplayer._latlngs) {
                // with s so it has bounds etc
                map.fitBounds(tmplayer.getBounds(), { paddingTopLeft: L.point(25, 25), paddingBottomRight: L.point(25, 25) });
                map.setZoom(map.getZoom() + 1);
            } else {
                // map.panTo(tmplayer.getLatLng());
            }
        };
        _data.GoToLastClickBounds = function () {
            map.fitBounds(_data.LastIdentifyBounds, { paddingTopLeft: L.point(0, 0), paddingBottomRight: L.point(0, 0) });
            map.setZoom(map.getZoom() + 1);
        };
        _data.SetZIndexes = function () {
            var counter = _data.Themes.length + 3;
            _data.Themes.forEach(function (theme) {
                theme.MapData.ZIndex = counter;
                if (theme.Type == ThemeType.ESRI) {
                    if (theme.MapData._currentImage) {
                        theme.MapData._currentImage._image.style.zIndex = counter;
                    }
                } else {
                    // WMS
                    theme.MapData.bringToFront();
                    theme.MapData.setZIndex(counter);
                }
                counter--;
            });
        };
        _data.AddFeatures = function (features, theme, layerId) {
            if (features.length == 0) {
                ResultsData.EmptyResult = true;
            } else {
                ResultsData.EmptyResult = false;
                for (var x = 0; x < features.features.length; x++) {
                    var featureItem = features.features[x];

                    var layer = {};
                    if (featureItem.layerId != undefined && featureItem.layerId != null) {
                        layer = theme.AllLayers.find(function (x) {
                            return x.id === featureItem.layerId;
                        });
                    } else if (layerId != undefined && layerId != null) {
                        layer = theme.AllLayers.find(function (x) {
                            return x.id === layerId;
                        });
                    } else {
                        console.log('NO LAYER ID WAS GIVEN EITHER FROM FEATURE ITEM OR FROM PARAMETER');
                    }
                    // featureItem.layer = layer;
                    featureItem.theme = theme;
                    featureItem.layerName = layer.name;
                    if (theme.Type === ThemeType.ESRI) {
                        layer.fields.forEach(function (field) {
                            if (field.type == 'esriFieldTypeDate') {
                                var date = new Date(featureItem.properties[field.name]);
                                var date_string = date.getDate() + 1 + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(); // "2013-9-23"
                                featureItem.properties[field.name] = date_string;
                            }
                        });
                        featureItem.displayValue = featureItem.properties[layer.displayField];
                        var mapItem = L.geoJson(featureItem, { style: Style.DEFAULT }).addTo(map);
                        _data.VisibleFeatures.push(mapItem);
                        featureItem.mapItem = mapItem;
                    } else {
                        featureItem.displayValue = featureItem.properties[Object.keys(featureItem.properties)[0]];
                    }
                    ResultsData.JsonFeatures.push(featureItem);
                }
                $rootScope.$apply();
            }
        };
        return _data;
    };
    module.$inject = ['ResultsData'];
    module.factory('MapData', mapData);
})();
//# sourceMappingURL=mapData.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var mapEvents = function mapEvents(map, MapService, MapData, DrawService) {
        var _mapEvents = {};
        map.on('draw:drawstart', function (event) {
            console.log('draw started');
            MapData.IsDrawing = true;
            // MapData.CleanDrawings();
        });

        map.on('draw:drawstop', function (event) {
            console.log('draw stopped');
            MapData.IsDrawing = false;
            // MapData.CleanDrawings();
        });

        var berkenOmtrek = function berkenOmtrek(layer) {
            // Calculating the distance of the polyline
            var tempLatLng = null;
            var totalDistance = 0.00000;
            _.each(layer._latlngs, function (latlng) {
                if (tempLatLng == null) {
                    tempLatLng = latlng;
                    return;
                }
                totalDistance += tempLatLng.distanceTo(latlng);
                tempLatLng = latlng;
            });
            return totalDistance.toFixed(2);
        };

        map.on('zoomend', function (event) {
            console.log('Zoomend!!!');
            console.log(event);
            // MapData.Themes.forEach(x => {
            //     console.log(x.MapData);
            // });
        });

        map.on('click', function (event) {
            console.log('click op map! Is drawing: ' + MapData.IsDrawing);
            if (!MapData.IsDrawing) {
                MapData.CleanMap();
                switch (MapData.ActiveInteractieKnop) {
                    case ActiveInteractieButton.IDENTIFY:
                        MapData.LastIdentifyBounds = map.getBounds();
                        MapService.Identify(event, 10);
                        break;
                    case ActiveInteractieButton.SELECT:
                        if (MapData.DrawingType === DrawingOption.NIETS) {
                            MapService.Select(event);
                        } // else a drawing finished
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
            } else {
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

        map.on('draw:created', function (e) {
            console.log('draw created');
            console.log(e);
            switch (MapData.ActiveInteractieKnop) {
                case ActiveInteractieButton.SELECT:
                    switch (MapData.DrawingType) {
                        case DrawingOption.LIJN:
                            break;
                        case DrawingOption.VIERKANT:
                            break;
                        case DrawingOption.POLYGON:
                            break;
                        default:
                            break;
                    }
                    MapService.Query(e);

                    // if (MapData.SelectedLayer.id == '') {
                    //     console.log('Geen layer selected! kan dus niet opvragen');
                    // }
                    // else {
                    //     MapService.Query(event);
                    // }
                    break;
                case ActiveInteractieButton.METEN:
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            var omtrek = berkenOmtrek(e.layer);
                            var popup = e.layer.bindPopup('Afstand (m): ' + omtrek + ' ');
                            popup.on('popupclose', function (event) {
                                MapData.CleanMap();
                            });
                            e.layer.openPopup();
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            var omtrek = berkenOmtrek(e.layer);
                            var popuptekst = '<p>Opp  (m<sup>2</sup>): ' + LGeo.area(e.layer).toFixed(2) + '</p>' + '<p>Omtrek (m): ' + omtrek + ' </p>';
                            var popup = e.layer.bindPopup(popuptekst);
                            popup.on('popupclose', function (event) {
                                MapData.CleanMap();
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
//# sourceMappingURL=mapEvents.js.map
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function mapService($rootScope, MapData, map, ThemeHelper, $q, GISService, WMSService, ResultsData) {
        var _mapService = {};
        _mapService.Identify = function (event, tolerance) {
            if (typeof tolerance === 'undefined') {
                tolerance = 10;
            }
            _.each(MapData.Themes, function (theme) {
                theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                if (identifOnThisTheme) {
                    switch (theme.Type) {
                        case ThemeType.ESRI:
                            var layersVoorIdentify = 'visible: ' + theme.VisibleLayerIds;
                            ResultsData.Loading++;
                            theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                                ResultsData.Loading--;
                                MapData.AddFeatures(featureCollection, theme);
                            });
                            break;
                        case ThemeType.WMS:
                            var layersVoorIdentify = theme.VisibleLayerIds;
                            theme.VisibleLayers.forEach(function (lay) {
                                console.log(lay);
                                if (lay.queryable == true) {

                                    ResultsData.Loading++;
                                    theme.MapData.getFeatureInfo(event.latlng, lay.name).success(function (data, status, xhr) {
                                        ResultsData.Loading--;
                                        console.log("minus");
                                        var xmlstring = JXON.xmlToString(data);
                                        var returnjson = JXON.stringToJs(xmlstring);
                                        var processedjson = null;
                                        if (returnjson.featureinforesponse) {
                                            processedjson = returnjson.featureinforesponse.fields;
                                        }
                                        var returnitem = {
                                            type: "FeatureCollection",
                                            features: []
                                        };
                                        if (processedjson) {
                                            var featureArr = [];
                                            if ((typeof processedjson === 'undefined' ? 'undefined' : _typeof(processedjson)) === "object") {
                                                featureArr.push(processedjson);
                                            } else {
                                                featureArr = processedjson;
                                            }

                                            featureArr.forEach(function (feat) {
                                                var tmpitem = {
                                                    layerName: lay.name,
                                                    name: lay.name,
                                                    layerId: lay.name,
                                                    properties: feat,
                                                    type: "Feature"
                                                };
                                                returnitem.features.push(tmpitem);
                                            });
                                            console.log(lay.name + " item info: ");
                                            console.log(returnitem);
                                            MapData.AddFeatures(returnitem, theme);
                                        } else {
                                            // we must still apply for the loading to get updated
                                            $rootScope.$apply();
                                        }
                                    });
                                }
                            });
                            break;
                        default:
                            console.log("UNKNOW TYPE!!!!:");
                            console.log(Theme.Type);
                            break;
                    }
                }
            });
        };

        _mapService.Select = function (event) {
            if (MapData.SelectedLayer.id == '') {
                // alle layers selected
                MapData.Themes.filter(function (x) {
                    return x.Type == ThemeType.ESRI;
                }).forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    ResultsData.Loading++;
                    theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + theme.VisibleLayerIds).run(function (error, featureCollection) {
                        ResultsData.Loading--;
                        MapData.AddFeatures(featureCollection, theme);
                    });
                });
            } else {
                ResultsData.Loading++;
                MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function (error, featureCollection) {
                    ResultsData.Loading--;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme);
                });
            }
        };
        _mapService.WatIsHier = function (event) {
            GISService.ReverseGeocode(event);
        };

        _mapService.Query = function (event) {
            if (MapData.SelectedLayer.id == '') {
                // alle layers selected
                MapData.Themes.forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(function (lay) {
                            ResultsData.Loading++;
                            theme.MapData.query().layer(lay.id).intersects(event.layer).run(function (error, featureCollection, response) {
                                ResultsData.Loading--;
                                MapData.AddFeatures(featureCollection, theme, lay.id);
                            });
                        });
                    }
                });
            } else {
                ResultsData.Loading++;
                MapData.SelectedLayer.theme.MapData.query().layer(MapData.SelectedLayer.id).intersects(event.layer).run(function (error, featureCollection, response) {
                    ResultsData.Loading--;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme, MapData.SelectedLayer.id);
                });
            }
        };
        _mapService.UpdateThemeStatus = function (theme) {
            _.each(theme.Groups, function (layerGroup) {
                _mapService.UpdateGroupLayerStatus(layerGroup, theme);
            });
            _.each(theme.Layers, function (layer) {
                _mapService.UpdateLayerStatus(layer, theme);
            });
        };
        _mapService.UpdateGroupLayerStatus = function (groupLayer, theme) {
            _.each(groupLayer.Layers, function (childlayer) {
                _mapService.UpdateLayerStatus(childlayer, theme);
            });
        };

        _mapService.UpdateLayerStatus = function (layer, theme) {
            var visibleOnMap = theme.Visible && layer.visible && (layer.parent && layer.parent.visible || !layer.parent);
            var indexOfLayerInVisibleLayers = theme.VisibleLayers.indexOf(layer);
            if (visibleOnMap) {
                if (indexOfLayerInVisibleLayers === -1 && layer.enabled) {
                    // alleen maar toevoegen wnnr layer enabled en niet aanwezig al in de array!
                    theme.VisibleLayers.push(layer);
                    if (theme.Type == ThemeType.ESRI) {
                        MapData.VisibleLayers.push(layer);
                    }
                }
            } else {
                if (indexOfLayerInVisibleLayers > -1) {
                    theme.VisibleLayers.splice(indexOfLayerInVisibleLayers, 1);
                    if (theme.Type == ThemeType.ESRI) {
                        var indexOfLayerInVisibleLayersOfMap = MapData.VisibleLayers.indexOf(layer);
                        MapData.VisibleLayers.splice(indexOfLayerInVisibleLayersOfMap, 1);
                    }
                }
            }
        };
        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeHelper', '$q', 'GISService', 'WMSService', 'ResultsData'];
    module.factory('MapService', mapService);
})();
//# sourceMappingURL=mapService.js.map
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function service() {
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
                thema.Type = ThemeType.ESRI;
                thema.status = ThemeStatus.NEW;
                thema.MapData = {};
                _.each(rawlayers, function (x) {
                    x.visible = true;
                    x.enabled = true;
                    x.parent = null;
                    x.title = x.name;
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
                thema.UpdateMap = function () {
                    thema.RecalculateVisibleLayerIds();
                    thema.MapData.setLayers(thema.VisibleLayerIds);
                };

                thema.RecalculateVisibleLayerIds = function () {
                    thema.VisibleLayerIds.length = 0;
                    _.forEach(thema.VisibleLayers, function (visLayer) {
                        thema.VisibleLayerIds.push(visLayer.id);
                    });
                    if (thema.VisibleLayerIds.length === 0) {
                        thema.VisibleLayerIds.push(-1); //als we niet doen dan zoekt hij op alle lagen!
                    }
                };
                thema.RecalculateVisibleLayerIds();
            } catch (ex) {
                console.log('Error when creating theme from url: ' + getData.url + ' Exeption: ' + ex + ' Data: ');
                console.log(rawdata);
            }
            return thema;
        };
        return themeHelper;
    };
    module.$inject = ['map'];
    module.factory('ThemeHelper', service);
})();
//# sourceMappingURL=themeHelper.js.map
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service(map, ThemeHelper, MapData, LayerManagementService) {
        var _service = {};
        _service.AddAndUpdateThemes = function (themesBatch) {
            console.log('Themes batch for add and updates...');
            console.log(themesBatch);
            themesBatch.forEach(function (theme) {
                var existingTheme = MapData.Themes.find(function (x) {
                    return x.CleanUrl == theme.CleanUrl;
                });
                console.log(theme);
                console.log(theme.status);
                switch (theme.status) {
                    case ThemeStatus.NEW:
                        if (theme.Type == ThemeType.ESRI) {
                            LayerManagementService.SetAditionalLayerInfo(theme);
                        }
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
                        console.log('Er is iets fout, status niet bekend!!!: ' + theme.status);
                        break;
                }
                //Theme is proccessed, now make it unmodified again
                theme.status = ThemeStatus.UNMODIFIED;
            });
            console.log('refresh of sortableThemes');
            $('#sortableThemes').sortable('refresh');

            MapData.SetZIndexes();
        };
        _service.UpdateThemeVisibleLayers = function (theme) {
            theme.UpdateMap();
        };
        _service.UpdateTheme = function (updatedTheme, existingTheme) {
            //lets update the existingTheme
            for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
                var updatedLayer = updatedTheme.AllLayers[x];
                var existingLayer = existingTheme.AllLayers[x];

                //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
                if (updatedLayer.enabled && updatedLayer.visible) {
                    //eerst checken dat ze nog niet bestaan!.
                    if (existingTheme.Type == ThemeType.ESRI && MapData.VisibleLayers.indexOf(existingLayer) == -1) {
                        MapData.VisibleLayers.push(existingLayer);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
                        existingTheme.VisibleLayers.push(existingLayer);
                    }
                } else {
                    //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
                    if (existingTheme.Type == ThemeType.ESRI && MapData.VisibleLayers.indexOf(existingLayer) != -1) {
                        MapData.VisibleLayers.splice(MapData.VisibleLayers.indexOf(existingLayer), 1);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) != -1) {
                        existingTheme.VisibleLayers.splice(existingTheme.VisibleLayers.indexOf(existingLayer), 1);
                    }
                }
                existingLayer.enabled = updatedLayer.enabled;
                existingLayer.visible = updatedLayer.visible;
            }
            existingTheme.RecalculateVisibleLayerIds();
        };
        _service.AddNewTheme = function (theme) {
            MapData.Themes.unshift(theme);
            console.log('Adding THEME!!!', theme);
            _.each(theme.AllLayers, function (layer) {
                if (layer.enabled && layer.visible && layer.type === LayerType.LAYER && theme.Visible && (layer.parent == null || layer.parent == undefined || layer.parent.visible == true)) {
                    console.log("LAYERINFO: ", layer);
                    theme.VisibleLayers.push(layer);
                    if (theme.Type == ThemeType.ESRI) {
                        MapData.VisibleLayers.push(layer);
                    }
                }
            });
            theme.RecalculateVisibleLayerIds();

            switch (theme.Type) {
                case ThemeType.ESRI:
                    theme.MapData = L.esri.dynamicMapLayer({
                        maxZoom: 20,
                        minZoom: 1,
                        url: theme.CleanUrl,
                        opacity: 1,
                        layers: theme.VisibleLayerIds,
                        continuousWorld: true,
                        useCors: true
                    }).addTo(map);

                    theme.MapData.on('load', function (e) {
                        // console.log(MapData.Zindex);
                        // console.log('Load Fired for ' + theme.Naam);
                        if (theme.MapData._currentImage) {
                            theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log('Zindex on ' + theme.Naam + ' set to ' + theme.MapData.ZIndex);
                        }
                    });
                    // theme.MapData.on('loading', function(e) {
                    //     console.log('loading ' + theme.Naam);
                    // });
                    // theme.MapData.on('requeststart', function(obj) {
                    //     MapData.Loading++;
                    //     console.log(MapData.Loading + 'requeststart ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    // theme.MapData.on('requestend', function(obj) {
                    //     if (MapData.Loading > 0) {
                    //         MapData.Loading--;
                    //     }
                    //     console.log(MapData.Loading + 'requestend ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    break;
                case ThemeType.WMS:
                    theme.MapData = L.tileLayer.betterWms(theme.CleanUrl, {
                        maxZoom: 20,
                        minZoom: 1,
                        format: 'image/png',
                        layers: theme.VisibleLayerIds,
                        transparent: true,
                        continuousWorld: true,
                        useCors: true
                    }).addTo(map);
                    // theme.MapData.on('tileloadstart', function(obj) {
                    //     MapData.Loading++;
                    //     console.log(MapData.Loading + 'tileloadstart ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    // theme.MapData.on('tileerror', function(obj) {
                    //     // if (MapData.Loading > 0) {
                    //         MapData.Loading--;
                    //     // }
                    //     console.log('!!!!!!!!! ' + MapData.Loading + 'tileerror ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    // theme.MapData.on('tileload', function(obj) {
                    //     // if (MapData.Loading > 0) {
                    //         MapData.Loading--;
                    //     // }
                    //     console.log(MapData.Loading + 'tileload ' + theme.Naam);
                    //     $rootScope.$apply();

                    // });
                    theme.MapData.on('load', function (e) {
                        console.log('LOAD VAN ' + theme.Naam);
                        console.log(theme.MapData);
                        if (theme.MapData._container.childNodes) {
                            [].slice.call(theme.MapData._container.childNodes).forEach(function (imgNode) {
                                imgNode.style.zIndex = theme.MapData.ZIndex;
                            });
                            // theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log('Zindex on ' + theme.Naam + ' set to ' + theme.MapData.ZIndex);
                        }
                    });
                    break;
                default:
                    console.log('UNKNOW TYPE');
                    break;
            }

            // _mapService.UpdateThemeVisibleLayers(theme);
        };
        _service.CleanThemes = function () {
            while (MapData.Themes.length != 0) {
                console.log('DELETING THIS THEME', MapData.Themes[0]);
                _service.DeleteTheme(MapData.Themes[0]);
            }
            // MapData.Themes.length = 0;
            // MapData.VisibleLayers.length = 0;
            // MapData.VisibleLayers.unshift(MapData.defaultlayer);
        };

        _service.DeleteTheme = function (theme) {
            // theme.MapData.removeFrom(map);
            map.removeLayer(theme.MapData); // this one works with ESRI And leaflet
            var themeIndex = MapData.Themes.indexOf(theme);
            if (themeIndex > -1) {
                MapData.Themes.splice(themeIndex, 1);
            }
            theme.VisibleLayers.forEach(function (visLayer) {
                var visLayerIndex = MapData.VisibleLayers.indexOf(visLayer);
                if (visLayerIndex > -1) {
                    MapData.VisibleLayers.splice(visLayerIndex, 1);
                }
            });
            MapData.CleanSearch();
        };

        return _service;
    };
    module.$inject = ['map', 'ThemeHelper', 'MapData', 'LayerManagementService'];
    module.factory('ThemeService', service);
})();
//# sourceMappingURL=themeService.js.map
;'use strict';

L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

    // onAdd: function(map) {
    //     // Triggered when the layer is added to a map.
    //     //   Register a click listener, then do all the upstream WMS things
    //     L.TileLayer.WMS.prototype.onAdd.call(this, map);
    //     map.on('click', this.getFeatureInfo, this);
    // },

    // onRemove: function(map) {
    //     // Triggered when the layer is removed from a map.
    //     //   Unregister a click listener, then do all the upstream WMS things
    //     L.TileLayer.WMS.prototype.onRemove.call(this, map);
    //     map.off('click', this.getFeatureInfo, this);
    // },

    getFeatureInfo: function getFeatureInfo(latlng, layers) {
        // Make an AJAX request to the server and hope for the best
        var url = this.getFeatureInfoUrl(latlng, layers);
        // showResults = L.Util.bind(this.showGetFeatureInfo, this);
        var prom = $.ajax({
            url: url,
            success: function success(data, status, xhr) {
                // var err = typeof data === 'string' ? null : data;
                // showResults(err, latlng, data);
                // console.log(data);
                // var xmlstring = JXON.xmlToString(data);
                // var returnjson = JXON.stringToJs(xmlstring);

                // console.log(returnjson);
            },
            error: function error(xhr, status, _error) {
                // showResults(error);
            }
        });
        return prom;
    },

    getFeatureInfoUrl: function getFeatureInfoUrl(latlng, layers) {
        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: this.wmsParams.styles,
            transparent: this.wmsParams.transparent,
            version: this.wmsParams.version,
            format: this.wmsParams.format,
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: layers,
            query_layers: layers,
            buffer: 100,
            info_format: 'text/xml'
        };

        params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
        params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

        return this._url + L.Util.getParamString(params, this._url, true);
    }

});

// showGetFeatureInfo: function(err, latlng, content) {
//     if (err) { console.log(err); return; } // do nothing if there's an error

//     // Otherwise show the content in a popup, or something.
//     L.popup({ maxWidth: 800 })
//         .setLatLng(latlng)
//         .setContent(content)
//         .openOn(this._map);
// }
L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);
};
//# sourceMappingURL=L.js.map
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
// })();
"use strict";
//# sourceMappingURL=errorhandler.js.map
;'use strict';

L.drawVersion = '0.3.0-dev';

L.drawLocal = {
    draw: {
        toolbar: { actions: {
                title: 'Tekenen annuleren',
                text: 'Annuleren'
            },
            finish: {
                title: 'Tekenen beëindigen',
                text: 'Tekenen beëindigen'
            },
            undo: {
                title: 'Verwijder laatst getekende punt',
                text: 'Verwijder laatste punt'
            },
            buttons: {
                polyline: 'Teken een lijn',
                polygon: 'Teken een veelhoek',
                rectangle: 'Teken een rechthoek',
                circle: 'Teken een cirkel',
                marker: 'Teken een markering'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: 'Klik en sleep om een cirkel te tekenen.'
                },
                radius: 'Straal'
            },
            marker: {
                tooltip: {
                    start: 'Klik om een markering te plaatsen.'
                }
            },
            polygon: {
                tooltip: {
                    start: 'Klik om een veelhoek  te tekenen.',
                    cont: 'Klik om de veelhoek verder te tekenen.',
                    end: 'Klik op het eerste punt om de veelhoek te sluiten.'
                }
            },
            polyline: {
                error: '<strong>Error:</strong> figuur randen mogen niet kruisen!',
                tooltip: {
                    start: 'Klik om een lijn te tekenen.',
                    cont: 'Klik om de lijn verder te tekenen.',
                    end: 'Klik op het laatste punt om de lijn af te sluiten.'
                }
            },
            rectangle: {
                tooltip: {
                    start: 'Klik en sleep om een rechthoek te tekenen.'
                }
            },
            simpleshape: {
                tooltip: {
                    end: 'Laat de muis los om het tekenen te beëindigen.'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Aanpassingen bewaren.',
                    text: 'Bewaren'
                },
                cancel: {
                    title: 'Tekenen annuleren, aanpassingen verwijderen.',
                    text: 'Annuleren'
                }
            },
            buttons: {
                edit: 'Lagen bewerken.',
                editDisabled: 'Geen lagen om te bewerken.',
                remove: 'Lagen verwijderen.',
                removeDisabled: 'Geen lagen om te verwijderen.'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Versleep ankerpunt of markering om het object aan te passen.',
                    subtext: 'Klink Annuleer om de aanpassingen ongedaan te maken.'
                }
            },
            remove: {
                tooltip: {
                    text: 'Klik op object om te verwijderen'
                }
            }
        }
    }
};
//# sourceMappingURL=leafletDrawNL.js.map
;// (function() {
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
"use strict";
//# sourceMappingURL=logger.js.map
;angular.module('tink.gis').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/external/streetView.html',
    "<html> <head> <meta charset=utf-8> <title>Street View side-by-side</title> <style>html, body {\r" +
    "\n" +
    "        height: 100%;\r" +
    "\n" +
    "        margin: 0;\r" +
    "\n" +
    "        padding: 0;\r" +
    "\n" +
    "      }\r" +
    "\n" +
    "      #map,  {\r" +
    "\n" +
    "        float: left;\r" +
    "\n" +
    "        height: 0%;\r" +
    "\n" +
    "        width: 0%;\r" +
    "\n" +
    "      }\r" +
    "\n" +
    "       #pano {\r" +
    "\n" +
    "        float: left;\r" +
    "\n" +
    "        height: 100%;\r" +
    "\n" +
    "        width: 100%;\r" +
    "\n" +
    "      }</style> </head> <body> <div id=map></div> <div id=pano></div> <script>function initialize() {\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        var urlLat = parseFloat((location.search.split('lat=')[1]||'').split('&')[0]);\r" +
    "\n" +
    "        var urlLng = parseFloat((location.search.split('lng=')[1]||'').split('&')[0]);\r" +
    "\n" +
    "        var fenway = {lat:urlLat, lng: urlLng};\r" +
    "\n" +
    "        var map = new google.maps.Map(document.getElementById('map'), {\r" +
    "\n" +
    "          center: fenway,\r" +
    "\n" +
    "          zoom: 14\r" +
    "\n" +
    "        });\r" +
    "\n" +
    "        var panorama = new google.maps.StreetViewPanorama(\r" +
    "\n" +
    "            document.getElementById('pano'), {\r" +
    "\n" +
    "              position: fenway,\r" +
    "\n" +
    "              pov: {\r" +
    "\n" +
    "                heading: 34,\r" +
    "\n" +
    "                pitch: 10\r" +
    "\n" +
    "              }\r" +
    "\n" +
    "            });\r" +
    "\n" +
    "        map.setStreetView(panorama);\r" +
    "\n" +
    "      }</script> <script async defer src=\"https://maps.googleapis.com/maps/api/js?callback=initialize\"></script> </body> </html>"
  );


  $templateCache.put('templates/groupLayerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox id={{grplyrctrl.grouplayer.name}}{{grplyrctrl.grouplayer.id}} ng-model=grplyrctrl.grouplayer.visible ng-change=grplyrctrl.chkChanged()> <label for={{grplyrctrl.grouplayer.name}}{{grplyrctrl.grouplayer.id}}>{{grplyrctrl.grouplayer.name}}</label> <div ng-repeat=\"layer in grplyrctrl.grouplayer.Layers | filter :  { enabled: true }\"> <tink-layer layer=layer> </tink-layer> </div> </div>"
  );


  $templateCache.put('templates/layerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=lyrctrl.layer.visible ng-change=lyrctrl.chkChanged() id={{layer.name}}{{layer.id}}> <label for={{layer.name}}{{layer.id}}> {{layer.title | limitTo: 20}} <span ng-show=\"lyrctrl.layer.theme.Type == 'wms' && lyrctrl.layer.queryable\">(i)</span></label> </div>"
  );


  $templateCache.put('templates/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" id=rightaside data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <ul id=sortableThemes ui-sortable=lyrsctrl.sortableOptions ng-model=lyrsctrl.themes> <div ng-repeat=\"theme in lyrsctrl.themes\"> <tink-theme theme=theme> </tink-theme> </div> </ul> <button class=\"btn btn-primary addlayerbtn\" ng-click=lyrsctrl.AddLayers()>Voeg laag toe</button> </div> </aside> </div>"
  );


  $templateCache.put('templates/mapTemplate.html',
    "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('identify')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('select')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('meten')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='meten'}\" prevent-default><i class=\"fa fa-expand\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('watishier')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='watishier'}\" prevent-default><i class=\"fa fa-thumb-tack\"></i></button>  </div> <div class=\"btn-group ll metenbtns\" ng-show=mapctrl.showMetenControls> <button ng-click=\"mapctrl.drawingButtonChanged('afstand')\" ng-class=\"{active: mapctrl.drawingType=='afstand'}\" type=button class=btn prevent-default><i class=\"fa fa-arrows-h\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('oppervlakte')\" ng-class=\"{active: mapctrl.drawingType=='oppervlakte'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button> </div> <div class=\"btn-group ll drawingbtns\" ng-show=mapctrl.showDrawControls> <button ng-click=mapctrl.selectpunt() ng-class=\"{active: mapctrl.drawingType==''}\" type=button class=btn prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('lijn')\" ng-class=\"{active: mapctrl.drawingType=='lijn'}\" type=button class=btn prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('vierkant')\" ng-class=\"{active: mapctrl.drawingType=='vierkant'}\" type=button class=btn prevent-default><i class=\"fa fa-square-o\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('polygon')\" ng-class=\"{active: mapctrl.drawingType=='polygon'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers\" ng-model=mapctrl.selectedLayer ng-change=mapctrl.layerChange() ng-class=\"{invisible: mapctrl.activeInteractieKnop!='select' || mapctrl.SelectableLayers.length<=1}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==true}\" ng-click=mapctrl.toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==false}\" ng-click=mapctrl.toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=mapctrl.zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> <div class=\"ll loading\" ng-show=\"mapctrl.Loading > 0\"> <div class=loader></div> {{mapctrl.MaxLoading - mapctrl.Loading}}/ {{mapctrl.MaxLoading}} </div> </div> <tink-search></tink-search> <tink-layers></tink-layers> </div>"
  );


  $templateCache.put('templates/modals/addLayerModalTemplate.html',
    "<div> <div class=modal-header> <button type=button style=float:right data-ng-click=cancel()><i class=\"fa fa-times\"></i></button> <h4 class=model-title>Laag toevoegen </h4></div> <div class=modal-content> <div class=row> <div class=col-md-4> <input class=searchbox ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 1000}\" placeholder=\"Geef een trefwoord of een url in\">\n" +
    "<input disabled value=\"https://geodata.antwerpen.be/arcgissql/services/P_SiK/Groeninventaris/MapServer/WMSServer\"> <div ng-if=!searchIsUrl ng-repeat=\"theme in availableThemes\"> <div ng-click=geopuntThemeChanged(theme) ng-class=\"{'greytext': theme.Type != 'wms' &&  theme.Type != 'esri'}\"> {{theme.Naam}}\n" +
    "<i ng-if=\"theme.Added == true\" class=\"fa fa-check-circle\"></i>\n" +
    "<i ng-if=\"theme.Added == null\" class=\"fa fa-check-circle-o\"></i> </div> </div> <tink-pagination ng-hide=\"numberofrecordsmatched == 0\" tink-items-per-page-values=[5] tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination> </div> <div class=col-md-8> <div ng-if=searchIsUrl> <button ng-click=laadUrl()>Laad url</button> </div> <div ng-if=\"copySelectedTheme !== null && !searchIsUrl\"> <button ng-if=\"copySelectedTheme.Added != false\" data-ng-click=AddOrUpdateTheme()>Update</button> <p>{{copySelectedTheme.Description}}</p> <p><small><a ng-href={{copySelectedTheme.CleanUrl}} target=_blank>Details</a></small></p> <div class=layercontroller-checkbox> <input indeterminate-checkbox child-list=copySelectedTheme.AllLayers property=enabled type=checkbox ng-model=copySelectedTheme.enabled id={{copySelectedTheme.name}}> <label for={{copySelectedTheme.name}}> {{copySelectedTheme.name | limitTo: 99}}</label> <div ng-repeat=\"mainlayer in copySelectedTheme.Layers\"> <div class=layercontroller-checkbox> <input type=checkbox ng-model=mainlayer.enabled id={{mainlayer.name}}{{mainlayer.id}}> <label for={{mainlayer.name}}{{mainlayer.id}}> {{mainlayer.name | limitTo: 99}}</label> </div> </div> <div ng-repeat=\"groupLayer in copySelectedTheme.Groups\"> <div class=layercontroller-checkbox> <input indeterminate-checkbox child-list=groupLayer.Layers property=enabled type=checkbox ng-model=groupLayer.enabled id={{groupLayer.name}}{{groupLayer.id}}> <label for={{groupLayer.name}}{{groupLayer.id}}> {{groupLayer.name | limitTo: 99}}</label> <div ng-repeat=\"layer in groupLayer.Layers\"> <div class=layercontroller-checkbox> <input type=checkbox ng-model=layer.enabled ng-change=layer.chkChanged() id={{layer.name}}{{layer.id}}> <label for={{layer.name}}{{layer.id}}> {{layer.name | limitTo: 99}}</label> </div> </div> </div> </div> </div> <button ng-if=\"copySelectedTheme.Added == false\" data-ng-click=AddOrUpdateTheme()>Toevoegen</button> </div> </div> </div> </div> <div class=modal-footer> <button data-ng-click=ok()>Klaar</button> </div> </div>"
  );


  $templateCache.put('templates/search/searchResultsTemplate.html',
    "<div ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length > 0\"> <select ng-model=srchrsltsctrl.layerGroupFilter> <option value=geenfilter selected>Geen filter ({{srchrsltsctrl.features.length}})</option> <option ng-repeat=\"feat in srchrsltsctrl.featureLayers\" value={{feat}}>{{feat}} ({{srchrsltsctrl.aantalFeaturesMetType(feat)}})</option> </select> <ul ng-repeat=\"layerGroupName in srchrsltsctrl.featureLayers\"> <tink-accordion ng-if=\"srchrsltsctrl.layerGroupFilter=='geenfilter' || srchrsltsctrl.layerGroupFilter==layerGroupName \" data-start-open=true data-one-at-a-time=false> <tink-accordion-panel> <data-header> <p class=nav-aside-title>{{layerGroupName}} ({{srchrsltsctrl.aantalFeaturesMetType(layerGroupName)}})\n" +
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=pull-right><i class=\"fa fa-trash\"></i></button> </p>  </data-header> <data-content> <li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>  <a ng-if=!feature.hoverEdit ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue | limitTo : 23}}<br>DETAILS</a> <div ng-if=feature.hoverEdit> <a ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue}} <br>DETAILS</a>\n" +
    "<a prevent-default ng-click=srchrsltsctrl.deleteFeature(feature)><i class=\"fa fa-trash\"></i></a> </div> </li> </data-content> </tink-accordion-panel> </tink-accordion> </ul> <a ng-click=srchrsltsctrl.exportToCSV()>Export to CSV</a> </div>"
  );


  $templateCache.put('templates/search/searchSelectedTemplate.html',
    "<div ng-if=srchslctdctrl.selectedResult> <div class=row> <div class=col-md-4> <button class=\"pull-left srchbtn\" ng-if=srchslctdctrl.prevResult ng-click=srchslctdctrl.vorige()>Vorige</button> </div> <div class=col-md-4> <button class=srchbtn ng-click=srchslctdctrl.delete()>Delete</button> </div> <div class=col-md-4> <button class=\"pull-right srchbtn\" ng-if=srchslctdctrl.nextResult ng-click=srchslctdctrl.volgende()>Volgende</button> </div> </div> <div class=row ng-repeat=\"prop in srchslctdctrl.props\"> <div class=col-md-5> {{ prop.key}} </div> <div class=col-md-7 ng-if=\"prop.value.toLowerCase() != 'null'\"> <a ng-if=\" prop.value.indexOf( 'https://')==0 || prop.value.indexOf( 'http://')==0 \" ng-href={{prop.value}} target=_blank>Link</a> <div ng-if=\"prop.value.indexOf( 'https://') !=0 && prop.value.indexOf( 'http://') !=0 \">{{ prop.value }}</div> </div> </div> <div class=row> <div class=col-md-6> <button class=\"pull-left srchbtn\" ng-click=\"srchslctdctrl.toonFeatureOpKaart() \">Tonen</button> </div> <div class=col-md-6 ng-show=\"srchslctdctrl.selectedResult.theme.Type === 'esri'\"> <button class=\"pull-right srchbtn\" ng-click=\" \">Buffer</button> </div> </div> <button class=srchbtn ng-click=\"srchslctdctrl.close(srchslctdctrl.selectedResult) \">Terug naar resultaten</button> </div>"
  );


  $templateCache.put('templates/search/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" id=leftaside data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section ng-show=\"srchctrl.Loading == 0\"> <tink-search-results></tink-search-results> <tink-search-selected></tink-search-selected> </div> <div class=nav-aside-section ng-show=\"srchctrl.Loading > 0\"> <div class=loader></div> {{srchctrl.MaxLoading - srchctrl.Loading}}/ {{srchctrl.MaxLoading}} </div> </aside> </div>"
  );


  $templateCache.put('templates/themeTemplate.html',
    "<div> <input class=visible-box type=checkbox id=chk{{thmctrl.theme.Naam}} ng-model=thmctrl.theme.Visible ng-change=thmctrl.chkChanged()> <label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} <span ng-show=\"thmctrl.theme.Type=='esri'\">(stad)</span><span ng-hide=\"thmctrl.theme.Type=='esri'\">({{thmctrl.theme.Type}})</span></label><i class=\"fa fa-trash pull-right\" ng-click=thmctrl.deleteTheme()></i> <div class=layercontroller-checkbox ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\"> <tink-layer layer=layer> </tink-layer> </div> <div class=layercontroller-checkbox ng-repeat=\"group in thmctrl.theme.Groups | filter: { enabled: true }\"> <tink-grouplayer grouplayer=group> </tink-grouplayer> </div> </div>"
  );

}]);
