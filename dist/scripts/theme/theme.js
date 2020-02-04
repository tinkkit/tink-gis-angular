"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinkGis;
(function (TinkGis) {
    'use strict';

    var Theme = function () {
        function Theme() {
            var _this = this;

            _classCallCheck(this, Theme);

            this.Layers = [];
            this.UpdateDisplayed = function (currentScale) {
                _this.EnabledLayers.forEach(function (layer) {
                    console.log("updating displayed status for layer: ", layer);
                    layer.UpdateDisplayed(currentScale);
                });
            };
        }

        _createClass(Theme, [{
            key: "VisibleLayers",
            get: function get() {
                if (this.Visible) {
                    var allLay = this.AllLayers.filter(function (x) {
                        return x.ShouldBeVisible;
                    });
                    return allLay;
                }
                return [];
            }
        }, {
            key: "VisibleAndDisplayedLayerIds",
            get: function get() {
                if (this.Visible) {
                    var allLay = this.AllLayers.filter(function (x) {
                        return x.ShouldBeVisible && x.displayed;
                    }).map(function (x) {
                        return x.id;
                    });
                    return allLay;
                }
                return [];
            }
        }, {
            key: "EnabledLayers",
            get: function get() {
                if (this.Visible) {
                    var allLay = this.AllLayers.filter(function (x) {
                        return x.enabled;
                    });
                    return allLay;
                }
                return [];
            }
        }, {
            key: "VisibleLayerIds",
            get: function get() {
                return this.VisibleLayers.map(function (x) {
                    return x.id;
                });
            }
        }, {
            key: "AllLayers",
            get: function get() {
                var allLay = this.Layers;
                this.Layers.forEach(function (lay) {
                    allLay = allLay.concat(lay.AllLayers);
                });
                return allLay;
            }
        }]);

        return Theme;
    }();

    TinkGis.Theme = Theme;

    var ArcGIStheme = function (_Theme) {
        _inherits(ArcGIStheme, _Theme);

        function ArcGIStheme(rawdata, themeData) {
            _classCallCheck(this, ArcGIStheme);

            var _this2 = _possibleConstructorReturn(this, (ArcGIStheme.__proto__ || Object.getPrototypeOf(ArcGIStheme)).call(this));

            var rawlayers = rawdata.layers;
            _this2.name = _this2.Naam = rawdata.documentInfo.Title;
            _this2.Description = rawdata.documentInfo.Subject;
            _this2.cleanUrl = themeData.cleanUrl;
            _this2.Opacity = themeData.opacity;
            _this2.Url = themeData.cleanUrl;
            _this2.Visible = true;
            _this2.Added = false;
            _this2.enabled = true;
            _this2.Type = ThemeType.ESRI;
            _this2.status = ThemeStatus.UNMODIFIED;
            _this2.MapData = {};
            var convertedLayers = rawlayers.map(function (x) {
                return new TinkGis.arcgislayer(x, _this2);
            });
            convertedLayers.forEach(function (argislay) {
                if (argislay.parentLayerId === -1) {
                    _this2.Layers.push(argislay);
                } else {
                    var parentlayer = convertedLayers.find(function (x) {
                        return x.id === argislay.parentLayerId;
                    });
                    argislay.parent = parentlayer;
                    parentlayer.Layers.push(argislay);
                }
            });
            return _this2;
        }

        _createClass(ArcGIStheme, [{
            key: "UpdateMap",
            value: function UpdateMap() {
                if (this.VisibleLayerIds.length !== 0) {
                    this.MapData.setLayers(this.VisibleLayerIds);
                } else {
                    this.MapData.setLayers([-1]);
                }
            }
        }, {
            key: "SetOpacity",
            value: function SetOpacity(opacity) {
                this.Opacity = opacity;
                this.MapData.setOpacity(opacity);
            }
        }]);

        return ArcGIStheme;
    }(Theme);

    TinkGis.ArcGIStheme = ArcGIStheme;

    var wmstheme = function (_Theme2) {
        _inherits(wmstheme, _Theme2);

        function wmstheme(data, url) {
            _classCallCheck(this, wmstheme);

            var _this3 = _possibleConstructorReturn(this, (wmstheme.__proto__ || Object.getPrototypeOf(wmstheme)).call(this));

            _this3.Version = data.version;
            _this3.name = _this3.Naam = data.service.title;
            _this3.enabled = true;
            _this3.Visible = true;
            _this3.cleanUrl = url;
            _this3.Added = false;
            _this3.status = ThemeStatus.NEW;
            _this3.Description = data.service.abstract;
            _this3.Type = ThemeType.WMS;
            var layers = data.capability.layer;
            if (layers.layer) {
                layers = layers.layer;
            }
            if (layers.layer) {
                layers = layers.layer;
            }
            var lays = [];
            if (layers) {
                if (layers.length === undefined) {
                    lays.push(layers);
                } else {
                    lays = layers;
                }
            } else {
                lays.push(data.capability.layer);
            }
            lays.forEach(function (layer) {
                if (layer.queryable == true) {
                    if (data.capability.request.getfeatureinfo.format.some(function (x) {
                        return x === "text/xml";
                    })) {
                        _this3.GetFeatureInfoType = "text/xml";
                    } else if (data.capability.request.getfeatureinfo.format.some(function (x) {
                        return x === "text/plain";
                    })) {
                        _this3.GetFeatureInfoType = "text/plain";
                    }
                    if (!_this3.GetFeatureInfoType) {
                        layer.queryable = false;
                    }
                }
                var lay = new TinkGis.wmslayer(layer, _this3);
                _this3.Layers.push(lay);
            });
            return _this3;
        }

        _createClass(wmstheme, [{
            key: "UpdateMap",
            value: function UpdateMap(map) {
                if (this.VisibleLayerIds.length !== 0) {
                    if (!map.hasLayer(this.MapData)) {
                        map.addLayer(this.MapData);
                    }
                    this.MapData.options.layers = this.MapData.wmsParams.layers = this.VisibleLayerIds.join(",");
                    this.MapData.redraw();
                } else {
                    if (map.hasLayer(this.MapData)) {
                        map.removeLayer(this.MapData);
                    }
                }
            }
        }]);

        return wmstheme;
    }(Theme);

    TinkGis.wmstheme = wmstheme;
})(TinkGis || (TinkGis = {}));
