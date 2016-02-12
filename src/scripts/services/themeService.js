'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis.angular');
    } catch (e) {
        module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function (map, ThemeHelper) {
        var _service = {};
        return _service;
    };
    module.$inject = ['map', 'ThemeHelper'];
    module.factory('ThemeService', service);
})();
