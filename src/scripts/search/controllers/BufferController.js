'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('BufferController', ['$scope', '$modalInstance', 'MapData',
        function ($scope, $modalInstance, MapData) {
            var vm = this;
            $scope.buffer = 100;
            $scope.SelectableLayers = angular.copy(MapData.VisibleLayers);
            $scope.SelectableLayers.shift();
            $scope.selectedLayer = $scope.SelectableLayers[0];
            $scope.ok = function () {
                $modalInstance.$close($scope.buffer, $scope.selectedLayer); // return the themes.
            };
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();

