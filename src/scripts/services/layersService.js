'use strict';


(function () {

    var module = angular.module('tink.gis.angular');
    var layersService = function () {
        var _layersService = {};
        _layersService.CurrentLayers = [6]
       

        return _layersService;
    };

    module.factory("LayersService", layersService);
})();