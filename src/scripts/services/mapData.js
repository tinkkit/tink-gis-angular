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
                WatIsHierOriginalMarker.clearAllEventListeners();
                WatIsHierOriginalMarker.closePopup();
                map.removeLayer(WatIsHierOriginalMarker);
                WatIsHierOriginalMarker = null;
            }
        };
        _data.CleanWatIsHierMarker = function () {
            console.log(WatIsHierMarker);
            if (WatIsHierMarker) {
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
                    icon: 'fa-frown-o',
                    // icon: 'fa-question',
                    markerColor: 'red',
                    // spin: true
                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: notFoundMarker }).addTo(map);
            }
            var convertedxy = HelperService.ConvertWSG84ToLambert72(latlng);
            if (straatNaam) {
                var html =
                    '<div class="container container-low-padding">' +
                    '<div class="row row-no-padding">' +
                    '<div class="col-sm-4">' +
                    '<img src="https://placehold.it/100x50" />' +
                    '</div>' +
                    '<div class="col-sm-8">' +
                    '<div class="col-sm-12">' + straatNaam + '</div>' +
                    // '<div class="row">' +
                    '<div class="col-sm-3">WGS84</div><div class="col-sm-8" style="text-align: center;">' + latlng.lat.toFixed(6) + ',' + latlng.lng.toFixed(6) + '</div><div class="col-sm-1"><i class="fa fa-clipboard"></i></div>' +
                    '<div class="col-sm-3">Lambert</div><div class="col-sm-8" style="text-align: center;">' + convertedxy.x.toFixed(1) + ',' + convertedxy.y.toFixed(1) + '</div><div class="col-sm-1"><i class="fa fa-clipboard"></i></div>' +
                    // '<div class="row">Lambert (x,y):' + convertedxy.x.toFixed(1) + ',' + convertedxy.y.toFixed(1) + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                // var html = '<tink-Theme></tink-Theme>'
                WatIsHierOriginalMarker.bindPopup(html, { minWidth: 300 }).openPopup();
            }
            else {
                WatIsHierOriginalMarker.bindPopup(
                    'WGS84 (x,y):' + latlng.lat.toFixed(6) + ',' + latlng.lng.toFixed(6) +
                    '<br>Lambert (x,y):' + convertedxy.x.toFixed(1) + ',' + convertedxy.y.toFixed(1)).openPopup();
            }


            WatIsHierOriginalMarker.on('popupclose', function (event) {
                _data.CleanWatIsHier();
            });
        };
        var straatNaam = null;
        _data.CreateWatIsHierMarker = function (data) {
            var convertedBackToWSG84 = HelperService.ConvertLambert72ToWSG84(data.location)
            straatNaam = data.address.Street;
            var greenIcon = L.icon({
                iconUrl: 'styles/fa-dot-circle-o_24_0_000000_none.png',
                iconSize: [24, 24], 
                // iconAnchor: [0, 0]
            });


            WatIsHierMarker = L.marker([convertedBackToWSG84.x, convertedBackToWSG84.y], { icon: greenIcon }).addTo(map);

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
                    'fillOpacity': 0
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


