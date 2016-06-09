/// <reference path='../services/mapService.js' />

'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, MapData, map, MapEvents, DrawService, HelperService) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        vm.layerId = '';
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = MapData.VisibleLayers;
        vm.selectedLayer = MapData.SelectedLayer;
        vm.drawingType = MapData.DrawingType
        vm.showMetenControls = false;
        vm.showDrawControls = false;
        vm.interactieButtonChanged = function (ActiveButton) {
            MapData.CleanMap();
            MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
            vm.activeInteractieKnop = ActiveButton;
            vm.showMetenControls = false;
            vm.showDrawControls = false;
            switch (ActiveButton) {
                case ActiveInteractieButton.SELECT:
                    vm.showDrawControls = true;
                    vm.selectpunt();
                    break;
                case ActiveInteractieButton.METEN:
                    vm.showMetenControls = true;
                    vm.drawingButtonChanged(DrawingOption.AFSTAND);
                    break;
            }
        };
        function isCharDigit(n) {
            return n != ' ' && n > -1;
        }
        vm.zoekLocChanged = function (search) {
            search = search.trim();
            var lambertCheck = isLambertCordinaat(search);
            console.log(lambertCheck);
            if (lambertCheck.hasCordinates) {
                var xyWGS84 = HelperService.ConvertLambert72ToWSG84({ x: lambertCheck.X, y: lambertCheck.Y });
                map.setView(L.latLng(xyWGS84.x, xyWGS84.y));
            }
        };
        var isWGS84Cordinaat = function (search) {
            if ((search.contains('51.') || search.contains('51,')) && (search.contains('4.') || search.contains('4,'))) {
                return true;
            }
            return false;
        };
        var isLambertCordinaat = function (search) {
            var returnobject = {};
            returnobject.hasCordinates = false;
            returnobject.error = null;
            returnobject.X = null;
            returnobject.Y = null;
            var getals = [];
            var currgetal = '';
            var samegetal = false;
            var aantalmet6size = 0;
            var hasaseperater = false;
            for (let char of search) {
                if (isCharDigit(char)) {
                    if (samegetal) {
                        currgetal = currgetal + char;
                    }
                    else {
                        currgetal = '' + char;
                        samegetal = true;
                    }
                }
                else {
                    if (currgetal.length == 6) {
                        if (currgetal[0] == '1') {
                            if (currgetal[1] == '3' || currgetal[1] == '4' || currgetal[1] == '5') {
                                aantalmet6size++;
                            }
                            else {
                                returnobject.error = 'Out of bounds cordinaten voor Antwerpen.';
                                return returnobject;
                            }
                        }
                        else if (currgetal[0] == '2') {
                            if (currgetal[1] == '0' || currgetal[1] == '1' || currgetal[1] == '2') {
                                aantalmet6size++;
                            } else {
                                returnobject.error = 'Out of bounds cordinaten voor Antwerpen.';
                                return returnobject;
                            }
                        }


                        if ((char == ',' || char == '.') && hasaseperater == false) {
                            hasaseperater = true;
                            currgetal = currgetal + char;
                        } else {
                            hasaseperater = false;
                            getals.push(currgetal);
                            currgetal = '';
                            samegetal = false;
                        }
                    }
                    else {
                        if (currgetal != '') {
                            getals.push(currgetal);
                        }
                        hasaseperater = false;
                        currgetal = '';
                        samegetal = false;
                    }

                }
            }
            if (currgetal != '') {
                getals.push(currgetal);
            }

            if (aantalmet6size == 2 && getals.length == 2) {
                returnobject.X = getals[0];
                returnobject.Y = getals[1];
                returnobject.hasCordinates = true;
                return returnobject;
            }
            else {
                returnobject.error = 'Incorrect format: Lat,Lng is required';
                return returnobject;
            }
        };
        vm.drawingButtonChanged = function (drawOption) {
            MapData.CleanMap();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            DrawService.StartDraw(drawOption);

        };
        vm.Loading = 0;
        vm.MaxLoading = 0;

        $scope.$watch(function () { return MapData.Loading; }, function (newVal, oldVal) {
            vm.Loading = newVal;
            if (oldVal == 0) {
                vm.MaxLoading = newVal;
            }
            if (vm.MaxLoading < oldVal) {
                vm.MaxLoading = oldVal;
            }
            if (newVal == 0) {
                vm.MaxLoading = 0;
            }
            console.log('MapLoading val: ' + newVal + '/' + vm.MaxLoading);
        });
        vm.selectpunt = function () {
            MapData.CleanMap();
            MapData.DrawingType = DrawingOption.NIETS; // pff must be possible to be able to sync them...
            vm.drawingType = DrawingOption.NIETS;
        };
        vm.layerChange = function () {
            MapData.CleanMap();
            // console.log('vm.sel: ' + vm.selectedLayer.id + '/ MapData.SelectedLayer: ' + MapData.Layer.SelectedLayer.id);
            MapData.SelectedLayer = vm.selectedLayer;
        };
        vm.zoomIn = function () {
            map.zoomIn();
        };
        vm.zoomOut = function () {
            map.zoomOut();
        };
        vm.fullExtent = function () {
            map.setView(new L.LatLng(51.2192159, 4.4028818), 16);
        };
        vm.kaartIsGetoond = true;
        vm.toonKaart = function () {
            vm.kaartIsGetoond = true;
            map.removeLayer(BaseLayersService.luchtfoto);
            map.addLayer(BaseLayersService.kaart);
        };
        vm.toonLuchtfoto = function () {
            vm.kaartIsGetoond = false;
            map.removeLayer(BaseLayersService.kaart);
            map.addLayer(BaseLayersService.luchtfoto);
        };
    });
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService', 'HelperService'];
})();