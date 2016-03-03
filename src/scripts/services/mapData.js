'use strict';
(function () {
    var module = angular.module('tink.gis.angular');
    var mapData = function (map, $rootScope, HelperService) {
        var _data = {};

        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.JsonFeatures = [];
        _data.IsDrawing = false;
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
        _data.ActiveInteractieKnop = ActiveInteractieButton.SELECT;
        _data.DrawingType = DrawingOption.NIETS;
        _data.DrawingObject = null;
        _data.RemoveDrawings = function () {
            if (_data.DrawingObject) {
                _data.DrawingObject.disable();
                // map.removeLayer(_data.DrawingObject);
                _data.DrawingObject = null;
            }
        };
        var WatIsHierMarker = null;
        var WatIsHierOriginalMarker = null;
        _data.CleanWatIsHierOriginalMarker = function () {
            if (WatIsHierOriginalMarker) {
                map.removeLayer(WatIsHierOriginalMarker);
                WatIsHierOriginalMarker = null;
            }
        };
        _data.CleanWatIsHierMarker = function () {
            console.log(WatIsHierMarker);
            if (WatIsHierMarker) {
                WatIsHierMarker.clearAllEventListeners();
                WatIsHierMarker.closePopup();
                map.removeLayer(WatIsHierMarker);
                WatIsHierMarker = null;
            }
        };
        _data.CleanAll = function () {
            _data.RemoveDrawings();
            _data.CleanMap();
            _data.CleanWatIsHier();
        };
        _data.CleanWatIsHier = function () {
            _data.CleanWatIsHierMarker();
            _data.CleanWatIsHierOriginalMarker();
        };
        _data.CreateOrigineleMarker = function (latlng, addressFound) {
            if (addressFound) {
                var foundMarker = L.AwesomeMarkers.icon({
                    icon: 'fa-map-marker',
                    markerColor: 'orange'

                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: foundMarker, opacity: 0.5 }).addTo(map);
            }
            else {
                var notFoundMarker = L.AwesomeMarkers.icon({
                    // icon: 'fa-frown-o',
                    icon: 'fa-question',
                    markerColor: 'red',
                    spin: true
                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: notFoundMarker }).addTo(map);
            }
        };
        _data.CreateWatIsHierMarker = function (data) {
            var convertedBackToWSG84 = HelperService.ConvertLambert72ToWSG84(data.location)

            var addressMarker = L.AwesomeMarkers.icon({
                icon: 'fa-dot-circle-o',
                markerColor: 'green'
            });

            WatIsHierMarker = L.marker([convertedBackToWSG84.x, convertedBackToWSG84.y], { icon: addressMarker }).addTo(map);
            WatIsHierMarker.bindPopup("<h4>" + data.address.Street + "</h4>" +
                "<br>WGS84 x:" + convertedBackToWSG84.x.toFixed(6) + " y: " + convertedBackToWSG84.y.toFixed(6) +
                "<br>Lambert x:" + data.location.x.toFixed(1) + " y: " + data.location.y.toFixed(1)).openPopup();
            WatIsHierMarker.on('popupclose', function (event) {
                _data.CleanWatIsHier();
            });
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


