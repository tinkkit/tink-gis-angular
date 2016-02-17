'use strict';
(function (module) {
    module = angular.module('tink.gis.angular')
            .controller('addLayerController', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
        var passFromResolveObj = items;
        
        $scope.ok = function () {
            $modalInstance.$close('ok is pressed'); // To close the controller with a success message
        }

        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
        }

    }]);
})();