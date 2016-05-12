'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter','ngLodash','tink.safeApply']); //'leaflet-directive'
    }
    module.constant('appConfig', {
        templateUrl: "/digipolis.stadinkaart.webui",
        apiUrl: "/digipolis.stadinkaart.api/",
        enableDebug: true,
        enableLog: true
    });
    module.directive('tinkPagination', ['lodash', function (_) {
        return {
            restrict: 'EA',
            templateUrl: 'templates/pagination.html',
            scope: {
                tinkTotalItems: '=',
                tinkItemsPerPage: '=',
                tinkItemsPerPageValues: '=',
                tinkCurrentPage: '=',
                tinkChange: '&',
                tinkPaginationId: '@'
            },
            controllerAs: 'ctrl',
            controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, timeout) {
                var ctrl = this;

                //ctrl.init = function(){
                /*ctrl.tinkTotalItems = $scope.tinkTotalItems;
                $scope.tinkItemsPerPage = $scope.tinkItemsPerPage;
                $scope.tinkItemsPerPageValues = $scope.tinkItemsPerPageValues;
                $scope.tinkCurrentPage =  $scope.tinkCurrentPage;
              //}*/
                ctrl.itemsPerPage = function () {
                    if ($scope.tinkItemsPerPageValues && $scope.tinkItemsPerPageValues instanceof Array && $scope.tinkItemsPerPageValues.length > 0) {
                        if ($scope.tinkItemsPerPageValues.indexOf(parseInt($scope.tinkItemsPerPage)) === -1) {
                            $scope.tinkItemsPerPage = $scope.tinkItemsPerPageValues[0];
                        }
                        return $scope.tinkItemsPerPageValues;
                    } else {
                        var basic = [5, 10, 20, 30];
                        if (basic.indexOf(parseInt($scope.tinkItemsPerPage)) === -1) {
                            $scope.tinkItemsPerPage = basic[0];
                        }
                        return basic;
                    }
                };


                ctrl.perPageChange = function () {
                    $rootScope.$broadcast('tink-pagination-' + $scope.tinkPaginationId, 'loading');
                    timeout(function () {
                        $scope.tinkChange({
                            page: $scope.tinkCurrentPage, perPage: $scope.tinkItemsPerPage, next: function () {
                                $rootScope.$broadcast('tink-pagination-' + $scope.tinkPaginationId, 'ready');
                            }
                        });
                    }, 0);
                };

                ctrl.setPage = function (page) {
                    $scope.tinkCurrentPage = page;
                    sendMessage();
                };


                ctrl.setPrev = function () {
                    if ($scope.tinkCurrentPage > 1) {
                        $scope.tinkCurrentPage = $scope.tinkCurrentPage - 1;
                    }
                    sendMessage();
                };

                ctrl.setNext = function () {
                    if ($scope.tinkCurrentPage < ctrl.pages) {
                        $scope.tinkCurrentPage = $scope.tinkCurrentPage + 1;
                    }
                    sendMessage();
                };

                function sendMessage() {
                    $rootScope.$broadcast('tink-pagination-' + $scope.tinkPaginationId, 'loading');
                    timeout(function () {
                        $scope.tinkChange({
                            page: $scope.tinkCurrentPage, perPage: $scope.tinkItemsPerPage, next: function () {
                                $rootScope.$broadcast('tink-pagination-' + $scope.tinkPaginationId, 'ready');
                            }
                        });
                    }, 0);
                }

                ctrl.calculatePages = function () {
                    var num = $scope.tinkCurrentPage;
                    ctrl.pages = Math.ceil($scope.tinkTotalItems / $scope.tinkItemsPerPage);
                    if (ctrl.pages <= 0 || ctrl.pages === undefined || ctrl.pages === null || isNaN(ctrl.pages)) {
                        ctrl.pages = 1;
                    }

                    if (num > ctrl.pages) {
                        num = $scope.tinkCurrentPage = ctrl.pages;
                    } else if (num <= 0 || num === undefined || num === null) {
                        $scope.tinkCurrentPage = 1;
                    }

                    var arrayNums;
                    if (ctrl.pages < 6) {
                        arrayNums = _.range(2, ctrl.pages);
                    } else {
                        if (num < 4) {
                            arrayNums = _.range(2, 4);
                            arrayNums.push(-1);
                        } else if (num >= ctrl.pages - 2) {
                            arrayNums = [-1].concat(_.range(ctrl.pages - 2, ctrl.pages));
                        } else {
                            arrayNums = [-1, num, -1];
                        }
                    }
                    if (ctrl.pages > 1) {
                        arrayNums.push(ctrl.pages);
                    }
                    return arrayNums;
                };

            }]
        };
    }]).filter('limitNum', [function () {
        return function (input, limit) {
            if (input > limit) {
                return limit;
            }
            return input;
        };
    }])
        .filter('tinkMin', [function () {
            return function (input, limit) {
                if (limit === undefined) {
                    limit = 0;
                }
                if (input === undefined || input === null) {
                    return 0;
                }

                if (input < limit) {
                    return limit;
                }
                return input;
            };
        }])
        .filter('tinkNumber', [function () {
            return function (input, limit) {
                if (limit === undefined) {
                    limit = 0;
                }
                if (input < limit) {
                    return limit;
                }
                return input;
            };
        }]).directive('tinkPaginationKey', ['$rootScope', function (rootScope) {
            return {
                link: function ($scope, element, attrs) {

                    rootScope.$on('tink-pagination-' + attrs.tinkPaginationKey, function (e, value) {

                        var table;
                        if (element[0].tagName === 'TABLE') {
                            table = $(element[0]);
                        } else {
                            table = $(element).find('table');
                        }
                        if (value === 'loading') {
                            table.addClass('is-loading');
                        } else if (value === 'ready') {
                            table.removeClass('is-loading');
                        }

                    });

                }
            };

        }]);
    module.run(['$templateCache', function ($templateCache) {
        'use strict';

        $templateCache.put('templates/pagination.html',
            "<div class=table-sort-options> <div class=table-sort-info> <strong>{{tinkTotalItems > 0 ? (tinkItemsPerPage*(tinkCurrentPage-1)+1 | number:0) : '0'}} - {{tinkTotalItems > 0 ? (tinkItemsPerPage*tinkCurrentPage | limitNum:tinkTotalItems | tinkMin:0 | number:0) : '0'}}</strong> van <span class=table-total-rows-info>{{tinkTotalItems | tinkMin:0 | number:0}}</span> <div class=select> <select data-ng-change=ctrl.perPageChange() data-ng-model=tinkItemsPerPage ng-options=\"o as o for o in ctrl.itemsPerPage()\">> </select> </div> items per pagina </div> <div class=table-sort-pagination> <div class=\"btn-group btn-group-sm\"> <a href=\"\" class=\"btn prev\" data-ng-class=\"{disabled:tinkCurrentPage===1}\" data-ng-click=\"tinkCurrentPage===1 || ctrl.setPrev()\" ng-disabled=\"tinkCurrentPage===1\"><span>Vorige</span></a>\n" +
            "<a href=\"\" class=btn data-ng-class=\"{active:tinkCurrentPage===1}\" data-ng-click=ctrl.setPage(1)><span>1</span></a>\n" +
            "<a href=\"\" class=btn data-ng-repeat=\"pag in ctrl.calculatePages() track by $index\" data-ng-class=\"{active:pag===tinkCurrentPage}\" data-ng-click=\"pag === -1 || ctrl.setPage(pag)\"><span data-ng-if=\"pag !== -1\">{{pag | number:0}}</span> <span data-ng-show=\"pag === -1\">…<span></span></span></a>\n" +
            "<a href=\"\" class=\"btn next\" data-ng-click=\"tinkCurrentPage===ctrl.pages || ctrl.setNext()\" data-ng-class=\"{disabled:tinkCurrentPage===ctrl.pages}\" ng-disabled=\"tinkCurrentPage===ctrl.pages\"><span>Volgende</span></a> </div> </div> </div>"
        );
    }]);
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
        attrPrefix: '',              // default: '@'
        // lowerCaseTags: false,         // default: true
        // trueIsEmpty: false,           // default: true
        autoDate: false              // default: true
        // ignorePrefixedNodes: false,   // default: true
        // parseValues: false            // default: true
    });
    var init = function () {
        // var abc = _.forEach([], function (x){});
        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    } ();
    var mapObject = function () {
        var crsLambert = new L.Proj.CRS('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438'
            + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs', {
                origin: [-35872700, 41422700],
                resolutions: [
                    66.1459656252646,
                    52.91677250021167,
                    39.687579375158755,
                    26.458386250105836,
                    13.229193125052918,
                    6.614596562526459,
                    5.291677250021167,
                    3.9687579375158752,
                    3.3072982812632294,
                    2.6458386250105836,
                    1.9843789687579376,
                    1.3229193125052918,
                    0.6614596562526459,
                    0.5291677250021167,
                    0.39687579375158755,
                    0.33072982812632296,
                    0.26458386250105836,
                    0.19843789687579377,
                    0.13229193125052918,
                    0.06614596562526459,
                    0.026458386250105836
                ]
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
        L.control.scale({ imperial: false }).addTo(map);
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
            console.log("clearingDrawings");
            console.log(drawnItems);
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
const DrawingOption = {
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