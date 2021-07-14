'use strict';
(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch(e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); 
    }
    module.controller('previewQueryLayerController', ['$scope', 
    function ($scope) {
        console.log($scope);
    }]);
})();