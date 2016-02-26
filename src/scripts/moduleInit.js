'use strict';
(function () {
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
            maxZoom: 21,
            minZoom: 10,
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