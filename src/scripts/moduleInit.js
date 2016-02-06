try {
    module = angular.module('tink.gis.angular');
} catch (e) {
    module = angular.module('tink.gis.angular', ['leaflet-directive', 'tink.accordion', 'tink.tinkApi']);
}