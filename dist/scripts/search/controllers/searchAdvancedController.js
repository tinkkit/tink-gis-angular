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
        if ($scope.query == undefined) $scope.query = null;

        $scope.openQueryEditor = function () {
            $scope.editor = true;
            if ($scope.selectedLayer) {
                SearchAdvancedService.BuildQuery($scope.selectedLayer.name);
            }
        };

        $scope.SelectedLayers = function () {
            //display only usable layers
            var layers = MapData.VisibleLayers.filter(function (data) {
                return data.name !== "Alle lagen";
            });
            if (layers.length == 1) {
                $scope.selectedLayer = layers[0];
                SearchAdvancedService.UpdateFields($scope.selectedLayer);
            }
            return layers;
        };

        $scope.updateFields = function () {
            if ($scope.selectedLayer != null && $scope.selectedLayer != undefined) {
                SearchAdvancedService.UpdateFields($scope.selectedLayer);
            }
        };

        $scope.$on('queryBuild', function (event, data) {
            $scope.query = data;
        });

        $scope.$on('queryOperationUpdated', function (event, data) {
            $scope.query = data;
            $scope.editor = false;
        });

        $scope.$on('deleteOperation', function () {
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
                var query = SearchAdvancedService.TranslateOperations($scope.operations);
                var result = SearchAdvancedService.ExecuteQuery($scope.selectedLayer, query);
            } else {
                var rawQueryResult = SearchAdvancedService.MakeNewRawQuery($scope.query);
                if (rawQueryResult.layer != null) {
                    var result = SearchAdvancedService.ExecuteQuery(rawQueryResult.layer, rawQueryResult.query);
                }
            }

            UIService.OpenLeftSide();
            $modalInstance.$close();
        };

        if ($scope.query != null && $scope.query != "") {
            $scope.openQueryEditor();
        }
    }]);

    theController.$inject = ['$scope', '$modalInstance', 'SearchAdvancedService', 'MapData', 'UIService', 'GISService', 'ResultsData'];
})();
