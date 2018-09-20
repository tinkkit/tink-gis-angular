'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }

    var popupService = function () {
        var _popupService = {};
        _popupService.Init = function () {
            toastr.options.timeOut = 0; // How long the toast will display without user interaction, when timeOut and extendedTimeOut are set to 0 it will only close after user has clocked the close button
            toastr.options.extendedTimeOut = 0; // How long the toast will display after a user hovers over it
            toastr.options.closeButton = true;
        }();
        _popupService.popupGenerator = function (type, title, message, callback, options) {
            var messagetype = type.toLowerCase().trim();
            if (messagetype != 'error' && messagetype != 'warning' && messagetype != 'info' && messagetype != 'success') {
                throw "Invalid toastr type(info, error, warning,  success): " + messagetype
            }
            if (!options) {
                options = {}
            }
            if (!options.timeOut) {
                options.timeOut = 3000;
            }
            if (!options.extendedTimeOut) {
                options.extendedTimeOut = 0;
            }
            if (callback) {
                options.onclick = callback;
            }
            toastr[messagetype](message, title, options);
        }
        _popupService.ExceptionFunc = function (exception) {
            console.log(exception);
        };
        _popupService.ErrorWithException = function (title, message, exception, options) {
            var callback = function () { _popupService.ExceptionFunc(exception) };
            _popupService.Error(title, message, callback, options)
        };
        _popupService.ErrorFromHttp = function (data, status, url) {
            _popupService.ErrorFromHTTP(data, status, url);
        };
        _popupService.ErrorFromHTTP = function (data, status, url) {
            if (!status) { // if no status code is given, it is most likely in the body of data
                status = data.code;
            }
          
            var title = 'HTTP error (' + status + ')';
            var baseurl = url.split('/').slice(0, 3).join('/');
            var message = 'Fout met het navigeren naar url: ' + baseurl;
            var exception = { url: url, status: status, data: data };
            var callback = function () { _popupService.ExceptionFunc(exception) };
            
            if (status == -1 && url.includes("reversedgeocode-p.antwerpen.be")){
                title = "ReversedGeocoding Error (status " + status + ")";
                message = "Er is geen adres binnen Antwerpen in de buurt van deze coördinaten.";
            }

            if(baseurl == "https://metadata.geopunt.be"){
                title = "Geopunt Error (status " + status + ")";
                message = "De geopunt service(s) die u probeert te bevragen zijn (tijdelijk) niet bereikbaar.";
            }
            if(status == 403) {
                title = "Onvoldoende rechten"
                if(url.includes("service")) {
                    
                }
                message = "U hebt geen rechten om het thema " + url + " te raadplegen";
                callback = function () { 
                    var win = window.open('https://um.antwerpen.be/main.aspx', '_blank');
                    win.focus();
                 };
                 var options = {};
                 options.timeOut = 10000;
                _popupService.popupGenerator('Warning', title, message, callback, options);
            }
            else
            {
                _popupService.Error(title, message, callback);
            }
        };
        _popupService.Error = function (title, message, callback, options) {
            _popupService.popupGenerator('Error', title, message + "\nKlik hier om te melden.", callback, options)
        };
        _popupService.Warning = function (title, message, callback, options) {
            _popupService.popupGenerator('Warning', title, message, callback, options)
        };
        _popupService.Info = function (title, message, callback, options) {
            _popupService.popupGenerator('Info', title, message, callback, options)
        };
        _popupService.Success = function (title, message, callback, options) {
            if (!options) {
                options = {};
            }
            if (!options.closeButton) {
                options.closeButton = false;
            }
            _popupService.popupGenerator('Success', title, message, callback, options)
        };
        return _popupService;
    };
    module.factory('PopupService', popupService);
})();
