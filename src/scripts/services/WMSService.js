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
            $http({
                method: 'GET',
                url: url + posturl,
                timeout: 10000,
                // params: {},  // Query Parameters (GET)
                transformResponse: function(data) {
                    // string -> XML document object
                    var returnjson = JXON.stringToJs(data).wms_capabilities;
                    var wmstheme = {};
                    wmstheme.Version = returnjson['@version'];
                    wmstheme.Name = returnjson.service.name;
                    wmstheme.Title = returnjson.service.title;
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
                    return wmstheme;
                }
            }).success(function(data, status, headers, config) {
                console.dir(data);  // XML document object
            }).error(function(data, status, headers, config) {
                $window.alert('error');
            });
        };

        return _service;
    };
    module.factory('WMSService', service);
})();
