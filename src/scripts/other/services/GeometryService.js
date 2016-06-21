'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, map, MapData) {
        var _service = {};

        _service.Buffer = function (location, distance) {
            var geo = getGeo(location);
            var sergeo = serialize(geo);
            var url = 'http://geodata.antwerpen.be/arcgissql/rest/services/Utilities/Geometry/GeometryServer/buffer?geometries=' + sergeo + '&outSR=4326&bufferSR=&distances=' + distance + '&unit=&unionResults=true&geodesic=false&inSR=4326&f=pjson';
            console.log(url);
            var prom = $http.get(url);
            prom.success(function (response) {
                console.log(response);
                var out = L.esri.Util.responseToFeatureCollection(response);
                console.log(out);
            });
            return prom;
        };

        var getGeo = function (geometry) {
            var geo = null;
            // convert bounds to extent and finish
            if (geometry instanceof L.LatLngBounds) {
                // set geometry + geometryType
                geo = L.esri.Util.boundsToExtent(geometry);
                return geo;
            }

            // convert L.Marker > L.LatLng
            if (geometry.getLatLng) {
                geometry = geometry.getLatLng();
            }

            // convert L.LatLng to a geojson point and continue;
            if (geometry instanceof L.LatLng) {
                geometry = {
                    type: 'Point',
                    coordinates: [geometry.lng, geometry.lat]
                };
            }

            // handle L.GeoJSON, pull out the first geometry
            if (geometry instanceof L.GeoJSON) {
                // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
                geometry = geometry.getLayers()[0].feature.geometry;
                geo = L.esri.Util.geojsonToArcGIS(geometry);
            }

            // Handle L.Polyline and L.Polygon
            if (geometry.toGeoJSON) {
                geometry = geometry.toGeoJSON();
            }

            // handle GeoJSON feature by pulling out the geometry
            if (geometry.type === 'Feature') {
                // get the geometry of the geojson feature
                geometry = geometry.geometry;
            }

            // confirm that our GeoJSON is a point, line or polygon
            // if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon') {
            geo = L.esri.Util.geojsonToArcGIS(geometry);
            // }


            return geo;
        };
        var serialize = function (params) {
            var data = '';

            // params.f = params.f || 'json';

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var param = params[key];
                    var type = Object.prototype.toString.call(param);
                    var value;

                    if (data.length) {
                        data += '&';
                    }

                    if (type === '[object Array]') {
                        value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
                    } else if (type === '[object Object]') {
                        value = JSON.stringify(param);
                    } else if (type === '[object Date]') {
                        value = param.valueOf();
                    } else {
                        value = param;
                    }

                    // data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                    data += encodeURIComponent(value);
                }
            }

            return data;
        };
        return _service;
    };
    module.$inject = ['$http', 'map', 'MapData'];
    module.factory('GeometryService', service);
})();