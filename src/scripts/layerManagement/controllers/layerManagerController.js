'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('LayerManagerController', ['$scope', '$modalInstance', 'LayerManagementService',
        function ($scope, $modalInstance, LayerManagementService ) {
            



            $scope.ok = function () {
                $modalInstance.$close(LayerManagementService.EnabledThemes); // return the themes.
            };
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();

