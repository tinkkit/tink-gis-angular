'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.navigation', 'tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination', 'tink.tooltip', 'ngAnimate']); //'leaflet-directive'
    }





    JXON.config({
        attrPrefix: '',              // default: '@'
        autoDate: false              // default: true
    });
    var init = function () {
        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
        // L.Browser.touch = false; // no touch support!
    }();
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
            drawControl: false,
            attributionControl: false
        }).setView([51.2192159, 4.4028818], 5);
        L.control.scale({ imperial: false }).addTo(map); // set scale on the map






        map.doubleClickZoom.disable();
        // L.control.scale({ imperial: false }).addTo(map); // can be deleted?
        map.featureGroup = L.featureGroup().addTo(map);
        map.extendFeatureGroup = L.featureGroup().addTo(map);

        map.on('draw:created', function (event) {
            // var layer = event.layer;
            // map.featureGroup.addLayer(layer);
        });
        map.on('draw:drawstart', function (event) {
            console.log("draw started");
            //console.log(drawnItems);
            //map.clearDrawings();
        });
        map.addToDrawings = function (layer) {
            map.featureGroup.addLayer(layer);
        };
        map.clearDrawings = function () {
            map.featureGroup.clearLayers();
            map.extendFeatureGroup.clearLayers();
        }

        return map;
    }
    module.factory('map', mapObject);
    module.directive('preventDefaultMap', function (map) {
        return {
            link: function (scope, element, attrs) {
                L.DomEvent.disableClickPropagation(element.get(0));
                element.on('dblclick', function (event) {
                    event.stopPropagation();
                });
                element.on('mousemove', function (event) {
                    event.stopPropagation();
                });
            }
        }
    });
    module.directive('preventDefault', function (map) {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                element.on('dblclick', function (event) {
                    event.stopPropagation();
                });
                element.on('mousemove', function (event) {
                    event.stopPropagation();
                });
            }
        }
    });
    module.directive('autoFocus', function ($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 0);
            }
        };
    });
    // module.filter('strLimit', ['$filter', function ($filter) {

    //     return function (input, limit) {
    //         if (!input) return;
    //         if (input.length <= limit) {
    //             return input;
    //         }
    //         return $filter('limitTo')(input, limit) + '...';
    //     };
    // }]);
})();
