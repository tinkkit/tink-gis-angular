'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function ($scope, ExternService, BaseLayersService, MapService, MapData, map, MapEvents, DrawService, HelperService, GISService, PopupService, $interval) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        var init = function () {
            if (window.location.href.startsWith('http://localhost:9000/')) {
                var externproj = JSON.parse('{"naam":"Velo en fietspad!!","extent":{"_northEast":{"lat":"51.2336102032025","lng":"4.41993402409611"},"_southWest":{"lat":"51.1802290498612","lng":"4.38998297870121"}},"guid":"bfc88ea3-8581-4204-bdbc-b5f54f46050d","extentString":"51.2336102032025,4.41993402409611,51.1802290498612,4.38998297870121","isKaart":true,"uniqId":3,"creatorId":6,"creator":null,"createDate":"2016-08-22T10:55:15.525994","updaterId":6,"updater":null,"lastUpdated":"2016-08-22T10:55:15.525994","themes":[{"cleanUrl":"services/P_Stad/Mobiliteit/MapServer","naam":"Mobiliteit","type":"esri","visible":true,"layers":[{"id":"9","name":"fietspad","visible":true},{"id":"6","name":"velo","visible":true},{"id":"0","name":"Fiets en voetganger","visible":true}]}],"isReadOnly":false}');
                ExternService.Import(externproj);
                PopupService.Success("Dev autoload", 'Velo en fietspad loaded because you are in DEV.', function () { alert('onclicktestje'); })
                // PopupService.ExceptionFunc = function(exception) { alert(exception.message); }
                // PopupService.ErrorWithException("exceptiontest", "exceptiontextmessage", { message: 'OH NO EXCEP'})
            }
        } ();
        vm.ZoekenOpLocatie = true;
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        $scope.$watch(function () { return MapData.ActiveInteractieKnop; }, function (data) {
            vm.activeInteractieKnop = data;
        }, true);
        vm.drawingType = MapData.DrawingType;
        $scope.$watch(function () { return MapData.DrawingType; }, function (data) {
            vm.drawingType = data;
        }, true);
        // $scope.$watch(function () { return MapData.SelectedFindLayer; }, function (data) {
        //     // if (data != vm.selectedFindLayer) {
        //     vm.selectedFindLayer = data;
        //     // }
        // }, true);
        // $scope.$watch(function () { return MapData.SelectedLayer; }, function (data) {
        //     // if (data != vm.selectedLayer) {
        //     vm.selectedLayer = data;
        //     // }
        // }, true);
        vm.SelectableLayers = function () {
            return MapData.VisibleLayers;
        };
        vm.selectedLayer = function () {
            return MapData.SelectedLayer;
        }
        vm.selectedFindLayer = function () {
            return MapData.SelectedFindLayer;
        }
        vm.showMetenControls = false;
        vm.showDrawControls = false;
        vm.zoekLoc = '';

        var suggestionfunc = function (item) {
            var output = '<div>' + item.name;
            if (item.attribute1value) {
                output += '<p>' + item.attribute1name + ': ' + item.attribute1value + '</p>';
            }

            if (item.attribute2value) {
                output += '<p>' + item.attribute2name + ': ' + item.attribute2value + '</p>';
            }
            if (item.layer) {
                output += '<p>Laag: ' + item.layer + '</p>';
            }
            output += '</div>'
            return output;
        }
        function CheckForStringWithInteger() {
            return
        }
        let isCharDigit = function (n) {
            return n != ' ' && n > -1;
        };
        var features = [];
        L.control.typeahead({
            minLength: 3,
            highlight: true,
            classNames: {
                open: 'is-open',
                empty: 'is-empty',
            }
        }, {
                async: true,
                limit: 99,
                display: 'name',
                displayKey: 'name',
                source: function (query, syncResults, asyncResults) {
                    if (query.replace(/[^0-9]/g, '').length < 6) { // if less then 6 numbers then we just search
                        var splitquery = query.split(' ');
                        var numbers = splitquery.filter(x => isCharDigit(x[0]));
                        var notnumbers = splitquery.filter(x => !isCharDigit(x[0]));

                        if (numbers.length == 1 && notnumbers.length == 1) {
                            var huisnummer = numbers[0];
                            var straatnaam = notnumbers.join(' ');
                            console.log(straatnaam, huisnummer);
                            GISService.QueryCrab(straatnaam, huisnummer).then(function (data) {
                                console.log(data);
                                features = data.features.map(function (feature) {
                                    var obj = {};
                                    obj.straatnaam = feature.attributes.STRAATNM;
                                    obj.huisnummer = feature.attributes.HUISNR;
                                    // obj.busnummer = feature.attributes.BUSNR;
                                    obj.id = feature.attributes.OBJECTID;
                                    obj.x = feature.geometry.x;
                                    obj.y = feature.geometry.y;
                                    obj.name = (obj.straatnaam + " " + obj.huisnummer).trim();
                                    return obj;
                                }).slice(0, 10);
                                console.log(features);
                                asyncResults(features);

                            });
                        } else {
                            GISService.QuerySOLRLocatie(query.trim()).then(function (data) {
                                var arr = data.response.docs;
                                asyncResults(arr);
                            });
                        }

                    } else {
                        syncResults([]);
                        vm.zoekXY(query);
                    }

                },
                templates: {
                    suggestion: suggestionfunc,
                    notFound: ['<div class="empty-message"><b>Geen match gevonden</b></div>'],
                    empty: ['<div class="empty-message"><b>Zoek naar straten, POI en districten</b></div>']
                }

            },
            {
                placeholder: 'Geef een X,Y / locatie of POI in.',
                'typeahead:select': function (ev, suggestion) {
                    MapData.CleanWatIsHier();
                    MapData.CleanTempFeatures();
                    if (suggestion.layer) {
                        switch (suggestion.layer.toLowerCase()) {
                            case 'postzone':
                                MapData.QueryForTempFeatures(20, 'ObjectID=' + suggestion.key);
                                break;
                            case 'district':
                                MapData.QueryForTempFeatures(21, 'ObjectID=' + suggestion.key);
                                break;
                            default:
                                var cors = {
                                    x: suggestion.x,
                                    y: suggestion.y
                                };
                                var xyWGS84 = HelperService.ConvertLambert72ToWSG84(cors);
                                setViewAndPutDot(xyWGS84);
                                break;

                        }
                    }
                    else {
                        var cors = {
                            x: suggestion.x,
                            y: suggestion.y
                        };
                        var xyWGS84 = HelperService.ConvertLambert72ToWSG84(cors);
                        setViewAndPutDot(xyWGS84);
                    }

                }
            }
        ).addTo(map);
        vm.interactieButtonChanged = function (ActiveButton) {
            // MapData.CleanMap();
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
                    MapData.DrawingType = DrawingOption.GEEN;
                    // vm.drawingButtonChanged(DrawingOption.GEEN);
                    break;
            }
        };
        vm.zoekLaag = function (search) {
            MapData.CleanMap();
            MapService.Find(search);
        };
        var setViewAndPutDot = function (loc) {
            MapData.PanToPoint(loc);
            MapData.CreateDot(loc);
        };
        //ng-keyup="$event.keyCode == 13 && mapctrl.zoekLocatie(mapctrl.zoekLoc)"
        vm.zoekXY = function (search) {
            search = search.trim();
            var WGS84Check = HelperService.getWGS84CordsFromString(search);
            if (WGS84Check.hasCordinates) {
                setViewAndPutDot(WGS84Check);
            } else {
                var lambertCheck = HelperService.getLambartCordsFromString(search);
                if (lambertCheck.hasCordinates) {
                    var xyWGS84 = HelperService.ConvertLambert72ToWSG84({ x: lambertCheck.x, y: lambertCheck.y });
                    setViewAndPutDot(xyWGS84);
                } else {
                    console.log('NIET GEVONDEN');
                }
            }
        };
        vm.drawingButtonChanged = function (drawOption) {
            if (drawOption == DrawingOption.LIJN || drawOption == DrawingOption.POLYGON || drawOption == DrawingOption.NIETS || drawOption == DrawingOption.VIERKANT) {
                MapData.CleanMap();
                MapData.CleanSearch();
            }
            if (drawOption == DrawingOption.AFSTAND || drawOption == DrawingOption.OPPERVLAKTE) {
                // MapData.CleanDrawings();
            }

            // MapData.CleanMap();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            DrawService.StartDraw(drawOption);
        };
        vm.Loading = 0;
        vm.MaxLoading = 0;

        // $scope.$watch(function () { return MapData.Loading; }, function (newVal, oldVal) {
        //     console.log('MapData.Loading at start', MapData.Loading);
        //     vm.Loading = newVal;
        //     if (oldVal == 0) {
        //         vm.MaxLoading = newVal;
        //     }
        //     if (vm.MaxLoading < oldVal) {
        //         vm.MaxLoading = oldVal;
        //     }
        //     if (newVal == 0) {
        //         vm.MaxLoading = 0;
        //     }
        //     console.log('MapLoading val: ' + newVal + '/' + vm.MaxLoading);
        //     console.log('MapData.Loading at the end', MapData.Loading);

        // });
        vm.selectpunt = function () {
            // MapData.CleanMap();
            MapData.DrawingType = DrawingOption.GEEN; // pff must be possible to be able to sync them...
            // vm.drawingType = DrawingOption.NIETS;
        };
        vm.layerChange = function () {
            // MapData.CleanMap();
            MapData.SelectedLayer = vm.selectedLayer;
        };
        vm.findLayerChange = function () {
            // MapData.CleanMap();
            MapData.SelectedFindLayer = vm.selectedFindLayer;
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
        vm.IsBaseMap1 = true;
        vm.toonBaseMap1 = function () {
            vm.IsBaseMap1 = true;
            map.removeLayer(BaseLayersService.basemap2);
            map.addLayer(BaseLayersService.basemap1);
        };
        vm.toonBaseMap2 = function () {
            vm.IsBaseMap1 = false;
            map.removeLayer(BaseLayersService.basemap1);
            map.addLayer(BaseLayersService.basemap2);
        };
        vm.baseMap1Naam = function () {
            return BaseLayersService.basemap1Naam;
        }
        vm.baseMap2Naam = function () {
            return BaseLayersService.basemap2Naam;
        }
        vm.cancelPrint = function () {
            let html = $('html');
            if (html.hasClass('print')) {
                html.removeClass('print');
            }
            vm.portrait(); // also put it back to portrait view

        }
        vm.print = function () {
            window.print();
        }
        vm.printStyle = 'portrait';
        var cssPagedMedia = (function () {
            var style = document.createElement('style');
            document.head.appendChild(style);
            return function (rule) {
                style.id = 'tempstyle';
                style.innerHTML = rule;
            };
        } ());

        cssPagedMedia.size = function (oriantation) {
            cssPagedMedia('@page {size: A4 ' + oriantation + '}');
        };
        vm.setPrintStyle = function (oriantation) {
            vm.printStyle = oriantation;
            cssPagedMedia.size(oriantation);
        };
        vm.setPrintStyle('portrait');

        vm.portrait = function () {
            let html = $('html');
            vm.setPrintStyle('portrait');
            if (html.hasClass('landscape')) {
                html.removeClass('landscape');
            }
            map.invalidateSize(false);
        }
        vm.landscape = function () {
            let html = $('html');
            vm.setPrintStyle('landscape');
            if (!html.hasClass('landscape')) {
                html.addClass('landscape');
            }
            map.invalidateSize(false);
        }

        vm.ZoekenInLagen = function () {
            vm.ZoekenOpLocatie = false;
            $('.twitter-typeahead').addClass('hide-element');
        }

        vm.fnZoekenOpLocatie = function () {
            vm.ZoekenOpLocatie = true;
            if ($(".twitter-typeahead").hasClass("hide-element")) {
                $('.twitter-typeahead').removeClass('hide-element');
            }
            else {
                return vm.ZoekenOpLocatie;
            }
        }
        vm.gpstracking = false;
        var gpstracktimer = null;
        vm.zoomToGps = function () {
            vm.gpstracking = !vm.gpstracking;

            if (vm.gpstracking == false) {
                $interval.cancel(gpstracktimer);
                MapEvents.ClearGPS();
            }
            else {
                map.locate({ setView: true, maxZoom: 16 });
                gpstracktimer = $interval(function () {
                    map.locate({ setView: false });
                    console.log('gps refresh');
                }, 5000);
            }
        }

    });
    theController.$inject = ['BaseLayersService', 'ExternService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService', 'HelperService', 'GISService', 'PopupService', '$interval'];
})();
