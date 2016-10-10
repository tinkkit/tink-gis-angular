'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function ($scope, ExternService, BaseLayersService, MapService, MapData, map, MapEvents, DrawService, HelperService, GISService) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        var init = function () {
            if (window.location.href.startsWith('http://localhost:9000/')) {
                var externproj = JSON.parse('{"naam":"Velo en fietspad!!","extent":{"_northEast":{"lat":"51.2336102032025","lng":"4.41993402409611"},"_southWest":{"lat":"51.1802290498612","lng":"4.38998297870121"}},"guid":"bfc88ea3-8581-4204-bdbc-b5f54f46050d","extentString":"51.2336102032025,4.41993402409611,51.1802290498612,4.38998297870121","isKaart":true,"uniqId":3,"creatorId":6,"creator":null,"createDate":"2016-08-22T10:55:15.525994","updaterId":6,"updater":null,"lastUpdated":"2016-08-22T10:55:15.525994","themes":[{"cleanUrl":"services/P_Stad/Mobiliteit/MapServer","naam":"Mobiliteit","type":"esri","visible":true,"layers":[{"id":"9","name":"fietspad","visible":true},{"id":"6","name":"velo","visible":true},{"id":"0","name":"Fiets en voetganger","visible":true}]}],"isReadOnly":false}');
                ExternService.Import(externproj);
            }
        } ();
        vm.ZoekenOpLocatie = true;
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = function () {
            return MapData.VisibleLayers;
        };
        vm.selectedLayer = function () {
            return MapData.SelectedLayer;
        }
        vm.drawingType = MapData.DrawingType;
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
            output += '<p>Laag: ' + item.layer + '</p></div>';
            return output;
        }
        // $('#locatiezoek.typeahead').typeahead({
        //     minLength: 3,
        //     highlight: true,
        //     classNames: {
        //         open: 'is-open',
        //         empty: 'is-empty',
        //     }
        // }, {
        //         async: true,
        //         limit: 99,
        //         display: 'name',
        //         displayKey: 'name',
        //         source: function (query, syncResults, asyncResults) {
        //             if (query.replace(/[^0-9]/g, "").length < 6) { // if less then 6 numbers then we just search
        //                 GISService.QuerySOLRLocatie(query).then(function (data) {
        //                     var arr = data.response.docs;
        //                     asyncResults(arr);
        //                 });
        //             }
        //             else {
        //                 syncResults([]);
        //                 vm.zoekXY(query);
        //             }

        //         },
        //         templates: {
        //             suggestion: suggestionfunc,
        //             notFound: ['<div class="empty-message"><b>Geen match gevonden</b></div>'],
        //             empty: ['<div class="empty-message"><b>Zoek naar straten, POI en districten</b></div>']
        //         }

        //     });


        // $('#locatiezoek.typeahead').bind('typeahead:change', function (ev, suggestion) {
        //     console.log("CHANGEEEEEEEEEEEE");
        //     console.log('Selection: ' + suggestion);
        // });

        // $('#locatiezoek.typeahead').bind('typeahead:selected', function (ev, suggestion) {
        //     MapData.CleanWatIsHier();
        //     MapData.CleanTempFeatures();
        //     switch (suggestion.layer.toLowerCase()) {
        //         case 'postzone':
        //             MapData.QueryForTempFeatures(20, 'ObjectID=' + suggestion.key);
        //             break;
        //         case 'district':
        //             MapData.QueryForTempFeatures(21, 'ObjectID=' + suggestion.key);
        //             break;
        //         default:
        //             var cors = {
        //                 x: suggestion.x,
        //                 y: suggestion.y
        //             };
        //             var xyWGS84 = HelperService.ConvertLambert72ToWSG84(cors);
        //             setViewAndPutDot(xyWGS84);
        //             break;

        //     }
        // });
        // $('.typeahead').on('typeahead:asyncrequest', function () {
        //     $('.Typeahead-spinner').show();
        // })
        // $('.typeahead').on('typeahead:asynccancel typeahead:asyncreceive', function () {
        //     $('.Typeahead-spinner').hide();
        // });

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
                    if (query.replace(/[^0-9]/g, "").length < 6) { // if less then 6 numbers then we just search
                        GISService.QuerySOLRLocatie(query).then(function (data) {
                            var arr = data.response.docs;
                            asyncResults(arr);
                        });
                    }
                    else {
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
            }
        ).addTo(map);


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
            MapData.CleanMap();
            MapData.DrawingType = drawOption; // pff must be possible to be able to sync them...
            vm.drawingType = drawOption;
            DrawService.StartDraw(drawOption);

        };
        vm.Loading = 0;
        vm.MaxLoading = 0;

        $scope.$watch(function () { return MapData.Loading; }, function (newVal, oldVal) {
            console.log('MapData.Loading at start', MapData.Loading);
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
            console.log('MapData.Loading at the end', MapData.Loading);

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


    });
    theController.$inject = ['BaseLayersService', 'ExternService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService', 'HelperService', 'GISService'];
})();
