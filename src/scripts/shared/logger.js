(function() {

    'use strict';

    var componentName = "Logger";
    var theComponent = function($log, appConfig) {

        function _success(message) {
            if (appConfig.enableLog) {
                $log.log(message);
            }
        }

        function _debug(message) {
            if (appConfig.enableLog) {
                if (appConfig.enableDebug) {
                    $log.debug(message);
                }
            }
        }

        function _info(message) {
            if (appConfig.enableLog) {
                $log.info(message);
            }
        }

        function _warn(message) {
            if (appConfig.enableLog) {
                $log.warn(message);
            }
        }

        function _error(message) {
            if (appConfig.enableLog) {
                $log.error(message);
            }
        }

        function _creation(name) {
            _debug(name + " : gecreëerd.");
        }

        function _initialization(name) {
            _debug(name + " : geïnitialiseerd.");
        }

        /* +++++ public interface +++++ */

        return {
            success: _success,
            debug: _debug,
            info: _info,
            warn: _warn,
            error: _error,
            creation: _creation,
            init: _initialization
        };

    };

    theComponent.$inject = ['$log', 'appConfig'];

    angular.module('tink.gis.angular').factory(componentName, theComponent);

})();