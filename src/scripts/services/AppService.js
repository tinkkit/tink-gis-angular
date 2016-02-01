(function() {

    'use strict';

    var componentName = "AppService";
    var theComponent = function(logger) {

        var _previousRoute = "/";

        function _setPreviousRoute(route) {
            _previousRoute = route;
        };

        function _getPreviousRoute() {
            return _previousRoute;
        };

        /* +++++ public interface +++++ */

        logger.creation(componentName);

        return {
            logger: logger,
            anonymousUrls: new Array(),
            setPreviousRoute: _setPreviousRoute,
            getPreviousRoute: _getPreviousRoute
        };

    }

    theComponent.$inject = ['Logger'];

    var appServiceModule = angular.module('tink.gis.angular', []);

    appServiceModule.factory(componentName, theComponent);

})();