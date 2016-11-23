'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    // module.$inject = ['MapData', 'map', 'GISService', 'ThemeCreater', 'WMSService', 'ThemeService', '$q','BaseLayersService'];

    var popupService = function () {
        var _popupService = {};
        _popupService.Init = function () {
            toastr.options.timeOut = 10000; // How long the toast will display without user interaction
            toastr.options.extendedTimeOut = 10000; // How long the toast will display after a user hovers over it
            toastr.options.closeButton = true;
        } ();
        _popupService.popupGenerator = function (type, title, message, callback, options) {
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
            toastr[messagetype](message, title, options);
        }
        _popupService.ExceptionFunc = function (exception) {
            console.log(exception);
        };
        _popupService.ErrorWithException = function (title, message, exception, options) {
            var callback = function () { _popupService.ExceptionFunc(exception) };
            _popupService.popupGenerator('Error', title, message, callback, options)
        };
        _popupService.Error = function (title, message, callback, options) {
            _popupService.popupGenerator('Error', title, message, callback, options)
        };
        _popupService.Warning = function (title, message, callback, options) {
            _popupService.popupGenerator('Warning', title, message, callback, options)
        };
        _popupService.Info = function (title, message, callback, options) {
            _popupService.popupGenerator('Info', title, message, callback, options)
        };
        _popupService.Success = function (title, message, callback, options) {
            _popupService.popupGenerator('Success', title, message, callback, options)
        };
        return _popupService;
    };
    module.factory('PopupService', popupService);
})();
