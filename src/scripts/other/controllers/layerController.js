'use strict';
(function (module) {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope) {
        var vm = this;
        vm.layer = $scope.layer;
        //use random id for input id's because we calculated id on layer name, id and theme name but could match
        vm.randomId = Math.floor(Math.random() * 101);
        console.log(vm.layer);
    });
    // theController.$inject = ['ThemeService'];
})();