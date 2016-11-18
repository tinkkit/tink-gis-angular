'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    // module.$inject = ['MapData', 'map', 'GISService', 'ThemeCreater', 'WMSService', 'ThemeService', '$q','BaseLayersService'];

    var popupService = function (MapData, map, GISService, ThemeCreater, WMSService, ThemeService, $q, BaseLayersService) {
        var _popupService = {};
        _popupService.Init = function () {
            toastr.options.timeOut = 10000; // How long the toast will display without user interaction
            toastr.options.extendedTimeOut = 10000; // How long the toast will display after a user hovers over it
            toastr.options.closeButton = true;
        } ();
        _popupService.popupGenerator = function (type, message, title, callback, options) {
            var messagetype = type.toLowerCase().trim();
            if (messagetype != 'error' && messagetype != 'warning' && messagetype != 'info' && messagetype != 'success') {
                throw "Invalid toastr type(info, error, warning,  success): " + messagetype
            }
            if (!options) {
                options = {}
            }
            if (callback) {
                options = { onclick: callback }
            }
            toastr[messagetype](message, null, options);
        }
        _popupService.Error = function (message, title, callback, options) {
            _popupService.popupGenerator('Error', message, title, callback, options)
        };
        _popupService.Warning = function (message, title, callback, options) {
            _popupService.popupGenerator('Warning', message, title, callback, options)
        };
        _popupService.Info = function (message, title, callback, options) {
            _popupService.popupGenerator('Info', message, title, callback, options)
        };
        _popupService.Success = function (message, title, callback, options) {
            _popupService.popupGenerator('Success', message, title, callback, options)
        };
        return _popupService;
    };
    module.factory('PopupService', popupService);
})();
