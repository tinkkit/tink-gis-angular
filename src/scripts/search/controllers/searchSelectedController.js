'use strict';
(function(module) {
    module = angular.module('tink.gis.angular');
    var theController = module.controller('searchSelectedController',
        function($scope, ResultsData) {
            var vm = this;
            vm.selectedResult = null;
            $scope.$watch(function() { return ResultsData.SelectedFeature; }, function(newVal, oldVal) {
                vm.selectedResult = newVal;
            });
            vm.close = function(feature) {
                ResultsData.SelectedFeature = null;
            };
        });
    theController.$inject = ['$scope', 'ResultsData',];
})();