'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(ResultsData, map) {
        var _service = {};
        _service.DeleteFeature = function(feature) {
            var featureIndex = ResultsData.JsonFeatures.indexOf(feature);
            if (featureIndex > -1) {
                console.log(feature);
                map.removeLayer(feature.mapItem);
                ResultsData.JsonFeatures.splice(featureIndex, 1);
            }
        };
        _service.DeleteFeatureGroup = function(featureGroupName) {
            ResultsData.JsonFeatures.forEach(function(feature) {
                if (feature.layerName === featureGroupName) {
                    _service.DeleteFeature(feature);
                }
            });
        };
        _service.ExportToCSV = function() {
            var csvContent = "data:text/csv;charset=utf-8,";
            var dataString = "";
            var layName = "";

            ResultsData.JsonFeatures.forEach(function(feature, index) {
                if (layName !== feature.layerName) {
                    layName = feature.layerName;
                    var tmparr = [];
                    for (var name in feature.properties) {
                        tmparr.push(name);
                    }
                    var layfirstline = tmparr.join(",");

                    csvContent += layName + "\n" + layfirstline + "\n";
                }
                var infoArray = _.values(feature.properties)
                dataString = infoArray.join(",");
                console.log(dataString);
                // csvContent += dataString + "\n";
                csvContent += index < ResultsData.JsonFeatures.length ? dataString + "\n" : dataString;

            });
            var encodedUri = encodeURI(csvContent);
            window.open(encodedUri);
        };
        return _service;
    };
    module.factory("SearchService", service);
})();

