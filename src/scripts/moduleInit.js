try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', [ 'tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
}
module.constant('appConfig', {
    templateUrl: "/digipolis.stadinkaart.webui",
    apiUrl: "/digipolis.stadinkaart.api/",
    enableDebug: true,
    enableLog: true
});
module.directive('button', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            // if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            // }
        }
   };
});
// var Leaflet = function () {
//     console.log('L CTOR');
// 
// 
//     return L;
// };
// 
// module.factory("Leaflet", Leaflet);