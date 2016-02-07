try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
}
module.constant('appConfig', {
    templateUrl: "/digipolis.stadinkaart.webui",
    apiUrl: "/digipolis.stadinkaart.api/",
    enableDebug: true,
    enableLog: true
});
module.directive('preventDefault', function () {
    return function (scope, element, attrs) {
        angular.element(element).bind('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
        angular.element(element).bind('dblclick', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

    }
});

var helperService = function () {
    var map = {};
    return map;
}


module.factory("map", helperService);