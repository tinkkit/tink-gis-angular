'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, MapService, MapData) {
        var _service = {};

        _service.Buffer = function (location, distance) {
            MapData.CleanMap();

            var geo = getGeo(location.geometry);
            delete geo.geometry.spatialReference;
            geo.geometries = geo.geometry;
            delete geo.geometry;
            var sergeo = serialize(geo);
            var url = 'http://app10.p.gis.local/arcgissql/rest/services/Utilities/Geometry/GeometryServer/buffer';
            var body = 'inSR=4326&outSR=4326&bufferSR=31370&distances=' + distance * 100 + '&unit=109006&unionResults=true&geodesic=false&geometries=%7B' + sergeo + '%7D&f=json';
            var prom = $http({
                method: 'POST',
                url: url,
                data: body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
            prom.success(function (response) {
                var buffer = MapData.CreateBuffer(response);
                MapService.Query(buffer);
            });
            return prom;
        };
        _service.Doordruk = function (location) {
            MapData.CleanMap();
            console.log(location);
            MapService.Query(location);
        };



        _service.BufferEnDoordruk = function (location, distance) {
            if (distance === 0) {
                _service.Doordruk(location);
            }
            else {
                _service.Buffer(location, distance);

            }

        };


        var getGeo = function (geometry) {
            var geoconverted = {};
            // geoconverted.inSr = 4326;

            // convert bounds to extent and finish
            if (geometry instanceof L.LatLngBounds) {
                // set geometry + geometryType
                geoconverted.geometry = L.esri.Util.boundsToExtent(geometry);
                geoconverted.geometryType = 'esriGeometryEnvelope';
                return geoconverted;
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
                geoconverted.geometry = L.esri.Util.geojsonToArcGIS(geometry);
                geoconverted.geometryType = L.esri.Util.geojsonTypeToArcGIS(geometry.type);
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
            else {
                geoconverted.geometry = L.esri.Util.geojsonToArcGIS(geometry);
                geoconverted.geometryType = L.esri.Util.geojsonTypeToArcGIS(geometry.type);
            }

            // confirm that our GeoJSON is a point, line or polygon
            // if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {

            return geoconverted;
            // }

            // warn the user if we havn't found an appropriate object

            // return geoconverted;
        };
        var serialize = function (params) {
            var data = '';
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var param = params[key];
                    var type = Object.prototype.toString.call(param);
                    var value;

                    if (data.length) {
                        data += ',';
                    }

                    if (type === '[object Array]') {
                        value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
                    } else if (type === '[object Object]') {
                        value = JSON.stringify(param);
                    } else if (type === '[object Date]') {
                        value = param.valueOf();
                    } else {
                        value = '"' + param + '"';
                    }
                    if (key == 'geometries') {
                        data += encodeURIComponent('"' + key + '"') + ':' + encodeURIComponent('[' + value + ']');
                    } else {
                        data += encodeURIComponent('"' + key + '"') + ':' + encodeURIComponent(value);
                    }
                }
            }

            return data;
        };
        return _service;
    };
    module.$inject = ['$http', 'MapService', 'MapData'];
    module.factory('GeometryService', service);
})();