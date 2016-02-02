// Kan gebruikt worden om data door te geven tussen controllers en/of directives

(function () {

    'use strict';

    var componentName = "GisDataService";
    var theComponent = function ($http) {
 function initData() {
   
    return {
                layers: {
                    baselayers: {
                        stadsplan: {
                            name: 'Stadsplan',
                            url: 'http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}',
                            type: 'xyz'
                        },      
                        	world: {
					    	name: "Imagery",
					        type: "agsDynamic",
					        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
					        visible: true,
					        layerOptions: {
					            layers: [0, 1],
				                opacity: 1,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        }
				    	},
                     },
                 overlays: {
                                 	perceel: {
                            name: "geoservice",
                            type: "agsFeature",
                            url: "http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/6",
                            visible: true,
                                                         layerOptions: {
                                 simplifyFactor: 0.5,
                                 precision: 5,
                                 minZoom: 17,
                                 maxZoom: 25,
             
                            },
                            group: "Test",
                            superGroup: "SuperTest"
                        },
                         hoofdgebouw: {
                            name: "Styling Polygons",
                            type: "agsFeature",
                            url: "http://app10.a.gis.local/arcgissql/rest/services/A_GeoService/operationallayers/MapServer/1",
                            visible: false,
                            layerOptions: {
                                simplifyFactor: 0.5,
                                precision: 5,
                                minZoom: 17,
                                 maxZoom: 25,
                                style: function (feature) {
                       
                                        return { color: "red", weight: 1 };
                                
                                }
                            },
                            group: "Test"
                        },
           
                        }
                     },
                 
                
                
    }}
        var _mapData = initData();
        var _layers = [];
        var layerDataService = {};

        $http.get('/layerControlData.json').then(function (res) {
            res.data.forEach(function (layer) {
                _layers.push(layer);
            }, this);
        });

        function _add() {

            layerDataService.add = function (item) {
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
            return _.flatten(_.map(obj, function (v) {
                return typeof v == "object" ? fn(v, key) : [];
            }), true);


        }

        function _changeVisibility(url) {

            var overlays = _mapData.layers.overlays;

            var res = fn(overlays, "url");

            res.forEach(function (layer) {
                if (layer.url == url) {
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
