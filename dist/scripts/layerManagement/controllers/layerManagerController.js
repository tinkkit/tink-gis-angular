'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('LayerManagerController', ['$scope', '$modalInstance', 'LayerManagementService', function ($scope, $modalInstance, LayerManagementService) {
        $scope.active = 'solr';
        $scope.searchTerm = '';
        $scope.solrLoading = false;
        $scope.solrCount = null;
        $scope.geopuntLoading = false;
        $scope.geopuntCount = null;
        $scope.mobile = L.Browser.mobile;
        $scope.ok = function () {
            $modalInstance.$close(); // return the themes.
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
        };
        $scope.enterPressed = function () {
            if ($scope.searchTerm == '') {
                $scope.$broadcast("searchChanged", '*');
            };
        };
        $scope.searchChanged = function () {
            if ($scope.searchTerm != null && $scope.searchTerm != '') {
                $scope.$broadcast("searchChanged", $scope.searchTerm);
            }
        };
    }]);
})();
