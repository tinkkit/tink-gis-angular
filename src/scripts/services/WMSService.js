'use strict';
(function() {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var service = function($http, $window) {
        var _service = {};
        JXON.config({
            // valueKey: '_',                // default: 'keyValue'
            // attrKey: '$',                 // default: 'keyAttributes'
            // attrPrefix: '$',              // default: '@'
            // lowerCaseTags: false,         // default: true
            // trueIsEmpty: false,           // default: true
            autoDate: false              // default: true
            // ignorePrefixedNodes: false,   // default: true
            // parseValues: false            // default: true
        });
        _service.GetCapabilities = function(url) {
            var posturl = '?request=GetCapabilities&service=WMS';
            var prom = $http({
                method: 'GET',
                url: url + posturl,
                timeout: 10000,
                // params: {},  // Query Parameters (GET)
                transformResponse: function(data) {
                    var wmstheme = {};
                    if (data) {
                        var returnjson = JXON.stringToJs(data).wms_capabilities;
                        console.log(returnjson);
                        wmstheme.Version = returnjson['@version'];
                        wmstheme.name = returnjson.service.title;
                        wmstheme.Naam = returnjson.service.title;
                        // wmstheme.Title = returnjson.service.title;
                        wmstheme.enabled = true;
                        wmstheme.Visible = true;
                        wmstheme.Layers = [];
                        wmstheme.AllLayers = [];
                        wmstheme.CleanUrl = url;
                        wmstheme.Added = false;
                        wmstheme.Description = returnjson.service.abstract;
                        var layers = returnjson.capability.layer.layer;
                        layers.forEach(layer => {
                            var tmplayer = {};
                            tmplayer.visible = true;
                            tmplayer.enabled = true;
                            tmplayer.parent = null;
                            tmplayer.theme = wmstheme;
                            tmplayer.name = layer.title;
                            tmplayer.id = layer.name; //names are the ids of the layer in wms
                            wmstheme.Layers.push(tmplayer);
                            wmstheme.AllLayers.push(tmplayer);
                        });
                    }

                    return wmstheme;
                }
            }).success(function(data, status, headers, config) {
                console.dir(data);  // XML document object
            }).error(function(data, status, headers, config) {
                console.log('error: data, status, headers, config:');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
                $window.alert('error');
            });
            return prom;
        };

        return _service;
    };
    module.factory('WMSService', service);
})();
