'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    var service = function () {
        var _service = {};
        _service.OpenLeftSide = function () {
            let html = $('html');
            if (!html.hasClass('nav-left-open')) {
                html.addClass('nav-left-open');
            }
        };

        return _service;
    };
    // module.$inject = ['$http', 'map'];
    module.factory('UIService', service);
})();