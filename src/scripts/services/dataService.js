'use strict';
(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var dataService = function (MapData, map) {
        var _dataService = {};
        _dataService.Export = function () {
            var exportObject = {};
            var arr = MapData.Themes.map(theme => {
                var returnitem = {};
                console.log(theme);
                returnitem.Naam = theme.Naam;
                returnitem.CleanUrl = theme.CleanUrl;
                returnitem.Layers = theme.Layers.map(layer => {
                    console.log(layer);
                })
                return returnitem;
            });
            exportObject.Themes = arr;
            exportObject.Extent = map.getBounds();
            console.log(exportObject.Extent);
            exportObject.IsKaart = true;
            return exportObject;
        }
        return _dataService;
    };
    module.$inject = ['MapData', 'map'];
    module.factory('DataService', dataService);
})();
