'use strict';
(function () {
    var module = angular.module('tink.gis');
    var data = function () {
        var _data = {};
        _data.SelectedFeature = null;
        _data.JsonFeatures = [];
        _data.RequestCompleted = 0;
        _data.RequestStarted = 0;
        _data.GetRequestPercentage = function () {
            var percentage = Math.round(_data.RequestCompleted / _data.RequestStarted * 100);
            if (isNaN(percentage)) {
                return 100; // if something went wrong there is no point in sending back 0 lets just send back 100
            }
            return percentage;
        };
        _data.EmptyResult = false;
        _data.CleanSearch = function () {
            _data.SelectedFeature = null;
            _data.JsonFeatures.length = 0;
            _data.RequestStarted = _data.RequestStarted - _data.RequestCompleted;
            _data.RequestCompleted = 0;
        };
        return _data;
    };
    module.factory('ResultsData', data);
})();


