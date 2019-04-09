'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    var service = function service() {
        var _service = {};
        _service.OpenLeftSide = function () {
            var html = $('html');
            if (!html.hasClass('nav-left-open')) {
                html.addClass('nav-left-open');
            }
        };
        _service.CloseLeftSide = function () {
            var html = $('html');
            if (html.hasClass('nav-left-open')) {
                html.removeClass('nav-left-open');
            }
        };
        _service.OpenRightSide = function () {
            var html = $('html');
            if (!html.hasClass('nav-right-open')) {
                html.addClass('nav-right-open');
            }
        };
        _service.CloseRightSide = function () {
            var html = $('html');
            if (html.hasClass('nav-right-open')) {
                html.removeClass('nav-right-open');
            }
        };

        return _service;
    };
    module.factory('UIService', service);
})();
