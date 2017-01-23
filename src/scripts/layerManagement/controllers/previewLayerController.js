'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('previewLayerController', ['$scope',
        function ($scope) {
            $scope.delTheme = function() {
                $scope.theme.AllLayers.forEach(lay => {
                    lay.enabled = false;
                })
                $scope.addorupdatefunc();
            }
        }]);
})();