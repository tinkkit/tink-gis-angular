'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController', function ($scope, ResultsData, map, $interval) {
        var vm = this;
        vm.features = ResultsData.JsonFeatures;
        vm.EmptyResult = ResultsData.EmptyResult;
        vm.LoadingCompleted = true;
        vm.loadingPercentage = 100;

        var percentageupdater = $interval(function () {
            vm.loadingPercentage = ResultsData.GetRequestPercentage();
            vm.LoadingCompleted = vm.loadingPercentage >= 100;
        }, 333);
        vm.asidetoggle = function () {
            if (L.Browser.mobile) {
                var html = $('html');
                if (html.hasClass('nav-right-open')) {
                    html.removeClass('nav-right-open');
                }
            }
        };
    });
    theController.$inject = ['$scope', 'ResultsData', 'map', '$interval'];
})();
