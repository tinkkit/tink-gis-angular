'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('BufferController', ['$scope', '$modalInstance', 'MapData', function ($scope, $modalInstance, MapData) {
        var vm = this;
        $scope.buffer = MapData.LastBufferedDistance;
        $scope.SelectableLayers = angular.copy(MapData.VisibleLayers);
        $scope.SelectableLayers.shift(); // remove the alllayers for buffer
        var bufferDefault = MapData.LastBufferedLayer || MapData.DefaultLayer;
        if (bufferDefault) {
            var selectedLayer = $scope.SelectableLayers.find(function (x) {
                return x.name == bufferDefault.name;
            });
            if (selectedLayer) {
                $scope.selectedLayer = selectedLayer;
            } else {
                $scope.selectedLayer = $scope.SelectableLayers[0];
            }
        } else {
            $scope.selectedLayer = $scope.SelectableLayers[0];
        }
        $scope.ok = function () {
            MapData.LastBufferedDistance = $scope.buffer;
            MapData.LastBufferedLayer = $scope.selectedLayer;
            $modalInstance.$close({ buffer: $scope.buffer, layer: $scope.selectedLayer }); // return the themes.
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
        };
    }]);
})();
