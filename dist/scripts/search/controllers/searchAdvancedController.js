'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var theController = module.controller('searchAdvancedController', ['$scope', '$modalInstance', 'SearchAdvancedService', 'MapData', 'GISService', 'UIService', 'ResultsData', function ($scope, $modalInstance, SearchAdvancedService, MapData, GISService, UIService, ResultsData) {
        $scope.editor = false;
        $scope.selectedLayer = null;
        $scope.operations = [];
        $scope.query = null;

        $scope.openQueryEditor = function () {
            $scope.editor = true;
            if ($scope.selectedLayer) {
                SearchAdvancedService.BuildQuery($scope.selectedLayer.name);
            }
        };

        $scope.SelectedLayers = function () {
            //display only usable layers
            return MapData.VisibleLayers.filter(function (data) {
                return data.name !== "Alle lagen";
            });
        };

        $scope.updateFields = function () {
            SearchAdvancedService.UpdateFields($scope.selectedLayer);
        };

        $scope.$on('queryBuild', function (event, data) {
            $scope.query = data;
        });

        $scope.$on('queryOperationUpdated', function (event, data) {
            $scope.query = data;
            $scope.editor = false;
        });

        $scope.$on('deleteOperation', function () {
            console.log('false');
            $scope.editor = false;
        });

        $scope.addOperation = function () {
            $scope.editor = false;
            SearchAdvancedService.newAddOperation();
        };

        $scope.orOperation = function () {
            $scope.editor = false;
            SearchAdvancedService.newOrOperation();
        };

        $scope.ok = function () {
            $modalInstance.$close();
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed');
        };

        $scope.QueryAPI = function () {
            if (!$scope.editor) {
                SearchAdvancedService.BuildQuery($scope.selectedLayer);
                //TODO: API call with query or operations as args ?
                var query = SearchAdvancedService.TranslateOperations($scope.operations);
                var result = SearchAdvancedService.ExecuteQuery($scope.selectedLayer, query);
                console.log(result);
            } else {
                //TODO: API call with query
                var rawQueryResult = SearchAdvancedService.MakeNewRawQuery($scope.query);
                if (rawQueryResult.layer != null) {
                    var result = SearchAdvancedService.ExecuteQuery(rawQueryResult.layer, rawQueryResult.query);
                }
                console.log(result);
            }
            console.log("API Call : " + $scope.query); //TODO: remove this testing placeholder

            UIService.OpenLeftSide();
            $modalInstance.$close();
        };
    }]);

    theController.$inject = ['$scope', '$modalInstance', 'SearchAdvancedService', 'MapData', 'UIService', 'GISService', 'ResultsData'];
})();
