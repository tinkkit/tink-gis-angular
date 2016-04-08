'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function() {
        var _service = {};
        proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438'
            + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs');
        // proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs');
        
        _service.ConvertWSG84ToLambert72 = function(coordinates) {
            var result = proj4('EPSG:31370', [(coordinates.lng || coordinates.x), (coordinates.lat || coordinates.y)]);
            return {
                x: result[0],
                y: result[1]
            };
        };
        _service.ConvertLambert72ToWSG84 = function(coordinates) {
            var x = (coordinates.lng || coordinates.x || coordinates[0]);
            var y = (coordinates.lat || coordinates.y || coordinates[1]);
            var result = proj4('EPSG:31370', 'WGS84', [x, y]);
            console.log(result);
            return {
                y: result[0],
                x: result[1]
            };
        };

        return _service;
    };
    // module.$inject = ["$http", 'map'];
    module.factory("HelperService", service);
})();