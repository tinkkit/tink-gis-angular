
'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function (MapData, $http, $q, GISService, ThemeCreater, ThemeService) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];

        _service.AddOrUpdateTheme = function (selectedTheme, copySelectedTheme) {
            console.log('AddOrUpdateTheme');
            var allChecked = true;
            var noneChecked = true;
            var hasAChange = false;
            for (var x = 0; x < copySelectedTheme.AllLayers.length; x++) { // aha dus update gebeurt, we gaan deze toevoegen.
                var copyLayer = copySelectedTheme.AllLayers[x];
                var realLayer = selectedTheme.AllLayers[x];
                if (realLayer.enabled != copyLayer.enabled) {
                    hasAChange = true;
                }
                realLayer.enabled = copyLayer.enabled;
                if (copyLayer.enabled === false) { // check or all the checkboxes are checked
                    allChecked = false;
                }
                else {
                    noneChecked = false;
                }
            }
            var alreadyAdded = MapData.Themes.find(x => { return x.cleanUrl === selectedTheme.cleanUrl }) != undefined;
            if (alreadyAdded) {
                if (hasAChange) {
                    selectedTheme.status = ThemeStatus.UPDATED;
                } else {
                    selectedTheme.status = ThemeStatus.UNMODIFIED;
                }
                if (noneChecked) {
                    selectedTheme.status = ThemeStatus.DELETED;
                }
            }
            else {
                selectedTheme.status = ThemeStatus.NEW;
            }
            if (allChecked && selectedTheme != ThemeStatus.DELETED) {
                selectedTheme.Added = true; // here we can set the Added to true when they are all added
            }
            if (!allChecked && !noneChecked && selectedTheme != ThemeStatus.DELETED) {
                selectedTheme.Added = null; // if not all added then we put it to null
            }
            if (selectedTheme == ThemeStatus.DELETED) {
                selectedTheme.Added = false;
            }
            ThemeService.AddAndUpdateThemes([selectedTheme]);
      
        }
        return _service;
    };
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeCreater', 'ThemeService'];
    module.factory('LayerManagementService', service);
})();