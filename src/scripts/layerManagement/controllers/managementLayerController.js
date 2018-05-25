'use strict';
(function (module) {
    var module = angular.module('tink.gis');
    var theController = module.controller('managementLayerController', function ($scope) {
        var vm = this;
        vm.layer = $scope.layer;
        $scope.showLayer = false; // to show and hide the layers
        // console.log(vm.layer.hasLayers());
        // vm.chkChanged = function () {
        //     $scope.$emit('layerCheckboxChangedEvent', $scope.layer); // stuur naar parent ofwel group ofwel theme
        // };
        angular.forEach($scope.layer.Layers, function(value){
            if(value.enabled == true){
                $scope.showLayer = true;
            }
            if(value.Layers.length > 0){
                angular.forEach(value.Layers, function(childvalue){
                    if(childvalue.enabled == true){
                        $scope.showLayer = true;
                    }
                })
            }
        });
    });
    theController.$inject = [];
})();
