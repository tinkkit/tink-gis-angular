'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var theController = module.controller('searchOperationsController', ['$scope', 'SearchAdvancedService',
        function ($scope, SearchAdvancedService) {

            $scope.attributes = null; ['Straat', 'Postcode', 'nummer']; //ophalen vanaf API
            $scope.operators = ['=', '<>', '<', '>', '<=', '>=', 'LIKE'];
            $scope.operator = '=';
            $scope.selectedAttribute = null;
            $scope.value = null;
            $scope.layer = null;

            //initial value to build the form
            $scope.operations = [{ addition: null, attribute: null, operator: '=', value: null }];

            $scope.updateOperation = function(){
                $scope.changeoperation();
            };

            $scope.$on('updateFields', function (event, data) {
                $scope.attributes = data.fields;
            })

            $scope.$on('addOperation', function () {

                $scope.operations.push(
                    { addition: 'AND', attribute: '', operator: '=', value: '' }
                );
                $scope.changeoperation();
            })

            $scope.$on('orOperation', function () {

                $scope.operations.push(
                    { addition: 'OR', attribute: '', operator: '=', value: '' }
                );
                $scope.changeoperation();
            })

            $scope.delete = function (index) {
                console.log(index);
                if (index !== 0) {
                    $scope.operations.splice(index, 1);
                }
                $scope.changeoperation();
            };

            $scope.up = function (index) {

                var op = $scope.operations[index];
                if (index == 1) {
                    op.addition = null;
                    $scope.operations[0].addition = "AND";
                }
                $scope.operations.splice(index, 1);
                $scope.operations.splice(index - 1, 0, op);
                $scope.changeoperation();
            };

            $scope.down = function (index) {

                var op = $scope.operations[index];
                if (index == 0) {
                    op.addition = "AND";
                    $scope.operations[1].addition = null;
                }
                
                $scope.operations.splice(index, 1);
                $scope.operations.splice(index + 1, 0, op);
                $scope.changeoperation();
            };

            $scope.changeoperation = function() {
                $scope.$emit('addedOperation', $scope.operations);
            };
            

        }]);
    theController.$inject = ['$scope', 'SearchAdvancedService'];
})();

