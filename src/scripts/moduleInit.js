(function () {

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
    var mapObject = function () {
        var map = L.map('map', {
            center: [51.2192159, 4.4028818],
            zoom: 16,
            layers: L.tileLayer('http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}', { id: 'kaart' }),
            zoomControl: false
        });
        map.doubleClickZoom.disable();
        L.control.scale({ imperial: false }).addTo(map);
        return map;
    }
    module.factory("map", mapObject);
    console.log('init done');
})();