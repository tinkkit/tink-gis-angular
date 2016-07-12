'use strict';
(function () {
    var module = angular.module('tink.gis');
    var service = function ($http, map, MapData, $rootScope, $q) {
        var _service = {};
        _service.getMetaData = function (searchterm = 'water', startpos = 1, recordsAPage = 10) {
            var url = 'https://metadata.geopunt.be/zoekdienst/srv/dut/csw?service=CSW&version=2.0.2&request=GetRecords&namespace=xmlns%28csw=http://www.opengis.net/cat/csw%29&resultType=results&outputSchema=http://www.opengis.net/cat/csw/2.0.2&outputFormat=application/xml&startPosition=' + startpos + '&maxRecords=' + recordsAPage + '&typeNames=csw:Record&elementSetName=full&constraintLanguage=CQL_TEXT&constraint_language_version=1.1.0&constraint=AnyText+LIKE+%27%25' + searchterm + '%25%27AND%20Type%20=%20%27service%27%20AND%20Servicetype%20=%27view%27&SortBy=dc:title';
            console.log('GETTING METADATA WITH ULR:', url);
            var prom = $q.defer();
            $http.get(url).
                success(function (data, status, headers, config) {
                    if (data) {
                        var returnjson = JXON.stringToJs(data);
                        var getResults = returnjson['csw:getrecordsresponse']['csw:searchresults'];
                        var returnObject = {};
                        returnObject.searchTerm = searchterm;
                        returnObject.currentrecord = startpos;
                        returnObject.recordsAPage = recordsAPage;
                        returnObject.nextrecord = getResults.nextrecord;
                        returnObject.numberofrecordsmatched = getResults.numberofrecordsmatched;
                        returnObject.numberofrecordsreturned = getResults.numberofrecordsreturned;
                        returnObject.results = [];
                        if (returnObject.numberofrecordsmatched != 0) { // only foreach when there are items
                            getResults['csw:record'].forEach(record => {
                                if ((record['dc:uri'] instanceof Array) == false) {
                                    var tmpdata = record['dc:uri'];
                                    record['dc:uri'] = [];
                                    record['dc:uri'].push(tmpdata);
                                }
                                var tmptheme = {};
                                tmptheme.Added = false;
                                tmptheme.Naam = record['dc:title'];
                                var wmsinfo = record['dc:uri'].find(x => { return x.protocol == 'WMS' || x.protocol == 'OGC:WMS' });
                                if (wmsinfo) {
                                    tmptheme.Url = wmsinfo.keyValue;
                                    tmptheme.Type = ThemeType.WMS;
                                }
                                else {
                                    tmptheme.Type = 'DONTKNOW';
                                }
                                tmptheme.TMPMETADATA = record;
                                returnObject.results.push(tmptheme);
                            });
                        }

                        prom.resolve(returnObject);
                        // console.log(getResults['csw:record']);
                    }
                    else {
                        prom.reject(null);
                        console.log('EMPTY RESULT');
                    }
                }).
                error(function (data, status, headers, config) {
                    prom.reject(null);
                    console.log('ERROR!', data, status, headers, config);
                });
            return prom.promise;
        };
        return _service;
    };
    module.$inject = ['$http', 'map', 'MapData', '$rootScope', '$q'];
    module.factory('GeopuntService', service);
})();