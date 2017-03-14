'use strict';
(function () {
    var module = angular.module('tink.gis');
    var mapData = function (map, $rootScope, HelperService, ResultsData, $compile, FeatureService) {
        var _data = {};

        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.IsDrawing = false;
        _data.Themes = [];
        _data.defaultlayer = { id: '', name: 'Alle Layers' };
        _data.VisibleLayers.unshift(_data.defaultlayer);
        _data.SelectedLayer = _data.defaultlayer;
        _data.DrawLayer = null;

        _data.SelectedFindLayer = _data.defaultlayer;

        _data.ResetVisibleLayers = function () {
            console.log("RestVisLayers");
            var curSelectedLayer = _data.SelectedLayer;
            _data.VisibleLayers.length = 0;
            _data.Themes.forEach(x => {
                _data.VisibleLayers = _data.VisibleLayers.concat(x.VisibleLayers);
            });
            _data.VisibleLayers = _data.VisibleLayers.sort(x => x.title);
            _data.VisibleLayers.unshift(_data.defaultlayer);
            var reselectLayer = _data.VisibleLayers.find(x => x.name == curSelectedLayer.name);
            if (reselectLayer) {
                _data.SelectedLayer = reselectLayer;
            }
            else {
                _data.SelectedLayer = _data.defaultlayer;
            }
        }
        _data.ActiveInteractieKnop = ActiveInteractieButton.NIETS;
        _data.DrawingType = DrawingOption.NIETS;
        _data.DrawingObject = null;
        _data.LastIdentifyBounds = null;
        _data.CleanDrawings = function () {
            if (_data.DrawingObject) {
                if (_data.DrawingObject.layer) { // if the layer (drawing) is created
                    _data.DrawingObject.layer._popup = null; // remove popup first because else it will fire close event which will do an other clean of the drawings which is not needed
                }
                if (_data.DrawingObject.disable) { // if it is a drawing item (not a point) then we must disable it
                    _data.DrawingObject.disable();
                }
                _data.DrawingObject = null;
                _data.DrawLayer = null;
                map.clearDrawings();
            }
        };
        _data.SetDrawPoint = function (latlng) {
            var pinIcon = L.AwesomeMarkers.icon({
                icon: 'fa-map-pin',
                markerColor: 'orange'
            });
            _data.SetDrawLayer(L.marker(latlng, { icon: pinIcon }).addTo(map));
        }
        _data.SetDrawLayer = function (layer) {
            _data.DrawLayer = layer;
            _data.DrawingObject = layer;
            map.addToDrawings(layer);
        }
        _data.SetStyle = function (mapItem, polyStyle, pointStyle) {
            if (mapItem) {
                var tmplayer = mapItem._layers[Object.keys(mapItem._layers)[0]];
                if (tmplayer._latlngs) { // with s so it is an array, so not a point so we can set the style
                    tmplayer.setStyle(polyStyle);
                }
                else {
                    tmplayer.setIcon(pointStyle);
                }
            }
        }
        var WatIsHierMarker = null;
        var WatIsHierOriginalMarker = null;
        _data.CleanMap = function () {
            _data.CleanDrawings();
            _data.CleanWatIsHier();
            _data.CleanBuffer();
            _data.CleanTempFeatures();
        };
        _data.bufferLaag = null;
        _data.CreateBuffer = function (gisBufferData) {
            var esrigj = esri2geo.toGeoJSON(gisBufferData);
            var gj = new L.GeoJSON(esrigj, { style: Style.BUFFER });
            _data.bufferLaag = gj.addTo(map);
            map.fitBounds(_data.bufferLaag.getBounds());
            return _data.bufferLaag;
        };
        _data.CleanBuffer = function () {
            var bufferitem = {};
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                if (_data.VisibleFeatures[x].isBufferedItem) {
                    bufferitem = _data.VisibleFeatures[x];
                    map.removeLayer(bufferitem);
                }
            }
            var index = _data.VisibleFeatures.indexOf(bufferitem);
            if (index > -1) {
                _data.VisibleFeatures.splice(index, 1);
            }
            if (_data.bufferLaag) {
                map.removeLayer(_data.bufferLaag);
                _data.bufferLaag = null;
            }
        };
        _data.CleanTempFeatures = function () {
            tempFeatures.forEach(tempfeature => {
                map.removeLayer(tempfeature);
            });
            tempFeatures.length = 0;
        };
        _data.GetZoomLevel = function () {
            return map.getZoom();
        };
        _data.GetScale = function () {
            return Scales[_data.GetZoomLevel()];
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
        };
        _data.UpdateDisplayed = function (Themes) {
            var currentScale = _data.GetScale();
            _data.Themes.forEach(theme => {
                if (theme.Type == ThemeType.ESRI) {
                    theme.UpdateDisplayed(currentScale);
                }
            });
        };
        _data.Apply = function () {
            console.log('apply');
            $rootScope.$applyAsync();
        };
        _data.CreateOrigineleMarker = function (latlng, addressFound, straatNaam) {
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
            var html = "";
            var minwidth = 0;
            if (straatNaam) {
                html =
                    '<div class="container container-low-padding">' +
                    '<div class="row row-no-padding">' +
                    '<div class="col-sm-4" >' +
                    '<a href="http://maps.google.com/maps?q=&layer=c&cbll=' + latlng.lat + ',' + latlng.lng + '" + target="_blank" >' +
                    '<img tink-tooltip="Ga naar streetview" tink-tooltip-align="bottom" src="https://maps.googleapis.com/maps/api/streetview?size=100x50&location=' + latlng.lat + ',' + latlng.lng + '&pitch=-0.76" />' +
                    '</a>' +
                    '</div>' +
                    '<div class="col-sm-8 mouse-over">' +
                    '<div class="col-sm-12"><b>' + straatNaam + '</b></div>' +
                    '<div class="col-sm-3">WGS84:</div><div id="wgs" class="col-sm-8" style="text-align: left;">{{WGS84LatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyWGS()"  tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"  ></i></div>' +
                    '<div class="col-sm-3">Lambert:</div><div id="lambert" class="col-sm-8" style="text-align: left;">{{LambertLatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow"  ng-click="CopyLambert()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                minwidth = 300;
            }
            else {
                html =
                    '<div class="container container-low-padding">' +
                    '<div class="row row-no-padding mouse-over">' +
                    '<div class="col-sm-3">WGS84:</div><div id="wgs" class="col-sm-8 " style="text-align: left;">{{WGS84LatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyWGS()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' +
                    '<div class="col-sm-3">Lambert:</div><div id="lambert" class="col-sm-8" style="text-align: left;">{{LambertLatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyLambert()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' +
                    '</div>' +
                    '</div>';
                minwidth = 200;

            }
            var linkFunction = $compile(html);
            var newScope = $rootScope.$new();
            newScope.LambertLatLng = convertedxy.x.toFixed(1) + ', ' + convertedxy.y.toFixed(1);
            newScope.CopyLambert = function () {
                copyToClipboard('#lambert');
            };
            newScope.CopyWGS = function () {
                copyToClipboard('#wgs');
            };
            newScope.WGS84LatLng = latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6);
            var domele = linkFunction(newScope)[0];
            var popup = WatIsHierOriginalMarker.bindPopup(domele, { minWidth: minwidth, closeButton: true }).openPopup();
            popup.on('popupclose', function () {
                _data.CleanWatIsHier();
            });

        };
        var copyToClipboard = function (element) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(element).text()).select();
            document.execCommand("copy");
            $temp.remove();
        }
        _data.CreateDot = function (loc) {
            _data.CleanWatIsHier();
            var dotIcon = L.icon({
                iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABKVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUJ5OrAAAAYnRSTlMAAQIEBQYICgsNDg8QERITFxgaGyAhJSYoKS8wMTU2ODk7QkRPVFVXXV5fYWJkZ2lrbHF3eHyAg4aMjpSXmJ6jpqirra+wsrS3ucDByszP0dPc3uDi5Obo6evt7/P19/n7/fGWhfoAAAERSURBVBgZXcGHIoJhGIbh5+uXZO+sZK/slZ0tMwkhwn3+B+HtrxTXpapgKOj0n4slC8DX+binWrEcFe8T+uV2qXXhqcSdYvYGmurD/Ylv4M6TLwGk21QSugROVBQBjgKqcFvAmMwNPHiqclfwEpC6gB4VRdeWumQagai0CLcy7hwzK7MPe9IFzMjE8XVKisGr9AyDMhl8C5LagYA+ISLzhm9VUjPgKQvDMtv4hiR1Ak5JWJFpyGPOZMYhI03Bo4oadvKZuJNJwabUDIyqVjfQK+kICmFV1T1BWqYVuA+rIpgCIiqaBD5GVNKXAzZUso7JLkcjQ3NpzIFT2RS11lTVdkzFdbf+aJk+zH4+n813qOwHxGRbFJ0DoNgAAAAASUVORK5CYII=',
                iconSize: [24, 24]
            });
            WatIsHierMarker = L.marker([loc.x, loc.y], { icon: dotIcon }).addTo(map);
        }
        _data.CleanSearch = function () {
            ResultsData.CleanSearch();
            var bufferitem = null;
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                if (!_data.VisibleFeatures[x].isBufferedItem) {
                    map.removeLayer(_data.VisibleFeatures[x]);
                }
                else {
                    bufferitem = _data.VisibleFeatures[x];
                }
            }
            _data.VisibleFeatures.length = 0;
            if (bufferitem) {
                _data.VisibleFeatures.push(bufferitem);
            }
        };
        _data.PanToPoint = function (loc) {
            map.setView(L.latLng(loc.x, loc.y), 12);
        };
        _data.PanToFeature = function (feature) {
            console.log("PANNING TO FEATURE");
            var featureBounds = feature.getBounds();
            map.fitBounds(featureBounds);
        };
        _data.PanToItem = function (item) {
            if (item.toGeoJSON().geometry.type == 'Point') {
                _data.PanToPoint({ x: item.toGeoJSON().geometry.coordinates[1], y: item.toGeoJSON().geometry.coordinates[0] });
            }
            else {
                _data.PanToFeature(item);
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
        var tempFeatures = [];
        _data.AddTempFeatures = function (featureCollection) {
            featureCollection.features.forEach(feature => {
                var mapItem = L.geoJson(feature, { style: Style.DEFAULT }).addTo(map);
                _data.PanToFeature(mapItem);
                tempFeatures.push(mapItem);
            })
        }
        _data.AddFeatures = function (features, theme, layerId) {
            var bufferid = null;
            var bufferlayer = null;
            var buffereditem = _data.VisibleFeatures.find(x => x.isBufferedItem);
            if (buffereditem) {
                bufferid = buffereditem.toGeoJSON().features[0].id;
                bufferlayer = buffereditem.toGeoJSON().features[0].layer;
            }
            if (!features || features.features.length == 0) {
                ResultsData.EmptyResult = true;
            } else {
                ResultsData.EmptyResult = false;
                for (var x = 0; x < features.features.length; x++) {
                    var featureItem = features.features[x];

                    var layer = {};
                    if (featureItem.layerId != null) {
                        layer = theme.AllLayers.find(x => x.id === featureItem.layerId);
                    }
                    else if (layerId != null) {
                        layer = theme.AllLayers.find(x => x.id === layerId);
                    } else {
                        console.log('NO LAYER ID WAS GIVEN EITHER FROM FEATURE ITEM OR FROM PARAMETER');
                    }
                    featureItem.theme = theme;
                    featureItem.layerName = layer.name;
                    if (theme.Type === ThemeType.ESRI) {
                        layer.fields.forEach(field => {
                            if (field.type == 'esriFieldTypeDate') {
                                var date = new Date(featureItem.properties[field.name]);
                                var date_string = (date.getDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(); // "2013-9-23"
                                featureItem.properties[field.name] = date_string;
                            }
                        });
                        featureItem.displayValue = featureItem.properties[layer.displayField];
                        if (!featureItem.displayValue) {
                            var displayFieldProperties = layer.fields.find(x => x.name == layer.displayField);
                            if (displayFieldProperties) {
                                if (featureItem.properties[displayFieldProperties.alias]) {
                                    featureItem.displayValue = featureItem.properties[displayFieldProperties.alias];
                                }
                                else {
                                    featureItem.displayValue = 'LEEG';
                                }
                            } else {
                                featureItem.displayValue = 'LEEG';
                            }
                        }
                        if (featureItem.displayValue.toString().trim() == '') {
                            featureItem.displayValue = 'LEEG'
                        }
                        if (bufferid && bufferid == featureItem.id && bufferlayer == featureItem.layer) {
                            featureItem.mapItem = buffereditem;
                        }
                        else {
                            var mapItem = L.geoJson(featureItem, { style: Style.DEFAULT }).addTo(map);
                            _data.VisibleFeatures.push(mapItem);
                            featureItem.mapItem = mapItem;
                        }
                    }
                    else {
                        featureItem.displayValue = featureItem.properties[Object.keys(featureItem.properties)[0]];
                    }
                    ResultsData.JsonFeatures.push(featureItem);
                }
                $rootScope.$applyAsync();
            }
        };
        return _data;
    };
    module.$inject = ['ResultsData', 'FeatureService'];
    module.factory('MapData', mapData);
})();


