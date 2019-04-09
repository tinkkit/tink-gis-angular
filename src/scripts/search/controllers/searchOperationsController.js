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
            $scope.operators = ['=', '<>', '<', '>', '<=', '>=', 'LIKE', 'NOT LIKE'];
            $scope.operator = '=';
            $scope.selectedAttribute = null;
            $scope.value = null;
            $scope.layer = null;
            $scope.autoCompleteActive = false;
            $scope.autoComplete = [];

            //initial value to build the form
            $scope.operations = [{ addition: null, attribute: null, operator: '=', value: null }];

            $scope.updateOperation = function (index){
                // $scope.autoCompleteActive = false;
                $scope.changeoperation();
                // var valueInput = document.getElementById("input_waarde");
                // if(valueInput === document.activeElement){
                //     $scope.autoCompleteActive = true;
                //     $scope.valueChanged(index);
                // }
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

            // $scope.valueChanged = async function (index) {
            //     // var test = document.getElementById("input_waarde").value;
            //     // $scope.autoComplete = await SearchAdvancedService.autoComplete(test, index); //TODO activeren wanneer je aan autocomplete werkt
            // }
        }]);
    theController.$inject = ['$scope', 'SearchAdvancedService'];
})();

