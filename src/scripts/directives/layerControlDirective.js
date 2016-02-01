'use strict';
(function(module) {
 
    module = angular.module('tink.gis.angular');
  
var theController = module.controller('layerControlctrl', function($scope, $http, GisDataService)
{
     
      $scope.layers = GisDataService.layers;
      $scope.changeVisibility = function(url){
        
      GisDataService.changeVisibility(url);
                     
      };
     
})

    theController.$inject = ['GisDataService'];

module.directive('layerControl', function() {
  return {
   templateUrl:  '../scripts/layerControl/layerControlTemplate.html',
   controllerAs: 'layerControlctrl' ,  
  };
});
  

})();