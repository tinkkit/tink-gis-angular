// Kan gebruikt worden om data door te geven tussen controllers en/of directives

(function() {

    'use strict';

    var componentName = "GisDataService";
    var theComponent = function($http) {
        
       var _mapData = initData();
       var _layers = [];
       var layerDataService = {};
        
             $http.get('../scripts/layerControl/layerControlData.json').then(function(res){
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
       
   
       
         function fn(obj, key) {
    if (_.has(obj, key)) // or just (key in obj)
        return [obj];
    // elegant:
    return _.flatten(_.map(obj, function(v) {
        return typeof v == "object" ? fn(v, key) : [];
    }), true);


}
       
       function _changeVisibility(url)
       {
   
           var overlays = _mapData.layers.overlays;
           
         var res = fn(overlays, "url");
         
         res.forEach(function(layer) {
             if (layer.url == url)
             {
                   layer.visible = !layer.visible;
             }
         }, this);
  
           
           
        //    for (var property in overlays) {
        //         if (overlays.hasOwnProperty(property)) {
        //              for (var childProperty in property) {
        //                   if (property.hasOwnProperty(childProperty)) {
        //                         if(property.name == "url")
        //                         {
        //                             return property.visible = !property.visible;
        //                         }
        //                   }
        //              }
        //         }
        //         
        //       }
       }
       
        
         return {
            add: _add,
            list: _list,
            layers: _layers,
            changeVisibility: _changeVisibility,
            mapData: _mapData
            
            
                         };
        
    }

  // theComponent.$inject = ['GisDataService'];

    angular.module('tink.gis.angular').factory(componentName, theComponent);

})();
