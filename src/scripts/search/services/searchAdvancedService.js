'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($rootScope, MapData) {
        var _service = {};
        $rootScope.attribute = null;
        $rootScope.operations = [];
        $rootScope.query = "";

        _service.newOrOperation = function () {
            $rootScope.$broadcast('orOperation');
        };

        _service.newAddOperation = function () {
            $rootScope.$broadcast('addOperation');
        };

        $rootScope.$on('addedOperation', function (event, data) {
            $rootScope.operations = data;
            $rootScope.$broadcast('queryOperationUpdated', $rootScope.operations);
        });

        $rootScope.$on('deleteOperation', function () {
            $rootScope.$emit('deleteOperation');
        });

        $rootScope.$on('alteredOperation', function () {
            $rootScope.$emit('alteredOperation');
        });

        _service.UpdateFields = function (layer) {
            $rootScope.$broadcast('updateFields', layer);
        };

        var checkOperator = function (value) {
            var returnValue = "";
            if (value.operator == 'LIKE') {
                returnValue += value.operator + " \'%" + value.value + "%\' ";
            } else {
                returnValue += value.operator + " \'" + value.value + "\' ";
            }
            return returnValue;
        };

        _service.BuildQuery = function (layer) {
            $rootScope.query = ""; //init
            $rootScope.query += "FROM (" + layer; //always remains the same

            angular.forEach($rootScope.operations, function (value, key) {
                if (value.addition == null) {
                    $rootScope.query += ") WHERE (" + value.attribute.name +  ") " + checkOperator(value);
                } else {
                    $rootScope.query += value.addition + " (" + value.attribute.name + ") " + checkOperator(value);
                }
            });

            $rootScope.$broadcast('queryBuild', $rootScope.query);
        };

        return _service;
    };
    module.factory("SearchAdvancedService", service);
    module.$inject = ['$rootScope'];
})();

