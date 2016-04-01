'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function(ResultsData, map) {
        var _service = {};
        _service.DeleteFeature = function(feature) {
            var featureIndex = ResultsData.JsonFeatures.indexOf(feature);
            if (featureIndex > -1) {
                if (feature.mapItem) {
                    map.removeLayer(feature.mapItem);
                }
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
            var csvContent = ""; // "data:text/csv;charset=utf-8,";
            var dataString = "";
            var layName = "";
            csvContent += 'Laag;' + "\n"

            ResultsData.JsonFeatures.forEach(function(feature, index) {
                if (layName !== feature.layerName) {
                    layName = feature.layerName;
                    var tmparr = [];
                    for (var name in feature.properties) {
                        tmparr.push(name);
                    }
                    var layfirstline = tmparr.join(";");

                    csvContent += layName + ";" + layfirstline + "\n";
                }
                var infoArray = _.values(feature.properties);
                infoArray.unshift(layName);
                dataString = infoArray.join(";");
                console.log(dataString);
                // csvContent += dataString + "\n";
                csvContent += index < ResultsData.JsonFeatures.length ? dataString + "\n" : dataString;

            });
            var a = document.createElement('a');
            a.href = 'data:attachment/csv,' + encodeURIComponent(csvContent);
            a.target = '_blank';
            a.download = 'exportsik.csv';

            document.body.appendChild(a);
            a.click();
            // var encodedUri = encodeURI(csvContent);
            // window.open(encodedUri, 'exportsik.csv');
        };
        _service.GetNextResult = function() {
            var index = ResultsData.JsonFeatures.indexOf(ResultsData.SelectedFeature);
            var layerName = ResultsData.SelectedFeature.layerName;
            if (index < ResultsData.JsonFeatures.length - 1) { // check for nextResult exists
                var nextItem = ResultsData.JsonFeatures[index + 1];
                if (nextItem.layerName === layerName) {
                    return nextItem;
                }
            }
            return null;

        };
        _service.GetPrevResult = function() {
            var index = ResultsData.JsonFeatures.indexOf(ResultsData.SelectedFeature);
            var layerName = ResultsData.SelectedFeature.layerName;
            if (index > 0) { // check or prevResult exists
                var prevItem = ResultsData.JsonFeatures[index - 1];
                if (prevItem.layerName === layerName) {
                    return prevItem;
                }
            }
            return null;
        };

        return _service;
    };
    module.factory("SearchService", service);
})();

