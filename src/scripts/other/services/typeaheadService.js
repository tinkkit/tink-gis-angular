'use strict';
(function() {
    var module = angular.module('tink.gis');
    var typeAheadService = function(map, GISService, MapData, GisHelperService) {
        var _typeAheadService = {};
        _typeAheadService.districts = [];
        _typeAheadService.lastData = [];
        _typeAheadService.lastStreetNameId = null;
        _typeAheadService.lastStreetName = "";
        _typeAheadService.numbers = null;

        //Hardcoded districtcodes + names
        _typeAheadService.districts.push({postcode: 2000, district: "Antwerpen"});
        _typeAheadService.districts.push({postcode: 2018, district: "Antwerpen"});
        _typeAheadService.districts.push({postcode: 2020, district: "Antwerpen"});
        _typeAheadService.districts.push({postcode: 2030, district: "Antwerpen"});
        _typeAheadService.districts.push({postcode: 2040, district: "Berendrecht"});
        _typeAheadService.districts.push({postcode: 2050, district: "Antwerpen"});
        _typeAheadService.districts.push({postcode: 2060, district: "Antwerpen"});
        _typeAheadService.districts.push({postcode: 2100, district: "Deurne"});
        _typeAheadService.districts.push({postcode: 2140, district: "Borgerhout"});
        _typeAheadService.districts.push({postcode: 2170, district: "Merksem"});
        _typeAheadService.districts.push({postcode: 2180, district: "Ekeren"});
        _typeAheadService.districts.push({postcode: 2600, district: "Berchem"});
        _typeAheadService.districts.push({postcode: 2610, district: "Wilrijk"});
        _typeAheadService.districts.push({postcode: 2660, district: "Hoboken"});

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
                        var hasComma = query.indexOf(',');

                        // if search isn't coordinates only search for the first part
                        if (hasComma > -1) {
                            query = query.replace(query.substr(hasComma, query.length), '');
                        }

                        var splitquery = query.split(' ');
                        var numbers = splitquery.filter(x => isCharDigit(x[0]));
                        var notnumbers = splitquery.filter(x => !isCharDigit(x[0]));
                        _typeAheadService.numbers = numbers.length;
                        if(query.length == 3){ //FIXES BUG SIK-496
                            _typeAheadService.lastStreetNameId = null;
                        }
                        if (numbers.length == 1 && (notnumbers.length >= 1 && !(notnumbers.length === 1 && notnumbers[0].toUpperCase() === 'KAAINUMMER'))) {
                            var huisnummer = numbers[0];
                            var strnmid = [];
                            var count = 0;
                            _typeAheadService.lastData.forEach(street => {
                                var notnumberscombined = '';
                                notnumbers.forEach(n => {
                                    notnumberscombined += ' ' + n;
                                })
                                notnumberscombined = notnumberscombined.trim();
                                if(_typeAheadService.lastStreetName.trim() != notnumberscombined){
                                    typeAheadService.lastStreetNameId = null;
                                }
                                if(street.streetNameId) 
                                {
                                    strnmid.push(street.streetNameId);
                                }
                                if (_typeAheadService.lastStreetNameId != null){
                                    strnmid = [];
                                    strnmid.push(_typeAheadService.lastStreetNameId);
                                }
                                if(!street.name.toLowerCase().trim().contains(notnumberscombined.toLowerCase())){
                                    strnmid = [];
                                }
                            });
                            var straatnaam = encodeURIComponent(notnumbers.join(' '));
                            if(strnmid.length != 0){
                                GISService.QueryCrab(strnmid, huisnummer).then(function(data) {
                                    console.log(data);
                                    var features = data.features.map(function(feature) {
                                        var obj = {};
                                        obj.straatnaam = feature.attributes.STRAATNM;
                                        obj.huisnummer = feature.attributes.HUISNR;
                                        // obj.busnummer = feature.attributes.BUSNR;
                                        obj.id = feature.attributes.OBJECTID;
                                        obj.x = feature.geometry.x;
                                        obj.y = feature.geometry.y;
                                        obj.name = (obj.straatnaam.split('_')[0] + " " + obj.huisnummer).trim();
                                        obj.postcode = feature.attributes.POSTCODE;
                                        _typeAheadService.districts.forEach(district => {
                                            if(district.postcode == obj.postcode){
                                                obj.district = district.district;
                                            }
                                        });
                                        if (obj.straatnaam.split('_')[1]){
                                            obj.name = (obj.straatnaam.split('_')[0] + " " + obj.huisnummer + ", " + obj.postcode + " " + obj.district);
                                        }else{
                                            obj.name = obj.straatnaam + " " + obj.huisnummer + ", " + obj.postcode + " " + obj.district;
                                        }
                                        return obj;
                                    }).slice(0, 10);
                                    asyncResults(features);
    
                                });
                            } else {
                                GISService.QueryLocationPickerAddress(straatnaam, huisnummer).then(function(data) {
                                    var features = data.map(function(feature) {
                                        var obj = {};
                                        obj.straatnaam = feature.street.streetName;
                                        obj.huisnummer = feature.houseNumber.houseNumber;
                                        obj.id = feature.id;
                                        obj.x = feature.addressPosition.lambert72.x;
                                        obj.y = feature.addressPosition.lambert72.y;
                                        obj.name = feature.formattedAddress;
                                        obj.postcode = feature.municipalityPost.postCode;
                                        obj.district = feature.municipalityPost.antwerpDistrict;
                                        return obj;
                                    }).slice (0,10);

                                    asyncResults(features);
                                });
                            }
                            
                        } else {
                            GISService.QueryLocationPickerLocation(query.trim()).then(function(data) {
                                var arr = data.map(function(feature) {
                                    var obj = {};
                                    obj.key = feature.id;
                                    obj.id = feature.fullId;
                                    obj.name = feature.name;
                                    obj.layer = feature.layer;
                                    obj.layerString = feature.layer;
                                    if (feature.antwerpDistrict !== null && feature.antwerpDistrict.match(/^ *$/) === null) {
                                        obj.districts = [feature.antwerpDistrict]
                                    }
                                    if (feature.position) {
                                        if (feature.position.geometry) {
                                            obj.geometry = feature.position.geometry;
                                        }
                                        if (feature.position.lambert72) {
                                            obj.x = feature.position.lambert72.x;
                                            obj.y = feature.position.lambert72.y;
                                        }
                                    }


                                    return obj;
                                });
                                _typeAheadService.lastData = arr;
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
                    if (suggestion.streetNameId){
                        _typeAheadService.lastStreetNameId = suggestion.streetNameId;
                        _typeAheadService.lastStreetName = suggestion.name;
                    }
                    if (suggestion.x && suggestion.y) {
                        var cors = {
                            x: suggestion.x,
                            y: suggestion.y
                        };
                        var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84(cors);
                        setViewAndPutDot(xyWGS84);
                    } else {
                        if (suggestion.id) {
                            var idsplitted = suggestion.id.split("/");
                            var layerid = idsplitted[3];
                            QueryForTempFeatures(layerid, 'ObjectID=' + suggestion.key);
                        }

                    }
                }


            }).addTo(map);
            $('.typeahead').on('keyup', function(e) {
                if (e.which == 13 && $('.tt-suggestion').length == 1) {
                    var firstsug = $(".tt-suggestion:first-child");
                    firstsug.trigger('click');
                    if (_typeAheadService.numbers > 0){
                        _typeAheadService.lastStreetNameId = null;
                    }
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
            if(item.districts){
                var output = '<div>' + item.name + ' (' + item.districts[0] + ')';
            }
            else
            {
                var output = '<div>' + item.name;
            }
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