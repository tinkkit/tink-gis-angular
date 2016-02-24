'use strict';
(function (module) {
    module = angular.module('tink.gis.angular')
        .controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$http', '$q', 'urls', 'MapService', function ($scope, $modalInstance, ThemeHelper, $http, $q, urls, MapService) {
            var AddedThemes = [];
            $scope.availableThemes = [];
            var processUrls = function (urls) {
                var promises = [];
                $scope.searchTerm = 'Laden...';
                _.each(urls, function (url) {
                    var prom = $http.get(url).success(function (data, statuscode, functie, getdata) {
                        var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                        $scope.availableThemes.push(convertedTheme);
                    });
                    promises.push(prom);
                });
                $q.all(promises).then(function (lagen) {
                    $scope.searchTerm = '';

                });
            };
            processUrls(urls);
            $scope.selectedTheme = null;
            $scope.themeChanged = function (theme) {
                $scope.selectedTheme = theme;
                console.log(theme);
            };
            $scope.AddTheme = function () {
                var allChecked = true;
                $scope.selectedTheme.AllLayers.forEach(x=> {
                    if (x.enabled === false) { // check or all the checkboxes are checked
                        allChecked = false;
                    }
                });
                if (allChecked) { 
                    $scope.selectedTheme.Added = true; // here we can set the Added to true when they are all added 
                }
                else {
                    $scope.selectedTheme.Added = null; // if not all added then we put it to null

                }
                AddedThemes.push($scope.selectedTheme);
            };

            $scope.ok = function () {
                // var selectedThemes = []
                // _.each($scope.themes, function (theme) {
                //     if (theme.selected === true) {
                //         selectedThemes.push(theme);
                //     }
                // });
                $modalInstance.$close(AddedThemes);
            };
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            };

        }]);
})();