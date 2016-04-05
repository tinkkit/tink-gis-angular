/// <reference path="../../typings/tsd.d.ts"/>

'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var init = function() {
        // var abc = _.forEach([], function (x){});
        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
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
    } ();
    var mapObject = function() {

        // var crsLambert = new L.Proj.CRS('EPSG:31370', "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs", {
        //     origin: [51000, 132000],
        //     resolutions: [
        //         66.1459656252646,
        //         52.91677250021167,
        //         39.687579375158755,
        //         26.458386250105836,
        //         13.229193125052918,
        //         6.614596562526459,
        //         5.291677250021167,
        //         3.9687579375158752,
        //         3.3072982812632294,
        //         2.6458386250105836,
        //         1.9843789687579376,
        //         1.3229193125052918,
        //         0.6614596562526459,
        //         0.5291677250021167,
        //         0.39687579375158755,
        //         0.33072982812632296,
        //         0.26458386250105836,
        //         0.19843789687579377,
        //         0.13229193125052918,
        //         0.06614596562526459,
        //         0.026458386250105836
        //     ]
        //     // resolutions: [
        //     //     250000,
        //     //     200000,
        //     //     150000,
        //     //     100000,
        //     //     50000,
        //     //     25000,
        //     //     20000,
        //     //     15000,
        //     //     12500,
        //     //     10000,
        //     //     7500,
        //     //     5000,
        //     //     2500,
        //     //     2000,
        //     //     1500,
        //     //     1250,
        //     //     1000,
        //     //     750,
        //     //     500,
        //     //     250,
        //     //     100
        //     // ]
        // });
        var map = L.map('map', {
            center: [51.2192159, 4.4028818],
            zoom: 17,
            // crs: crsLambert,
            maxZoom: 19,
            minZoom: 0,
            // maxZoom: 21,
            // minZoom: 10,
            // layers: L.tileLayer('http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap_wgs84/MapServer', { id: 'kaart' }),
            layers: L.tileLayer('https://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v10/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' }),
            // layers: L.tileLayer('http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' }),
            // layers: L.esri.tiledMapLayer({ url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer', id: 'kaart' }),
            zoomControl: false,
            drawControl: false
        });
        // var url = 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer/WMTS';
        // var layerIGNScanStd = "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD";

        // var wmts = new L.TileLayer.WMTS(url,
        //     {
        //         layer: 'P_Publiek_P_basemap',
        //         style: "normal",
        //         tilematrixSet: "PM",
        //         format: "image/png",
        //     });
        // map.addLayer(wmts);
        // L.tileLayer({
        //     url: 'http://app11.p.gis.local/arcgissql/rest/services/P_Publiek/P_basemap/MapServer/',
        //     // url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap_wgs84/MapServer',
        //     maxZoom: 20,
        //     continuousWorld: true,
        //     minZoom: 0,
        // }).addTo(map);

        map.doubleClickZoom.disable();
        L.control.scale({ imperial: false }).addTo(map);
        var drawnItems = L.featureGroup().addTo(map);
        map.on('draw:created', function(event) {
            var layer = event.layer;
            drawnItems.addLayer(layer);
        });
        map.on('draw:drawstart', function(event) {
            //console.log(drawnItems);
            //map.clearDrawings();
        });
        map.clearDrawings = function() {
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