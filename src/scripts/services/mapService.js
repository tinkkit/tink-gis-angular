'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var mapService = function () {
        var _mapService = {};

        

        _mapService.currentLayers = [6];
        _mapService.IdentifiedItems = [];
        _mapService.visibleFeatures = [];
        _mapService.jsonFeatures = [];

        return _mapService;
    };


    module.factory('MapService', mapService);
})();