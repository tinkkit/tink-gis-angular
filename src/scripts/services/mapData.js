'use strict';
(function () {
    var module = angular.module('tink.gis.angular');
    var mapData = function (map, $rootScope, HelperService) {
        var _data = {};
        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.JsonFeatures = [];
        _data.ThemeUrls = ['http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Afval/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Cultuur/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Jeugd/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/Onderwijs/MapServer?f=pjson',
            'http://app10.p.gis.local/arcgissql/rest/services/P_Stad/stad/MapServer?f=pjson'
        ];
        _data.Themes = [];
        var defaultlayer = { id: '', name: 'Alle Layers' };
        _data.VisibleLayers.unshift(defaultlayer);
        _data.SelectedLayer = defaultlayer;
        _data.WatIsHierMarker = null;
        _data.WatIsHierOriginalMarker = null;
        _data.CleanWatIsHierOriginalMarker = function () {
            if (_data.WatIsHierOriginalMarker !== null) {
                map.removeLayer(_data.WatIsHierOriginalMarker);
                _data.WatIsHierOriginalMarker = null;
            }

        };
        _data.CleanWatIsHierMarker = function () {
            if (_data.WatIsHierMarker !== null) {
                map.removeLayer(_data.WatIsHierMarker);
                _data.WatIsHierMarker = null;
            }
        };
        _data.CleanWatIsHier = function () {
            _data.CleanWatIsHierMarker();
            _data.CleanWatIsHierOriginalMarker();
        };
        _data.CreateOrigineleMarker = function (latlng, addressFound) {
            if (addressFound) {
                _data.WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng]).addTo(map);
            }
            else {
                _data.WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng]).addTo(map);
            }
        };
        _data.CreateWatIsHierMarker = function (data) {
            var convertedBackToWSG84 = HelperService.ConvertLambert72ToWSG84(data.location)
            _data.WatIsHierMarker = L.marker([convertedBackToWSG84.x, convertedBackToWSG84.y]).addTo(map);
            _data.WatIsHierMarker.bindPopup("<h4>" + data.address.Street + "</h4>" +
                "<br>WGS84 x:" + convertedBackToWSG84.x + " y: " + convertedBackToWSG84.y +
                "<br>Lambert x:" + data.location.x + " y: " + data.location.y).openPopup();
        };
        _data.CleanMap = function () {
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                map.removeLayer(_data.VisibleFeatures[x]); //eerst de 
            }
            _data.VisibleFeatures.length = 0;
            _data.JsonFeatures.length = 0;
            map.clearDrawings();
        };
        _data.AddFeatures = function (features) {
            for (var x = 0; x < features.features.length; x++) {
                var featureItem = features.features[x];
                var myStyle = {
                    "fillOpacity": 0
                };
                _data.JsonFeatures.push(featureItem);
                var mapItem = L.geoJson(featureItem, { style: myStyle }).addTo(map);
                _data.VisibleFeatures.push(mapItem);
            }
            $rootScope.$apply();
        };
        return _data;
    };
    // module.$inject = ['map'];
    module.factory('MapData', mapData);
})();


