'use strict';
(function (module) {
    module = angular.module('tink.gis.angular')
        .controller('addLayerController', ['$scope', '$modalInstance', 'ThemeHelper', '$http', '$q', 'urls', function ($scope, $modalInstance, ThemeHelper, $http, $q, urls) {
            $scope.themes = [];
            var processUrls = function (urls) {
                var promises = [];
                $scope.searchTerm = 'Laden...';
                _.each(urls, function (url) {
                    var prom = $http.get(url).success(function (data, statuscode, functie, getdata) {
                        var convertedTheme = ThemeHelper.createThemeFromJson(data, getdata)
                        $scope.themes.push(convertedTheme);
                    });
                    promises.push(prom);
                });
                $q.all(promises).then(function (lagen) {
                    $scope.searchTerm = '';
                    _.each($scope.themes, function (theme) {
                        theme.selected = false;
                    });
                });
            };
            processUrls(urls);
            $scope.selectedTheme = null;
            $scope.themeChanged = function (theme) {
                $scope.selectedTheme = theme;
                console.log(theme);
            };
            $scope.AddTheme = function (theme) {

            }

            $scope.ok = function () {
                var selectedThemes = []
                _.each($scope.themes, function (theme) {
                    if (theme.selected === true) {
                        selectedThemes.push(theme);
                    }
                });
                $modalInstance.$close(selectedThemes);
            }
            $scope.cancel = function () {
                $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
            }

        }]);
})();