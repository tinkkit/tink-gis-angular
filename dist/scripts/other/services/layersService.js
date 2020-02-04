'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', ['ui.sortable']]); //'leaflet-directive'
    }
    var layersService = function layersService() {
        var _layersService = {};
        return _layersService;
    };
    module.$inject = [];
    module.factory('LayersService', layersService);
})();
