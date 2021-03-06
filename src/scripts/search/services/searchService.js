'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function (ResultsData, map) {
        var _service = {};
        _service.DeleteFeature = function (feature) {
            var featureOfArray = ResultsData.JsonFeatures.find(x => x.layerName == feature.layerName && x.id == feature.id);
            var featureIndex = ResultsData.JsonFeatures.indexOf(featureOfArray);
            if (featureIndex > -1) {
                if (featureOfArray.mapItem) {
                    map.removeLayer(featureOfArray.mapItem);
                }
                ResultsData.JsonFeatures.splice(featureIndex, 1);
            }
        };
        _service.DeleteFeatureGroup = function (featureGroupName) {
            let toDelFeatures = [];
            ResultsData.JsonFeatures.forEach(function (feature) {
                if (feature.layerName === featureGroupName) {
                    toDelFeatures.push(feature);
                }
            });
            toDelFeatures.forEach(feat => {
                _service.DeleteFeature(feat);
            });

        };
        _service.ExportToCSV = function () {
            var csvContent = "", dataString = "", layName = "";
            csvContent += 'sep=;\n';
            csvContent += 'Laag;\n';
            _.sortBy(ResultsData.JsonFeatures, x => x.layerName).forEach(function (feature, index) {
                if (layName !== feature.layerName) {
                    layName = feature.layerName.replace(';', ',');
                    var tmparr = [];
                    for (var name in feature.properties) {
                        tmparr.push(name.replace(';', ','));
                    }
                    //adding geometry fields
                    tmparr.push("TYPE");
                    tmparr.push("Geometry");
                    var layfirstline = tmparr.join(";");

                    csvContent += layName + ";" + layfirstline + '\n';
                }
                var infoArray = _.values(feature.properties);
                //adding geometry field values
                infoArray.push(feature.geometry.type);
                infoArray.push(feature.geometry.coordinates);
                infoArray.unshift(layName);
                dataString = infoArray.join(";");
                console.log(dataString);
                // csvContent += dataString + "\n";
                csvContent += index < ResultsData.JsonFeatures.length ? dataString + '\n' : dataString;

            });
            var a = document.createElement('a');
            a.href = 'data:attachment/csv,' + escape(csvContent);
            a.target = '_blank';
            a.download = 'exportsik.csv';

            document.body.appendChild(a);
            a.click();
        };
        _service.ExportOneToCSV = function (result) {
            var props = Object.getOwnPropertyNames(result.properties).map(k => ({ key: k, value: result.properties[k] }));
            var geo = Object.getOwnPropertyNames(result.geometry).map(k => ({ key: k, value: result.geometry[k] }));
            //Pushing both seperately
            props.push(geo[0]);
            props.push(geo[1]);
            var csvContent = "", dataString = "", layName = "";
            csvContent += 'sep=;\n'
            csvContent += 'Laag;' + result.layerName + '\n';
            props.forEach(function (prop) {
                if (prop.key) {
                    prop.key = prop.key.toString().replace(';', ',')
                }
                if (prop.value) {
                    prop.value = prop.value.toString().replace(';', ',')
                }
                csvContent += prop.key + ';' + prop.value + '\n';
            })
            var a = document.createElement('a');
            a.href = 'data:attachment/csv,' + escape(csvContent);
            a.target = '_blank';
            a.download = 'exportsik.csv';

            document.body.appendChild(a);
            a.click();
        }
        _service.GetNextResult = function () {
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
        _service.GetPrevResult = function () {
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

