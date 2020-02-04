'use strict';

(function () {
    var module = angular.module('tink.gis');

    var featureService = function featureService() {
        var _featureService = {};
        _featureService.layerManagementButtonIsEnabled = true;
        _featureService.deleteLayerButtonIsEnabled = true;
        _featureService.exportToCSVButtonIsEnabled = true;
        _featureService.defaultLayerName = null;
        _featureService.ConfigResultButton = function (isEnabled, text, callback, conditioncallback) {
            _featureService.resultButtonText = text;
            _featureService.extraResultButtonIsEnabled = isEnabled;
            if (callback) {
                _featureService.extraResultButtonCallBack = callback;
            }
            if (conditioncallback) {
                _featureService.extraResultButtonConditionCallBack = conditioncallback;
            }
        };
        _featureService.extraResultButtonIsEnabled = false;
        _featureService.resultButtonText = 'extra knop text';
        _featureService.extraResultButtonCallBack = function () {};
        _featureService.extraResultButtonConditionCallBack = function () {
            return _featureService.extraResultButtonIsEnabled;
        };
        return _featureService;
    };
    module.factory('FeatureService', featureService);
})();
