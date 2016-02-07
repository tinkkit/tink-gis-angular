try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', ['leaflet-directive', 'tink.accordion', 'tink.tinkApi']);
}
module.constant('appConfig', {
    templateUrl: "/digipolis.stadinkaart.webui",
    apiUrl: "/digipolis.stadinkaart.api/",
    enableDebug: true,
    enableLog: true
});