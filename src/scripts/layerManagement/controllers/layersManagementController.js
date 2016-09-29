'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('layersManagementController', ['$scope', 'MapData', 'ThemeService',
        function ($scope, MapData, ThemeService) {
            $scope.pagingCount = null;
            $scope.numberofrecordsmatched = 0;
            $scope.availableThemes = MapData.Themes;
            $scope.allThemes = [];
            var init = function () {
                $scope.searchTerm = '';
            } ();
            $scope.searchChanged = function () {
          
            };

            $scope.pageChanged = function (page, recordsAPage) {
                let startItem = ((page - 1) * recordsAPage);
                $scope.availableThemes = $scope.allThemes.slice(startItem, startItem + recordsAPage)
                // console.log(page, recordsAPage);
                // $scope.QueryGISSOLR($scope.searchTerm, page);
            };
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.previewTheme = function (theme) {
                console.log('themeChanged');
                console.log(theme);
                var alreadyExistingTheme = MapData.Themes.find(x => { return x.CleanUrl === theme.CleanUrl });
                if (alreadyExistingTheme) {
                    theme = alreadyExistingTheme;
                }
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
            };
            $scope.clearPreview = function () {
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
            };
            $scope.ThemeChanged = function (theme) {
                $scope.previewTheme(theme);
            };

            $scope.AddOrUpdateTheme = function () {
                console.log('AddOrUpdateTheme');
                var allChecked = true;
                var noneChecked = true;
                var hasAChange = false;
                for (var x = 0; x < $scope.copySelectedTheme.AllLayers.length; x++) { // aha dus update gebeurt, we gaan deze toevoegen.
                    var copyLayer = $scope.copySelectedTheme.AllLayers[x];
                    var realLayer = $scope.selectedTheme.AllLayers[x];
                    if (realLayer.enabled != copyLayer.enabled) {
                        hasAChange = true;
                    }
                    realLayer.enabled = copyLayer.enabled;
                    if (copyLayer.enabled === false) { // check or all the checkboxes are checked
                        allChecked = false;
                    }
                    else {
                        noneChecked = false;
                    }
                }

                var alreadyAdded = MapData.Themes.find(x => { return x.CleanUrl === $scope.selectedTheme.CleanUrl }) != undefined;

                if (alreadyAdded) {
                    if (hasAChange) {
                        $scope.selectedTheme.status = ThemeStatus.UPDATED;
                    } else {
                        $scope.selectedTheme.status = ThemeStatus.UNMODIFIED;
                    }
                    if (noneChecked) {
                        $scope.selectedTheme.status = ThemeStatus.DELETED;
                    }
                }
                else {
                    $scope.selectedTheme.status = ThemeStatus.NEW;
                }
                if (allChecked && $scope.selectedTheme != ThemeStatus.DELETED) {
                    $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added
                }
                if (!allChecked && !noneChecked && $scope.selectedTheme != ThemeStatus.DELETED) {
                    $scope.selectedTheme.Added = null; // if not all added then we put it to null
                }
                if ($scope.selectedTheme == ThemeStatus.DELETED) {
                    $scope.selectedTheme.Added = false;
                }
                ThemeService.AddAndUpdateThemes([$scope.selectedTheme]);
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
                // if (noneChecked) {
                //     //Niks is checked, dus we moeten deze 'deleten'.
                //     $scope.selectedTheme.Added = false;
                //     if ($scope.selectedTheme.status != ThemeStatus.NEW) { // als deze new is dan zette we deze gewoon op niets want we verwijderen die.
                //         $scope.selectedTheme.status = ThemeStatus.DELETED;
                //     }
                //     else {
                //         if (alreadyAdded) {
                //             var index = MapData.Themes.indexOf($scope.selectedTheme);
                //             if (index > -1) {
                //                 MapData.Themes.splice(index, 1);
                //             }
                //         }
                //     }
                // }
                // else { // het is dus geen delete
                //     if (allChecked) {
                //         $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added
                //     }
                //     else {
                //         $scope.selectedTheme.Added = null; // if not all added then we put it to null
                //     }
                //     if (alreadyAdded == false) { // it is a new theme!
                //         MapData.Themes.push($scope.selectedTheme);
                //     } else { // already exist! It is an update!
                //         if ($scope.selectedTheme.status != ThemeStatus.NEW) {
                //             $scope.selectedTheme.status = ThemeStatus.UPDATED;
                //             console.log('changed naar updated');
                //         }
                //         else {
                //             console.log('Hij is al new, dus moet hij niet naar updated changen.');
                //         }
                //     }
                // }

            };

            $scope.ok = function () {
                // console.log(LayerManagementService.EnabledThemes);
                // $modalInstance.$close(); // return the themes.
            };
            $scope.cancel = function () {
                // $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();