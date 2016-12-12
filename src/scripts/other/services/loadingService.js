'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var loadingService = function () {
        var _loadingService = {};
        _loadingService.Init = function () {
            toastr.options.timeOut = 5000; // How long the toast will display without user interaction
            toastr.options.extendedTimeOut = 10000; // How long the toast will display after a user hovers over it
            toastr.options.closeButton = true;
        } ();

        _loadingService.ShowLoading = function () {
            let html = $('html');
            if (!html.hasClass('show-loader')) {
                html.addClass('show-loader');
            }
        };
        _loadingService.HideLoading = function () {
            let html = $('html');
            if (html.hasClass('show-loader')) {
                html.removeClass('show-loader');
            }
        };
        return _loadingService;
    };
    module.factory('LoadingService', loadingService);
})();
