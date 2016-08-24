// 'use strict';
// (function (module) {
//     try {
//         var module = angular.module('tink.gis');
//     } catch (e) {
//         var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
//     }
//     module = angular.module('tink.gis');
//     module.controller('groupLayerController',
//         function ($scope) {
//             var vm = this;
//             vm.grouplayer = $scope.grouplayer;
//             vm.chkChanged = function () {
//                 $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
//             };
//         });
// })();