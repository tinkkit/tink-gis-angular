'use strict';
(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('mapController', function ($scope, BaseLayersService, MapService, MapData, map, MapEvents, DrawService, HelperService, GISService) {
        //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
        var vm = this;
        vm.layerId = '';
        vm.ZoekenOpLocatie = true;
        vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
        vm.SelectableLayers = MapData.VisibleLayers;
        vm.selectedLayer = MapData.SelectedLayer;
        vm.drawingType = MapData.DrawingType;
        vm.showMetenControls = false;
        vm.showDrawControls = false;
        vm.zoekLoc = '';
        // var itemsdata = [];

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
        $('#locatiezoek.typeahead').typeahead({
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
                source: function (query, syncResults, asyncResults) {
                    if (query == 'mech') {
                        syncResults([])
                    }
                    else {
                        var prom = GISService.QuerySOLRLocatie(query);
                        prom.then(function (data) {
                            var arr = data.response.docs;
                            asyncResults(arr);
                        });
                    }

                },
                templates: {
                    suggestion: suggestionfunc,
                    notFound: ['<div class="empty-message"><b>Geen match gevonden</b></div>'],
                    empty: ['<div class="empty-message"><b>Zoek naar straten, POI en districten</b></div>']
                }

            });


        $('#locatiezoek.typeahead').bind('typeahead:change', function (ev, suggestion) {
            console.log("CHANGEEEEEEEEEEEE");
            console.log('Selection: ' + suggestion);
        });

        $('#locatiezoek.typeahead').bind('typeahead:selected', function (ev, suggestion) {
            MapData.CleanWatIsHier();
            MapData.CleanTempFeatures();
            if (suggestion.layer.toLowerCase() === 'postzone') {
                MapData.QueryForTempFeatures(20, 'ObjectID=' + suggestion.key);
            }
            else {
                var cors = {
                    x: suggestion.x,
                    y: suggestion.y
                };

                var xyWGS84 = HelperService.ConvertLambert72ToWSG84(cors);
                setViewAndPutDot(xyWGS84);
            }
        });
        $('.typeahead').on('typeahead:asyncrequest', function () {
            $('.Typeahead-spinner').show();
        })
        $('.typeahead').on('typeahead:asynccancel typeahead:asyncreceive', function () {
            $('.Typeahead-spinner').hide();
        });
        // $('.typeahead').bind('typeahead:select', function (ev, suggestion) {
        //     console.log("JAAAAAAAAAAAAINFUNCTIEEEEEEEEEEEEEEEEEEE");

        //     if (suggestion.layer.toLowerCase() === 'postzone') {
        //         console.log('POSTZONEEEEEEE');
        //     }

        //     var cors = {
        //         x: suggestion.x,
        //         y: suggestion.y
        //     };

        //     var xyWGS84 = HelperService.ConvertLambert72ToWSG84(cors);
        //     setViewAndPutDot(xyWGS84);
        //     console.log('Selection: ' + suggestion);
        // });
        // $("[data-provide='typeahead']").blur(function (e) {
        //     if ($('.dropdown-menu').is(":visible")) {
        //         $(this).data('typeahead').click(e);
        //     }
        // });
        // $('#locatiezoek.typeahead').on('input', function (e) {
        //     vm.zoekLoc = e.currentTarget.value;
        //     var search = vm.zoekLoc;
        //     if (search.length > 2) {
        //         var prom = GISService.QuerySOLRLocatie(search);
        //         prom.then(function (data) {
        //             var arr = data.response.docs;
        //             var names = arr.map(x => x.name);
        //             console.log(names);
        //             itemsdata = arr;
        //             engine.clear();
        //             engine.add(names);
        //             var promise = engine.initialize();

        //             promise
        //                 .done(function () {
        //                     $('#locatiezoek.typeahead').typeahead('open');
        //                     console.log('ready to go!');
        //                 })
        //                 .fail(function () {
        //                     console.log('err, something went wrong :(');
        //                 });
        //         });
        //     }
        //     else {
        //         console.log("engine clear");
        //         engine.clear();
        //         $('#locatiezoek.typeahead').typeahead('close');

        //     }
        // });
        // vm.zoekLocChanged = function () {
        //     console.log("ZOEKLOCCHANGED");
        //     var search = vm.zoekLoc;
        //     if (search.length > 2) {
        //         var prom = GISService.QuerySOLRLocatie(search);
        //         prom.then(function (data) {
        //             var arr = data.response.docs;
        //             var names = arr.map(x => x.name);
        //             console.log(names);
        //             itemsdata = arr;
        //             engine.clear();
        //             engine.add(names);
        //         });
        //     }
        // };
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
            map.setView(L.latLng(loc.x, loc.y), 12);
            MapData.CreateDot(loc);

        };
        //ng-keyup="$event.keyCode == 13 && mapctrl.zoekLocatie(mapctrl.zoekLoc)" 
        vm.zoekLocatie = function (search) {
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
    });
    theController.$inject = ['BaseLayersService', 'MapService', 'MapData', 'map', 'MapEvents', 'DrawService', 'HelperService', 'GISService'];
})();