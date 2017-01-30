'use strict';
(function () {
    var module = angular.module('tink.gis');
    var typeAheadService = function (map, GISService, MapData, HelperService) {
        var _typeAheadService = {};
        _typeAheadService.init = function () {

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

                            if (numbers.length == 1 && notnumbers.length >= 1) {
                                var huisnummer = numbers[0];
                                var straatnaam = notnumbers.join(' ');
                                console.log(straatnaam, huisnummer);
                                GISService.QueryCrab(straatnaam, huisnummer).then(function (data) {
                                    console.log(data);
                                    var features = data.features.map(function (feature) {
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
        }
        var isCharDigit = function (n) {
            return n != ' ' && n > -1;
        };
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
        var setViewAndPutDot = function (loc) {
            MapData.PanToPoint(loc);
            MapData.CreateDot(loc);
        };
        return _typeAheadService;
    };

    module.factory('TypeAheadService', typeAheadService);
})();