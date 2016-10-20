'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinkGis;
(function (TinkGis) {
    'use strict';

    var LayerJSON = function LayerJSON() {
        _classCallCheck(this, LayerJSON);
    };

    TinkGis.LayerJSON = LayerJSON;

    var Layer = function (_LayerJSON) {
        _inherits(Layer, _LayerJSON);

        function Layer() {
            var _ref;

            _classCallCheck(this, Layer);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, (_ref = Layer.__proto__ || Object.getPrototypeOf(Layer)).call.apply(_ref, [this].concat(args)));

            _this.parent = null;
            _this.Layers = [];
            _this.UpdateDisplayed = function (currentScale) {
                if (_this.maxScale > 0 || _this.minScale > 0) {
                    console.log('MinMaxandCurrentScale', _this.maxScale, _this.minScale, currentScale);
                    if (currentScale > _this.maxScale && currentScale < _this.minScale) {
                        _this.displayed = true;
                    } else {
                        _this.displayed = false;
                    }
                }
            };
            _this.toString = function () {
                return 'Lay: (id: ' + _this.name + ')';
            };
            return _this;
        }

        _createClass(Layer, [{
            key: 'hasLayers',
            get: function get() {
                if (this.Layers) {
                    return this.Layers.length > 0;
                }
                return false;
            }
        }, {
            key: 'ShouldBeVisible',
            get: function get() {
                if (this.IsEnabledAndVisible && !this.hasLayers) {
                    if (!this.parent || this.parent.IsEnabledAndVisible) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            key: 'IsEnabledAndVisible',
            get: function get() {
                if (this.theme.enabled && this.enabled && this.visible) {
                    if (!this.parent) {
                        return true;
                    } else {
                        return this.parent.IsEnabledAndVisible;
                    }
                }
                return false;
            }
        }, {
            key: 'AllLayers',
            get: function get() {
                var allLay = this.Layers;
                this.Layers.forEach(function (lay) {
                    allLay = allLay.concat(lay.AllLayers);
                });
                return allLay;
            }
        }]);

        return Layer;
    }(LayerJSON);

    TinkGis.Layer = Layer;

    var wmslayer = function (_Layer) {
        _inherits(wmslayer, _Layer);

        function wmslayer(info, parenttheme) {
            _classCallCheck(this, wmslayer);

            var _this2 = _possibleConstructorReturn(this, (wmslayer.__proto__ || Object.getPrototypeOf(wmslayer)).call(this));

            Object.assign(_this2, info);
            _this2.visible = true;
            _this2.enabled = true;
            _this2.displayed = true;
            _this2.theme = parenttheme;
            _this2.queryable = info.queryable;
            _this2.id = _this2.name;
            return _this2;
        }

        _createClass(wmslayer, [{
            key: 'legendUrl',
            get: function get() {
                return this.theme.CleanUrl + '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + this.id;
            }
        }]);

        return wmslayer;
    }(Layer);

    TinkGis.wmslayer = wmslayer;

    var argislegend = function argislegend(label, url) {
        _classCallCheck(this, argislegend);

        this.label = label;
        this.url = url;
    };

    TinkGis.argislegend = argislegend;

    var arcgislayer = function (_Layer2) {
        _inherits(arcgislayer, _Layer2);

        function arcgislayer(info, parenttheme) {
            _classCallCheck(this, arcgislayer);

            var _this3 = _possibleConstructorReturn(this, (arcgislayer.__proto__ || Object.getPrototypeOf(arcgislayer)).call(this));

            Object.assign(_this3, info);
            _this3.visible = info.defaultVisibility;
            _this3.enabled = true;
            _this3.title = info.name;
            _this3.theme = parenttheme;
            _this3.displayed = true;
            _this3.queryable = false;
            return _this3;
        }

        _createClass(arcgislayer, [{
            key: 'legends',
            get: function get() {
                return this.legend.map(function (x) {
                    return new argislegend(x.label, x.fullurl);
                });
            }
        }]);

        return arcgislayer;
    }(Layer);

    TinkGis.arcgislayer = arcgislayer;
})(TinkGis || (TinkGis = {}));
