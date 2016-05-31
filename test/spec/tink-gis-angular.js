'use strict';
describe('tink-gis', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, scope;

   beforeEach(module('tink.gis'));
   
     var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));
  
  

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'map').appendTo(bodyEl);
  }));


  describe('helperservice', function() {
    it('should calculate lamber72 coordinates', function(){
        
      var coordinates = {};
     coordinates.lat = 51;
     coordinates.lng = 4.4;
  
    
        it('returns 1', inject(function(HelperService){ 

          var result =  HelperService.ConvertWSG84ToLambert72(coordinates);
          console.log(result);
          expect(result.x).toBe(152193.35735187418)
          expect(result.y).toBe(187753.56831674278)

        }))
  

}); 
  
  
  
  describe('gisservice', function() {
      
  
  
  
 
      
 it('returns 1', inject(function(GISService){ 
     
           var coordinates = {};
           var latlng = {};
           latlng.lat = 51;
           latlng.lng = 4.4;
           coordinates.latlng = latlng;

          var result =  GISService.ReverseGeocode(coordinates);
        //   console.log(result);
        //   expect(result.x).toBe(152193.35735187418)
        //   expect(result.y).toBe(187753.56831674278)

 }))

 
      
    //   var controller = $controller('themeController', { $scope: scope });
    // //   $scope.password = 'longerthaneightchars';
    // //   $scope.grade();
    // console.log(controller.$scope);
    // console.log(controller)
    //   expect(1).toBe(1);
    // });
  })
      
  
      
      
  


})})