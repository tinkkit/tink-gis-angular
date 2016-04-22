'use strict';
(function () {
    var module = angular.module('tink.gis');
    var mapData = function (map, $rootScope, HelperService, ResultsData) {
        var _data = {};

        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.Loading = 0;
        _data.IsDrawing = false;
        _data.ThemeUrls = ['http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Afval/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Cultuur/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Jeugd/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/Onderwijs/MapServer/',
            'http://app11.p.gis.local/arcgissql/rest/services/P_Stad/stad/MapServer/'
        ];
        _data.Themes = [];
        var defaultlayer = { id: '', name: 'Alle Layers' };
        _data.SelectedLayer = defaultlayer;
        _data.VisibleLayers.unshift(defaultlayer);
        _data.ActiveInteractieKnop = ActiveInteractieButton.IDENTIFY;
        _data.DrawingType = DrawingOption.NIETS;
        _data.DrawingObject = null;
        _data.LastIdentifyBounds = null;
        _data.CleanDrawings = function () {
            if (_data.DrawingObject) {
                console.log(_data.DrawingObject);
                if (_data.DrawingObject.layer) { // if the layer (drawing) is created
                    _data.DrawingObject.layer._popup = null; // remove popup first because else it will fire close event which will do an other clean of the drawings which is not needed
                }
                _data.DrawingObject.disable();
                _data.DrawingObject = null;
                map.clearDrawings();
            }
        };
        var WatIsHierMarker = null;
        var WatIsHierOriginalMarker = null;
        _data.CleanAll = function () {
            _data.CleanDrawings();
            _data.CleanWatIsHier();
            _data.CleanSearch();
        };
        _data.CleanWatIsHier = function () {
            if (WatIsHierOriginalMarker) {
                WatIsHierOriginalMarker.clearAllEventListeners();
                WatIsHierOriginalMarker.closePopup();
                map.removeLayer(WatIsHierOriginalMarker);
                WatIsHierOriginalMarker = null;
            }
            if (WatIsHierMarker) {
                map.removeLayer(WatIsHierMarker);
                WatIsHierMarker = null;
            }
            straatNaam = null;
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
            var convertedxy = HelperService.ConvertWSG84ToLambert72(latlng);
            if (straatNaam) {
                var html =
                    '<div class="container container-low-padding">' +
                    '<div class="row row-no-padding">' +
                    '<div class="col-sm-4">' +
                    '<a href="templates/external/streetView.html?lat=' + latlng.lat + '&lng=' + latlng.lng + '" + target="_blank" >' +
                    '<img src="https://maps.googleapis.com/maps/api/streetview?size=100x50&location=' + latlng.lat + ',' + latlng.lng + '&pitch=-0.76" />' +
                    '</a>' +
                    '</div>' +
                    '<div class="col-sm-8">' +
                    '<div class="col-sm-12"><b>' + straatNaam + '</b></div>' +
                    // '<div class="row">' +
                    '<div class="col-sm-3">WGS84:</div><div class="col-sm-8" style="text-align: left;">' + latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' +
                    '<div class="col-sm-3">Lambert:</div><div class="col-sm-8" style="text-align: left;">' + convertedxy.x.toFixed(1) + ', ' + convertedxy.y.toFixed(1) + '</div><div class="col-sm-1"><i class="fa fa-files-o"></i></div>' +
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
            straatNaam = data.address.Street + " (" + data.address.Postal + ")";
            var greenIcon = L.icon({
                iconUrl: 'styles/fa-dot-circle-o_24_0_000000_none.png',
                iconSize: [24, 24],
                // iconAnchor: [0, 0]
            });


            WatIsHierMarker = L.marker([convertedBackToWSG84.x, convertedBackToWSG84.y], { icon: greenIcon }).addTo(map);

        };
        _data.CleanSearch = function () {
            ResultsData.CleanSearch();
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                map.removeLayer(_data.VisibleFeatures[x]); //eerst de
            }
            _data.VisibleFeatures.length = 0;
        };
        _data.PanToFeature = function (feature) {
            console.log("FEATUREPANTO");
            var tmplayer = feature.mapItem._layers[Object.keys(feature.mapItem._layers)[0]]
            if (tmplayer._latlngs) { // with s so it has bounds etc
                map.fitBounds(tmplayer.getBounds(), { paddingTopLeft: L.point(25, 25), paddingBottomRight: L.point(25, 25) });
            }
            else {
                // map.panTo(tmplayer.getLatLng());
            }
        };
        _data.GoToLastClickBounds = function () {
            map.fitBounds(_data.LastIdentifyBounds, { paddingTopLeft: L.point(0, 0), paddingBottomRight: L.point(0, 0) });
        };
        _data.SetZIndexes = function () {
            var counter = _data.Themes.length + 3;
            _data.Themes.forEach(theme => {
                theme.MapData.ZIndex = counter;
                if (theme.Type == ThemeType.ESRI) {
                    if (theme.MapData._currentImage) {
                        theme.MapData._currentImage._image.style.zIndex = counter;
                    }
                } else { // WMS
                    theme.MapData.bringToFront();
                    theme.MapData.setZIndex(counter);
                }
                counter--;

            });
        };
        _data.AddFeatures = function (features, theme, layerId) {
            if (features.length == 0) {
                ResultsData.EmptyResult = true;
            }
            else {
                ResultsData.EmptyResult = false;
                for (var x = 0; x < features.features.length; x++) {
                    var featureItem = features.features[x];

                    var layer = {};
                    if (featureItem.layerId != undefined && featureItem.layerId != null) {
                        layer = theme.AllLayers.find(x => x.id === featureItem.layerId);
                    }
                    else if (layerId != undefined && layerId != null) {
                        layer = theme.AllLayers.find(x => x.id === layerId);
                    } else {
                        console.log("NO LAYER ID WAS GIVEN EITHER FROM FEATURE ITEM OR FROM PARAMETER");
                    }
                    // featureItem.layer = layer;
                    featureItem.theme = theme;
                    featureItem.layerName = layer.name;
                    if (theme.Type === ThemeType.ESRI) {
                        layer.fields.forEach(field => {
                            if (field.type == "esriFieldTypeDate") {
                                var date = new Date(featureItem.properties[field.name])
                                var date_string = (date.getDate() + 1) + '/' + (date.getMonth() + 1) + "/" + date.getFullYear(); // "2013-9-23"
                                featureItem.properties[field.name] = date_string;
                            }
                        });
                        featureItem.displayValue = featureItem.properties[layer.displayField];
                        var mapItem = L.geoJson(featureItem, { style: Style.DEFAULT }).addTo(map);
                        _data.VisibleFeatures.push(mapItem);
                        featureItem.mapItem = mapItem;
                    }
                    else {
                        featureItem.displayValue = featureItem.properties[Object.keys(featureItem.properties)[0]];
                    }
                    ResultsData.JsonFeatures.push(featureItem);
                }
                console.log("applying");
                $rootScope.$apply();
            }
        };
        return _data;
    };
    module.$inject = ['ResultsData'];
    module.factory('MapData', mapData);
})();


