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
                returnitem.Naam = theme.Naam;
                returnitem.CleanUrl = theme.CleanUrl;
                returnitem.Type = theme.Type;
                returnitem.Visible = theme.Visible;
                returnitem.Layers = theme.AllLayers.filter(x => { return x.enabled == true; }).map(layer => {
                    var returnlayer = {};
                    // returnlayer.enabled = layer.enabled; // will always be true... since we only export the enabled layers
                    returnlayer.visible = layer.visible;
                    returnlayer.name = layer.name;
                    returnlayer.id = layer.id;
                    return returnlayer;
                });
                return returnitem;
            });
            exportObject.Themes = arr;
            exportObject.Extent = map.getBounds();
            exportObject.IsKaart = true;

            return exportObject;
        };
        _dataService.Import = function (project) {
            console.log(project);
            _dataService.setExtent(project.Extent);
        };
        _dataService.setExtent = function (extent) {
            map.setBounds(extent);
        };


        return _dataService;
    };
    module.$inject = ['MapData', 'map'];
    module.factory('DataService', dataService);
})();
