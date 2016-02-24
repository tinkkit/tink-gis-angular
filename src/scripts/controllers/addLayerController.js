'use strict';
(function (module) {
    module = angular.module('tink.gis.angular')
        .controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$http', '$q', 'urls', 'MapService', function ($scope, $modalInstance, ThemeHelper, $http, $q, urls, MapService) {
            var EnabledThemes = angular.copy(MapService.Themes);
            // EnabledThemes.forEach(enabledTheme => {
            // });
            $scope.availableThemes = [];
            var processUrls = function (urls) {
                var promises = [];
                $scope.searchTerm = 'Laden...';
                _.each(urls, function (url) {
                    var AlreadyAddedTheme = null
                    EnabledThemes.forEach(theme=> { // OPTI kan paar loops minder door betere zoek in array te doen
                        if (theme.Url == url) {
                            AlreadyAddedTheme = theme;
                        }
                    });
                    if (AlreadyAddedTheme == null) { // if we didn t get an alreadyadderdtheme we get the data
                        var prom = $http.get(url).success(function (data, statuscode, functie, getdata) {
                            var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                            $scope.availableThemes.push(convertedTheme);
                            convertedTheme.status = ThemeStatus.NEW;
                        });
                        promises.push(prom);
                    }
                    else { // ah we already got it then just push it.
                        AlreadyAddedTheme.status = ThemeStatus.UNMODIFIED;
                        $scope.availableThemes.push(AlreadyAddedTheme);
                    }
                });
                $q.all(promises).then(function (lagen) {
                    $scope.searchTerm = '';
                });
            };
            processUrls(urls);
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.themeChanged = function (theme) {
                $scope.selectedTheme = theme;
                $scope.copySelectedTheme = angular.copy(theme);
            };
            $scope.AddOrUpdateTheme = function () {
                var allChecked = true;
                for (var x = 0; x < $scope.copySelectedTheme.AllLayers.length; x++) { // aha dus update gebeurt, we gaan deze toevoegen.
                    var copyLayer = $scope.copySelectedTheme.AllLayers[x];
                    var realLayer = $scope.selectedTheme.AllLayers[x];
                    realLayer.enabled = copyLayer.enabled;
                    if (copyLayer.enabled === false) { // check or all the checkboxes are checked
                        allChecked = false;
                    }
                };

                if (allChecked) {
                    $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added 
                }
                else {
                    $scope.selectedTheme.Added = null; // if not all added then we put it to null
                }
                var alreadyAdded = false;
                EnabledThemes.forEach(theme=> { // OPTI kan paar loops minder door betere zoek in array te doen
                    if (theme.Url == $scope.selectedTheme.Url) {
                        alreadyAdded = true;
                    }
                });
                console.log(alreadyAdded);
                if (alreadyAdded == false) { // it is a new theme!
                    EnabledThemes.push($scope.selectedTheme);
                } else { // already exist! It is an update!
                    if ($scope.selectedTheme.status != ThemeStatus.NEW) {
                        $scope.selectedTheme.status = ThemeStatus.UPDATED;
                        console.log("changed naar updated");
                    }
                    else {
                        console.log("Hij is al new, dus moet hij niet naar updated changen.");
                    }

                }
                $scope.selectedTheme = null;
                $scope.copySelectedTheme = null;
            };

            $scope.ok = function () {
                $modalInstance.$close(EnabledThemes); // return the themes.
            };
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();