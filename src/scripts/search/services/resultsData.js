'use strict';
(function() {
    var module = angular.module('tink.gis.angular');
    var data = function() {
        var _data = {};
        _data.SelectedFeature = null;
        _data.JsonFeatures = [];
        _data.CleanSearch = function() {
            _data.JsonFeatures.length = 0;
            console.log("clearing");
            console.log(_data.JsonFeatures);
        };
        return _data;
    };
    module.factory('ResultsData', data);
})();


