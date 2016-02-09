'use strict';
(function (module) {
    module = angular.module('tink.gis.angular');
    module.controller('themeController',
        function ($scope) {
            $scope.$on('visChangedEvent', function (event, layer) { // stuur het door naar het thema
                addOrRemoveVisibleLayer(layer);
            });
            var addOrRemoveVisibleLayer = function (layer) {
                if (layer.visible) {
                    $scope.theme.VisibleLayersIds.push(layer.id)
                }
                else {
                    var index = $scope.theme.VisibleLayersIds.indexOf(layer.id);
                    if (index > -1) {
                        $scope.theme.VisibleLayersIds.splice(index, 1);
                    }
                }
            };
        });
})();