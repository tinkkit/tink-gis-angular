'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    var service = function () {
        var _service = {};
        proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438'
            + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs');
        // proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs');
        var getApiURL = function () {
            if (window.location.href.startsWith('https://stadinkaart-a.antwerpen.be/')) {
                console.log('ACC');
                return 'https://stadinkaart-a.antwerpen.be/digipolis.stadinkaart.api/'
            }
            else if (window.location.href.startsWith('https://stadinkaart-o.antwerpen.be/')) {
                console.log('O');
                return 'https://stadinkaart-o.antwerpen.be/digipolis.stadinkaart.api/'
            }
            else {
                console.log('LOC');
                return 'https://localhost/digipolis.stadinkaart.api/'
            }

        }
        _service.CreateProxyUrl = function (url) {
            return getApiURL() + 'Proxy/go?url=' + encodeURIComponent(url);
        };
        _service.UnwrapProxiedData = function (data) {
            if (typeof data == 'string' && data.startsWith('{"listOfString":')) {
                data = $.parseJSON(data).listOfString;
            }
            else if (typeof data == 'object' && data.listOfString) {
                data = data.listOfString;
            }
            if (typeof data == 'string' && data.startsWith('{')) {
                data = JSON.parse(data);
            }
            return data;
        }
        _service.ConvertWSG84ToLambert72 = function (coordinates) {
            var result = proj4('EPSG:31370', [(coordinates.lng || coordinates.x), (coordinates.lat || coordinates.y)]);
            return {
                x: result[0],
                y: result[1]
            };
        };
        _service.ConvertLambert72ToWSG84 = function (coordinates) {
            var x = (coordinates.lng || coordinates.x || coordinates[0]);
            var y = (coordinates.lat || coordinates.y || coordinates[1]);
            var result = proj4('EPSG:31370', 'WGS84', [x, y]);
            return {
                y: result[0],
                x: result[1]
            };
        };
        let isCharDigit = function (n) {
            return n != ' ' && n > -1;
        };
        _service.getWGS84CordsFromString = function (search) {
            var returnobject = {};
            returnobject.hasCordinates = false;
            returnobject.error = null;
            returnobject.x = null;
            returnobject.y = null;
            var currgetal = '';
            var samegetal = false;
            var aantalmetcorrectesize = 0;
            var hasaseperater = false;
            var getals = [];
            if ((search.contains('51.') || search.contains('51,')) && (search.contains('4.') || search.contains('4,'))) {
                for (let char of search) {
                    if (isCharDigit(char)) {
                        if (samegetal) {
                            currgetal = currgetal + char;
                        }
                        else {
                            currgetal = '' + char;
                            samegetal = true;
                        }
                    }
                    else {
                        if ((currgetal == '51' || currgetal == '4') && (char == '.' || char == ',') && hasaseperater == false) {
                            currgetal = currgetal + char;
                            aantalmetcorrectesize++;
                            hasaseperater = true;
                        }
                        else {
                            if (currgetal != '') {
                                getals.push(currgetal);
                            }
                            currgetal = '';
                            samegetal = false;
                            hasaseperater = false;

                        }
                    }
                }
                if (currgetal != '') {
                    getals.push(currgetal);
                }
            }
            if (aantalmetcorrectesize == 2 && getals.length == 2) {
                returnobject.x = getals[0].replace(',', '.');
                returnobject.y = getals[1].replace(',', '.');
                returnobject.hasCordinates = true;
                return returnobject;
            }
            else {
                returnobject.error = 'Incorrect format: X,Y is required';
                return returnobject;
            }
        };
        _service.getLambartCordsFromString = function (search) {
            var returnobject = {};
            returnobject.hasCordinates = false;
            returnobject.error = null;
            returnobject.x = null;
            returnobject.y = null;
            var getals = [];
            var currgetal = '';
            var samegetal = false;
            var aantalmet6size = 0;
            var hasaseperater = false;
            for (let char of search) {
                if (isCharDigit(char)) {
                    if (samegetal) {
                        currgetal = currgetal + char;
                    }
                    else {
                        currgetal = '' + char;
                        samegetal = true;
                    }
                } else {
                    if (currgetal.length == 6) {
                        if ((currgetal > 125000 && currgetal < 175000) || (currgetal > 180000 && currgetal < 240000)) {
                            aantalmet6size++;
                        }
                        else {
                            returnobject.error = 'Out of bounds cordinaten voor Antwerpen.';
                            return returnobject;
                        }
                    }


                    if ((char == ',' || char == '.') && hasaseperater == false) {
                        hasaseperater = true;
                        currgetal = currgetal + char;
                    } else {
                        hasaseperater = false;
                        getals.push(currgetal);
                        currgetal = '';
                        samegetal = false;
                    }

                }

            }


            if (currgetal != '') {
                if (currgetal.length == 6) {
                    aantalmet6size++;
                }
                getals.push(currgetal);
            }

            if (aantalmet6size == 2 && getals.length == 2) {
                returnobject.x = getals[0].replace(',', '.');
                returnobject.y = getals[1].replace(',', '.');
                returnobject.hasCordinates = true;
                return returnobject;
            }
            else {
                returnobject.error = 'Incorrect format: Lat,Lng is required';
                return returnobject;
            }
        };

        return _service;
    };
    // module.$inject = ['$http', 'map'];
    module.factory('HelperService', service);
})();