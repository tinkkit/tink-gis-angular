'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('previewLayerController', ['$scope', function ($scope) {
        $scope.delTheme = function () {
            $scope.theme.AllLayers.forEach(function (lay) {
                lay.enabled = false;
            });
            $scope.addorupdatefunc();
        };
        // var vm = this;
        // vm.theme = $scope.theme;
        // console.log("previewLayerController INIT", $scope.theme);
        // $scope.$watch('theme', function (theme) {
        //     console.log('WATCH HAPPENED', $scope.theme);
        //     // vm.theme = $scope.theme;
        // })
    }]);
})();
