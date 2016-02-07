'use strict';
(function () {
    try {
        var module = angular.module('tink.gis.angular');
    } catch (e) {
        var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function (map) {
        var _mapService = {};



        _mapService.currentLayers = [6]
        _mapService.IdentifiedItems = [];
        _mapService.visibleFeatures = [];
        _mapService.jsonFeatures = [];

        return _mapService;
    };

    mapService.$inject = ['map'];

    module.factory('MapService', mapService);
})();