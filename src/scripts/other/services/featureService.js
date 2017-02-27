'use strict';
(function () {
    var module = angular.module('tink.gis');

    var featureService = function () {
        var _featureService = {};
        _featureService.layerManagementButtonIsEnabled = true;
        _featureService.deleteLayerButtonIsEnabled = true;
        _featureService.exportToCSVButtonIsEnabled = true;
        _featureService.defaultLayerName = null;
        // _featureService.ConfigResultsButton = function (isEnabled, text, callback) {
        //     _featureService.extraresultsButtonText = text;
        //     _featureService.extraResultsButtonCallBack = callback;
        //     _featureService.extraResultsButtonIsEnabled = isEnabled;
        // }
        // _featureService.extraResultsButtonIsEnabled = false;
        // _featureService.extraresultsButtonText = 'extra knop text';
        // _featureService.extraResultsButtonCallBack = null;
        _featureService.ConfigResultButton = function (isEnabled, text, callback) {
            _featureService.resultButtonText = text;
            _featureService.extraResultButtonCallBack = callback;
            _featureService.extraResultButtonIsEnabled = isEnabled;
        }
        _featureService.extraResultButtonIsEnabled = false;
        _featureService.resultButtonText = 'extra knop text';
        _featureService.extraResultButtonCallBack = null;
        return _featureService;
    };
    module.factory('FeatureService', featureService);
})();
