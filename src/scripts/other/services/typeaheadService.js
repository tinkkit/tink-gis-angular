'use strict';
(function() {
    var module = angular.module('tink.gis');
    var typeAheadService = function(map, GISService, MapData, GisHelperService) {
        var _typeAheadService = {};
        _typeAheadService.init = function() {

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
                source: function(query, syncResults, asyncResults) {
                    if (query.replace(/[^0-9]/g, '').length < 6) { // if less then 6 numbers then we just search
                        var splitquery = query.split(' ');
                        var numbers = splitquery.filter(x => isCharDigit(x[0]));
                        var notnumbers = splitquery.filter(x => !isCharDigit(x[0]));

                        if (numbers.length == 1 && notnumbers.length >= 1) {
                            var huisnummer = numbers[0];
                            var straatnaam = notnumbers.join(' ');
                            console.log(straatnaam, huisnummer);
                            GISService.QueryCrab(straatnaam, huisnummer).then(function(data) {
                                console.log(data);
                                var features = data.features.map(function(feature) {
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
                            GISService.QuerySOLRLocatie(query.trim()).then(function(data) {
                                var arr = data.response.docs;
                                asyncResults(arr);
                            });
                        }

                    } else {
                        syncResults([]);
                        zoekXY(query);
                    }

                },
                templates: {
                    suggestion: suggestionfunc,
                    notFound: ['<div class="empty-message"><b>Geen resultaten gevonden</b></div>'],
                    empty: ['<div class="empty-message"><b>Zoek naar straten, POI en districten</b></div>']
                }

            }, {
                placeholder: 'Geef een X,Y / locatie of POI in.',
                'typeahead:select': function(ev, suggestion) {
                    MapData.CleanWatIsHier();
                    MapData.CleanTempFeatures();
                    if (suggestion.x && suggestion.y) {
                        var cors = {
                            x: suggestion.x,
                            y: suggestion.y
                        };
                        var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84(cors);
                        setViewAndPutDot(xyWGS84);
                    } else {
                        var idsplitted = suggestion.id.split("/");
                        var layerid = idsplitted[3];
                        QueryForTempFeatures(layerid, 'ObjectID=' + suggestion.key);

                    }
                }


            }).addTo(map);
            $('.typeahead').on('keyup', function(e) {
                if (e.which == 13) {
                    var firstsug = $(".tt-suggestion:first-child");
                    firstsug.trigger('click');
                }
            });
        }

        var zoekXY = function(search) {
            search = search.trim();
            var WGS84Check = GisHelperService.getWGS84CordsFromString(search);
            if (WGS84Check.hasCordinates) {
                setViewAndPutDot(WGS84Check);
            } else {
                var lambertCheck = GisHelperService.getLambartCordsFromString(search);
                if (lambertCheck.hasCordinates) {
                    var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84({ x: lambertCheck.x, y: lambertCheck.y });
                    setViewAndPutDot(xyWGS84);
                } else {
                    console.log('NIET GEVONDEN');
                }
            }
        };
        var QueryForTempFeatures = function(layerid, where) {
            locatieMapData.query()
                .layer(layerid)
                .where(where)
                .run(function(error, featureCollection, response) {
                    if (!error) {
                        console.log(error, featureCollection, response);
                        MapData.AddTempFeatures(featureCollection);
                    } else {
                        console.log("ERRRORRRRRRRRRRR", error);
                    }

                });
        }
        var locatieMapData = L.esri.dynamicMapLayer({
            maxZoom: 20,
            minZoom: 0,
            url: Gis.LocatieUrl,
            opacity: 1,
            layers: 0,
            continuousWorld: true,
            useCors: false
        });
        var isCharDigit = function(n) {
            return n != ' ' && n > -1;
        };
        var suggestionfunc = function(item) {
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
        var setViewAndPutDot = function(loc) {
            MapData.PanToPoint(loc);
            MapData.CreateDot(loc);
        };
        return _typeAheadService;
    };

    module.factory('TypeAheadService', typeAheadService);
})();