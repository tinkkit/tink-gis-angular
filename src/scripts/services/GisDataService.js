// Kan gebruikt worden om data door te geven tussen controllers en/of directives

(function () {

    'use strict';
   var module = angular.module('tink.gis.angular');


    var gisDataService = function (HelperService) { //$http
 function initData() {
   //http://app11.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/identify?geometry=%7Bx%3A4.4029%2C+y%3A+51.2192%7D&geometryType=esriGeometryPoint&sr=4326&layers=all%3A1%2C6&layerDefs=&time=&layerTimeOptions=&tolerance=2&mapExtent=4.2%2C51%2C4.6%2C51.4&imageDisplay=imageDisplay%3D600%2C600%2C96&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=html
    return {
                layers: {
                    baselayers: {
                        kaart: {
                name: 'kaart',
                url: 'http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}',
                type: 'xyz',
                layerOptions: {
                    showOnSelector: true
                }
            },
            luchtfoto: {
                name: 'luchtfoto',
                url: "http://tile.informatievlaanderen.be/ws/raadpleegdiensten/tms/1.0.0/omwrgbmrvl@GoogleMapsVL/{z}/{x}/{y}.png",
                type: 'xyz',
                layerOptions: {
                    showOnSelector: true,
                    tms: true
                }
            }
                     },
                 overlays: {
                                 	perceel: {
                            name: 'geoservice',
                            type: 'agsFeature',
                            url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/6',
                            visible: true,
                                layerOptions: {
                                      showOnSelector: true,
                                 simplifyFactor: 0.5,
                                 precision: 5,
                                 minZoom: 17,
                                 maxZoom: 25,
             
                            },
                            group: 'Test',
                            // superGroup: 'SuperTest'
                        },
                    //      hoofdgebouw: {
                    //         name: 'Styling Polygons',
                    //         type: 'agsFeature',
                    //         url: 'http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/1',
                    //         visible: true,
                    //         layerOptions: {
                    //             simplifyFactor: 0.5,
                    //             precision: 5,
                    //             minZoom: 17,
                    //              maxZoom: 25,
                    //             style: function (feature) {
                    //    
                    //                     return { color: 'red', weight: 1 };
                    //             
                    //             }
                    //         },
                    //         group: 'Test'
                    //     },
           
                        }
                     },
                 
                
                
    }}
        var _mapData = function() { return HelperService.clone(initData()); };
        var _convertedMapData = {};
        _convertedMapData.layers = {};
         _convertedMapData.layers.overlays = HelperService.findNested(_mapData.layers ,"overlays");
         _convertedMapData.layers.baselayers = HelperService.findNested(_mapData.layers ,"baselayers");
//         var _layers = [];
//         var layerDataService = {};
// 
//         $http.get('/layerControlData.json').then(function (res) {
//             res.data.forEach(function (layer) {
//                 _layers.push(layer);
//             }, this);
//         });
// 
//         function _add() {
// 
//             layerDataService.add = function (item) {
//                 _layers.push(item);
//             };
// 
// 
//             return layerDataService.add;
//         };
// 
//         function _list() {
// 
//             return _layers;
// 
//         }



    

        function _changeVisibility(url) {

            var overlays = _mapData().layers.overlays;

            var res = HelperService.findNested(overlays, 'url');

            res.forEach(function (layer) {
                if (layer.url == url) {
                    // layer.visible = !layer.visible;
                    console.log('Changed url: ' + url + ' to: ' + layer.visible);
                }
            }, this);
           

            
        }


        return {
            // add: _add,
            // list: _list,
            // layers: _layers,
            changeVisibility: _changeVisibility,
            mapData: _mapData(),
            convertMapData: _convertedMapData


        };

    }
    gisDataService.$inject = ['HelperService'];


    module.factory('GisDataService', gisDataService);

})();
