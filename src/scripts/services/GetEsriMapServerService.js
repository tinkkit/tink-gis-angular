// Kan gebruikt worden om data door te geven tussen controllers en/of directives

(function() {

    'use strict';

    var componentName = "GetEsriMapServerService";
    var theComponent = function($http) {
        
       var _mapData = initData();
       var _layers = [];
       var layerDataService = {};
        
             $http.get('http://app10.p.gis.local/arcgis/rest/services/P_Stad/Milieu/MapServer/layers?f=pjson').then(function(res){
                    res.data.forEach(function(layer) {
                        _layers.push(layer);
                    }, this);
               });
        
       function _add() {
                 
            layerDataService.add = function(item) {
                _layers.push(item);
            };
        
            
            return layerDataService.add;
       };
       
       function _list() {
           
                return _layers;
          
       }
   
   
       
       
        
         return {
            add: _add,
            list: _list,
            layers: _layers,
            mapData: _mapData
            
            
                         };
        
    }

  // theComponent.$inject = ['GisDataService'];

    angular.module('tink.gis.angular').factory(componentName, theComponent);

})();
