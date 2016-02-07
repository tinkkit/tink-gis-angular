'use strict';


(function () {

  try {
    var module = angular.module('tink.gis.angular');
} catch (e) {
    var module = angular.module('tink.gis.angular', [ 'tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
}
    var helperService = function () {
        console.log('Helperservice CTOR');
        var _helperService = {};

        _helperService.clone = function (obj) {
            var copy;
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;
            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = _helperService.clone(obj[i]);
                }
                return copy;
            }
            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = _helperService.clone(obj[attr]);
                }
                return copy;
            }
            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        }


        _helperService.findNested = function (obj, key) {
            if (_.has(obj, key)) // or just (key in obj)
                return [obj];
            // elegant:
            return _.flatten(_.map(obj, function (v) {
                return typeof v == 'object' ? _helperService.findNested(v, key) : [];
            }), true);


        }

        return _helperService;
    };

    module.factory("HelperService", helperService);
})();