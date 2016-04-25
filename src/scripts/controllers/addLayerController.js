'use strict';
(function(module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$q', 'urls', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http',
        function($scope, $modalInstance, ThemeHelper, $q, urls, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http) {
            $scope.searchIsUrl = false;
            LayerManagementService.EnabledThemes.length = 0;
            LayerManagementService.AvailableThemes.length = 0;
            LayerManagementService.EnabledThemes = angular.copy(MapData.Themes);
            $scope.availableThemes = LayerManagementService.AvailableThemes;
            var init = function() {
                $scope.searchTerm = 'Laden...';
                var qwhenready = LayerManagementService.ProcessUrls(urls);
                qwhenready.then(function(allelagen) {
                    // $scope.searchTerm = 'http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
                    $scope.searchTerm = '';
                    $scope.searchIsUrl = false;
                });
            } ();
            $scope.searchChanged = function() {
                if ($scope.searchTerm.startsWith('http')) {
                    $scope.searchIsUrl = true;
                }
                else {
                    $scope.searchIsUrl = false;
                }
            };
            $scope.laadUrl = function() {
                if (MapData.Themes.find(x => x.CleanUrl == $scope.searchTerm) == undefined) {
                    var getwms = WMSService.GetCapabilities($scope.searchTerm);
                    getwms.success(function(data, status, headers, config) {
                        $scope.themeChanged(data);
                        $scope.searchIsUrl = false;
                        $scope.searchTerm = '';
                    }).error(function(data, status, headers, config) {
                        $window.alert('error');
                    });
                }
                else
                {
                    alert('Deze is al toegevoegd aan de map.');
                }


            };
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.themeChanged = function(theme) {
                console.log('themeChanged');
                console.log(theme);
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
                console.log($scope.copySelectedTheme);

            };
            $scope.AddOrUpdateTheme = function() {
                console.log('AddOrUpdateTheme');
                var allChecked = true;
                var noneChecked = true;
                for (var x = 0; x < $scope.copySelectedTheme.AllLayers.length; x++) { // aha dus update gebeurt, we gaan deze toevoegen.
                    var copyLayer = $scope.copySelectedTheme.AllLayers[x];
                    var realLayer = $scope.selectedTheme.AllLayers[x];
                    realLayer.enabled = copyLayer.enabled;
                    if (copyLayer.enabled === false) { // check or all the checkboxes are checked
                        allChecked = false;
                    }
                    else {
                        noneChecked = false;
                    }
                }
                var alreadyAdded = LayerManagementService.EnabledThemes.find(x => { return x.CleanUrl === $scope.selectedTheme.CleanUrl }) != undefined;
                if (noneChecked) {
                    //Niks is checked, dus we moeten deze 'deleten'.
                    $scope.selectedTheme.Added = false;
                    if ($scope.selectedTheme.status != ThemeStatus.NEW) { // als deze new is dan zette we deze gewoon op niets want we verwijderen die.
                        $scope.selectedTheme.status = ThemeStatus.DELETED;
                    }
                    else {
                        if (alreadyAdded) {
                            var index = LayerManagementService.EnabledThemes.indexOf($scope.selectedTheme);
                            if (index > -1) {
                                LayerManagementService.EnabledThemes.splice(index, 1);
                            }
                        }
                    }
                }
                else { // het is dus geen delete
                    if (allChecked) {
                        $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added
                    }
                    else {
                        $scope.selectedTheme.Added = null; // if not all added then we put it to null
                    }
                    if (alreadyAdded == false) { // it is a new theme!
                        LayerManagementService.EnabledThemes.push($scope.selectedTheme);
                    } else { // already exist! It is an update!
                        if ($scope.selectedTheme.status != ThemeStatus.NEW) {
                            $scope.selectedTheme.status = ThemeStatus.UPDATED;
                            console.log('changed naar updated');
                        }
                        else {
                            console.log('Hij is al new, dus moet hij niet naar updated changen.');
                        }
                    }
                }
                console.log('AddOrUpdateTheme');

                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
            };

            $scope.ok = function() {
                console.log(LayerManagementService.EnabledThemes);
                $modalInstance.$close(LayerManagementService.EnabledThemes); // return the themes.
            };
            $scope.cancel = function() {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();