'use strict';
(function() {
    var module = angular.module('tink.gis');
    var data = function() {
        var _data = {};
        _data.SelectedFeature = null;
        _data.JsonFeatures = [];
        _data.Loading = 0;
        _data.EmptyResult = false;
        _data.CleanSearch = function() {
            _data.JsonFeatures.length = 0;
            _data.SelectedFeature = null;
        };
        return _data;
    };
    module.factory('ResultsData', data);
})();


