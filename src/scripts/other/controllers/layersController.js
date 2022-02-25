'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function ($scope, MapData, map, ThemeService, $modal, FeatureService) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.queryLayers = MapData.QueryLayers;
        vm.selectedLayers = [];
        vm.showQueryLayers = true;

        vm.sortableOptions = {
            stop: function (e, ui) {
                MapData.SetZIndexes();
            }
        };
          
          //these lists only serve purpose to track where the querylayers are
          vm.topQueryLayers = [{}];
          vm.bottomQueryLayers = [];

        vm.sortableOptionsQueryLayers = {
            placeholder: "query-layers",
            connectWith: ".query-layers-container",
            stop: function (e, ui) {
                MapData.UpdateZIndexQueryPane(vm.topQueryLayers.length > 0);
            }
          };
        vm.asidetoggle = function () {
            if (L.Browser.mobile) {
                let html = $('html');
                if (html.hasClass('nav-left-open')) {
                    html.removeClass('nav-left-open');
                }
            }
        }
        vm.deleteLayerButtonIsEnabled = FeatureService.deleteLayerButtonIsEnabled;
        $scope.$watch(function () { return FeatureService.deleteLayerButtonIsEnabled; }, function (newValue, oldValue) {
            vm.deleteLayerButtonIsEnabled = newValue
        });
        vm.layerManagementButtonIsEnabled = FeatureService.layerManagementButtonIsEnabled;
        $scope.$watch(function () { return FeatureService.layerManagementButtonIsEnabled; }, function (newValue, oldValue) {
            vm.layerManagementButtonIsEnabled = newValue
        });

        $scope.$watch(function () { return MapData.Themes; }, function (newVal, oldVal) {
            MapData.SetZIndexes(newVal);
        });
        vm.updatethemevisibility = function (theme) {
            ThemeService.UpdateThemeVisibleLayers(theme);
        };
        vm.updateQueryVisibility = function (index) {
            ThemeService.updateQueryVisibility(index);
        };
        vm.deleteQueryLayer = function (index) {
            ThemeService.DeleteQueryLayer(index);
        };
        vm.Lagenbeheer = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/layermanagement/layerManagerTemplate.html',
                controller: 'LayerManagerController',
                resolve: {
                    backdrop: false,
                    keyboard: true
                }
            });
            addLayerInstance.result.then(function () {
                // ThemeService.AddAndUpdateThemes(selectedThemes);
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['MapData', 'map', 'ThemeService', '$modal', 'FeatureService'];
})();