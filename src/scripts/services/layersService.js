'use strict';
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
})();