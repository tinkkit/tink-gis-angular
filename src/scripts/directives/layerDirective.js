(function (module) {
    
    'use strict';
    
    console.log("init layer")
     
    module = angular.module('tink.gis.angular');
  
    var directiveName = "layer";
   // var theDirective = function (appService) {
    var theDirective = function () {
        return {
            // link: function (scope, element, attrs) {
            //                   
            // },
            restrict: "E",
            scope: {
                layerData: "="
            },
            templateUrl: window.location.pathname + "../scripts/layerControl/layer/layer.html",
            controllerAs: 'layerctrl' ,
        }
    };
    
    var theController = module.controller('layerctrl', function($scope, $http, GisDataService)
{
     
    //   $scope.layers = GisDataService.layers;
      $scope.changeVisibility = function(url){
        
      GisDataService.changeVisibility(url);
                     
      };
     
})

    theController.$inject = ['GisDataService'];

   
    angular.module('tink.gis.angular').directive(directiveName, theDirective);
})();