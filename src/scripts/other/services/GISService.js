//http://proj4js.org/
'use strict';
(function() {
    var module = angular.module('tink.gis');
    var service = function($http, GisHelperService, $q, PopupService) {
        var _service = {};
        _service.AddressByCoordinate = function(event) {
            var lambert72Cords = GisHelperService.ConvertWSG84ToLambert72(event.latlng);
            
            var url = GEOAPI.BaseUrl + 'addresses?sr=Lambert72&x=' + lambert72Cords.x + '&y=' + lambert72Cords.y + '&buffer=50&count=1';

            var req = $http({
                method: 'GET',
                url: url,
                headers: {
                    'apikey': GEOAPI.ApiKey
                }
            });
            req.success(function(data, status, headers, config) {
                // nothing we just give back the prom do the stuff not here!
            }).error(function(data, status, headers, config) {
                PopupService.ErrorFromHttp(data, status, url);
            });
            return req;
        }
        _service.QueryCrab = function(straatnaamid, huisnummer) {
            var prom = $q.defer();
            var query = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' +
            'where=GEMEENTE%3D%27Antwerpen%27';
            for (var i=0; i < straatnaamid.length; i++) {
                if(straatnaamid.length > 1){
                    if(i == 0){
                        query += '%20and%20(STRAATNMID%20%3D%27' + straatnaamid[i] + '%27';
                    }else{
                        query += '%20or%20STRAATNMID%20%3D%27' + straatnaamid[i] + '%27';
                    }
                }else{
                    query += '%20and%20STRAATNMID%20%3D%27' + straatnaamid[i] + '%27';
                }
              }
              if (straatnaamid.length > 1){
                  query += ')'
              }
            
            // straatnaamid.forEach(id => {
            //     query += '%20and%20STRAATNMID%20%3D%27' + straatnaamid;
            // });
            query += '%20and%20' +
            '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' +
            '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json';
            // var originalQuery = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' +
            // 'where=GEMEENTE%3D%27Antwerpen%27%20and%20STRAATNMID%20%3D%27' + straatnaamid + '%27%20and%20' +
            // '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' +
            // '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
            $http.get(query)
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        }


        _service.QueryCrabName = function(straatnaam, huisnummer) {
            var prom = $q.defer();
            var query = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' +
            'where=GEMEENTE%3D%27Antwerpen%27';
            query += '%20and%20STRAATNAAM%20%3D%27' + straatnaam + '%27';
            // for (var i=0; i < straatnaamid.length; i++) {
            //     if(straatnaamid.length > 1){
            //         if(i == 0){
            //             query += '%20and%20(STRAATNMID%20%3D%27' + straatnaam + '%27';
            //         }else{
            //             query += '%20or%20STRAATNMID%20%3D%27' + straatnaam + '%27';
            //         }
            //     }else{
            //         query += '%20and%20STRAATNMID%20%3D%27' + straatnaam + '%27';
            //     }
            //   }
            //   if (straatnaamid.length > 1){
            //       query += ')'
            //   }
            
            // straatnaamid.forEach(id => {
            //     query += '%20and%20STRAATNMID%20%3D%27' + straatnaamid;
            // });
            query += '%20and%20' +
            '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' +
            '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json';
            // var originalQuery = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' +
            // 'where=GEMEENTE%3D%27Antwerpen%27%20and%20STRAATNMID%20%3D%27' + straatnaamid + '%27%20and%20' +
            // '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' +
            // '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
            $http.get(query)
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        }

        _service.QuerySOLRGIS = function(search) {
            var prom = $q.defer();
            var url = Solr.BaseUrl + 'giszoek/solr/search?q=*' + search + '*&wt=json&indent=true&facet=true&rows=999&facet.field=parent&group=true&group.field=parent&group.limit=999&solrtype=gis'; // &group.limit=5
            $http.get(url)
                .success(function(data, status, headers, config) {
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        };
        _service.QueryElasticGis = function(search) {
            var prom = $q.defer();
            // var url = GisHelperService.getApiURL() + 'gismetadata?query=' + search;
            var url = GisHelperService.CreateMetadataUrl(search);

            $http.get(url)
                .success(function(data, status, headers, config)
                {
                    prom.resolve(data)
                })
                .error(function(data, status, headers, config)
                {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
                return prom.promise;
        };
        _service.QueryLocationPickerLocation = function(search) {
            var prom = $q.defer();
            var req = $http({
                method: 'GET',
                url: LocationPicker.BaseUrl + 'locations?search=' + search + '&sort=name&limit=50&layers=all&prioritizelayer=district,straatnaam',
                headers: {
                    'apikey': LocationPicker.ApiKey
                }
            });
           
            req.success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        }
        _service.QueryLocationPickerAddress = function( streetName, houseNumber) {
            var prom = $q.defer();
            var req = $http({
                method: 'GET',
                url: LocationPicker.BaseUrl + 'addresses?streetname=' + streetName + '&housenumber=' + houseNumber,
                headers: {
                    'apikey': LocationPicker.ApiKey
                }
            });

            req.success(function(data, status, headers, config)
                {
                    prom.resolve(data);
                }).error(function(data, status, headers, config){
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        };
        _service.QuerySOLRLocatie = function(search) {
            var prom = $q.defer();
            var url = Solr.BaseUrl + 'giszoek/solr/search?q=*' + search + '*&wt=json&indent=true&rows=50&solrtype=gislocaties&dismax=true&bq=exactName:DISTRICT^20000.0&bq=layer:straatnaam^20000.0';
            $http.get(url)
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        };
        var completeUrl = function(url) {
            // var baseurl = Gis.BaseUrl + 'arcgissql/rest/';
            // if (!url.contains('arcgissql/rest/') && !url.contains('arcgis/rest/')) {
            //     url = baseurl + url;
            // }
            // if (url.toLowerCase().contains("p_sik") && url.toLowerCase().contains("/arcgissql/")) {
            //     url = url.replace("/arcgissql/", "/arcgis/");
            // }
            return url
        }
        var generateOptionsBasedOnUrl = function(url, opts) {
            if (!opts) {
                opts = {};
            }
            if (url.toLowerCase().includes("p_sik")) {
                opts.withCredentials = true;
            }
            return opts;
        }
        _service.GetThemeData = function(mapserver) {
            var prom = $q.defer();

            var url = completeUrl(mapserver) + '?f=json';
            console.log("ZZZZZ");
            
            $http.get(url, generateOptionsBasedOnUrl(url))
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    console.log("ZZZZZ");
                    if (url.toLocaleLowerCase().contains("p_sik")) {
                        prom.resolve(null);
                    } else {
                        prom.reject(null);
                        PopupService.ErrorFromHttp(data, status, url);
                    }
                });
            return prom.promise;
        };
        _service.GetThemeLayerData = function(cleanurl) {
            var prom = $q.defer();

            var url = completeUrl(cleanurl) + '/layers?f=json';
            $http.get(url, generateOptionsBasedOnUrl(url))
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);

                });
            return prom.promise;
        };
        _service.GetLegendData = function(cleanurl) {
            var prom = $q.defer();

            var url = completeUrl(cleanurl) + '/legend?f=json';
            $http.get(url, generateOptionsBasedOnUrl(url))
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        };

        _service.GetLayerSpecification = function(layerUrl) {
            var prom = $q.defer()
            var url = `${layerUrl}?f=json`;

            $http.get(url, generateOptionsBasedOnUrl(url))
                .success(function(data, status, headers, config) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                    prom.resolve(data);
                }).error(function(data, status, headers, config) {
                    prom.reject(null);
                    PopupService.ErrorFromHttp(data, status, url);
                });
            return prom.promise;
        }
        _service.GetAditionalLayerInfo = function(theme) {

            var promLegend = _service.GetLegendData(theme.cleanUrl);
            promLegend.then(function(data) {
                theme.AllLayers.forEach(layer => {
                    var layerid = layer.id;
                    var layerInfo = data.layers.find(x => x.layerId == layerid);
                    layer.legend = [];
                    if (layerInfo) {
                        layer.legend = layerInfo.legend;
                        layer.legend.forEach(legenditem => {
                            legenditem.fullurl = "data:" + legenditem.contentType + ";base64," + legenditem.imageData;
                        });
                    }
                });
            });
            var promLayerData = _service.GetThemeLayerData(theme.cleanUrl);
            promLayerData.then(function(data) {
                theme.AllLayers.forEach(layer => {
                    var layerid = layer.id;
                    var layerInfo = data.layers.find(x => x.id == layerid);
                    layer.displayField = layerInfo.displayField;
                    layer.fields = layerInfo.fields;
                });
            });
        };
        return _service;
    };
    module.$inject = ['$http', 'GisHelperService', '$q', 'PopupService'];
    module.factory('GISService', service);
})();