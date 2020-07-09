'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.navigation', 'tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination', 'tink.tooltip', 'ngAnimate', 'rzModule']); //'leaflet-directive'
    }

    JXON.config({
        attrPrefix: '', // default: '@'
        autoDate: false, // default: true
        lowerCaseTags: true
    });
    var init = function () {
        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
        // L.Browser.touch = false; // no touch support!
    }();
    (function () {
        var originalOnTouch = L.Draw.Polyline.prototype._onTouch;
        L.Draw.Polyline.prototype._onTouch = function (e) {
            if (e.originalEvent.pointerType != 'mouse') {
                return originalOnTouch.call(this, e);
            }
        };
    })();
    var mapObject = function mapObject() {
        var crsLambert = new L.Proj.CRS('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438' + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs', {
            origin: [-35872700, 41422700],
            resolutions: [66.1459656252646, 52.91677250021167, 39.687579375158755, 26.458386250105836, 13.229193125052918, 6.614596562526459, 5.291677250021167, 3.9687579375158752, 3.3072982812632294, 2.6458386250105836, 1.9843789687579376, 1.3229193125052918, 0.6614596562526459, 0.5291677250021167, 0.39687579375158755, 0.33072982812632296, 0.26458386250105836, 0.19843789687579377, 0.13229193125052918, 0.06614596562526459, 0.026458386250105836]
        });
        var map = L.map('map', {
            minZoom: 0,
            maxZoom: 20,
            crs: crsLambert,
            zoomControl: false,
            drawControl: false,
            attributionControl: false
        }).setView([51.2192159, 4.4028818], 5);
        L.control.scale({ imperial: false }).addTo(map); // set scale on the map


        map.doubleClickZoom.disable();
        // L.control.scale({ imperial: false }).addTo(map); // can be deleted?
        map.featureGroup = L.featureGroup().addTo(map);
        map.extendFeatureGroup = L.featureGroup().addTo(map);

        map.on('draw:created', function (event) {
            // var layer = event.layer;
            // map.featureGroup.addLayer(layer);
        });
        map.on('draw:drawstart', function (event) {
            console.log("draw started");
            //console.log(drawnItems);
            //map.clearDrawings();
        });
        map.addToDrawings = function (layer) {
            map.featureGroup.addLayer(layer);
        };
        map.clearDrawings = function () {
            map.featureGroup.clearLayers();
            map.extendFeatureGroup.clearLayers();
        };

        return map;
    };
    module.factory('map', mapObject);
    module.directive('preventDefaultMap', function (map) {
        return {
            link: function link(scope, element, attrs) {
                L.DomEvent.disableClickPropagation(element.get(0));
                element.on('dblclick', function (event) {
                    event.stopPropagation();
                });
                element.on('mousemove', function (event) {
                    event.stopPropagation();
                });
            }
        };
    });
    module.directive('preventDefault', function (map) {
        return {
            link: function link(scope, element, attrs) {
                element.on('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                element.on('dblclick', function (event) {
                    event.stopPropagation();
                });
                element.on('mousemove', function (event) {
                    event.stopPropagation();
                });
            }
        };
    });
    module.directive('autoFocus', function ($timeout) {
        return {
            restrict: 'AC',
            link: function link(_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 0);
            }
        };
    });

    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.toLowerCase().includes("p_sik")) {
            this.withCredentials = true;
            // debugger;
        }
        origOpen.apply(this, arguments);
    };
    // XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    //     console.log(header + ": " + value);
    //     // origOpen.setRequestHeader(header, value);
    // };

})();
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (L, undefined) {
  L.Map.addInitHook(function () {
    this.whenReady(function () {
      L.Map.mergeOptions({
        preferCanvas: true
      });
      if (!('exportError' in this)) {
        this.exportError = {
          wrongBeginSelector: 'Селектор JQuery не имеет начальной скобки (',
          wrongEndSelector: 'Селектор JQuery не заканчивается скобкой )',
          jqueryNotAvailable: 'В опциях используется JQuery селектор, но JQuery не подключен.Подключите JQuery или используйте DOM-селекторы .class, #id или DOM-элементы',
          popupWindowBlocked: 'Окно печати было заблокировано браузером. Пожалуйста разрешите всплывающие окна на этой странице',
          emptyFilename: 'При выгрузке карты в виде файла не указано его имя'
        };
      }

      this.supportedCanvasMimeTypes = function () {
        if ('_supportedCanvasMimeTypes' in this) {
          return this._supportedCanvasMimeTypes;
        }

        var mimeTypes = {
          PNG: 'image/png',
          JPEG: 'image/jpeg',
          JPG: 'image/jpg',
          GIF: 'image/gif',
          BMP: 'image/bmp',
          TIFF: 'image/tiff',
          XICON: 'image/x-icon',
          SVG: 'image/svg+xml',
          WEBP: 'image/webp'
        };

        var canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas = document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
        this._supportedCanvasMimeTypes = {};

        for (var type in mimeTypes) {
          var mimeType = mimeTypes[type];
          var data = canvas.toDataURL(mimeType);
          var actualType = data.replace(/^data:([^;]*).*/, '$1');
          if (mimeType === actualType) {
            this._supportedCanvasMimeTypes[type] = mimeType;
          }
        }

        document.body.removeChild(canvas);

        return this._supportedCanvasMimeTypes;
      };

      this.export = function (options) {
        var caption = {};
        var exclude = [];
        var format = 'image/png';
        options = options || {
          caption: {},
          exclude: []
        };

        if ('caption' in options) {
          caption = options['caption'];
          if ('position' in caption) {
            var position = caption.position;
            if (!Array.isArray(position)) {
              position = [0, 0];
            }

            if (position.length != 2) {
              if (position.length === 0) {
                position[0] = 0;
              }

              if (position.length === 1) {
                position[1] = 0;
              }
            }
            if (typeof position[0] !== 'number') {
              if (typeof position[0] === 'string') {
                position[0] = parseInt(position[0]);
                if (isNaN(position[0])) {
                  position[0] = 0;
                }
              }
            }
            if (typeof position[1] !== 'number') {
              if (typeof position[1] === 'string') {
                position[1] = parseInt(position[1]);
                if (isNaN(position[1])) {
                  position[1] = 0;
                }
              }
            }

            caption.position = position;
          }
        }

        if ('exclude' in options && Array.isArray(options['exclude'])) {
          exclude = options['exclude'];
        }

        if ('format' in options) {
          format = options['format'];
        }

        var afterRender = options.afterRender;
        if (typeof afterRender !== 'function') {
          afterRender = function afterRender(result) {
            return result;
          };
        }

        var afterExport = options.afterExport;
        if (typeof afterExport !== 'function') {
          afterExport = function afterExport(result) {
            return result;
          };
        }

        var container = options.container || this._container;

        var hide = [];
        for (var i = 0; i < exclude.length; i++) {
          var selector = exclude[i];
          switch (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) {
            // DOM element.
            case 'object':
              if ('tagName' in selector) {
                hide.push(selector);
              }
              break;
            // Selector
            case 'string':
              var type = selector.substr(0, 1);
              switch (type) {
                // Class selector.
                case '.':
                  var elements = container.getElementsByClassName(selector.substr(1));
                  for (var j = 0; j < elements.length; j++) {
                    hide.push(elements.item(j));
                  }
                  break;

                // Id selector.
                case '#':
                  var element = container.getElementById(selector.substr(1));
                  if (element) {
                    hide.push(element);
                  }
                  break;

                // JQuery.
                case '$':
                  var jQuerySelector = selector.trim().substr(1);
                  if (jQuerySelector.substr(0, 1) !== '(') {
                    throw new Error(this.exportError.wrongBeginSelector);
                  }
                  jQuerySelector = jQuerySelector.substr(1);
                  if (jQuerySelector.substr(-1) !== ')') {
                    throw new Error(this.exportError.wrongEndSelector);
                  }
                  jQuerySelector = jQuerySelector.substr(0, jQuerySelector.length - 1);
                  if (typeof jQuery !== 'undefined') {
                    var elements = $(jQuerySelector, container);
                    for (var j = 0; j < elements.length; j++) {
                      hide.push(elements[i]);
                    }
                  } else {
                    throw new Error(this.exportError.jqueryNotAvailable);
                  }
              }
          }
        }

        // Hide excluded elements.
        for (var i = 0; i < hide.length; i++) {
          hide[i].setAttribute('data-html2canvas-ignore', 'true');
        }

        var _this = this;

        return html2canvas(container, {
          useCORS: true
        }).then(afterRender).then(function (canvas) {
          // Show excluded elements.
          for (var i = 0; i < hide.length; i++) {
            hide[i].removeAttribute('data-html2canvas-ignore');
          }

          if ('text' in caption && caption.text) {
            var x, y;
            if ('position' in caption) {
              x = caption.position[0];
              y = caption.position[1];
            } else {
              x = 0;
              y = 0;
            }

            var ctx = canvas.getContext('2d');
            if ('font' in caption) {
              ctx.font = caption.font;
            }

            if ('fillStyle' in caption) {
              ctx.fillStyle = caption.fillStyle;
            }

            ctx.fillText(caption.text, x, y);
          }

          var ret = format === 'canvas' ? canvas : {
            data: canvas.toDataURL(format),
            width: canvas.width,
            height: canvas.height,
            type: format
          };

          return ret;
        }, function (reason) {
          var newReason = reason;
          alert(reason);
        }).then(afterExport);
      };

      this.printExport = function (options) {
        options = options || {};
        var _this = this;
        var images = [];

        var _runPrintTasks = function _runPrintTasks(options, index) {
          var exportMethod = options[index].export || _this.export;
          return exportMethod(options[index]).then(function (result) {
            images.push(result);
            if (index < options.length - 1) {
              return _runPrintTasks(options, index + 1);
            }

            return images;
          });
        };

        if (Array.isArray(options)) {
          return _runPrintTasks(options, 0).then(function (result) {
            return _this._printExport(options, result);
          });
        }

        var exportMethod = options.export || this.export;
        return exportMethod(options).then(function (result) {
          return _this._printExport(options, [result]);
        });
      };

      this._printExport = function (options, images) {
        var printWindow = window.open('', '_blank');
        if (printWindow) {
          var printDocument = printWindow.document;
          printDocument.write('<html><head><style>@media print { @page { padding: 0; margin: 0; } }</style><title>' + (options.text ? options.text : '') + '</title></head><body onload=\'window.print(); window.close();\'></body></html>');
          images.forEach(function (image) {
            var img = printDocument.createElement('img');
            img.height = image.height - 20;
            img.width = image.width - 10;
            img.src = image.data;
            printDocument.body.appendChild(img);
          });

          printDocument.close();
          printWindow.focus();
        } else {
          throw new Error(this.exportError.popupWindowBlocked);
        }

        return images;
      };

      this.downloadExport = function (options) {
        options = options || {};

        if (Array.isArray(options)) {
          return this._runDownloadTasks(options, 0);
        } else {
          return this._downloadExport(options);
        }
      };

      this._runDownloadTasks = function (options, index) {
        var _this = this;
        var i = index;

        return this._downloadExport(options[i]).then(function (result) {
          i++;

          if (i < options.length) {
            return _this._runDownloadTasks(options, i).then(function (tasksResult) {
              return [result].concat(tasksResult);
            });
          } else {
            return [result];
          }
        });
      };

      this._downloadExport = function (options) {
        if (!('fileName' in options)) {
          throw new Error(this.exportError.emptyFilename);
        }

        var exportMethod = options.export || this.export;
        var fileName = options.fileName;
        delete options.fileName;

        var _this = this;
        return exportMethod(options).then(function (result) {
          var fileData = atob(result.data.split(',')[1]);
          var arrayBuffer = new ArrayBuffer(fileData.length);
          var view = new Uint8Array(arrayBuffer);
          for (var i = 0; i < fileData.length; i++) {
            view[i] = fileData.charCodeAt(i) & 0xff;
          }

          var blob;
          if (typeof Blob === 'function') {
            blob = new Blob([arrayBuffer], {
              type: 'application/octet-stream'
            });
          } else {
            var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)();
            blobBuilder.append(arrayBuffer);
            blob = blobBuilder.getBlob('application/octet-stream');
          }

          if (window.navigator.msSaveOrOpenBlob) {
            // IE can not open blob and data links, but has special method for downloading blobs as files.
            window.navigator.msSaveBlob(blob, fileName);
          } else {
            var blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
            var downloadLink = document.createElement('a');
            downloadLink.style = 'display: none';
            downloadLink.download = fileName;
            downloadLink.href = blobUrl;

            // IE requires link to be added into body.
            document.body.appendChild(downloadLink);

            // Emit click to download image.
            downloadLink.click();

            // Delete appended link.
            document.body.removeChild(downloadLink);
          }

          return result;
        });
      };
    });
  });
})(L);
;"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? e() : "function" == typeof define && define.amd ? define(e) : e();
}(0, function () {
  "use strict";
  function t(t, e) {
    return e = { exports: {} }, t(e, e.exports), e.exports;
  }var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
      n = t(function (t) {
    !function (e) {
      function n(t, e) {
        function n(t) {
          return e.bgcolor && (t.style.backgroundColor = e.bgcolor), e.width && (t.style.width = e.width + "px"), e.height && (t.style.height = e.height + "px"), e.style && Object.keys(e.style).forEach(function (n) {
            t.style[n] = e.style[n];
          }), t;
        }return e = e || {}, s(e), Promise.resolve(t).then(function (t) {
          return u(t, e.filter, !0);
        }).then(c).then(d).then(n).then(function (n) {
          return g(n, e.width || h.width(t), e.height || h.height(t));
        });
      }function i(t, e) {
        return l(t, e || {}).then(function (e) {
          return e.getContext("2d").getImageData(0, 0, h.width(t), h.height(t)).data;
        });
      }function o(t, e) {
        return l(t, e || {}).then(function (t) {
          return t.toDataURL();
        });
      }function r(t, e) {
        return e = e || {}, l(t, e).then(function (t) {
          return t.toDataURL("image/jpeg", e.quality || 1);
        });
      }function a(t, e) {
        return l(t, e || {}).then(h.canvasToBlob);
      }function s(t) {
        void 0 === t.imagePlaceholder ? w.impl.options.imagePlaceholder = M.imagePlaceholder : w.impl.options.imagePlaceholder = t.imagePlaceholder, void 0 === t.cacheBust ? w.impl.options.cacheBust = M.cacheBust : w.impl.options.cacheBust = t.cacheBust;
      }function l(t, e) {
        function i(t) {
          var n = document.createElement("canvas");if (n.width = e.width || h.width(t), n.height = e.height || h.height(t), e.bgcolor) {
            var i = n.getContext("2d");i.fillStyle = e.bgcolor, i.fillRect(0, 0, n.width, n.height);
          }return n;
        }return n(t, e).then(h.makeImage).then(h.delay(100)).then(function (e) {
          var n = i(t);return n.getContext("2d").drawImage(e, 0, 0), n;
        });
      }function u(t, e, n) {
        function i(t) {
          return t instanceof HTMLCanvasElement ? h.makeImage(t.toDataURL()) : t.cloneNode(!1);
        }function o(t, e, n) {
          var i = t.childNodes;return 0 === i.length ? Promise.resolve(e) : function (t, e, n) {
            var i = Promise.resolve();return e.forEach(function (e) {
              i = i.then(function () {
                return u(e, n);
              }).then(function (e) {
                e && t.appendChild(e);
              });
            }), i;
          }(e, h.asArray(i), n).then(function () {
            return e;
          });
        }function r(t, e) {
          function n() {
            !function (t, e) {
              t.cssText ? e.cssText = t.cssText : function (t, e) {
                h.asArray(t).forEach(function (n) {
                  e.setProperty(n, t.getPropertyValue(n), t.getPropertyPriority(n));
                });
              }(t, e);
            }(window.getComputedStyle(t), e.style);
          }function i() {
            function n(n) {
              var i = window.getComputedStyle(t, n),
                  o = i.getPropertyValue("content");if ("" !== o && "none" !== o) {
                var r = h.uid();e.className = e.className + " " + r;var a = document.createElement("style");a.appendChild(function (t, e, n) {
                  var i = "." + t + ":" + e,
                      o = n.cssText ? function (t) {
                    var e = t.getPropertyValue("content");return t.cssText + " content: " + e + ";";
                  }(n) : function (t) {
                    function e(e) {
                      return e + ": " + t.getPropertyValue(e) + (t.getPropertyPriority(e) ? " !important" : "");
                    }return h.asArray(t).map(e).join("; ") + ";";
                  }(n);return document.createTextNode(i + "{" + o + "}");
                }(r, n, i)), e.appendChild(a);
              }
            }[":before", ":after"].forEach(function (t) {
              n(t);
            });
          }function o() {
            t instanceof HTMLTextAreaElement && (e.innerHTML = t.value), t instanceof HTMLInputElement && e.setAttribute("value", t.value);
          }function r() {
            e instanceof SVGElement && (e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e instanceof SVGRectElement && ["width", "height"].forEach(function (t) {
              var n = e.getAttribute(t);n && e.style.setProperty(t, n);
            }));
          }return e instanceof Element ? Promise.resolve().then(n).then(i).then(o).then(r).then(function () {
            return e;
          }) : e;
        }return n || !e || e(t) ? Promise.resolve(t).then(i).then(function (n) {
          return o(t, n, e);
        }).then(function (e) {
          return r(t, e);
        }) : Promise.resolve();
      }function c(t) {
        return p.resolveAll().then(function (e) {
          var n = document.createElement("style");return t.appendChild(n), n.appendChild(document.createTextNode(e)), t;
        });
      }function d(t) {
        return f.inlineAll(t).then(function () {
          return t;
        });
      }function g(t, e, n) {
        return Promise.resolve(t).then(function (t) {
          return t.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"), new XMLSerializer().serializeToString(t);
        }).then(h.escapeXhtml).then(function (t) {
          return '<foreignObject x="0" y="0" width="100%" height="100%">' + t + "</foreignObject>";
        }).then(function (t) {
          return '<svg xmlns="http://www.w3.org/2000/svg" width="' + e + '" height="' + n + '">' + t + "</svg>";
        }).then(function (t) {
          return "data:image/svg+xml;charset=utf-8," + t;
        });
      }var h = function () {
        function t() {
          var t = "application/font-woff",
              e = "image/jpeg";return { woff: t, woff2: t, ttf: "application/font-truetype", eot: "application/vnd.ms-fontobject", png: "image/png", jpg: e, jpeg: e, gif: "image/gif", tiff: "image/tiff", svg: "image/svg+xml" };
        }function e(t) {
          var e = /\.([^\.\/]*?)$/g.exec(t);return e ? e[1] : "";
        }function n(n) {
          var i = e(n).toLowerCase();return t()[i] || "";
        }function i(t) {
          return -1 !== t.search(/^(data:)/);
        }function o(t) {
          return new Promise(function (e) {
            for (var n = window.atob(t.toDataURL().split(",")[1]), i = n.length, o = new Uint8Array(i), r = 0; r < i; r++) {
              o[r] = n.charCodeAt(r);
            }e(new Blob([o], { type: "image/png" }));
          });
        }function r(t) {
          return t.toBlob ? new Promise(function (e) {
            t.toBlob(e);
          }) : o(t);
        }function a(t, e) {
          var n = document.implementation.createHTMLDocument(),
              i = n.createElement("base");n.head.appendChild(i);var o = n.createElement("a");return n.body.appendChild(o), i.href = e, o.href = t, o.href;
        }function s(t) {
          return new Promise(function (e, n) {
            var i = new Image();i.onload = function () {
              e(i);
            }, i.onerror = n, i.src = t;
          });
        }function l(t) {
          var e = 3e4;return w.impl.options.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + new Date().getTime()), new Promise(function (n) {
            function i() {
              if (4 === a.readyState) {
                if (200 !== a.status) return void (s ? n(s) : r("cannot fetch resource: " + t + ", status: " + a.status));var e = new FileReader();e.onloadend = function () {
                  var t = e.result.split(/,/)[1];n(t);
                }, e.readAsDataURL(a.response);
              }
            }function o() {
              s ? n(s) : r("timeout of " + e + "ms occured while fetching resource: " + t);
            }function r(t) {
              console.error(t), n("");
            }var a = new XMLHttpRequest();a.onreadystatechange = i, a.ontimeout = o, a.responseType = "blob", a.timeout = e, a.open("GET", t, !0), a.send();var s;if (w.impl.options.imagePlaceholder) {
              var l = w.impl.options.imagePlaceholder.split(/,/);l && l[1] && (s = l[1]);
            }
          });
        }function u(t, e) {
          return "data:" + e + ";base64," + t;
        }function c(t) {
          return t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
        }function d(t) {
          return function (e) {
            return new Promise(function (n) {
              setTimeout(function () {
                n(e);
              }, t);
            });
          };
        }function g(t) {
          for (var e = [], n = t.length, i = 0; i < n; i++) {
            e.push(t[i]);
          }return e;
        }function h(t) {
          return t.replace(/#/g, "%23").replace(/\n/g, "%0A");
        }function m(t) {
          var e = f(t, "border-left-width"),
              n = f(t, "border-right-width");return t.scrollWidth + e + n;
        }function p(t) {
          var e = f(t, "border-top-width"),
              n = f(t, "border-bottom-width");return t.scrollHeight + e + n;
        }function f(t, e) {
          var n = window.getComputedStyle(t).getPropertyValue(e);return parseFloat(n.replace("px", ""));
        }return { escape: c, parseExtension: e, mimeType: n, dataAsUrl: u, isDataUrl: i, canvasToBlob: r, resolveUrl: a, getAndEncode: l, uid: function () {
            var t = 0;return function () {
              return "u" + function () {
                return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
              }() + t++;
            };
          }(), delay: d, asArray: g, escapeXhtml: h, makeImage: s, width: m, height: p };
      }(),
          m = function () {
        function t(t) {
          return -1 !== t.search(o);
        }function e(t) {
          for (var e, n = []; null !== (e = o.exec(t));) {
            n.push(e[1]);
          }return n.filter(function (t) {
            return !h.isDataUrl(t);
          });
        }function n(t, e, n, i) {
          function o(t) {
            return new RegExp("(url\\(['\"]?)(" + h.escape(t) + ")(['\"]?\\))", "g");
          }return Promise.resolve(e).then(function (t) {
            return n ? h.resolveUrl(t, n) : t;
          }).then(i || h.getAndEncode).then(function (t) {
            return h.dataAsUrl(t, h.mimeType(e));
          }).then(function (n) {
            return t.replace(o(e), "$1" + n + "$3");
          });
        }function i(i, o, r) {
          return function () {
            return !t(i);
          }() ? Promise.resolve(i) : Promise.resolve(i).then(e).then(function (t) {
            var e = Promise.resolve(i);return t.forEach(function (t) {
              e = e.then(function (e) {
                return n(e, t, o, r);
              });
            }), e;
          });
        }var o = /url\(['"]?([^'"]+?)['"]?\)/g;return { inlineAll: i, shouldProcess: t, impl: { readUrls: e, inline: n } };
      }(),
          p = function () {
        function t() {
          return e(document).then(function (t) {
            return Promise.all(t.map(function (t) {
              return t.resolve();
            }));
          }).then(function (t) {
            return t.join("\n");
          });
        }function e() {
          function t(t) {
            return t.filter(function (t) {
              return t.type === CSSRule.FONT_FACE_RULE;
            }).filter(function (t) {
              return m.shouldProcess(t.style.getPropertyValue("src"));
            });
          }function e(t) {
            var e = [];return t.forEach(function (t) {
              try {
                h.asArray(t.cssRules || []).forEach(e.push.bind(e));
              } catch (e) {
                console.log("Error while reading CSS rules from " + t.href, e.toString());
              }
            }), e;
          }function n(t) {
            return { resolve: function resolve() {
                var e = (t.parentStyleSheet || {}).href;return m.inlineAll(t.cssText, e);
              }, src: function src() {
                return t.style.getPropertyValue("src");
              } };
          }return Promise.resolve(h.asArray(document.styleSheets)).then(e).then(t).then(function (t) {
            return t.map(n);
          });
        }return { resolveAll: t, impl: { readAll: e } };
      }(),
          f = function () {
        function t(t) {
          function e(e) {
            return h.isDataUrl(t.src) ? Promise.resolve() : Promise.resolve(t.src).then(e || h.getAndEncode).then(function (e) {
              return h.dataAsUrl(e, h.mimeType(t.src));
            }).then(function (e) {
              return new Promise(function (n, i) {
                t.onload = n, t.onerror = i, t.src = e;
              });
            });
          }return { inline: e };
        }function e(n) {
          return n instanceof Element ? function (t) {
            var e = t.style.getPropertyValue("background");return e ? m.inlineAll(e).then(function (e) {
              t.style.setProperty("background", e, t.style.getPropertyPriority("background"));
            }).then(function () {
              return t;
            }) : Promise.resolve(t);
          }(n).then(function () {
            return n instanceof HTMLImageElement ? t(n).inline() : Promise.all(h.asArray(n.childNodes).map(function (t) {
              return e(t);
            }));
          }) : Promise.resolve(n);
        }return { inlineAll: e, impl: { newImage: t } };
      }(),
          M = { imagePlaceholder: void 0, cacheBust: !1 },
          w = { toSvg: n, toPng: o, toJpeg: r, toBlob: a, toPixelData: i, impl: { fontFaces: p, images: f, util: h, inliner: m, options: {} } };t.exports = w;
    }();
  }),
      i = t(function (t) {
    var n = n || function (t) {
      if (!(void 0 === t || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
        var e = t.document,
            n = function n() {
          return t.URL || t.webkitURL || t;
        },
            i = e.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            o = "download" in i,
            r = function r(t) {
          var e = new MouseEvent("click");t.dispatchEvent(e);
        },
            a = /constructor/i.test(t.HTMLElement) || t.safari,
            s = /CriOS\/[\d]+/.test(navigator.userAgent),
            l = function l(e) {
          (t.setImmediate || t.setTimeout)(function () {
            throw e;
          }, 0);
        },
            u = function u(t) {
          var e = function e() {
            "string" == typeof t ? n().revokeObjectURL(t) : t.remove();
          };setTimeout(e, 4e4);
        },
            c = function c(t, e, n) {
          e = [].concat(e);for (var i = e.length; i--;) {
            var o = t["on" + e[i]];if ("function" == typeof o) try {
              o.call(t, n || t);
            } catch (t) {
              l(t);
            }
          }
        },
            d = function d(t) {
          return (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) ? new Blob([String.fromCharCode(65279), t], { type: t.type }) : t
          );
        },
            g = function g(e, l, _g) {
          _g || (e = d(e));var h,
              m = this,
              p = e.type,
              f = "application/octet-stream" === p,
              M = function M() {
            c(m, "writestart progress write writeend".split(" "));
          };if (m.readyState = m.INIT, o) return h = n().createObjectURL(e), void setTimeout(function () {
            i.href = h, i.download = l, r(i), M(), u(h), m.readyState = m.DONE;
          });!function () {
            if ((s || f && a) && t.FileReader) {
              var i = new FileReader();return i.onloadend = function () {
                var e = s ? i.result : i.result.replace(/^data:[^;]*;/, "data:attachment/file;");t.open(e, "_blank") || (t.location.href = e), e = void 0, m.readyState = m.DONE, M();
              }, i.readAsDataURL(e), void (m.readyState = m.INIT);
            }if (h || (h = n().createObjectURL(e)), f) t.location.href = h;else {
              t.open(h, "_blank") || (t.location.href = h);
            }m.readyState = m.DONE, M(), u(h);
          }();
        },
            h = g.prototype,
            m = function m(t, e, n) {
          return new g(t, e || t.name || "download", n);
        };return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function (t, e, n) {
          return e = e || t.name || "download", n || (t = d(t)), navigator.msSaveOrOpenBlob(t, e);
        } : (h.abort = function () {}, h.readyState = h.INIT = 0, h.WRITING = 1, h.DONE = 2, h.error = h.onwritestart = h.onprogress = h.onwrite = h.onabort = h.onerror = h.onwriteend = null, m);
      }
    }("undefined" != typeof self && self || "undefined" != typeof window && window || e.content);t.exports && (t.exports.saveAs = n);
  });L.Control.EasyPrint = L.Control.extend({ options: { title: "Print map", position: "topleft", sizeModes: ["Current"], filename: "map", exportOnly: !1, hidden: !1, tileWait: 500, hideControlContainer: !0, customWindowTitle: window.document.title, spinnerBgCOlor: "#0DC5C1", customSpinnerClass: "epLoader", defaultSizeTitles: { Current: "Current Size", A4Landscape: "A4 Landscape", A4Portrait: "A4 Portrait" } }, onAdd: function onAdd() {
      this.mapContainer = this._map.getContainer(), this.options.sizeModes = this.options.sizeModes.map(function (t) {
        return "Current" === t ? { name: this.options.defaultSizeTitles.Current, className: "CurrentSize" } : "A4Landscape" === t ? { height: this._a4PageSize.height, width: this._a4PageSize.width, name: this.options.defaultSizeTitles.A4Landscape, className: "A4Landscape page" } : "A4Portrait" === t ? { height: this._a4PageSize.width, width: this._a4PageSize.height, name: this.options.defaultSizeTitles.A4Portrait, className: "A4Portrait page" } : t;
      }, this);var t = L.DomUtil.create("div", "leaflet-control-easyPrint leaflet-bar leaflet-control");if (!this.options.hidden) {
        this._addCss(), L.DomEvent.addListener(t, "mouseover", this._togglePageSizeButtons, this), L.DomEvent.addListener(t, "mouseout", this._togglePageSizeButtons, this);var e = "leaflet-control-easyPrint-button";this.options.exportOnly && (e += "-export"), this.link = L.DomUtil.create("a", e, t), this.link.id = "leafletEasyPrint", this.link.title = this.options.title, this.holder = L.DomUtil.create("ul", "easyPrintHolder", t), this.options.sizeModes.forEach(function (t) {
          var e = L.DomUtil.create("li", "easyPrintSizeMode", this.holder);e.title = t.name;L.DomUtil.create("a", t.className, e);L.DomEvent.addListener(e, "click", this.printMap, this);
        }, this), L.DomEvent.disableClickPropagation(t);
      }return t;
    }, printMap: function printMap(t, e) {
      e && (this.options.filename = e), this.options.exportOnly || (this._page = window.open("", "_blank", "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10, top=10, width=200, height=250, visible=none"), this._page.document.write(this._createSpinner(this.options.customWindowTitle, this.options.customSpinnerClass, this.options.spinnerBgCOlor))), this.originalState = { mapWidth: this.mapContainer.style.width, widthWasAuto: !1, widthWasPercentage: !1, mapHeight: this.mapContainer.style.height, zoom: this._map.getZoom(), center: this._map.getCenter() }, "auto" === this.originalState.mapWidth ? (this.originalState.mapWidth = this._map.getSize().x + "px", this.originalState.widthWasAuto = !0) : this.originalState.mapWidth.includes("%") && (this.originalState.percentageWidth = this.originalState.mapWidth, this.originalState.widthWasPercentage = !0, this.originalState.mapWidth = this._map.getSize().x + "px"), this._map.fire("easyPrint-start", { event: t }), this.options.hidden || this._togglePageSizeButtons({ type: null }), this.options.hideControlContainer && this._toggleControls();var n = "string" != typeof t ? t.target.className : t;if ("CurrentSize" === n) return this._printOpertion(n);this.outerContainer = this._createOuterContainer(this.mapContainer), this.originalState.widthWasAuto && (this.outerContainer.style.width = this.originalState.mapWidth), this._createImagePlaceholder(n);
    }, _createImagePlaceholder: function _createImagePlaceholder(t) {
      var e = this;n.toPng(this.mapContainer, { width: parseInt(this.originalState.mapWidth.replace("px")), height: parseInt(this.originalState.mapHeight.replace("px")) }).then(function (n) {
        e.blankDiv = document.createElement("div");var i = e.blankDiv;e.outerContainer.parentElement.insertBefore(i, e.outerContainer), i.className = "epHolder", i.style.backgroundImage = 'url("' + n + '")', i.style.position = "absolute", i.style.zIndex = 1011, i.style.display = "initial", i.style.width = e.originalState.mapWidth, i.style.height = e.originalState.mapHeight, e._resizeAndPrintMap(t);
      }).catch(function (t) {
        console.error("oops, something went wrong!", t);
      });
    }, _resizeAndPrintMap: function _resizeAndPrintMap(t) {
      this.outerContainer.style.opacity = 0;var e = this.options.sizeModes.filter(function (e) {
        return e.className === t;
      });e = e[0], this.mapContainer.style.width = e.width + "px", this.mapContainer.style.height = e.height + "px", this.mapContainer.style.width > this.mapContainer.style.height ? this.orientation = "portrait" : this.orientation = "landscape", this._map.setView(this.originalState.center), this._map.setZoom(this.originalState.zoom), this._map.invalidateSize(), this.options.tileLayer ? this._pausePrint(t) : this._printOpertion(t);
    }, _pausePrint: function _pausePrint(t) {
      var e = this,
          n = setInterval(function () {
        e.options.tileLayer.isLoading() || (clearInterval(n), e._printOpertion(t));
      }, e.options.tileWait);
    }, _printOpertion: function _printOpertion(t) {
      var e = this,
          o = this.mapContainer.style.width;(this.originalState.widthWasAuto && "CurrentSize" === t || this.originalState.widthWasPercentage && "CurrentSize" === t) && (o = this.originalState.mapWidth), n.toPng(e.mapContainer, { width: parseInt(o), height: parseInt(e.mapContainer.style.height.replace("px")) }).then(function (t) {
        var n = e._dataURItoBlob(t);e.options.exportOnly ? i.saveAs(n, e.options.filename + ".png") : e._sendToBrowserPrint(t, e.orientation), e._toggleControls(!0), e.outerContainer && (e.originalState.widthWasAuto ? e.mapContainer.style.width = "auto" : e.originalState.widthWasPercentage ? e.mapContainer.style.width = e.originalState.percentageWidth : e.mapContainer.style.width = e.originalState.mapWidth, e.mapContainer.style.height = e.originalState.mapHeight, e._removeOuterContainer(e.mapContainer, e.outerContainer, e.blankDiv), e._map.invalidateSize(), e._map.setView(e.originalState.center), e._map.setZoom(e.originalState.zoom)), e._map.fire("easyPrint-finished");
      }).catch(function (t) {
        console.error("Print operation failed", t);
      });
    }, _sendToBrowserPrint: function _sendToBrowserPrint(t, e) {
      this._page.resizeTo(600, 800);var n = this._createNewWindow(t, e, this);this._page.document.body.innerHTML = "", this._page.document.write(n), this._page.document.close();
    }, _createSpinner: function _createSpinner(t, e, n) {
      return "<html><head><title>" + t + "</title></head><body><style>\n      body{\n        background: " + n + ";\n      }\n      .epLoader,\n      .epLoader:before,\n      .epLoader:after {\n        border-radius: 50%;\n      }\n      .epLoader {\n        color: #ffffff;\n        font-size: 11px;\n        text-indent: -99999em;\n        margin: 55px auto;\n        position: relative;\n        width: 10em;\n        height: 10em;\n        box-shadow: inset 0 0 0 1em;\n        -webkit-transform: translateZ(0);\n        -ms-transform: translateZ(0);\n        transform: translateZ(0);\n      }\n      .epLoader:before,\n      .epLoader:after {\n        position: absolute;\n        content: '';\n      }\n      .epLoader:before {\n        width: 5.2em;\n        height: 10.2em;\n        background: #0dc5c1;\n        border-radius: 10.2em 0 0 10.2em;\n        top: -0.1em;\n        left: -0.1em;\n        -webkit-transform-origin: 5.2em 5.1em;\n        transform-origin: 5.2em 5.1em;\n        -webkit-animation: load2 2s infinite ease 1.5s;\n        animation: load2 2s infinite ease 1.5s;\n      }\n      .epLoader:after {\n        width: 5.2em;\n        height: 10.2em;\n        background: #0dc5c1;\n        border-radius: 0 10.2em 10.2em 0;\n        top: -0.1em;\n        left: 5.1em;\n        -webkit-transform-origin: 0px 5.1em;\n        transform-origin: 0px 5.1em;\n        -webkit-animation: load2 2s infinite ease;\n        animation: load2 2s infinite ease;\n      }\n      @-webkit-keyframes load2 {\n        0% {\n          -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n        }\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes load2 {\n        0% {\n          -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n        }\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      </style>\n    <div class=\"" + e + '">Loading...</div></body></html>';
    }, _createNewWindow: function _createNewWindow(t, e, n) {
      return "<html><head>\n        <style>@media print {\n          img { max-width: 98%!important; max-height: 98%!important; }\n          @page { size: " + e + ";}}\n        </style>\n        <script>function step1(){\n        setTimeout('step2()', 10);}\n        function step2(){window.print();window.close()}\n        <\/script></head><body onload='step1()'>\n        <img src=\"" + t + '" style="display:block; margin:auto;"></body></html>';
    }, _createOuterContainer: function _createOuterContainer(t) {
      var e = document.createElement("div");return t.parentNode.insertBefore(e, t), t.parentNode.removeChild(t), e.appendChild(t), e.style.width = t.style.width, e.style.height = t.style.height, e.style.display = "inline-block", e.style.overflow = "hidden", e;
    }, _removeOuterContainer: function _removeOuterContainer(t, e, n) {
      e.parentNode && (e.parentNode.insertBefore(t, e), e.parentNode.removeChild(n), e.parentNode.removeChild(e));
    }, _addCss: function _addCss() {
      var t = document.createElement("style");t.type = "text/css", t.innerHTML = ".leaflet-control-easyPrint-button { \n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMTI4LDMyaDI1NnY2NEgxMjhWMzJ6IE00ODAsMTI4SDMyYy0xNy42LDAtMzIsMTQuNC0zMiwzMnYxNjBjMCwxNy42LDE0LjM5OCwzMiwzMiwzMmg5NnYxMjhoMjU2VjM1Mmg5NiAgIGMxNy42LDAsMzItMTQuNCwzMi0zMlYxNjBDNTEyLDE0Mi40LDQ5Ny42LDEyOCw0ODAsMTI4eiBNMzUyLDQ0OEgxNjBWMjg4aDE5MlY0NDh6IE00ODcuMTk5LDE3NmMwLDEyLjgxMy0xMC4zODcsMjMuMi0yMy4xOTcsMjMuMiAgIGMtMTIuODEyLDAtMjMuMjAxLTEwLjM4Ny0yMy4yMDEtMjMuMnMxMC4zODktMjMuMiwyMy4xOTktMjMuMkM0NzYuODE0LDE1Mi44LDQ4Ny4xOTksMTYzLjE4Nyw0ODcuMTk5LDE3NnoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);\n      background-size: 16px 16px; \n      cursor: pointer; \n    }\n    .leaflet-control-easyPrint-button-export { \n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);\n      background-size: 16px 16px; \n      cursor: pointer; \n    }\n    .easyPrintHolder a {\n      background-size: 16px 16px;\n      cursor: pointer;\n    }\n    .easyPrintHolder .CurrentSize{\n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTZweCIgdmVyc2lvbj0iMS4xIiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiPgogIDxnPgogICAgPGcgZmlsbD0iIzFEMUQxQiI+CiAgICAgIDxwYXRoIGQ9Ik0yNS4yNTUsMzUuOTA1TDQuMDE2LDU3LjE0NVY0Ni41OWMwLTEuMTA4LTAuODk3LTIuMDA4LTIuMDA4LTIuMDA4QzAuODk4LDQ0LjU4MiwwLDQ1LjQ4MSwwLDQ2LjU5djE1LjQwMiAgICBjMCwwLjI2MSwwLjA1MywwLjUyMSwwLjE1NSwwLjc2N2MwLjIwMywwLjQ5MiwwLjU5NCwwLjg4MiwxLjA4NiwxLjA4N0MxLjQ4Niw2My45NDcsMS43NDcsNjQsMi4wMDgsNjRoMTUuNDAzICAgIGMxLjEwOSwwLDIuMDA4LTAuODk4LDIuMDA4LTIuMDA4cy0wLjg5OC0yLjAwOC0yLjAwOC0yLjAwOEg2Ljg1NWwyMS4yMzgtMjEuMjRjMC43ODQtMC43ODQsMC43ODQtMi4wNTUsMC0yLjgzOSAgICBTMjYuMDM5LDM1LjEyMSwyNS4yNTUsMzUuOTA1eiIgZmlsbD0iIzAwMDAwMCIvPgogICAgICA8cGF0aCBkPSJtNjMuODQ1LDEuMjQxYy0wLjIwMy0wLjQ5MS0wLjU5NC0wLjg4Mi0xLjA4Ni0xLjA4Ny0wLjI0NS0wLjEwMS0wLjUwNi0wLjE1NC0wLjc2Ny0wLjE1NGgtMTUuNDAzYy0xLjEwOSwwLTIuMDA4LDAuODk4LTIuMDA4LDIuMDA4czAuODk4LDIuMDA4IDIuMDA4LDIuMDA4aDEwLjU1NmwtMjEuMjM4LDIxLjI0Yy0wLjc4NCwwLjc4NC0wLjc4NCwyLjA1NSAwLDIuODM5IDAuMzkyLDAuMzkyIDAuOTA2LDAuNTg5IDEuNDIsMC41ODlzMS4wMjctMC4xOTcgMS40MTktMC41ODlsMjEuMjM4LTIxLjI0djEwLjU1NWMwLDEuMTA4IDAuODk3LDIuMDA4IDIuMDA4LDIuMDA4IDEuMTA5LDAgMi4wMDgtMC44OTkgMi4wMDgtMi4wMDh2LTE1LjQwMmMwLTAuMjYxLTAuMDUzLTAuNTIyLTAuMTU1LTAuNzY3eiIgZmlsbD0iIzAwMDAwMCIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==)\n    }\n    .easyPrintHolder .page {\n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0NC44MzMgNDQ0LjgzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ0LjgzMyA0NDQuODMzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTUuMjUsNDQ0LjgzM2gzMzQuMzMzYzkuMzUsMCwxNy03LjY1LDE3LTE3VjEzOS4xMTdjMC00LjgxNy0xLjk4My05LjM1LTUuMzgzLTEyLjQ2N0wyNjkuNzMzLDQuNTMzICAgIEMyNjYuNjE3LDEuNywyNjIuMzY3LDAsMjU4LjExNywwSDU1LjI1Yy05LjM1LDAtMTcsNy42NS0xNywxN3Y0MTAuODMzQzM4LjI1LDQzNy4xODMsNDUuOSw0NDQuODMzLDU1LjI1LDQ0NC44MzN6ICAgICBNMzcyLjU4MywxNDYuNDgzdjAuODVIMjU2LjQxN3YtMTA4LjhMMzcyLjU4MywxNDYuNDgzeiBNNzIuMjUsMzRoMTUwLjE2N3YxMzAuMzMzYzAsOS4zNSw3LjY1LDE3LDE3LDE3aDEzMy4xNjd2MjI5LjVINzIuMjVWMzR6ICAgICIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);\n    }\n    .easyPrintHolder .A4Landscape { \n      transform: rotate(-90deg);\n    }\n\n    .leaflet-control-easyPrint-button{\n      display: inline-block;\n    }\n    .easyPrintHolder{\n      margin-top:-31px;\n      margin-bottom: -5px;\n      margin-left: 30px;\n      padding-left: 0px;\n      display: none;\n    }\n\n    .easyPrintSizeMode {\n      display: inline-block;\n    }\n    .easyPrintHolder .easyPrintSizeMode a {\n      border-radius: 0px;\n    }\n\n    .easyPrintHolder .easyPrintSizeMode:last-child a{\n      border-top-right-radius: 2px;\n      border-bottom-right-radius: 2px;\n      margin-left: -1px;\n    }\n\n    .easyPrintPortrait:hover, .easyPrintLandscape:hover{\n      background-color: #757570;\n      cursor: pointer;\n    }", document.body.appendChild(t);
    }, _dataURItoBlob: function _dataURItoBlob(t) {
      for (var e = atob(t.split(",")[1]), n = t.split(",")[0].split(":")[1].split(";")[0], i = new ArrayBuffer(e.length), o = new DataView(i), r = 0; r < e.length; r++) {
        o.setUint8(r, e.charCodeAt(r));
      }return new Blob([i], { type: n });
    }, _togglePageSizeButtons: function _togglePageSizeButtons(t) {
      var e = this.holder.style,
          n = this.link.style;"mouseover" === t.type ? (e.display = "block", n.borderTopRightRadius = "0", n.borderBottomRightRadius = "0") : (e.display = "none", n.borderTopRightRadius = "2px", n.borderBottomRightRadius = "2px");
    }, _toggleControls: function _toggleControls(t) {
      var e = document.getElementsByClassName("leaflet-control-container")[0];if (t) return e.style.display = "block";e.style.display = "none";
    }, _a4PageSize: { height: 715, width: 1045 } }), L.easyPrint = function (t) {
    return new L.Control.EasyPrint(t);
  };
});
//# sourceMappingURL=bundle.js.map
;'use strict';

// NTLM (ntlm.js) authentication in JavaScript.
// ------------------------------------------------------------------------
// The MIT License (MIT). Copyright (c) 2012 Erland Ranvinge.
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Msg = function Msg(data) {
    this.data = [];
    if (!data) return;
    if (data.indexOf('NTLM ') == 0) data = data.substr(5);
    atob(data).split('').map(function (c) {
        this.push(c.charCodeAt(0));
    }, this.data);
};

Msg.prototype.addByte = function (b) {
    this.data.push(b);
};

Msg.prototype.addShort = function (s) {
    this.data.push(s & 0xFF);
    this.data.push(s >> 8 & 0xFF);
};

Msg.prototype.addString = function (str, utf16) {
    if (utf16) // Fake UTF16 by padding each character in string.
        str = str.split('').map(function (c) {
            return c + '\0';
        }).join('');

    for (var i = 0; i < str.length; i++) {
        this.data.push(str.charCodeAt(i));
    }
};

Msg.prototype.getString = function (offset, length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        if (offset + i >= this.data.length) return '';
        result += String.fromCharCode(this.data[offset + i]);
    }
    return result;
};

Msg.prototype.getByte = function (offset) {
    return this.data[offset];
};

Msg.prototype.toBase64 = function () {
    var str = String.fromCharCode.apply(null, this.data);
    return btoa(str).replace(/.{76}(?=.)/g, '$&');
};

var Ntlm = {};
Ntlm.domain = null;
Ntlm.username = null;
Ntlm.lmHashedPassword = null;
Ntlm.ntHashedPassword = null;

Ntlm.error = function (msg) {
    console.error(msg);
};

Ntlm.message = function (msg) {
    console.log(msg);
};

Ntlm.createMessage1 = function (hostname) {
    var msg1 = new Msg();
    msg1.addString('NTLMSSP\0');
    msg1.addByte(1);
    msg1.addString('\0\0\0');
    msg1.addShort(0xb203);
    msg1.addString('\0\0');
    msg1.addShort(Ntlm.domain.length);
    msg1.addShort(Ntlm.domain.length);
    msg1.addShort(32 + hostname.length);
    msg1.addString('\0\0');
    msg1.addShort(hostname.length);
    msg1.addShort(hostname.length);
    msg1.addShort(32);
    msg1.addString('\0\0');
    msg1.addString(hostname.toUpperCase());
    msg1.addString(Ntlm.domain.toUpperCase());
    return msg1;
};

Ntlm.getChallenge = function (data) {
    var msg2 = new Msg(data);
    if (msg2.getString(0, 8) != 'NTLMSSP\0') {
        Ntlm.error('Invalid NTLM response header.');
        return '';
    }
    if (msg2.getByte(8) != 2) {
        Ntlm.error('Invalid NTLM response type.');
        return '';
    }
    var challenge = msg2.getString(24, 8);
    return challenge;
};

Ntlm.createMessage3 = function (challenge, hostname) {
    var lmResponse = Ntlm.buildResponse(Ntlm.lmHashedPassword, challenge);
    var ntResponse = Ntlm.buildResponse(Ntlm.ntHashedPassword, challenge);
    var username = Ntlm.username;
    var domain = Ntlm.domain;
    var msg3 = new Msg();

    msg3.addString('NTLMSSP\0');
    msg3.addByte(3);
    msg3.addString('\0\0\0');

    msg3.addShort(24); // lmResponse
    msg3.addShort(24);
    msg3.addShort(64 + (domain.length + username.length + hostname.length) * 2);
    msg3.addString('\0\0');

    msg3.addShort(24); // ntResponse
    msg3.addShort(24);
    msg3.addShort(88 + (domain.length + username.length + hostname.length) * 2);
    msg3.addString('\0\0');

    msg3.addShort(domain.length * 2); // Domain.
    msg3.addShort(domain.length * 2);
    msg3.addShort(64);
    msg3.addString('\0\0');

    msg3.addShort(username.length * 2); // Username.
    msg3.addShort(username.length * 2);
    msg3.addShort(64 + domain.length * 2);
    msg3.addShort('\0\0');

    msg3.addShort(hostname.length * 2); // Hostname.
    msg3.addShort(hostname.length * 2);
    msg3.addShort(64 + (domain.length + username.length) * 2);
    msg3.addString('\0\0');

    msg3.addString('\0\0\0\0');
    msg3.addShort(112 + (domain.length + username.length + hostname.length) * 2);
    msg3.addString('\0\0');
    msg3.addShort(0x8201);
    msg3.addString('\0\0');

    msg3.addString(domain.toUpperCase(), true); // "Some" string are passed as UTF-16.
    msg3.addString(username, true);
    msg3.addString(hostname.toUpperCase(), true);
    msg3.addString(lmResponse);
    msg3.addString(ntResponse);

    return msg3;
};

Ntlm.createKey = function (str) {
    var key56 = [];
    while (str.length < 7) {
        str += '\0';
    }str = str.substr(0, 7);
    str.split('').map(function (c) {
        this.push(c.charCodeAt(0));
    }, key56);
    var key = [0, 0, 0, 0, 0, 0, 0, 0];
    key[0] = key56[0]; // Convert 56 bit key to 64 bit.
    key[1] = key56[0] << 7 & 0xFF | key56[1] >> 1;
    key[2] = key56[1] << 6 & 0xFF | key56[2] >> 2;
    key[3] = key56[2] << 5 & 0xFF | key56[3] >> 3;
    key[4] = key56[3] << 4 & 0xFF | key56[4] >> 4;
    key[5] = key56[4] << 3 & 0xFF | key56[5] >> 5;
    key[6] = key56[5] << 2 & 0xFF | key56[6] >> 6;
    key[7] = key56[6] << 1 & 0xFF;
    for (var i = 0; i < key.length; i++) {
        // Fix DES key parity bits.
        var bit = 0;
        for (var k = 0; k < 7; k++) {
            t = key[i] >> k;
            bit = (t ^ bit) & 0x1;
        }
        key[i] = key[i] & 0xFE | bit;
    }

    var result = '';
    key.map(function (i) {
        result += String.fromCharCode(i);
    });
    return result;
};

Ntlm.buildResponse = function (key, text) {
    while (key.length < 21) {
        key += '\0';
    }var key1 = Ntlm.createKey(key.substr(0, 7));
    var key2 = Ntlm.createKey(key.substr(7, 7));
    var key3 = Ntlm.createKey(key.substr(14, 7));
    return des(key1, text, 1, 0) + des(key2, text, 1, 0) + des(key3, text, 1, 0);
};

Ntlm.getLocation = function (url) {
    var l = document.createElement("a");
    l.href = url;
    return l;
};

Ntlm.setCredentials = function (domain, username, password) {
    var magic = 'KGS!@#$%'; // Create LM password hash.
    var lmPassword = password.toUpperCase().substr(0, 14);
    while (lmPassword.length < 14) {
        lmPassword += '\0';
    }var key1 = Ntlm.createKey(lmPassword);
    var key2 = Ntlm.createKey(lmPassword.substr(7));
    var lmHashedPassword = des(key1, magic, 1, 0) + des(key2, magic, 1, 0);

    var ntPassword = ''; // Create NT password hash.
    for (var i = 0; i < password.length; i++) {
        ntPassword += password.charAt(i) + '\0';
    }var ntHashedPassword = str_md4(ntPassword);

    Ntlm.domain = domain;
    Ntlm.username = username;
    Ntlm.lmHashedPassword = lmHashedPassword;
    Ntlm.ntHashedPassword = ntHashedPassword;
};

Ntlm.isChallenge = function (xhr) {
    if (!xhr) return false;
    if (xhr.status != 401) return false;
    var header = xhr.getResponseHeader('WWW-Authenticate');
    return header && header.indexOf('NTLM') != -1;
};

Ntlm.authenticate = function (url) {
    if (!Ntlm.domain || !Ntlm.username || !Ntlm.lmHashedPassword || !Ntlm.ntHashedPassword) {
        Ntlm.error('No NTLM credentials specified. Use Ntlm.setCredentials(...) before making calls.');
        return false;
    }
    var hostname = Ntlm.getLocation(url).hostname;
    var msg1 = Ntlm.createMessage1(hostname);
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.setRequestHeader('Authorization', 'NTLM ' + msg1.toBase64());
    request.send(null);
    var response = request.getResponseHeader('WWW-Authenticate');
    var challenge = Ntlm.getChallenge(response);

    var msg3 = Ntlm.createMessage3(challenge, hostname);
    request.open('GET', url, false);
    request.setRequestHeader('Authorization', 'NTLM ' + msg3.toBase64());
    request.send(null);
    return request.status == 200;
};

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD4 Message
 * Digest Algorithm, as defined in RFC 1320.
 * Version 2.1 Copyright (C) Jerrad Pierce, Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var chrsz = 8;

function str_md4(s) {
    return binl2str(core_md4(str2binl(s), s.length * chrsz));
}

function core_md4(x, len) {
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md4_ff(a, b, c, d, x[i + 0], 3);
        d = md4_ff(d, a, b, c, x[i + 1], 7);
        c = md4_ff(c, d, a, b, x[i + 2], 11);
        b = md4_ff(b, c, d, a, x[i + 3], 19);
        a = md4_ff(a, b, c, d, x[i + 4], 3);
        d = md4_ff(d, a, b, c, x[i + 5], 7);
        c = md4_ff(c, d, a, b, x[i + 6], 11);
        b = md4_ff(b, c, d, a, x[i + 7], 19);
        a = md4_ff(a, b, c, d, x[i + 8], 3);
        d = md4_ff(d, a, b, c, x[i + 9], 7);
        c = md4_ff(c, d, a, b, x[i + 10], 11);
        b = md4_ff(b, c, d, a, x[i + 11], 19);
        a = md4_ff(a, b, c, d, x[i + 12], 3);
        d = md4_ff(d, a, b, c, x[i + 13], 7);
        c = md4_ff(c, d, a, b, x[i + 14], 11);
        b = md4_ff(b, c, d, a, x[i + 15], 19);

        a = md4_gg(a, b, c, d, x[i + 0], 3);
        d = md4_gg(d, a, b, c, x[i + 4], 5);
        c = md4_gg(c, d, a, b, x[i + 8], 9);
        b = md4_gg(b, c, d, a, x[i + 12], 13);
        a = md4_gg(a, b, c, d, x[i + 1], 3);
        d = md4_gg(d, a, b, c, x[i + 5], 5);
        c = md4_gg(c, d, a, b, x[i + 9], 9);
        b = md4_gg(b, c, d, a, x[i + 13], 13);
        a = md4_gg(a, b, c, d, x[i + 2], 3);
        d = md4_gg(d, a, b, c, x[i + 6], 5);
        c = md4_gg(c, d, a, b, x[i + 10], 9);
        b = md4_gg(b, c, d, a, x[i + 14], 13);
        a = md4_gg(a, b, c, d, x[i + 3], 3);
        d = md4_gg(d, a, b, c, x[i + 7], 5);
        c = md4_gg(c, d, a, b, x[i + 11], 9);
        b = md4_gg(b, c, d, a, x[i + 15], 13);

        a = md4_hh(a, b, c, d, x[i + 0], 3);
        d = md4_hh(d, a, b, c, x[i + 8], 9);
        c = md4_hh(c, d, a, b, x[i + 4], 11);
        b = md4_hh(b, c, d, a, x[i + 12], 15);
        a = md4_hh(a, b, c, d, x[i + 2], 3);
        d = md4_hh(d, a, b, c, x[i + 10], 9);
        c = md4_hh(c, d, a, b, x[i + 6], 11);
        b = md4_hh(b, c, d, a, x[i + 14], 15);
        a = md4_hh(a, b, c, d, x[i + 1], 3);
        d = md4_hh(d, a, b, c, x[i + 9], 9);
        c = md4_hh(c, d, a, b, x[i + 5], 11);
        b = md4_hh(b, c, d, a, x[i + 13], 15);
        a = md4_hh(a, b, c, d, x[i + 3], 3);
        d = md4_hh(d, a, b, c, x[i + 11], 9);
        c = md4_hh(c, d, a, b, x[i + 7], 11);
        b = md4_hh(b, c, d, a, x[i + 15], 15);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}

function md4_cmn(q, a, b, x, s, t) {
    return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md4_ff(a, b, c, d, x, s) {
    return md4_cmn(b & c | ~b & d, a, 0, x, s, 0);
}
function md4_gg(a, b, c, d, x, s) {
    return md4_cmn(b & c | b & d | c & d, a, 0, x, s, 1518500249);
}
function md4_hh(a, b, c, d, x, s) {
    return md4_cmn(b ^ c ^ d, a, 0, x, s, 1859775393);
}

function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
}

function rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
}

function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
    }return bin;
}

function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) {
        str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
    }return str;
}

//Paul Tero, July 2001
//http://www.tero.co.uk/des/
//
//Optimised for performance with large blocks by Michael Hayworth, November 2001
//http://www.netdealing.com
//
//THIS SOFTWARE IS PROVIDED "AS IS" AND
//ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
//FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
//OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
//LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
//OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
//SUCH DAMAGE.

//des
//this takes the key, the message, and whether to encrypt or decrypt
function des(key, message, encrypt, mode, iv, padding) {
    //declaring this locally speeds things up a bit
    var spfunction1 = new Array(0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004);
    var spfunction2 = new Array(-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000);
    var spfunction3 = new Array(0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200);
    var spfunction4 = new Array(0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080);
    var spfunction5 = new Array(0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100);
    var spfunction6 = new Array(0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010);
    var spfunction7 = new Array(0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002);
    var spfunction8 = new Array(0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000);

    //create the 16 or 48 subkeys we will need
    var keys = des_createKeys(key);
    var m = 0,
        i,
        j,
        temp,
        temp2,
        right1,
        right2,
        left,
        right,
        looping;
    var cbcleft, cbcleft2, cbcright, cbcright2;
    var endloop, loopinc;
    var len = message.length;
    var chunk = 0;
    //set up the loops for single and triple des
    var iterations = keys.length == 32 ? 3 : 9; //single or triple des
    if (iterations == 3) {
        looping = encrypt ? new Array(0, 32, 2) : new Array(30, -2, -2);
    } else {
        looping = encrypt ? new Array(0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array(94, 62, -2, 32, 64, 2, 30, -2, -2);
    }

    //pad the message depending on the padding parameter
    if (padding == 2) message += "        "; //pad the message with spaces
    else if (padding == 1) {
            temp = 8 - len % 8;message += String.fromCharCode(temp, temp, temp, temp, temp, temp, temp, temp);if (temp == 8) len += 8;
        } //PKCS7 padding
        else if (!padding) message += "\0\0\0\0\0\0\0\0"; //pad the message out with null bytes

    //store the result here
    result = "";
    tempresult = "";

    if (mode == 1) {
        //CBC mode
        cbcleft = iv.charCodeAt(m++) << 24 | iv.charCodeAt(m++) << 16 | iv.charCodeAt(m++) << 8 | iv.charCodeAt(m++);
        cbcright = iv.charCodeAt(m++) << 24 | iv.charCodeAt(m++) << 16 | iv.charCodeAt(m++) << 8 | iv.charCodeAt(m++);
        m = 0;
    }

    //loop through each 64 bit chunk of the message
    while (m < len) {
        left = message.charCodeAt(m++) << 24 | message.charCodeAt(m++) << 16 | message.charCodeAt(m++) << 8 | message.charCodeAt(m++);
        right = message.charCodeAt(m++) << 24 | message.charCodeAt(m++) << 16 | message.charCodeAt(m++) << 8 | message.charCodeAt(m++);

        //for Cipher Block Chaining mode, xor the message with the previous result
        if (mode == 1) {
            if (encrypt) {
                left ^= cbcleft;right ^= cbcright;
            } else {
                cbcleft2 = cbcleft;cbcright2 = cbcright;cbcleft = left;cbcright = right;
            }
        }

        //first each 64 but chunk of the message must be permuted according to IP
        temp = (left >>> 4 ^ right) & 0x0f0f0f0f;right ^= temp;left ^= temp << 4;
        temp = (left >>> 16 ^ right) & 0x0000ffff;right ^= temp;left ^= temp << 16;
        temp = (right >>> 2 ^ left) & 0x33333333;left ^= temp;right ^= temp << 2;
        temp = (right >>> 8 ^ left) & 0x00ff00ff;left ^= temp;right ^= temp << 8;
        temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;

        left = left << 1 | left >>> 31;
        right = right << 1 | right >>> 31;

        //do this either 1 or 3 times for each chunk of the message
        for (j = 0; j < iterations; j += 3) {
            endloop = looping[j + 1];
            loopinc = looping[j + 2];
            //now go through and perform the encryption or decryption
            for (i = looping[j]; i != endloop; i += loopinc) {
                //for efficiency
                right1 = right ^ keys[i];
                right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
                //the result is attained by passing these bytes through the S selection functions
                temp = left;
                left = right;
                right = temp ^ (spfunction2[right1 >>> 24 & 0x3f] | spfunction4[right1 >>> 16 & 0x3f] | spfunction6[right1 >>> 8 & 0x3f] | spfunction8[right1 & 0x3f] | spfunction1[right2 >>> 24 & 0x3f] | spfunction3[right2 >>> 16 & 0x3f] | spfunction5[right2 >>> 8 & 0x3f] | spfunction7[right2 & 0x3f]);
            }
            temp = left;left = right;right = temp; //unreverse left and right
        } //for either 1 or 3 iterations

        //move then each one bit to the right
        left = left >>> 1 | left << 31;
        right = right >>> 1 | right << 31;

        //now perform IP-1, which is IP in the opposite direction
        temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;
        temp = (right >>> 8 ^ left) & 0x00ff00ff;left ^= temp;right ^= temp << 8;
        temp = (right >>> 2 ^ left) & 0x33333333;left ^= temp;right ^= temp << 2;
        temp = (left >>> 16 ^ right) & 0x0000ffff;right ^= temp;left ^= temp << 16;
        temp = (left >>> 4 ^ right) & 0x0f0f0f0f;right ^= temp;left ^= temp << 4;

        //for Cipher Block Chaining mode, xor the message with the previous result
        if (mode == 1) {
            if (encrypt) {
                cbcleft = left;cbcright = right;
            } else {
                left ^= cbcleft2;right ^= cbcright2;
            }
        }
        tempresult += String.fromCharCode(left >>> 24, left >>> 16 & 0xff, left >>> 8 & 0xff, left & 0xff, right >>> 24, right >>> 16 & 0xff, right >>> 8 & 0xff, right & 0xff);

        chunk += 8;
        if (chunk == 512) {
            result += tempresult;tempresult = "";chunk = 0;
        }
    } //for every 8 characters, or 64 bits in the message

    //return the result as an array
    return result + tempresult;
} //end of des


//des_createKeys
//this takes as input a 64 bit key (even though only 56 bits are used)
//as an array of 2 integers, and returns 16 48 bit keys
function des_createKeys(key) {
    //declaring this locally speeds things up a bit
    pc2bytes0 = new Array(0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204);
    pc2bytes1 = new Array(0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101);
    pc2bytes2 = new Array(0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808);
    pc2bytes3 = new Array(0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000);
    pc2bytes4 = new Array(0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010);
    pc2bytes5 = new Array(0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420);
    pc2bytes6 = new Array(0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002);
    pc2bytes7 = new Array(0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800);
    pc2bytes8 = new Array(0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002);
    pc2bytes9 = new Array(0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408);
    pc2bytes10 = new Array(0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020);
    pc2bytes11 = new Array(0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200);
    pc2bytes12 = new Array(0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010);
    pc2bytes13 = new Array(0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105);

    //how many iterations (1 for des, 3 for triple des)
    var iterations = key.length > 8 ? 3 : 1; //changed by Paul 16/6/2007 to use Triple DES for 9+ byte keys
    //stores the return keys
    var keys = new Array(32 * iterations);
    //now define the left shifts which need to be done
    var shifts = new Array(0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
    //other variables
    var lefttemp,
        righttemp,
        m = 0,
        n = 0,
        temp;

    for (var j = 0; j < iterations; j++) {
        //either 1 or 3 iterations
        left = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
        right = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);

        temp = (left >>> 4 ^ right) & 0x0f0f0f0f;right ^= temp;left ^= temp << 4;
        temp = (right >>> -16 ^ left) & 0x0000ffff;left ^= temp;right ^= temp << -16;
        temp = (left >>> 2 ^ right) & 0x33333333;right ^= temp;left ^= temp << 2;
        temp = (right >>> -16 ^ left) & 0x0000ffff;left ^= temp;right ^= temp << -16;
        temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;
        temp = (right >>> 8 ^ left) & 0x00ff00ff;left ^= temp;right ^= temp << 8;
        temp = (left >>> 1 ^ right) & 0x55555555;right ^= temp;left ^= temp << 1;

        //the right side needs to be shifted and to get the last four bits of the left side
        temp = left << 8 | right >>> 20 & 0x000000f0;
        //left needs to be put upside down
        left = right << 24 | right << 8 & 0xff0000 | right >>> 8 & 0xff00 | right >>> 24 & 0xf0;
        right = temp;

        //now go through and perform these shifts on the left and right keys
        for (var i = 0; i < shifts.length; i++) {
            //shift the keys either one or two bits to the left
            if (shifts[i]) {
                left = left << 2 | left >>> 26;right = right << 2 | right >>> 26;
            } else {
                left = left << 1 | left >>> 27;right = right << 1 | right >>> 27;
            }
            left &= -0xf;right &= -0xf;

            //now apply PC-2, in such a way that E is easier when encrypting or decrypting
            //this conversion will look like PC-2 except only the last 6 bits of each byte are used
            //rather than 48 consecutive bits and the order of lines will be according to
            //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7
            lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 0xf] | pc2bytes2[left >>> 20 & 0xf] | pc2bytes3[left >>> 16 & 0xf] | pc2bytes4[left >>> 12 & 0xf] | pc2bytes5[left >>> 8 & 0xf] | pc2bytes6[left >>> 4 & 0xf];
            righttemp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 0xf] | pc2bytes9[right >>> 20 & 0xf] | pc2bytes10[right >>> 16 & 0xf] | pc2bytes11[right >>> 12 & 0xf] | pc2bytes12[right >>> 8 & 0xf] | pc2bytes13[right >>> 4 & 0xf];
            temp = (righttemp >>> 16 ^ lefttemp) & 0x0000ffff;
            keys[n++] = lefttemp ^ temp;keys[n++] = righttemp ^ temp << 16;
        }
    } //for each iterations
    //return the keys we've created
    return keys;
} //end of des_createKeys
;'use strict';

var ThemeStatus = {
    UNMODIFIED: 0,
    NEW: 1,
    UPDATED: 2,
    DELETED: 3
};
var LayerType = {
    LAYER: 0,
    GROUP: 1
};
var ActiveInteractieButton = {
    GEEN: 'geen',
    IDENTIFY: 'identify',
    SELECT: 'select',
    METEN: 'meten',
    WATISHIER: 'watishier'
};
var GAAS = {
    ReversedGeocodeUrl: 'https://reversedgeocoding-app1-p.antwerpen.be/'
};
var Gis = {
    Arcgissql: '',
    BaseUrl: 'https://geoint.antwerpen.be/',
    PublicBaseUrl: 'https://geodata.antwerpen.be/',
    LocatieUrl: 'https://geoint-a.antwerpen.be/arcgissql/rest/services/A_DA/Locaties/MapServer',
    GeometryUrl: 'https://geoint.antwerpen.be/arcgissql/rest/services/Utilities/Geometry/GeometryServer/buffer'
};
Gis.Arcgissql = Gis.BaseUrl + 'arcgissql/rest/';
var Solr = {
    BaseUrl: 'https://esb-app1-o.antwerpen.be/v1/'
};
var DrawingOption = {
    GEEN: 'geen',
    NIETS: '',
    AFSTAND: 'afstand',
    OPPERVLAKTE: 'oppervlakte',
    LIJN: 'lijn',
    VIERKANT: 'vierkant',
    POLYGON: 'polygon'
};
var Global = { Mobile: false };
var ThemeType = {
    ESRI: 'esri',
    WMS: 'wms'
};
var Style = {
    DEFAULT: {
        fillOpacity: 0,
        color: 'blue',
        weight: 4
    },
    ADD: {
        fillOpacity: 0,
        color: 'green',
        weight: 5
    },
    REMOVE: {
        fillOpacity: 0,
        color: 'red',
        weight: 5
    },
    HIGHLIGHT: {
        weight: 7,
        color: 'red',
        fillOpacity: 0.5
    },
    COREBUFFER: {
        weight: 7,
        color: 'lightgreen',
        fillOpacity: 0.5
    },
    BUFFER: {
        fillColor: '#00cc00',
        color: '#00cc00',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.3
    }
};
var Scales = [250000, 200000, 150000, 100000, 50000, 25000, 20000, 15000, 12500, 10000, 7500, 5000, 2500, 2000, 1500, 1250, 1000, 750, 500, 250, 100];
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tinµk.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('geoPuntController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'PopupService', function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, PopupService) {
        $scope.loading = false;
        $scope.themeloading = false;
        $scope.currentPage = 1;
        $scope.geopuntError = null;

        //Data, status and url for GeoPunt error
        $scope.data = null;
        $scope.status = null;
        $scope.url = null;

        $scope.pagingCount = null;
        $scope.numberofrecordsmatched = 0;
        LayerManagementService.EnabledThemes.length = 0;
        LayerManagementService.AvailableThemes.length = 0;
        LayerManagementService.EnabledThemes = angular.copy(MapData.Themes);
        $scope.availableThemes = [];
        var init = function () {
            $scope.searchTerm = '';
        }();
        if (!L.Browser.mobile) {
            $scope.$on("searchChanged", function (event, searchTerm) {
                $scope.searchTerm = searchTerm;
                if ($scope.searchTerm.length > 2) {
                    $scope.clearPreview();
                    $scope.searchIsUrl = false;
                    $scope.$parent.geopuntLoading = true;
                    $scope.QueryGeoPunt($scope.searchTerm, 1);
                } else {
                    $scope.availableThemes.length = 0;
                    $scope.numberofrecordsmatched = 0;
                    $scope.$parent.geopuntCount = null;
                    $scope.loading = false;
                    $scope.$parent.geopuntLoading = false;
                }
            });
        }

        $scope.QueryGeoPunt = function (searchTerm, page) {
            $scope.loading = true;
            $scope.clearPreview();
            var prom = GeopuntService.getMetaData(searchTerm, (page - 1) * 5 + 1, 5);
            prom.then(function (metadata) {

                if ($scope.currentPage == 0) {
                    $scope.currentPage = 1;
                }
                $scope.loading = false;
                $scope.$parent.geopuntLoading = false;
                $scope.availableThemes = metadata.results;
                $scope.currentrecord = metadata.currentrecord;
                $scope.nextrecord = metadata.nextrecord;
                $scope.numberofrecordsmatched = metadata.numberofrecordsmatched;
                $scope.$parent.geopuntCount = metadata.numberofrecordsmatched;
            }, function (reason) {
                console.log(reason);
                $scope.$parent.geopuntLoading = false;
                $scope.$parent.geopuntCount = "!";
                $scope.geopuntError = true;
                $scope.loading = false;
                $scope.data = reason.data;
                $scope.status = reason.status;
                $scope.url = reason.url;
            });
        };
        $scope.pageChanged = function (page, recordsAPage) {
            $scope.QueryGeoPunt($scope.searchTerm, page);
        };
        $scope.geopuntThemeChanged = function (theme) {
            var questionmarkPos = theme.Url.trim().indexOf('?');
            var url = theme.Url.trim();
            if (questionmarkPos != -1) {
                url = theme.Url.trim().substring(0, questionmarkPos);
            }
            createWMS(url);
        };
        var createWMS = function createWMS(url) {
            $scope.clearPreview();
            var wms = MapData.Themes.find(function (x) {
                return x.cleanUrl == url;
            });
            if (wms == undefined) {
                var getwms = WMSService.GetThemeData(url);
                $scope.themeloading = true;
                getwms.success(function (data, status, headers, config) {
                    $scope.themeloading = false;
                    if (data) {
                        var wmstheme = ThemeCreater.createWMSThemeFromJSON(data, url);
                        $scope.previewTheme(wmstheme);
                    } else {
                        PopupService.Error("Fout bij het laden van de WMS", "Er is een fout opgetreden bij opvragen van de wms met de url: " + url);
                        $scope.error = "Fout bij het laden van WMS.";
                    }
                }).error(function (data, status, headers, config) {
                    $scope.error = "Fout bij het laden van WMS.";
                    $scope.themeloading = false;
                });
            } else {
                $scope.previewTheme(wms);
            }
        };
        $scope.selectedTheme = null;
        $scope.copySelectedTheme = null;
        $scope.previewTheme = function (theme) {
            $scope.selectedTheme = theme;
            $scope.copySelectedTheme = angular.copy(theme);
        };
        $scope.clearPreview = function () {
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.error = null;
            $scope.geopuntError = null;
        };

        $scope.AddOrUpdateTheme = function () {
            PopupService.Success("Data is bijgewerkt.", null, null, { timeOut: 1000 });
            LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
            $scope.clearPreview();
        };

        $scope.reportError = function () {
            var exception = { url: $scope.url, status: $scope.status, data: $scope.data };
            PopupService.ExceptionFunc(exception);
        };
    }]);
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('LayerManagerController', ['$scope', '$modalInstance', 'LayerManagementService', function ($scope, $modalInstance, LayerManagementService) {
        $scope.active = 'solr';
        $scope.searchTerm = '';
        $scope.solrLoading = false;
        $scope.solrCount = null;
        $scope.geopuntLoading = false;
        $scope.geopuntCount = null;
        $scope.mobile = L.Browser.mobile;
        $scope.ok = function () {
            $modalInstance.$close(); // return the themes.
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
        };
        $scope.enterPressed = function () {
            if ($scope.searchTerm == '') {
                $scope.$broadcast("searchChanged", '*');
            };
        };
        $scope.searchChanged = function () {
            if ($scope.searchTerm != null && $scope.searchTerm != '') {
                $scope.$broadcast("searchChanged", $scope.searchTerm);
            }
        };
    }]);
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('layersManagementController', ['$scope', 'MapData', 'ThemeService', 'LayerManagementService', 'PopupService', function ($scope, MapData, ThemeService, LayerManagementService, PopupService) {
        $scope.pagingCount = null;
        $scope.numberofrecordsmatched = 0;
        $scope.availableThemes = MapData.Themes;
        $scope.allThemes = [];

        $scope.searchChanged = function () {};

        $scope.pageChanged = function (page, recordsAPage) {
            var startItem = (page - 1) * recordsAPage;
            $scope.availableThemes = $scope.allThemes.slice(startItem, startItem + recordsAPage);
        };
        $scope.selectedTheme = null;
        $scope.copySelectedTheme = null;
        $scope.previewTheme = function (theme) {
            console.log('themeChanged');
            console.log(theme);
            var alreadyExistingTheme = MapData.Themes.find(function (x) {
                return x.cleanUrl === theme.cleanUrl;
            });
            if (alreadyExistingTheme) {
                theme = alreadyExistingTheme;
            }
            $scope.selectedTheme = theme;
            $scope.copySelectedTheme = angular.copy(theme);
        };
        $scope.clearPreview = function () {
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
        };
        $scope.ThemeChanged = function (theme) {
            $scope.previewTheme(theme);
            // added to give the selected theme an Active class
            $scope.selected = theme;
            $scope.isActive = function (theme) {
                return $scope.selected === theme;
            };
        };

        $scope.AddOrUpdateTheme = function () {
            PopupService.Success("Data is bijgewerkt.", null, null, { timeOut: 1000 });
            LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
            $scope.clearPreview();
        };
        $scope.delTheme = function (theme) {
            if ($scope.selectedTheme == theme) {
                $scope.clearPreview();
            }
            // theme.AllLayers.forEach(lay => {
            //     lay.enabled = false;
            // });
            ThemeService.DeleteTheme(theme);
        };
        var init = function () {
            $scope.searchTerm = '';
            if (!$scope.selected && $scope.availableThemes[0]) {
                $scope.ThemeChanged($scope.availableThemes[0]);
            }
        }();
    }]);
})();
;'use strict';

(function (module) {
    var module = angular.module('tink.gis');
    var theController = module.controller('managementLayerController', function ($scope) {
        var vm = this;
        vm.layer = $scope.layer;
        $scope.showLayer = false; // to show and hide the layers
        // console.log(vm.layer.hasLayers());
        // vm.chkChanged = function () {
        //     $scope.$emit('layerCheckboxChangedEvent', $scope.layer); // stuur naar parent ofwel group ofwel theme
        // };
        angular.forEach($scope.layer.Layers, function (value) {
            if (value.enabled == true) {
                $scope.showLayer = true;
            }
            if (value.Layers.length > 0) {
                angular.forEach(value.Layers, function (childvalue) {
                    if (childvalue.enabled == true) {
                        $scope.showLayer = true;
                    }
                });
            }
        });
    });
    theController.$inject = [];
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('previewLayerController', ['$scope', function ($scope) {
        console.log($scope.theme);
        if ($scope.theme.Added == false && !$scope.theme.AllLayers.some(function (x) {
            return x.enabled;
        })) {
            $scope.theme.enabled = false;
        }
        $scope.delTheme = function () {
            $scope.theme.AllLayers.forEach(function (lay) {
                lay.enabled = false;
            });
            $scope.addorupdatefunc();
        };
    }]);
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('solrGISController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'ThemeService', 'PopupService', function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, ThemeService, PopupService) {
        $scope.pagingCount = null;
        $scope.numberofrecordsmatched = 0;
        LayerManagementService.AvailableThemes.length = 0;
        $scope.availableThemes = [];
        $scope.allThemes = [];
        $scope.loading = false;
        $scope.error = null;
        var init = function () {
            $scope.searchTerm = '';
        }();
        $scope.$on("searchChanged", function (event, searchTerm) {
            $scope.searchTerm = searchTerm.replace(/ /g, '').replace(/_/g, '').replace(/-/g, '');
            if ($scope.searchTerm.length > 2) {
                if ($scope.searchTerm != null && $scope.searchTerm != '') {
                    $scope.$parent.solrLoading = true;
                    $scope.QueryGISSOLR($scope.searchTerm, 1);
                }
            } else {
                if ($scope.searchTerm == '*') {
                    $scope.searchTerm = 'arcgis';
                    $scope.$parent.solrLoading = true;
                    $scope.QueryGISSOLR('arcgis', 1);
                } else {
                    $scope.availableThemes.length = 0;
                    $scope.numberofrecordsmatched = 0;
                    $scope.$parent.solrCount = null;
                    $scope.loading = false;
                    $scope.$parent.solrLoading = false;
                }
            }
        });
        var generateUrl = function generateUrl(themeName, type) {
            var url = "";
            switch (type.toLowerCase()) {
                case "p_sik":
                    url = Gis.BaseUrl + 'arcgis/rest/services/P_Sik/' + themeName + '/MapServer';
                    break;
                case "p_stad":
                    url = Gis.BaseUrl + 'arcgissql/rest/services/P_Stad/' + themeName + '/MapServer';
                    break;
                case "p_publiek":
                    url = Gis.PublicBaseUrl + 'arcgissql/rest/services/P_Publiek/' + themeName + '/MapServer';
                    break;
                default:
                    throw error("invalid type: " + type + ". p_sik p_stad p_publiek only valid now.");
            }
            return url;
        };
        $scope.QueryGISSOLR = function (searchterm, page) {
            $scope.loading = true;

            var prom = GISService.QuerySOLRGIS(searchterm, (page - 1) * 5 + 1, 5);
            prom.then(function (data) {
                $scope.loading = false;
                $scope.$parent.solrLoading = false;
                $scope.currentPage = 1;
                var allitems = data.facet_counts.facet_fields.parent;
                var itemsMetData = data.grouped.parent.groups;
                $scope.$parent.solrCount = itemsMetData.length;
                // var aantalitems = allitems.length;
                var x = 0;
                var themes = [];
                itemsMetData.forEach(function (itemMetData) {
                    switch (itemMetData.doclist.docs[0].type) {
                        case "Feature":
                            var afterservicespart = itemMetData.groupValue.split('/services/')[1].split('/'); //  ["P_Stad", "ATLAS", "14"]
                            var url = itemMetData.groupValue.split('/').splice(0, itemMetData.groupValue.split('/').length - 1).join('/') + '/Mapserver'; // url without id
                            var themeName = afterservicespart[1];
                            var layerId = afterservicespart[2];
                            var layerName = itemMetData.doclist.docs[0].parentname;
                            var theme = themes.find(function (x) {
                                return x.name == themeName;
                            });
                            if (!theme) {
                                var theme = {
                                    layers: [],
                                    layersCount: 0,
                                    name: themeName,
                                    cleanUrl: url, // Gis.BaseUrl + 'arcgissql/rest/services/P_Stad/' + themeName + '/MapServer',
                                    url: url // 'services/P_Stad/' + themeName + '/MapServer'
                                };
                                themes.push(theme);
                            }
                            var layer = theme.layers.find(function (x) {
                                return x.id == layerId;
                            });
                            if (!layer) {
                                layer = {
                                    naam: layerName,
                                    id: layerId,
                                    features: [],
                                    featuresCount: itemMetData.doclist.numFound,
                                    isMatch: false
                                };
                                theme.layers.push(layer);
                            } else {
                                layer.featuresCount = itemMetData.doclist.numFound;
                            }
                            itemMetData.doclist.docs.slice(0, 5).forEach(function (item) {
                                var feature = item.titel.join(' ');
                                // id: item.id
                                layer.features.push(feature);
                            });
                            break;
                        case "Layer":
                            var afterservicespart = itemMetData.groupValue.split('/services/')[1].split('/');
                            var themeName = afterservicespart[1];
                            var type = itemMetData.groupValue.split('/')[0];
                            var url = itemMetData.groupValue + '/Mapserver'; //generateUrl(themeName, type);

                            var theme = themes.find(function (x) {
                                return x.name == themeName;
                            });
                            if (!theme) {
                                theme = {
                                    layers: [],
                                    layersCount: itemMetData.doclist.numFound,
                                    name: themeName,
                                    cleanUrl: url,
                                    url: url //'services/' + type +'/' + themeName + '/MapServer'
                                };
                                themes.push(theme);
                            } else {
                                theme.layersCount = itemMetData.doclist.numFound;
                            }
                            itemMetData.doclist.docs.forEach(function (item) {
                                if (item.titel[0].replace(/ /g, '').replace(/_/g, '').replace(/-/g, '').toLowerCase().includes(searchterm.toLowerCase())) {
                                    var layer = theme.layers.find(function (x) {
                                        return x.id == item.key;
                                    });
                                    if (!layer) {
                                        layer = {
                                            naam: item.titel[0],
                                            id: item.key,
                                            isMatch: true,
                                            featuresCount: 0,
                                            features: []
                                        };
                                        theme.layers.push(layer);
                                    } else {
                                        layer.isMatch = true;
                                    }
                                }
                            });
                            break;
                        default:
                            console.log("UNKOWN TYPE:", item);
                            break;
                    }
                });
                $scope.availableThemes = themes.slice(0, 5);
                $scope.allThemes = themes;
                $scope.numberofrecordsmatched = themes.length;
                console.log(data);
            }, function (reason) {
                console.log(reason);
            });
        };
        $scope.pageChanged = function (page, recordsAPage) {
            var startItem = (page - 1) * recordsAPage;
            $scope.availableThemes = $scope.allThemes.slice(startItem, startItem + recordsAPage);
        };
        $scope.selectedTheme = null;
        $scope.copySelectedTheme = null;
        $scope.previewTheme = function (theme, layername) {
            var alreadyExistingTheme = MapData.Themes.find(function (x) {
                return x.cleanUrl === theme.cleanUrl;
            });
            if (alreadyExistingTheme) {
                theme = alreadyExistingTheme;
            }
            if (layername) {
                var layer = theme.AllLayers.find(function (x) {
                    return x.name == layername;
                });
                if (layer) {
                    theme.enabled = true;
                    layer.enabled = true;
                    layer.AllLayers.forEach(function (x) {
                        return x.enabled = true;
                    });
                    if (layer.parent) {
                        layer.parent.enabled = true;
                    }
                }
            }
            $scope.selectedTheme = theme;
            $scope.copySelectedTheme = angular.copy(theme);
        };
        $scope.clearPreview = function () {
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.error = null;
        };
        $scope.solrThemeChanged = function (theme, layername) {
            $scope.clearPreview();
            $scope.themeloading = true;

            GISService.GetThemeData(theme.cleanUrl).then(function (data, status, functie, getdata) {
                if (data) {
                    if (!data.error) {
                        var convertedTheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                        $scope.previewTheme(convertedTheme, layername);
                    } else {
                        PopupService.ErrorFromHTTP(data.error, status, theme.cleanUrl);
                        $scope.error = "Fout bij het laden van de mapservice.";
                    }
                } else {
                    var callback = function callback() {
                        var win = window.open('https://um.antwerpen.be/main.aspx', '_blank');
                        win.focus();
                    };
                    var options = {};
                    options.timeOut = 10000;
                    PopupService.Warning("U hebt geen rechten om het thema " + theme.name + " te raadplegen.", "Klik hier om toegang aan te vragen.", callback, options);
                }

                $scope.themeloading = false;
            }, function (data, status, functie, getdata) {
                $scope.error = "Fout bij het laden van de mapservice.";
                $scope.themeloading = false;
            });
            // added to give the selected theme an Active class
            $scope.selected = theme;
            $scope.isActive = function (theme) {
                return $scope.selected === theme;
            };
        };
        $scope.AddOrUpdateTheme = function () {
            PopupService.Success("Data is bijgewerkt.", null, null, { timeOut: 1000 });
            LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
            $scope.clearPreview();
        };
        $scope.ok = function () {
            $modalInstance.$close();
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed');
        };
    }]);
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('wmsUrlController', ['$scope', 'ThemeCreater', '$q', 'MapService', 'MapData', 'GISService', 'LayerManagementService', 'WMSService', '$window', '$http', 'GeopuntService', 'PopupService', function ($scope, ThemeCreater, $q, MapService, MapData, GISService, LayerManagementService, WMSService, $window, $http, GeopuntService, PopupService) {
        $scope.urlIsValid = false;

        $scope.themeloading = false;
        $scope.urlChanged = function () {
            $scope.clearPreview();
            if ($scope.url != null && $scope.url.startsWith('http')) {
                $scope.urlIsValid = true;
            } else {
                $scope.urlIsValid = false;
            }
        };
        $scope.laadUrl = function () {
            $scope.url = $scope.url.trim().replace('?', '');
            createWMS($scope.url);
        };
        var createWMS = function createWMS(url) {
            $scope.clearPreview();
            var wms = MapData.Themes.find(function (x) {
                return x.cleanUrl == url;
            });
            if (wms == undefined) {
                var getwms = WMSService.GetThemeData(url);
                $scope.themeloading = true;
                getwms.success(function (data, status, headers, config) {
                    $scope.themeloading = false;
                    if (data) {
                        var wmstheme = ThemeCreater.createWMSThemeFromJSON(data, url);
                        $scope.previewTheme(wmstheme);
                    } else {
                        $scope.error = "Fout bij het laden van WMS.";
                        PopupService.Error("Ongeldige WMS", "De opgegeven url is geen geldige WMS url. (" + url + ")");
                    }
                }).error(function (data, status, headers, config) {
                    $scope.error = "Fout bij het laden van WMS.";
                    $scope.themeloading = false;
                });
            } else {
                $scope.previewTheme(wms);
            }
        };
        $scope.selectedTheme = null;
        $scope.copySelectedTheme = null;
        $scope.previewTheme = function (theme) {
            $scope.selectedTheme = theme;
            $scope.copySelectedTheme = angular.copy(theme);
        };
        $scope.clearPreview = function () {
            $scope.selectedTheme = null;
            $scope.copySelectedTheme = null;
            $scope.error = null;
        };

        $scope.AddOrUpdateTheme = function () {
            PopupService.Success("Data is bijgewerkt.", null, null, { timeOut: 1000 });
            LayerManagementService.AddOrUpdateTheme($scope.selectedTheme, $scope.copySelectedTheme);
            $scope.clearPreview();
        };
    }]);
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('geoPunt', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/geoPuntTemplate.html',
            controller: 'geoPuntController',
            controllerAs: 'geoPuntctrl'
        };
    });
})();
;'use strict';

(function (module) {

    module = angular.module('tink.gis');

    module.directive('tinkManagementlayer', ['RecursionHelper', function (RecursionHelper) {
        return {
            replace: false,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/managementLayerTemplate.html',
            controller: 'managementLayerController',
            controllerAs: 'lyrctrl',
            compile: function compile(element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            }
        };
    }]);
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('layersManagement', function () {
        return {
            replace: true,
            // scope: {
            //     layer: '='
            // },
            templateUrl: 'templates/layermanagement/layersManagementTemplate.html',
            controller: 'layersManagementController',
            controllerAs: 'layersManagementctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('previewLayer', function () {
        return {
            replace: true,
            scope: {
                theme: '=',
                addorupdatefunc: '&'
            },
            templateUrl: 'templates/layermanagement/previewLayerTemplate.html',
            controller: 'previewLayerController',
            controllerAs: 'previewctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('solrGis', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/solrGISTemplate.html',
            controller: 'solrGISController',
            controllerAs: 'solrGISctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('wmsUrl', function () {
        return {
            replace: true,
            scope: {
                layer: '='
            },
            templateUrl: 'templates/layermanagement/wmsUrlTemplate.html',
            controller: 'wmsUrlController',
            controllerAs: 'wmsUrlctrl'
        };
    });
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($http, map, MapData, $rootScope, $q, helperService, PopupService) {
        var _service = {};
        _service.getMetaData = function () {
            var searchterm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'water';
            var startpos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var recordsAPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

            var url = 'https://metadata.geopunt.be/zoekdienst/srv/dut/csw?' + 'service=CSW&version=2.0.2&SortBy=title&request=GetRecords&namespace=xmlns(csw=http://www.opengis.net/cat/csw)&resultType=results&outputSchema=http://www.opengis.net/cat/csw/2.0.2&outputFormat=application/xml' + '&startPosition=' + startpos + '&maxRecords=' + recordsAPage + '&typeNames=csw:Record&elementSetName=full&constraintLanguage=CQL_TEXT&constraint_language_version=1.1.0' + '&constraint=AnyText%20LIKE%20%27%' + searchterm + '%%27AND%20Type%20=%20%27service%27%20AND%20Servicetype%20=%27view%27'; //%20AND%20MetadataPointOfContact%20=%27%27'; //MetadataPointOfContact%20=%27AIV%27';            // var url = 'https://metadata.geopunt.be/zoekdienst/srv/dut/csw?service=CSW&version=2.0.2&SortBy=title&request=GetRecords&namespace=xmlns%28csw=http://www.opengis.net/cat/csw%29&resultType=results&outputSchema=http://www.opengis.net/cat/csw/2.0.2&outputFormat=application/xml&startPosition=' + startpos + '&maxRecords=' + recordsAPage + '&typeNames=csw:Record&elementSetName=full&constraintLanguage=CQL_TEXT&constraint_language_version=1.1.0&constraint=AnyText+LIKE+%27%25' + searchterm + '%25%27AND%20Type%20=%20%27service%27%20AND%20Servicetype%20=%27view%27%20AND%20MetadataPointOfContact%20=%27AIV%27';
            // var url = 'https://metadata.geopunt.be/zoekdienst/srv/dut/q?fast=index&from=' + startpos + '&to=' + recordsAPage + '&any=*' + searchterm + '*&sortBy=title&sortOrder=reverse&hitsperpage=' + recordsAPage;
            var prom = $q.defer();
            var proxiedurl = helperService.CreateProxyUrl(url);
            $http.get(proxiedurl).success(function (data, status, headers, config) {
                if (data) {
                    data = helperService.UnwrapProxiedData(data);
                    var returnjson = JXON.stringToJs(data);
                    var getResults = returnjson['csw:getrecordsresponse']['csw:searchresults'];
                    var returnObject = {};
                    returnObject.results = [];
                    returnObject.searchTerm = searchterm;
                    returnObject.currentrecord = startpos;
                    returnObject.recordsAPage = recordsAPage;
                    returnObject.nextrecord = getResults.nextrecord;
                    returnObject.numberofrecordsmatched = getResults.numberofrecordsmatched;
                    returnObject.numberofrecordsreturned = getResults.numberofrecordsreturned;
                    if (returnObject.numberofrecordsmatched != 0) {
                        // only foreach when there are items
                        var themeArr = [];
                        if (getResults['csw:record'].constructor === Array) {
                            themeArr = getResults['csw:record'];
                        } else {
                            themeArr.push(getResults['csw:record']);
                        }
                        themeArr.forEach(function (record) {
                            var processedTheme = procesTheme(record);
                            returnObject.results.push(processedTheme);
                        });
                    }
                    prom.resolve(returnObject);
                    // console.log(getResults['csw:record']);
                } else {
                    prom.reject(null);
                    console.log('EMPTY RESULT');
                }
            }).error(function (data, status, headers, config) {
                var rejectdata = [];
                rejectdata.data = data;
                rejectdata.status = status;
                rejectdata.url = url;
                prom.reject(rejectdata);
            });
            return prom.promise;
        };
        var procesTheme = function procesTheme(record) {
            if (record['dc:uri'] instanceof Array == false) {
                var tmpdata = record['dc:uri'];
                record['dc:uri'] = [];
                record['dc:uri'].push(tmpdata);
            }
            var tmptheme = {};
            tmptheme.Added = false;
            tmptheme.Naam = record['dc:title'];
            var wmsinfo = record['dc:uri'].find(function (x) {
                return x.protocol == 'WMS' || x.protocol == 'OGC:WMS';
            });
            if (wmsinfo) {
                tmptheme.Url = wmsinfo._;
                tmptheme.Type = ThemeType.WMS;
            } else {
                tmptheme.Type = 'DONTKNOW';
            }
            tmptheme.TMPMETADATA = record;
            return tmptheme;
        };
        return _service;
    };
    module.factory('GeopuntService', ['$http', 'map', 'MapData', '$rootScope', '$q', 'GisHelperService', 'PopupService', service]);
})();
;
'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service(MapData, $http, $q, GISService, ThemeCreater, ThemeService) {
        var _service = {};
        _service.EnabledThemes = [];
        _service.AvailableThemes = [];

        _service.AddOrUpdateTheme = function (selectedTheme, copySelectedTheme) {
            console.log('AddOrUpdateTheme');
            var allChecked = true;
            var noneChecked = true;
            var hasAChange = false;
            for (var x = 0; x < copySelectedTheme.AllLayers.length; x++) {
                // aha dus update gebeurt, we gaan deze toevoegen.
                var copyLayer = copySelectedTheme.AllLayers[x];
                var realLayer = selectedTheme.AllLayers[x];
                if (realLayer.enabled != copyLayer.enabled) {
                    hasAChange = true;
                }
                realLayer.enabled = copyLayer.enabled;
                if (copyLayer.enabled === false) {
                    // check or all the checkboxes are checked
                    allChecked = false;
                } else {
                    noneChecked = false;
                }
            }
            var alreadyAdded = MapData.Themes.find(function (x) {
                return x.cleanUrl === selectedTheme.cleanUrl;
            }) != undefined;
            if (alreadyAdded) {
                if (hasAChange) {
                    selectedTheme.status = ThemeStatus.UPDATED;
                } else {
                    selectedTheme.status = ThemeStatus.UNMODIFIED;
                }
                if (noneChecked) {
                    selectedTheme.status = ThemeStatus.DELETED;
                }
            } else {
                selectedTheme.status = ThemeStatus.NEW;
            }
            if (allChecked && selectedTheme != ThemeStatus.DELETED) {
                selectedTheme.Added = true; // here we can set the Added to true when they are all added
            }
            if (!allChecked && !noneChecked && selectedTheme != ThemeStatus.DELETED) {
                selectedTheme.Added = null; // if not all added then we put it to null
            }
            if (selectedTheme == ThemeStatus.DELETED) {
                selectedTheme.Added = false;
            }
            ThemeService.AddAndUpdateThemes([selectedTheme]);
        };
        return _service;
    };
    module.$inject = ['MapData', '$http', '$q', 'GISService', 'ThemeCreater', 'ThemeService'];
    module.factory('LayerManagementService', service);
})();
;// 'use strict';
// (function (module) {
//     try {
//         var module = angular.module('tink.gis');
//     } catch (e) {
//         var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
//     }
//     module = angular.module('tink.gis');
//     module.controller('groupLayerController',
//         function ($scope) {
//             var vm = this;
//             vm.grouplayer = $scope.grouplayer;
//             vm.chkChanged = function () {
//                 $scope.$emit('groupCheckboxChangedEvent', $scope.grouplayer); // stuur naar parent ofwel group ofwel theme
//             };
//         });
// })();
"use strict";
;'use strict';

(function (module) {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var theController = module.controller('layerController', function ($scope) {
        var vm = this;
        vm.layer = $scope.layer;
        console.log(vm.layer);
    });
    // theController.$inject = ['ThemeService'];
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('layersController', function ($scope, MapData, map, ThemeService, $modal, FeatureService) {
        var vm = this;
        vm.themes = MapData.Themes;
        vm.selectedLayers = [];

        vm.sortableOptions = {
            stop: function stop(e, ui) {
                MapData.SetZIndexes();
            }
        };
        vm.asidetoggle = function () {
            if (L.Browser.mobile) {
                var html = $('html');
                if (html.hasClass('nav-left-open')) {
                    html.removeClass('nav-left-open');
                }
            }
        };
        vm.deleteLayerButtonIsEnabled = FeatureService.deleteLayerButtonIsEnabled;
        $scope.$watch(function () {
            return FeatureService.deleteLayerButtonIsEnabled;
        }, function (newValue, oldValue) {
            vm.deleteLayerButtonIsEnabled = newValue;
        });
        vm.layerManagementButtonIsEnabled = FeatureService.layerManagementButtonIsEnabled;
        $scope.$watch(function () {
            return FeatureService.layerManagementButtonIsEnabled;
        }, function (newValue, oldValue) {
            vm.layerManagementButtonIsEnabled = newValue;
        });

        $scope.$watch(function () {
            return MapData.Themes;
        }, function (newVal, oldVal) {
            MapData.SetZIndexes(newVal);
        });
        vm.updatethemevisibility = function (theme) {
            ThemeService.UpdateThemeVisibleLayers(theme);
        };
        vm.Lagenbeheer = function () {
            var addLayerInstance = $modal.open({
                templateUrl: 'templates/layermanagement/layerManagerTemplate.html',
                controller: 'LayerManagerController',
                resolve: {
                    backdrop: false,
                    keyboard: true
                }
            });
            addLayerInstance.result.then(function () {
                // ThemeService.AddAndUpdateThemes(selectedThemes);
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
    });
    theController.$inject = ['MapData', 'map', 'ThemeService', '$modal', 'FeatureService'];
})();
;"use strict";

(function (module) {
  module = angular.module("tink.gis");
  var theController = module.controller("mapController", function ($scope, ExternService, BaseLayersService, MapService, MapData, map, MapEvents, DrawService, GisHelperService, GISService, PopupService, $interval, TypeAheadService, UIService, tinkApi, FeatureService, $modal) {
    //We need to include MapEvents, even tho we don t call it just to make sure it gets loaded!
    var vm = this;
    vm.exportPNG = function () {
      var width = $("#map").width();
      var height = $("#map").height();
      $("#map").css("width", width);
      $("#map").css("height", height);

      vm.easyprinter.printMap("CurrentSize", "Export");

      $("#map").css("width", "100%");
      $("#map").css("height", "100%");
    };
    var init = function () {
      console.log("Tink-Gis-Angular component init!!!!!!!!!");
      if (window.location.href.startsWith("http://localhost:9000/")) {
        var externproj = JSON.parse('{"themes":[{"Naam":"Planon","cleanUrl":"https://geoint.antwerpen.be/arcgissql/rest/services/P_Planon/planon/MapServer","type":"esri","visible":true,"layers":[{"visible":true,"name":"PLANON_DOSSIER","id":1},{"visible":true,"name":"perceel","id":4}]},{"Naam":"Patrimonium","cleanUrl":"https://geoint.antwerpen.be/arcgis/rest/services/P_Sik/Patrimonium/MapServer","type":"esri","visible":true,"layers":[{"visible":true,"name":"KAVIA","id":17}]}],"extent":{"_southWest":{"lat":51.20536146014249,"lng":4.409578736245564},"_northEast":{"lat":51.206417795952646,"lng":4.411724381984817}},"isKaart":true}');
        ExternService.Import(externproj);

        PopupService.Success("Dev autoload", "Velo en fietspad loaded because you are in DEV.", function () {
          alert("onclicktestje");
        });
      }
      TypeAheadService.init();

      //   function manualPrint () {
      //   }
    }();
    vm.mobile = L.Browser.mobile;
    vm.ZoekenOpLocatie = true;
    vm.activeInteractieKnop = MapData.ActiveInteractieKnop;
    $scope.$watch(function () {
      return MapData.ActiveInteractieKnop;
    }, function (data) {
      vm.activeInteractieKnop = data;
    }, true);
    vm.easyprinter = L.easyPrint({
      tileWait: 250,
      exportOnly: true,
      hidden: true,
      hideControlContainer: true
    }).addTo(map);
    vm.drawingType = MapData.DrawingType;
    $scope.$watch(function () {
      return MapData.DrawingType;
    }, function (data) {
      vm.drawingType = data;
    }, true);

    vm.SelectableLayers = function () {
      return MapData.VisibleLayers;
    };
    vm.selectedLayer = MapData.SelectedLayer;
    $scope.$watch(function () {
      return MapData.SelectedLayer;
    }, function (newval, oldval) {
      vm.selectedLayer = newval;
    });
    vm.selectedFindLayer = MapData.SelectedFindLayer;
    $scope.$watch(function () {
      return MapData.SelectedFindLayer;
    }, function (newval, oldval) {
      vm.selectedFindLayer = newval;
    });
    $scope.$watch(function () {
      return MapData.ShowMetenControls;
    }, function (data) {
      vm.showMetenControls = data;
    }, true);
    vm.showMetenControls = MapData.ShowMetenControls;
    $scope.$watch(function () {
      return MapData.ShowDrawControls;
    }, function (data) {
      vm.showDrawControls = data;
    }, true);
    vm.showDrawControls = MapData.ShowDrawControls;
    vm.zoekLoc = "";
    vm.addCursorAuto = function () {
      if (!$(".leaflet-container").hasClass("cursor-auto")) {
        $(".leaflet-container").addClass("cursor-auto");
      }
    };
    vm.resetButtonBar = function () {
      MapData.ActiveInteractieKnop = ActiveInteractieButton.NIETS;
      vm.activeInteractieKnop = ActiveInteractieButton.NIETS;
      MapData.DrawingType = DrawingOption.NIETS;
      MapData.ExtendedType = null;
      MapData.ShowMetenControls = false;
      MapData.ShowDrawControls = false;
    };
    vm.interactieButtonChanged = function (ActiveButton) {
      if (vm.activeInteractieKnop != ActiveButton) {
        MapData.ActiveInteractieKnop = ActiveButton; // If we only could keep the vmactiveInteractieKnop in sync with the one from MapData
        vm.activeInteractieKnop = ActiveButton;
        MapData.ShowMetenControls = false;
        MapData.ShowDrawControls = false;
        switch (ActiveButton) {
          case ActiveInteractieButton.IDENTIFY:
          case ActiveInteractieButton.WATISHIER:
            MapData.ExtendedType = null;
            vm.addCursorAuto();
            break;
          case ActiveInteractieButton.SELECT:
            MapData.ShowDrawControls = true;
            MapData.DrawingType = DrawingOption.GEEN; // pff must be possible to be able to sync them...
            vm.selectpunt();
            break;
          case ActiveInteractieButton.METEN:
            MapData.ExtendedType = null;
            MapData.ShowMetenControls = true;
            MapData.DrawingType = DrawingOption.GEEN;
            break;
        }
      } else {
        vm.resetButtonBar();
      }
    };
    vm.zoekLaag = function (search) {
      MapData.CleanMap();
      MapService.Find(search);
      UIService.OpenLeftSide();
    };
    var setViewAndPutDot = function setViewAndPutDot(loc) {
      MapData.PanToPoint(loc);
      MapData.CreateDot(loc);
    };
    //ng-keyup="$event.keyCode == 13 && mapctrl.zoekLocatie(mapctrl.zoekLoc)"
    vm.zoekXY = function (search) {
      search = search.trim();
      var WGS84Check = GisHelperService.getWGS84CordsFromString(search);
      if (WGS84Check.hasCordinates) {
        setViewAndPutDot(WGS84Check);
      } else {
        var lambertCheck = GisHelperService.getLambartCordsFromString(search);
        if (lambertCheck.hasCordinates) {
          var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84({
            x: lambertCheck.x,
            y: lambertCheck.y
          });
          setViewAndPutDot(xyWGS84);
        } else {
          console.log("NIET GEVONDEN");
        }
      }
    };
    vm.drawingButtonChanged = function (drawOption) {
      if (MapData.ExtendedType == null) {
        // else we don t have to clean the map!

        if (drawOption == DrawingOption.LIJN || drawOption == DrawingOption.POLYGON || drawOption == DrawingOption.NIETS || drawOption == DrawingOption.VIERKANT) {
          MapData.CleanMap();
          MapData.CleanSearch();
        }
        if (drawOption == DrawingOption.AFSTAND || drawOption == DrawingOption.OPPERVLAKTE) {
          // MapData.CleanDrawings();
        }
      }

      MapData.DrawingType = drawOption;
      vm.drawingType = drawOption;
      DrawService.StartDraw(drawOption);
    };
    vm.Loading = 0;
    vm.MaxLoading = 0;

    vm.selectpunt = function () {
      MapData.DrawingType = DrawingOption.NIETS;
      vm.drawingType = DrawingOption.NIETS;
      if (MapData.ExtendedType == null) {
        // else we don t have to clean the map!
        MapData.CleanMap();
        MapData.CleanSearch();
      }
      vm.addCursorAuto();
    };

    vm.selectAdvanced = function () {
      MapData.DrawingType = DrawingOption.ZOEKEN;
      vm.drawingType = DrawingOption.ZOEKEN;
      if (MapData.ExtendedType == null) {
        // else we don t have to clean the map!
        MapData.CleanMap();
        MapData.CleanSearch();
      }
      var addLayerInstance = $modal.open({
        templateUrl: 'templates/search/searchAdvancedTemplate.html',
        controller: 'searchAdvancedController',
        resolve: {
          backdrop: false,
          keyboard: true
        }
      });
      addLayerInstance.result.then(function () {
        // ThemeService.AddAndUpdateThemes(selectedThemes);
      }, function (obj) {
        console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
      });
    };

    vm.layerChange = function () {
      // MapData.CleanMap();
      MapData.SelectedLayer = vm.selectedLayer;
    };
    vm.findLayerChange = function () {
      // MapData.CleanMap();
      MapData.SelectedFindLayer = vm.selectedFindLayer;
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
    vm.IsBaseMap1 = true;
    vm.IsBaseMap2 = false;
    vm.IsBaseMapGeen = false;
    vm.toonBaseMap1 = function () {
      if (vm.IsBaseMapGeen == false && vm.IsBaseMap1 == true) {
        vm.IsBaseMapGeen = true;
        map.removeLayer(BaseLayersService.basemap1);
      } else {
        vm.IsBaseMap2 = false;
        vm.IsBaseMapGeen = false;
        map.removeLayer(BaseLayersService.basemap2);
        map.addLayer(BaseLayersService.basemap1);
      }
      vm.IsBaseMap1 = true;
    };
    vm.toonBaseMap2 = function () {
      if (vm.IsBaseMapGeen == false && vm.IsBaseMap2 == true) {
        vm.IsBaseMapGeen = true;
        map.removeLayer(BaseLayersService.basemap2);
      } else {
        vm.IsBaseMapGeen = false;
        vm.IsBaseMap1 = false;
        map.removeLayer(BaseLayersService.basemap1);
        map.addLayer(BaseLayersService.basemap2);
      }
      vm.IsBaseMap2 = true;
    };
    // vm.hideBaseMap1 = function(){
    //   vm.IsBaseMap1 = false;
    //   vm.IsBaseMapGeen = true;
    //   map.removeLayer(BaseLayersService.basemap1);
    //   map.removeLayer(BaseLayersService.basemap2);
    // }
    vm.baseMap1Naam = function () {
      return BaseLayersService.basemap1Naam;
    };
    vm.baseMap2Naam = function () {
      return BaseLayersService.basemap2Naam;
    };
    vm.cancelPrint = function () {
      var html = $("html");
      if (html.hasClass("print")) {
        html.removeClass("print");
      }
      vm.portrait(); // also put it back to portrait view
      tinkApi.sideNavToggle.recalculate("asideNavRight");
      tinkApi.sideNavToggle.recalculate("asideNavLeft");
    };
    vm.print = function () {
      window.print();
    };

    vm.printStyle = "portrait";
    var cssPagedMedia = function () {
      var style = document.createElement("style");
      document.head.appendChild(style);
      return function (rule) {
        style.id = "tempstyle";
        style.innerHTML = rule;
      };
    }();

    cssPagedMedia.size = function (oriantation) {
      cssPagedMedia("@page {size: A4 " + oriantation + "}");
    };
    vm.setPrintStyle = function (oriantation) {
      vm.printStyle = oriantation;
      cssPagedMedia.size(oriantation);
    };
    vm.setPrintStyle("portrait");
    vm.printLegendPreview = false;
    vm.previewMap = function () {
      var html = $("html");
      vm.printLegendPreview = false;
      if (html.hasClass("preview-legend")) {
        html.removeClass("preview-legend");
      }
    };
    vm.previewLegend = function () {
      var html = $("html");
      vm.printLegendPreview = true;
      if (!html.hasClass("preview-legend")) {
        html.addClass("preview-legend");
      }
    };
    vm.portrait = function () {
      var html = $("html");
      vm.setPrintStyle("portrait");
      if (html.hasClass("landscape")) {
        html.removeClass("landscape");
      }
      map.invalidateSize(false);
    };
    vm.landscape = function () {
      var html = $("html");
      vm.setPrintStyle("landscape");
      if (!html.hasClass("landscape")) {
        html.addClass("landscape");
      }
      map.invalidateSize(false);
    };

    vm.ZoekenInLagen = function () {
      vm.ZoekenOpLocatie = false;
      $(".twitter-typeahead").addClass("hide-element");
    };

    vm.fnZoekenOpLocatie = function () {
      vm.ZoekenOpLocatie = true;
      if ($(".twitter-typeahead").hasClass("hide-element")) {
        $(".twitter-typeahead").removeClass("hide-element");
      } else {
        return vm.ZoekenOpLocatie;
      }
    };
    vm.gpstracking = false;
    var gpstracktimer = null;
    var gpsmarker = null;
    vm.zoomToGps = function () {
      vm.gpstracking = !vm.gpstracking;

      if (vm.gpstracking == false) {
        $interval.cancel(gpstracktimer);
        MapEvents.ClearGPS();
      } else {
        map.locate({ setView: true, maxZoom: 16 });
        gpstracktimer = $interval(function () {
          map.locate({ setView: false });
          console.log("gps refresh");
        }, 5000);
      }
    };
    map.on("locationfound", function (e) {
      MapEvents.ClearGPS();
      var gpsicon = L.divIcon({
        className: "fa fa-crosshairs fa-2x blue",
        style: "color: blue"
      });
      gpsmarker = L.marker(e.latlng, { icon: gpsicon }).addTo(map);
    });
    map.on("locationerror", function (e) {
      vm.gpstracking = false;
      $interval.cancel(gpstracktimer);
      MapEvents.ClearGPS();
      PopupService.Warning("Browser heeft geen toegang tot locatiegegevens");
    });
  });
  theController.$inject = ["BaseLayersService", "ExternService", "MapService", "MapData", "map", "MapEvents", "DrawService", "GisHelperService", "GISService", "PopupService", "$interval", "UIService", "tinkApi", "FeatureService", "$modal"];
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.controller('themeController', ['$scope', 'MapService', 'ThemeService', function ($scope, MapService, ThemeService, $timeout) {
        var vm = this;
        console.log('Theme geladen');
        vm.theme = $scope.theme;
        vm.hidedelete = $scope.hidedelete;
        vm.chkChanged = function () {
            ThemeService.UpdateThemeVisibleLayers(vm.theme);
        };
        vm.deleteTheme = function () {
            swal({
                title: 'Verwijderen?',
                text: 'U staat op het punt om ' + vm.theme.Naam + ' te verwijderen.',
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: "Annuleer",
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Verwijder',
                closeOnConfirm: true
            }, function () {
                ThemeService.DeleteTheme(vm.theme);
                $scope.$applyAsync();
            });
            console.log(vm.theme);
        };
        vm.transpSlider = {
            value: vm.theme.Opacity * 100,
            options: {
                hideLimitLabels: true,
                hidePointerLabels: true,
                floor: 0,
                ceil: 100,
                onEnd: function onEnd() {
                    // console.log(vm.transpSlider.value /100);
                    vm.theme.SetOpacity(vm.transpSlider.value / 100);
                },
                onStart: function onStart() {
                    // console.log("onstartofslider", event);
                    // event.stopPropagation(); 
                }

            }
        };
        setTimeout(function () {
            $scope.$broadcast('rzSliderForceRender');
            $scope.$applyAsync();
        }, 1);
    }]);
})();
;// 'use strict';
// (function (module) {
//     module = angular.module('tink.gis');
//     module.directive('tinkGrouplayer', function () {
//         return {
//             replace: true,
//             scope: {
//                 grouplayer: '='
//             },
//             templateUrl: 'templates/other/groupLayerTemplate.html',
//             controller: 'groupLayerController',
//             controllerAs: 'grplyrctrl'
//         };
//     });
// })();
"use strict";
;'use strict';

(function (module) {

    angular.module('tink.gis').directive('indeterminateCheckbox', [function () {
        return {
            scope: true,
            require: '?ngModel',
            link: function link(scope, element, attrs, modelCtrl) {
                var childList = attrs.childList;
                var property = attrs.property;
                // Bind the onChange event to update children
                element.bind('change', function () {
                    scope.$applyAsync(function () {
                        var isChecked = element.prop('checked');
                        // Set each child's selected property to the checkbox's checked property
                        angular.forEach(scope.$eval(childList), function (child) {
                            child[property] = isChecked;
                        });
                    });
                });
                var thelist = scope.$eval(childList);
                //https://tech.small-improvements.com/2014/06/11/deep-watching-circular-data-structures-in-angular/
                function watchChildrenListWithProperty() {
                    return thelist.map(function (x) {
                        return x[property];
                    });
                }
                if (thelist) {

                    // Watch the children for changes
                    scope.$watch(watchChildrenListWithProperty, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            var hasChecked = false;
                            var hasUnchecked = false;
                            // Loop through the children
                            angular.forEach(newValue, function (child) {
                                if (child) {
                                    hasChecked = true;
                                } else {
                                    hasUnchecked = true;
                                }
                            });
                            // Determine which state to put the checkbox in
                            if (hasChecked && hasUnchecked) {
                                element.prop('checked', true);
                                element.prop('indeterminate', true);
                                if (modelCtrl) {
                                    modelCtrl.$setViewValue(true);
                                }
                            } else {
                                element.prop('checked', hasChecked);
                                element.prop('indeterminate', false);
                                if (modelCtrl) {
                                    modelCtrl.$setViewValue(hasChecked);
                                }
                            }
                        }
                    }, true);
                }
            }
        };
    }]);
})();
;'use strict';

(function (module) {

    module = angular.module('tink.gis');

    module.directive('tinkLayer', ['RecursionHelper', function (RecursionHelper) {
        return {
            replace: false,
            scope: {
                layer: '=',
                layercheckboxchange: '&'
            },
            templateUrl: 'templates/other/layerTemplate.html',
            controller: 'layerController',
            controllerAs: 'lyrctrl',
            compile: function compile(element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            }
        };
    }]);
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkLayers', function () {
        return {
            replace: true,
            templateUrl: 'templates/other/layersTemplate.html',
            controller: 'layersController',
            controllerAs: 'lyrsctrl'
        };
    });
})();
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    module.directive('tinkMap', function () {
        return {
            replace: true,
            templateUrl: 'templates/other/mapTemplate.html',
            controller: 'mapController',
            controllerAs: 'mapctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkTheme', function () {
        return {
            replace: true,
            scope: {
                theme: '=',
                layercheckboxchange: '&',
                hidedelete: '='
            },
            templateUrl: 'templates/other/themeTemplate.html',
            controller: 'themeController',
            controllerAs: 'thmctrl'
        };
    });
})();
;'use strict';

(function () {
    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var baseLayersService = function baseLayersService(map) {
        var _baseLayersService = {};
        _baseLayersService.basemap2Naam = "Geen";
        _baseLayersService.basemap1Naam = "Geen";

        _baseLayersService.setBaseMap = function (id, naam, url) {
            var maxZoom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
            var minZoom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

            var layer = L.esri.tiledMapLayer({ url: url, maxZoom: maxZoom, minZoom: minZoom, continuousWorld: true });
            if (id == 1) {
                if (_baseLayersService.basemap1) {
                    map.removeLayer(_baseLayersService.basemap1);
                }
                _baseLayersService.basemap1Naam = naam;
                _baseLayersService.basemap1 = layer;
                _baseLayersService.basemap1.addTo(map);
            } else if (id == 2) {
                if (_baseLayersService.basemap2) {
                    map.removeLayer(_baseLayersService.basemap2);
                }
                _baseLayersService.basemap2 = layer;
                _baseLayersService.basemap2Naam = naam;
            }
        };
        _baseLayersService.setBaseMap(1, "Kaart", 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/P_basemap/MapServer');
        _baseLayersService.setBaseMap(2, "Luchtfoto", 'https://geodata.antwerpen.be/arcgissql/rest/services/P_Publiek/Luchtfoto_2015/MapServer');
        return _baseLayersService;
    };

    module.factory('BaseLayersService', baseLayersService);
})();
;'use strict';

L.Draw.Rectangle = L.Draw.Rectangle.extend({
    _getTooltipText: function _getTooltipText() {
        var tooltipText = L.Draw.SimpleShape.prototype._getTooltipText.call(this),
            shape = this._shape,
            latLngs,
            area,
            subtext;

        if (shape) {
            latLngs = this._shape.getLatLngs();
            area = L.GeometryUtil.geodesicArea(latLngs);
            subtext = L.GeometryUtil.readableArea(area, this.options.metric);
        }

        return {
            text: tooltipText.text,
            subtext: ''
        };
    }
});
'use strict';
(function () {

    try {
        var module = angular.module('tink.gis');
    } catch (e) {
        var module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi']); //'leaflet-directive'
    }
    var service = function service(MapData, map) {
        var _service = {};

        _service.StartDraw = function (DrawingOptie) {
            var options = {
                metric: true,
                showArea: true,
                shapeOptions: {
                    stroke: true,
                    color: '#22528b',
                    weight: 2,
                    opacity: 0.6,
                    // fill: true,
                    fillColor: null, //same as color by default
                    fillOpacity: 0.4,
                    clickable: false
                }
            };
            switch (MapData.DrawingType) {
                case DrawingOption.LIJN:
                case DrawingOption.AFSTAND:
                    if (MapData.ExtendedType == null) {
                        MapData.DrawingObject = new L.Draw.Polyline(map, options);
                        MapData.DrawingObject.enable();
                    } else {
                        MapData.DrawingExtendedObject = new L.Draw.Polyline(map, options);
                        MapData.DrawingExtendedObject.enable();
                    }
                    break;
                case DrawingOption.POLYGON:
                case DrawingOption.OPPERVLAKTE:
                    if (MapData.ExtendedType == null) {
                        MapData.DrawingObject = new L.Draw.Polygon(map, options);
                        MapData.DrawingObject.enable();
                    } else {
                        MapData.DrawingExtendedObject = new L.Draw.Polygon(map, options);
                        MapData.DrawingExtendedObject.enable();
                    }
                    break;
                case DrawingOption.VIERKANT:
                    if (MapData.ExtendedType == null) {
                        MapData.DrawingObject = new L.Draw.Rectangle(map, options);
                        MapData.DrawingObject.enable();
                    } else {
                        MapData.DrawingExtendedObject = new L.Draw.Rectangle(map, options);
                        MapData.DrawingExtendedObject.enable();
                    }
                    break;
                default:
                    break;
            }
        };
        return _service;
    };
    // module.$inject = ['MapData', 'map'];

    module.factory("DrawService", service);
})();
;'use strict';

var esri2geo = {};
(function () {
    function toGeoJSON(data, cb) {
        if (typeof data === 'string') {
            if (cb) {
                ajax(data, function (err, d) {
                    toGeoJSON(d, cb);
                });
                return;
            } else {
                throw new TypeError('callback needed for url');
            }
        }
        var outPut = { 'type': 'FeatureCollection', 'features': [] };
        var fl = data.geometries.length;
        var i = 0;
        while (fl > i) {
            var ft = data.geometries[i];
            /* as only ESRI based products care if all the features are the same type of geometry, check for geometry type at a feature level*/
            var outFT = {
                'type': 'Feature',
                'properties': prop(ft.attributes)
            };
            if (ft.x) {
                //check if it's a point
                outFT.geometry = point(ft);
            } else if (ft.points) {
                //check if it is a multipoint
                outFT.geometry = points(ft);
            } else if (ft.paths) {
                //check if a line (or 'ARC' in ESRI terms)
                outFT.geometry = line(ft);
            } else if (ft.rings) {
                //check if a poly.
                outFT.geometry = poly(ft);
            }
            outPut.features.push(outFT);
            i++;
        }
        return outPut;
        // cb(null, outPut);
    }
    function point(geometry) {
        //this one is easy
        return { 'type': 'Point', 'coordinates': [geometry.x, geometry.y] };
    }
    function points(geometry) {
        //checks if the multipoint only has one point, if so exports as point instead
        if (geometry.points.length === 1) {
            return { 'type': 'Point', 'coordinates': geometry.points[0] };
        } else {
            return { 'type': 'MultiPoint', 'coordinates': geometry.points };
        }
    }
    function line(geometry) {
        //checks if their are multiple paths or just one
        if (geometry.paths.length === 1) {
            return { 'type': 'LineString', 'coordinates': geometry.paths[0] };
        } else {
            return { 'type': 'MultiLineString', 'coordinates': geometry.paths };
        }
    }
    function poly(geometry) {
        //first we check for some easy cases, like if their is only one ring
        if (geometry.rings.length === 1) {
            return { 'type': 'Polygon', 'coordinates': geometry.rings };
        } else {
            /*if it isn't that easy then we have to start checking ring direction, basically the ring goes clockwise its part of the polygon,
            if it goes counterclockwise it is a hole in the polygon, but geojson does it by haveing an array with the first element be the polygons 
            and the next elements being holes in it*/
            return decodePolygon(geometry.rings);
        }
    }
    function decodePolygon(a) {
        //returns the feature
        var coords = [],
            type;
        var len = a.length;
        var i = 0;
        var len2 = coords.length - 1;
        while (len > i) {
            if (ringIsClockwise(a[i])) {
                coords.push([a[i]]);
                len2++;
            } else {
                coords[len2].push(a[i]);
            }
            i++;
        }
        if (coords.length === 1) {
            type = 'Polygon';
        } else {
            type = 'MultiPolygon';
        }
        return { 'type': type, 'coordinates': coords.length === 1 ? coords[0] : coords };
    }
    /*determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
    or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
    points-are-in-clockwise-order
    this code taken from http://esri.github.com/geojson-utils/src/jsonConverters.js by James Cardona (MIT lisense)
    */
    function ringIsClockwise(ringToTest) {
        var total = 0,
            i = 0,
            rLength = ringToTest.length,
            pt1 = ringToTest[i],
            pt2;
        for (i; i < rLength - 1; i++) {
            pt2 = ringToTest[i + 1];
            total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
            pt1 = pt2;
        }
        return total >= 0;
    }
    function prop(a) {
        var p = {};
        for (var k in a) {
            if (a[k]) {
                p[k] = a[k];
            }
        }
        return p;
    }

    function ajax(url, cb) {
        if (typeof module !== 'undefined') {
            var request = require('request');
            request(url, { json: true }, function (e, r, b) {
                cb(e, b);
            });
            return;
        }
        // the following is from JavaScript: The Definitive Guide
        var response;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                cb(null, JSON.parse(req.responseText));
            }
        };
        req.open('GET', url);
        req.send();
    }
    if (typeof module !== 'undefined') {
        module.exports = toGeoJSON;
    } else {
        esri2geo.toGeoJSON = toGeoJSON;
    }
})();
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    // module.$inject = ['MapData', 'map', 'GISService', 'ThemeCreater', 'WMSService', 'ThemeService', '$q','BaseLayersService'];

    var externService = function externService(MapData, map, GISService, ThemeCreater, WMSService, ThemeService, $q, BaseLayersService, FeatureService, ResultsData, PopupService) {
        var _externService = {};
        _externService.GetAllThemes = function () {
            var legendItem = {};
            legendItem.EsriThemes = MapData.Themes.filter(function (x) {
                return x.Type == ThemeType.ESRI;
            });
            legendItem.WmsThemes = MapData.Themes.filter(function (x) {
                return x.Type == ThemeType.WMS;
            });
            return legendItem;
        };
        _externService.SetPrintPreview = function () {
            var cent = map.getCenter();
            var html = $('html');
            if (!html.hasClass('print')) {
                html.addClass('print');
            }
            if (html.hasClass('landscape')) {
                html.removeClass('landscape');
            }
            map.invalidateSize(false);
            map.setView(cent);
        };
        _externService.Export = function () {
            var exportObject = {};
            var arr = MapData.Themes.map(function (theme) {
                var returnitem = {};
                if (!theme.Naam) {
                    theme.Naam = "no_title_found";
                }
                returnitem.Naam = theme.Naam;
                // if (theme.Type == ThemeType.ESRI) {
                //     returnitem.cleanUrl = theme.Url;
                // } else {
                returnitem.cleanUrl = theme.cleanUrl || theme.Url;
                // }
                returnitem.opacity = theme.Opacity;
                returnitem.type = theme.Type;
                returnitem.visible = theme.Visible;
                returnitem.layers = theme.AllLayers.filter(function (x) {
                    return x.enabled == true;
                }).map(function (layer) {
                    var returnlayer = {};
                    // returnlayer.enabled = layer.enabled; // will always be true... since we only export the enabled layers
                    returnlayer.visible = layer.visible;
                    if (theme.Type == ThemeType.ESRI) {
                        returnlayer.name = layer.name;
                        returnlayer.id = layer.id;
                    } else {
                        returnlayer.name = layer.title;
                        returnlayer.id = layer.title;
                    }
                    return returnlayer;
                });
                return returnitem;
            });
            exportObject.themes = arr;
            exportObject.extent = map.getBounds();
            exportObject.isKaart = true;
            return exportObject;
        };

        _externService.Import = function (project) {
            console.log(project);
            _externService.setExtent(project.extent);
            var themesArray = [];
            var promises = [];

            project.themes.forEach(function (theme) {
                if (theme.type == ThemeType.ESRI) {
                    var prom = GISService.GetThemeData(theme.cleanUrl);
                    promises.push(prom);
                    prom.then(function (data) {
                        if (data) {
                            if (!data.error) {
                                var arcgistheme = ThemeCreater.createARCGISThemeFromJson(data, theme);
                                themesArray.push(arcgistheme);
                            } else {
                                PopupService.ErrorWithException("Fout bij laden van mapservice", "Kan mapservice met volgende url niet laden: " + theme.cleanUrl, data.error);
                            }
                        } else {
                            var callback = function callback() {
                                var win = window.open('https://um.antwerpen.be/main.aspx', '_blank');
                                win.focus();
                            };
                            var options = {};
                            options.timeOut = 10000;
                            PopupService.Warning("U hebt geen rechten om het thema " + theme.Naam + " te raadplegen.", "Klik hier om toegang aan te vragen.", callback, options);
                        }
                    });
                } else {
                    // wms
                    var _prom = WMSService.GetThemeData(theme.cleanUrl);
                    promises.push(_prom);
                    _prom.success(function (data, status, headers, config) {
                        var wmstheme = ThemeCreater.createWMSThemeFromJSON(data, theme.cleanUrl);
                        themesArray.push(wmstheme);
                    }).error(function (data, status, headers, config) {
                        console.log('error!!!!!!!', data, status, headers, config);
                    });
                }
            });

            var allpromises = $q.all(promises);

            allpromises.then(function () {
                var orderedArray = [];
                var errorMessages = [];
                project.themes.forEach(function (theme) {
                    var realTheme = themesArray.find(function (x) {
                        return x.cleanUrl == theme.cleanUrl;
                    });
                    if (realTheme) {
                        console.log(theme, ' vs real theme: ', realTheme);
                        realTheme.Visible = theme.visible;

                        if (realTheme.AllLayers.length == theme.layers.length) {
                            realTheme.Added = true; //all are added 
                        } else {
                            realTheme.Added = null; // some are added, never false because else we woudn't save it.
                        }
                        realTheme.AllLayers.forEach(function (layer) {
                            layer.enabled = false; // lets disable all layers first
                        });
                        //lets check what we need to enable and set visiblity of, and also check what we don't find
                        theme.layers.forEach(function (layer) {
                            var realLayer = realTheme.AllLayers.find(function (x) {
                                return x.title == layer.name;
                            });
                            if (realLayer) {
                                realLayer.visible = layer.visible; // aha so there was a layer, lets save this
                                realLayer.enabled = true;
                            } else {
                                errorMessages.push('"' + layer.name + '" not found in mapserver: ' + realTheme.Naam + '.');
                            }
                        });
                    }
                });
                project.themes.forEach(function (theme) {
                    // lets order them, since we get themesArray filled by async calls, the order can be wrong, thats why we make an ordered array
                    var realTheme = themesArray.find(function (x) {
                        return x.cleanUrl == theme.cleanUrl;
                    });
                    if (realTheme) {
                        orderedArray.unshift(realTheme);
                        realTheme.status = ThemeStatus.NEW; // and make sure they are new, ready to be added.
                    }
                });
                ThemeService.AddAndUpdateThemes(orderedArray);
                console.log('all loaded');
                if (errorMessages.length > 0) {
                    PopupService.Warning("Fout bij import", errorMessages.join('\n'));
                }
                if (FeatureService.defaultLayerName) {
                    var defaultLayer = MapData.VisibleLayers.find(function (x) {
                        return x.name == FeatureService.defaultLayerName;
                    });
                    if (defaultLayer) {
                        MapData.SelectedLayer = defaultLayer;
                        MapData.SelectedFindLayer = defaultLayer;
                        MapData.DefaultLayer = defaultLayer;
                    }
                }
            });
            return allpromises;
        };
        _externService.setExtent = function (extent) {
            map.fitBounds([[extent._northEast.lat, extent._northEast.lng], [extent._southWest.lat, extent._southWest.lng]]);
        };
        _externService.setExtendFromResults = function () {
            if (ResultsData.JsonFeatures && ResultsData.JsonFeatures.length > 0) {
                var featuregrp = L.featureGroup();
                ResultsData.JsonFeatures.forEach(function (feature) {
                    featuregrp.addLayer(feature.mapItem);
                });
                var featureBounds = featuregrp.getBounds();
                map.fitBounds(featureBounds);
            }
        };

        _externService.CleanMapAndThemes = function () {
            MapData.CleanMap();
            ThemeService.CleanThemes();
        };
        _externService.LoadConfig = function (config) {
            Gis.GeometryUrl = config.Gis.GeometryUrl;
            Gis.BaseUrl = config.Gis.BaseUrl;
            Style.Default = config.Style.Default;
            Style.HIGHLIGHT = config.Style.HIGHLIGHT;
            Style.BUFFER = config.Style.BUFFER;
            BaseLayersService.setBaseMap(1, config.BaseKaart1.Naam, config.BaseKaart1.Url, config.BaseKaart1.MaxZoom, config.BaseKaart1.MinZoom);
            BaseLayersService.setBaseMap(2, config.BaseKaart2.Naam, config.BaseKaart2.Url, config.BaseKaart2.MaxZoom, config.BaseKaart2.MinZoom);
        };
        return _externService;
    };
    module.factory('ExternService', externService);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');

    var featureService = function featureService() {
        var _featureService = {};
        _featureService.layerManagementButtonIsEnabled = true;
        _featureService.deleteLayerButtonIsEnabled = true;
        _featureService.exportToCSVButtonIsEnabled = true;
        _featureService.defaultLayerName = null;
        _featureService.ConfigResultButton = function (isEnabled, text, callback, conditioncallback) {
            _featureService.resultButtonText = text;
            _featureService.extraResultButtonIsEnabled = isEnabled;
            if (callback) {
                _featureService.extraResultButtonCallBack = callback;
            }
            if (conditioncallback) {
                _featureService.extraResultButtonConditionCallBack = conditioncallback;
            }
        };
        _featureService.extraResultButtonIsEnabled = false;
        _featureService.resultButtonText = 'extra knop text';
        _featureService.extraResultButtonCallBack = function () {};
        _featureService.extraResultButtonConditionCallBack = function () {
            return _featureService.extraResultButtonIsEnabled;
        };
        return _featureService;
    };
    module.factory('FeatureService', featureService);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($http, MapService, MapData) {
        var _service = {};

        _service.Buffer = function (loc, distance, selectedlayer) {
            var geo = getGeo(loc.geometry);
            delete geo.geometry.spatialReference;
            geo.geometries = geo.geometry;
            delete geo.geometry;
            var sergeo = serialize(geo);
            var url = Gis.GeometryUrl;
            if (loc.mapItem) {
                loc.mapItem.isBufferedItem = true;
            }
            var body = 'inSR=4326&outSR=4326&bufferSR=31370&distances=' + distance * 100 + '&unit=109006&unionResults=true&geodesic=false&geometries=%7B' + sergeo + '%7D&f=json';
            var prom = $http({
                method: 'POST',
                url: url,
                data: body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
            prom.success(function (response) {
                MapData.CleanSearch();
                var buffer = MapData.CreateBuffer(response);
                MapService.Query(buffer, selectedlayer);
                MapData.SetStyle(loc.mapItem, Style.COREBUFFER, L.AwesomeMarkers.icon({ icon: 'fa-circle-o', markerColor: 'lightgreen' }));
                return prom;
            });
        };
        _service.Doordruk = function (location) {
            MapData.CleanSearch();

            MapData.CleanMap();
            console.log(location);
            MapService.Query(location, { id: '' });
        };
        var getGeo = function getGeo(geometry) {
            var geoconverted = {};
            // geoconverted.inSr = 4326;

            // convert bounds to extent and finish
            if (geometry instanceof L.LatLngBounds) {
                // set geometry + geometryType
                geoconverted.geometry = L.esri.Util.boundsToExtent(geometry);
                geoconverted.geometryType = 'esriGeometryEnvelope';
                return geoconverted;
            }

            // convert L.Marker > L.LatLng
            if (geometry.getLatLng) {
                geometry = geometry.getLatLng();
            }

            // convert L.LatLng to a geojson point and continue;
            if (geometry instanceof L.LatLng) {
                geometry = {
                    type: 'Point',
                    coordinates: [geometry.lng, geometry.lat]
                };
            }

            // handle L.GeoJSON, pull out the first geometry
            if (geometry instanceof L.GeoJSON) {
                // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
                geometry = geometry.getLayers()[0].feature.geometry;
                geoconverted.geometry = L.esri.Util.geojsonToArcGIS(geometry);
                geoconverted.geometryType = L.esri.Util.geojsonTypeToArcGIS(geometry.type);
            }

            // Handle L.Polyline and L.Polygon
            if (geometry.toGeoJSON) {
                geometry = geometry.toGeoJSON();
            }

            // handle GeoJSON feature by pulling out the geometry
            if (geometry.type === 'Feature') {
                // get the geometry of the geojson feature
                geometry = geometry.geometry;
            } else {
                geoconverted.geometry = L.esri.Util.geojsonToArcGIS(geometry);
                geoconverted.geometryType = L.esri.Util.geojsonTypeToArcGIS(geometry.type);
            }

            // confirm that our GeoJSON is a point, line or polygon
            // if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {

            return geoconverted;
            // }

            // warn the user if we havn't found an appropriate object

            // return geoconverted;
        };
        var serialize = function serialize(params) {
            var data = '';
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var param = params[key];
                    var type = Object.prototype.toString.call(param);
                    var value;
                    if (data.length) {
                        data += ',';
                    }
                    if (type === '[object Array]') {
                        value = Object.prototype.toString.call(param[0]) === '[object Object]' ? JSON.stringify(param) : param.join(',');
                    } else if (type === '[object Object]') {
                        value = JSON.stringify(param);
                    } else if (type === '[object Date]') {
                        value = param.valueOf();
                    } else {
                        value = '"' + param + '"';
                    }
                    if (key == 'geometries') {
                        data += encodeURIComponent('"' + key + '"') + ':' + encodeURIComponent('[' + value + ']');
                    } else {
                        data += encodeURIComponent('"' + key + '"') + ':' + encodeURIComponent(value);
                    }
                }
            }

            return data;
        };
        return _service;
    };
    module.$inject = ['$http', 'MapService', 'MapData'];
    module.factory('GeometryService', service);
})();
;//http://proj4js.org/
'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($http, GisHelperService, $q, PopupService) {
        var _service = {};
        _service.ReverseGeocode = function (event) {
            var lambert72Cords = GisHelperService.ConvertWSG84ToLambert72(event.latlng);
            var loc = lambert72Cords.x + ',' + lambert72Cords.y;
            var urlloc = encodeURIComponent(loc);
            //CHANGE BACK BEFORE MTP NEEDS TO BE A LINK TO REVGEOCODE FROM API STORE AND THIS IS ONLY FOR TESTING IN ACC!!!!!!
            // var url = GAAS.ReversedGeocodeUrl + 'ReservedGeocoding/GetAntwerpAdresByPoint?SR=31370&X=' + lambert72Cords.x + '&Y=' + lambert72Cords.y + '&buffer=50&count=1';
            var url = GAAS.ReversedGeocodeUrl + 'antwerpaddressbypoint?SR=31370&X=' + lambert72Cords.x + '&Y=' + lambert72Cords.y + '&buffer=50&count=1';

            // -------------------------- to go through the api store when the api key is not exposed
            // var req = {
            //     method: 'GET',
            //     url: url,
            //     headers: {
            //         'apikey': config apikey
            //     },
            // }
            // var prom = $http(req);
            // ---------------------------

            var prom = $http.get(url);
            prom.success(function (data, status, headers, config) {
                // nothing we just give back the prom do the stuff not here!
            }).error(function (data, status, headers, config) {
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom;
        };
        _service.QueryCrab = function (straatnaamid, huisnummer) {
            var prom = $q.defer();
            var query = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' + 'where=GEMEENTE%3D%27Antwerpen%27';
            for (var i = 0; i < straatnaamid.length; i++) {
                if (straatnaamid.length > 1) {
                    if (i == 0) {
                        query += '%20and%20(STRAATNMID%20%3D%27' + straatnaamid[i] + '%27';
                    } else {
                        query += '%20or%20STRAATNMID%20%3D%27' + straatnaamid[i] + '%27';
                    }
                } else {
                    query += '%20and%20STRAATNMID%20%3D%27' + straatnaamid[i] + '%27';
                }
            }
            if (straatnaamid.length > 1) {
                query += ')';
            }

            // straatnaamid.forEach(id => {
            //     query += '%20and%20STRAATNMID%20%3D%27' + straatnaamid;
            // });
            query += '%20and%20' + '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
            // var originalQuery = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' +
            // 'where=GEMEENTE%3D%27Antwerpen%27%20and%20STRAATNMID%20%3D%27' + straatnaamid + '%27%20and%20' +
            // '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' +
            // '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
            $http.get(query).success(function (data, status, headers, config) {
                // data = GisHelperService.UnwrapProxiedData(data);
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom.promise;
        };

        _service.QueryCrabName = function (straatnaam, huisnummer) {
            var prom = $q.defer();
            var query = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' + 'where=GEMEENTE%3D%27Antwerpen%27';
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
            query += '%20and%20' + '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
            // var originalQuery = 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/CRAB_adresposities/MapServer/0/query?' +
            // 'where=GEMEENTE%3D%27Antwerpen%27%20and%20STRAATNMID%20%3D%27' + straatnaamid + '%27%20and%20' +
            // '(HUISNR%20like%20%27' + huisnummer + '%27%20or%20Huisnr%20like%20%27' + huisnummer + '%5Ba-z%5D%27or%20Huisnr%20like%20%27' + huisnummer + '%5B_%5D%25%27)%20and%20APPTNR%20%3D%20%27%27%20and%20busnr%20%3D%20%27%27' +
            // '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';
            $http.get(query).success(function (data, status, headers, config) {
                // data = GisHelperService.UnwrapProxiedData(data);
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom.promise;
        };

        _service.QuerySOLRGIS = function (search) {
            var prom = $q.defer();
            var url = Solr.BaseUrl + 'giszoek/solr/search?q=*' + search + '*&wt=json&indent=true&facet=true&rows=999&facet.field=parent&group=true&group.field=parent&group.limit=999&solrtype=gis'; // &group.limit=5
            $http.get(url).success(function (data, status, headers, config) {
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom.promise;
        };
        _service.QuerySOLRLocatie = function (search) {
            var prom = $q.defer();
            var url = Solr.BaseUrl + 'giszoek/solr/search?q=*' + search + '*&wt=json&indent=true&rows=50&solrtype=gislocaties&dismax=true&bq=exactName:DISTRICT^20000.0&bq=layer:straatnaam^20000.0';
            $http.get(url).success(function (data, status, headers, config) {
                // data = GisHelperService.UnwrapProxiedData(data);
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom.promise;
        };
        var completeUrl = function completeUrl(url) {
            // var baseurl = Gis.BaseUrl + 'arcgissql/rest/';
            // if (!url.contains('arcgissql/rest/') && !url.contains('arcgis/rest/')) {
            //     url = baseurl + url;
            // }
            // if (url.toLowerCase().contains("p_sik") && url.toLowerCase().contains("/arcgissql/")) {
            //     url = url.replace("/arcgissql/", "/arcgis/");
            // }
            return url;
        };
        var generateOptionsBasedOnUrl = function generateOptionsBasedOnUrl(url, opts) {
            if (!opts) {
                opts = {};
            }
            if (url.toLowerCase().includes("p_sik")) {
                opts.withCredentials = true;
            }
            return opts;
        };
        _service.GetThemeData = function (mapserver) {
            var prom = $q.defer();

            var url = completeUrl(mapserver) + '?f=pjson';
            console.log("ZZZZZ");

            $http.get(url, generateOptionsBasedOnUrl(url)).success(function (data, status, headers, config) {
                // data = GisHelperService.UnwrapProxiedData(data);
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
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
        _service.GetThemeLayerData = function (cleanurl) {
            var prom = $q.defer();

            var url = completeUrl(cleanurl) + '/layers?f=pjson';
            $http.get(url, generateOptionsBasedOnUrl(url)).success(function (data, status, headers, config) {
                // data = GisHelperService.UnwrapProxiedData(data);
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom.promise;
        };
        _service.GetLegendData = function (cleanurl) {
            var prom = $q.defer();

            var url = completeUrl(cleanurl) + '/legend?f=pjson';
            $http.get(url, generateOptionsBasedOnUrl(url)).success(function (data, status, headers, config) {
                // data = GisHelperService.UnwrapProxiedData(data);
                prom.resolve(data);
            }).error(function (data, status, headers, config) {
                prom.reject(null);
                PopupService.ErrorFromHttp(data, status, url);
            });
            return prom.promise;
        };
        _service.GetAditionalLayerInfo = function (theme) {

            var promLegend = _service.GetLegendData(theme.cleanUrl);
            promLegend.then(function (data) {
                theme.AllLayers.forEach(function (layer) {
                    var layerid = layer.id;
                    var layerInfo = data.layers.find(function (x) {
                        return x.layerId == layerid;
                    });
                    layer.legend = [];
                    if (layerInfo) {
                        layer.legend = layerInfo.legend;
                        layer.legend.forEach(function (legenditem) {
                            legenditem.fullurl = "data:" + legenditem.contentType + ";base64," + legenditem.imageData;
                        });
                    }
                });
            });
            var promLayerData = _service.GetThemeLayerData(theme.cleanUrl);
            promLayerData.then(function (data) {
                theme.AllLayers.forEach(function (layer) {
                    var layerid = layer.id;
                    var layerInfo = data.layers.find(function (x) {
                        return x.id == layerid;
                    });
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
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    var service = function service() {
        var _service = {};
        proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438' + ' +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs');
        // proj4.defs('EPSG:31370', '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs');
        var getApiURL = function getApiURL() {
            if (window.location.href.startsWith('https://stadinkaart-a.antwerpen.be/')) {
                return 'https://stadinkaart-a.antwerpen.be/digipolis.stadinkaart.api/';
            } else if (window.location.href.startsWith('https://stadinkaart-o.antwerpen.be/')) {
                return 'https://stadinkaart-o.antwerpen.be/digipolis.stadinkaart.api/';
            } else if (window.location.href.startsWith('https://stadinkaart.antwerpen.be/')) {
                return 'https://stadinkaart.antwerpen.be/digipolis.stadinkaart.api/';
            } else {
                return 'https://localhost/digipolis.stadinkaart.api/';
            }
        };
        _service.getEnvironment = function () {
            if (window.location.href.startsWith('https://stadinkaart.antwerpen.be/')) {
                return 'P';
            }
            if (window.location.href.startsWith('https://stadinkaart-a.antwerpen.be/')) {
                return 'A';
            } else if (window.location.href.startsWith('https://stadinkaart-o.antwerpen.be/')) {
                return 'O';
            } else if (window.location.href.startsWith('https://localhost/')) {
                return 'D'; //DEV
            } else {
                    return 'L'; //local
                }
        };
        _service.CreateProxyUrl = function (url) {
            return getApiURL() + 'Proxy/go?url=' + encodeURIComponent(url);
        };
        _service.UnwrapProxiedData = function (data) {
            if (typeof data == 'string' && data.startsWith('{"listOfString":')) {
                data = $.parseJSON(data).listOfString;
            } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object' && data.listOfString) {
                data = data.listOfString;
            }
            if (typeof data == 'string' && data.startsWith('{')) {
                data = JSON.parse(data);
            }

            if (typeof data == 'string' && data.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
                data = data.slice(38).trim();
            }
            return data;
        };
        _service.ConvertWSG84ToLambert72 = function (coordinates) {
            var result = proj4('EPSG:31370', [coordinates.lng || coordinates.x, coordinates.lat || coordinates.y]);
            return {
                x: result[0],
                y: result[1]
            };
        };
        _service.ConvertLambert72ToWSG84 = function (coordinates) {
            var x = coordinates.lng || coordinates.x || coordinates[0];
            var y = coordinates.lat || coordinates.y || coordinates[1];
            var result = proj4('EPSG:31370', 'WGS84', [parseFloat(x), parseFloat(y)]);
            return {
                y: result[0],
                x: result[1]
            };
        };
        var isCharDigit = function isCharDigit(n) {
            return n != ' ' && n > -1;
        };
        _service.getWGS84CordsFromString = function (search) {
            var returnobject = {};
            returnobject.hasCordinates = false;
            returnobject.error = null;
            returnobject.x = null;
            returnobject.y = null;
            var currgetal = '';
            var samegetal = false;
            var aantalmetcorrectesize = 0;
            var hasaseperater = false;
            var getals = [];
            if ((search.contains('51.') || search.contains('51,')) && (search.contains('4.') || search.contains('4,'))) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = search[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var char = _step.value;

                        if (isCharDigit(char)) {
                            if (samegetal) {
                                currgetal = currgetal + char;
                            } else {
                                currgetal = '' + char;
                                samegetal = true;
                            }
                        } else {
                            if ((currgetal == '51' || currgetal == '4') && (char == '.' || char == ',') && hasaseperater == false) {
                                currgetal = currgetal + char;
                                aantalmetcorrectesize++;
                                hasaseperater = true;
                            } else {
                                if (currgetal != '') {
                                    getals.push(currgetal);
                                }
                                currgetal = '';
                                samegetal = false;
                                hasaseperater = false;
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (currgetal != '') {
                    getals.push(currgetal);
                }
            }

            if (aantalmetcorrectesize == 2 && getals.length == 2) {
                returnobject.x = getals[0].replace(',', '.');
                returnobject.y = getals[1].replace(',', '.');
                returnobject.hasCordinates = true;
                return returnobject;
            } else {
                returnobject.error = 'Incorrect format: X,Y is required';
                return returnobject;
            }
        };
        _service.getLambartCordsFromString = function (search) {
            var returnobject = {};
            returnobject.hasCordinates = false;
            returnobject.error = null;
            returnobject.x = null;
            returnobject.y = null;
            var getals = [];
            var currgetal = '';
            var samegetal = false;
            var aantalmet6size = 0;
            var hasaseperater = false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = search[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var char = _step2.value;

                    if (isCharDigit(char)) {
                        if (samegetal) {
                            currgetal = currgetal + char;
                        } else {
                            currgetal = '' + char;
                            samegetal = true;
                        }
                    } else {
                        if (currgetal.length == 6) {
                            if (currgetal > 125000 && currgetal < 175000 || currgetal > 180000 && currgetal < 240000) {
                                aantalmet6size++;
                            } else {
                                returnobject.error = 'Out of bounds cordinaten voor Antwerpen.';
                                return returnobject;
                            }
                        }

                        if ((char == ',' || char == '.') && hasaseperater == false) {
                            hasaseperater = true;
                            currgetal = currgetal + char;
                        } else {
                            hasaseperater = false;
                            getals.push(currgetal);
                            currgetal = '';
                            samegetal = false;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (currgetal != '') {
                if (currgetal.length == 6) {
                    aantalmet6size++;
                }
                getals.push(currgetal);
            }
            var getals = getals.filter(function (x) {
                return x.trim() != '';
            });
            if (aantalmet6size == 2 && getals.length == 2) {
                returnobject.x = getals[0].replace(',', '.');
                returnobject.y = getals[1].replace(',', '.');
                returnobject.hasCordinates = true;
                return returnobject;
            } else {
                returnobject.error = 'Incorrect format: Lat,Lng is required';
                return returnobject;
            }
        };

        return _service;
    };
    // module.$inject = ['$http', 'map'];
    module.factory('GisHelperService', service);
})();
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', ['ui.sortable']]); //'leaflet-directive'
    }
    var layersService = function layersService() {
        var _layersService = {};
        return _layersService;
    };
    module.$inject = [];
    module.factory('LayersService', layersService);
})();
;'use strict';

L.Control.Typeahead = L.Control.extend({
  options: {
    position: 'topleft'
  },
  initialize: function initialize(args) {
    // constructor
    console.log('init');
    this.arguments = [];
    for (var i = 0; i < args.length - 1; i++) {
      this.arguments.push(args[i]);
    } //console.log(this.arguments);
    L.Util.setOptions(this, args[args.length - 1]);
  },
  onAdd: function onAdd(map) {
    console.log('onadd');
    var that = this;
    // happens after added to map
    //top: -65px; left: 40px
    var container = L.DomUtil.create('div', '');
    // var container = document.getElementsByClassName("zoekbalken2")[0];
    container.style.position = "absolute";
    // container.style.top = "px";
    // container.style.left = "50px";
    this.typeahead = L.DomUtil.create('input', 'typeahead tt-input', container);
    this.typeahead.type = 'text';
    this.typeahead.id = "okzor";
    this.typeahead.placeholder = this.options.placeholder;
    $(this.typeahead).typeahead.apply($(this.typeahead), this.arguments);
    ["typeahead:active", "typeahead:idle", "typeahead:open", "typeahead:close", "typeahead:change", "typeahead:render", "typeahead:select", 'keyup', "typeahead:autocomplete", "typeahead:cursorchange", "typeahead:asyncrequest", "typeahead:asynccancel", "typeahead:asyncreceive"].forEach(function (method) {
      if (that.options[method]) {
        $(that.typeahead).bind(method, that.options[method]);
      }
    });
    L.DomEvent.disableClickPropagation(container);
    return container;
  },
  onRemove: function onRemove(map) {},
  keyup: function keyup(e) {
    console.log('typeahead KEYUP!!', e);

    if (e.keyCode == 13) {
      $(".tt-suggestion:first-child", this).trigger('click');
      // console.log('typeahead input!!');

      // var selectedValue = $('input.typeahead').data().ttView.dropdownView.getFirstSuggestion();
      // $("#value_id").val(selectedValue);
      // $('form').submit();
      // return true;
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      // do nothing
    } else {}
  },
  itemSelected: function itemSelected(e) {
    console.log('item selcted');
    L.DomEvent.preventDefault(e);
  },
  submit: function submit(e) {
    console.log('submit');

    L.DomEvent.preventDefault(e);
  }
});

L.control.typeahead = function (args) {
  return new L.Control.Typeahead(arguments);
};
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var loadingService = function loadingService() {
        var _loadingService = {};
        _loadingService.Init = function () {}();

        _loadingService.ShowLoading = function () {
            var html = $('html');
            if (!html.hasClass('show-loader')) {
                html.addClass('show-loader');
            }
        };
        _loadingService.HideLoading = function () {
            var html = $('html');
            if (html.hasClass('show-loader')) {
                html.removeClass('show-loader');
            }
        };
        return _loadingService;
    };
    module.factory('LoadingService', loadingService);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var mapData = function mapData(map, $rootScope, GisHelperService, ResultsData, $compile, FeatureService, SearchService, $timeout) {
        var _data = {};

        _data.VisibleLayers = [];
        _data.SelectableLayers = [];
        _data.VisibleFeatures = [];
        _data.TempExtendFeatures = [];
        _data.IsDrawing = false;
        _data.Themes = [];
        _data.defaultlayer = { id: '', name: 'Alle lagen' };
        _data.VisibleLayers.unshift(_data.defaultlayer);
        _data.SelectedLayer = _data.defaultlayer;
        _data.DrawLayer = null;
        _data.DefaultLayer = null; // can be set from the featureservice
        _data.SelectedFindLayer = _data.defaultlayer;
        _data.ResetVisibleLayers = function () {
            console.log("RestVisLayers");
            var curSelectedLayer = _data.SelectedLayer || _data.defaultlayer;
            _data.VisibleLayers.length = 0;
            _data.Themes.filter(function (x) {
                return x.Type === ThemeType.ESRI;
            }).forEach(function (x) {
                _data.VisibleLayers = _data.VisibleLayers.concat(x.VisibleLayers);
            });
            _data.VisibleLayers = _data.VisibleLayers.sort(function (x) {
                return x.title;
            });
            _data.VisibleLayers.unshift(_data.defaultlayer);
            var reselectLayer = _data.VisibleLayers.find(function (x) {
                return x.name == curSelectedLayer.name;
            });
            if (reselectLayer) {
                _data.SelectedLayer = reselectLayer;
            } else {
                _data.SelectedLayer = _data.defaultlayer;
            }
        };
        _data.ActiveInteractieKnop = ActiveInteractieButton.NIETS;
        _data.DrawingType = DrawingOption.NIETS;
        _data.ShowDrawControls = false;
        _data.ShowMetenControls = false;
        _data.LastBufferedLayer = null;
        _data.LastBufferedDistance = 50;
        _data.ExtendedType = null;
        _data.DrawingObject = null;
        _data.DrawingExtendedObject = null;
        _data.LastIdentifyBounds = null;
        _data.CleanDrawingExtendedObject = function () {
            if (_data.DrawingExtendedObject) {
                if (_data.DrawingExtendedObject.layer) {
                    // if the layer (drawing) is created
                    _data.DrawingExtendedObject.layer._popup = null; // remove popup first because else it will fire close event which will do an other clean of the drawings which is not needed
                }
                if (_data.DrawingExtendedObject.disable) {
                    // if it is a drawing item (not a point) then we must disable it
                    _data.DrawingExtendedObject.disable();
                }
                map.extendFeatureGroup.clearLayers();
                _data.DrawingExtendedObject = null;
            }
        };
        map.on('draw:created', function (event) {
            var layer = event.layer;
            if (_data.ExtendedType == null) {
                map.featureGroup.addLayer(layer);
            } else {
                map.extendFeatureGroup.addLayer(layer);
            }
        });
        _data.CleanDrawings = function () {
            _data.CleanDrawingExtendedObject();
            if (_data.DrawingObject) {
                if (_data.DrawingObject.layer) {
                    // if the layer (drawing) is created
                    _data.DrawingObject.layer._popup = null; // remove popup first because else it will fire close event which will do an other clean of the drawings which is not needed
                }
                if (_data.DrawingObject.disable) {
                    // if it is a drawing item (not a point) then we must disable it
                    _data.DrawingObject.disable();
                }
                _data.DrawingObject = null;
                _data.DrawLayer = null;
                map.clearDrawings();
            }
        };
        _data.SetDrawPoint = function (latlng) {
            var pinIcon = L.AwesomeMarkers.icon({
                icon: 'fa-map-pin',
                markerColor: 'orange'
            });
            _data.SetDrawLayer(L.marker(latlng, { icon: pinIcon }).addTo(map));
        };
        _data.SetDrawLayer = function (layer) {
            _data.DrawLayer = layer;
            _data.DrawingObject = layer;
            map.addToDrawings(layer);
        };
        _data.SetStyle = function (mapItem, polyStyle, pointStyle) {
            if (mapItem) {
                var tmplayer = mapItem._layers[Object.keys(mapItem._layers)[0]];
                if (tmplayer._latlngs) {
                    // with s so it is an array, so not a point so we can set the style
                    tmplayer.setStyle(polyStyle);
                } else {
                    tmplayer.setIcon(pointStyle);
                }
            }
        };
        var WatIsHierMarker = null;
        var WatIsHierOriginalMarker = null;
        _data.CleanMap = function () {
            _data.CleanDrawings();
            _data.CleanWatIsHier();
            _data.CleanBuffer();
            _data.CleanTempFeatures();
        };
        _data.bufferLaag = null;
        _data.CreateBuffer = function (gisBufferData) {
            var esrigj = esri2geo.toGeoJSON(gisBufferData);
            var gj = new L.GeoJSON(esrigj, { style: Style.BUFFER });
            _data.bufferLaag = gj.addTo(map);
            map.fitBounds(_data.bufferLaag.getBounds());
            return _data.bufferLaag;
        };
        _data.CleanBuffer = function () {
            var bufferitem = {};
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                if (_data.VisibleFeatures[x].isBufferedItem) {
                    bufferitem = _data.VisibleFeatures[x];
                    map.removeLayer(bufferitem);
                }
            }
            var index = _data.VisibleFeatures.indexOf(bufferitem);
            if (index > -1) {
                _data.VisibleFeatures.splice(index, 1);
            }
            if (_data.bufferLaag) {
                map.removeLayer(_data.bufferLaag);
                _data.bufferLaag = null;
            }
        };
        _data.CleanTempFeatures = function () {
            tempFeatures.forEach(function (tempfeature) {
                map.removeLayer(tempfeature);
            });
            tempFeatures.length = 0;
        };
        _data.GetZoomLevel = function () {
            return map.getZoom();
        };
        _data.GetScale = function () {
            return Scales[_data.GetZoomLevel()];
        };
        _data.CleanWatIsHier = function () {
            if (WatIsHierOriginalMarker) {
                WatIsHierOriginalMarker.clearAllEventListeners();
                WatIsHierOriginalMarker.closePopup();
                map.removeLayer(WatIsHierOriginalMarker);
                WatIsHierOriginalMarker = null;
            }
            if (WatIsHierMarker) {
                map.removeLayer(WatIsHierMarker);
                WatIsHierMarker = null;
            }
        };
        _data.UpdateDisplayed = function (Themes) {
            var currentScale = _data.GetScale();
            _data.Themes.forEach(function (theme) {
                if (theme.Type == ThemeType.ESRI) {
                    theme.UpdateDisplayed(currentScale);
                }
            });
        };
        _data.Apply = function () {
            console.log('apply');
            $rootScope.$applyAsync();
        };
        _data.CreateOrigineleMarker = function (latlng, addressFound, straatNaam) {
            if (addressFound) {
                var foundMarker = L.AwesomeMarkers.icon({
                    icon: 'fa-map-marker',
                    markerColor: 'orange'
                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: foundMarker, opacity: 0.5 }).addTo(map);
            } else {
                var notFoundMarker = L.AwesomeMarkers.icon({
                    // icon: 'fa-frown-o',
                    icon: 'fa-question',
                    markerColor: 'red',
                    spin: true
                });
                WatIsHierOriginalMarker = L.marker([latlng.lat, latlng.lng], { icon: notFoundMarker }).addTo(map);
            }
            var convertedxy = GisHelperService.ConvertWSG84ToLambert72(latlng);
            var html = "";
            var minwidth = 0;
            if (straatNaam) {
                html = '<div class="container container-low-padding">' + '<div class="row row-no-padding">' + '<div class="col-sm-3" align="center" >' + '<a href="http://maps.google.com/maps?q=&layer=c&cbll=' + latlng.lat + ',' + latlng.lng + '" + target="_blank" >' +
                // '<img tink-tooltip="Ga naar streetview" tink-tooltip-align="bottom" src="https://maps.googleapis.com/maps/api/streetview?size=100x50&location=' + latlng.lat + ',' + latlng.lng + '&pitch=-0.76" />' +
                '<img tink-tooltip="Ga naar streetview" tink-tooltip-align="bottom" src="https://seeklogo.com/images/G/google-street-view-logo-665165D1A8-seeklogo.com.png" width="70%" height="70%" />' + '</a>' + '</div>' + '<div class="col-sm-8 mouse-over">' + '<div class="col-sm-12"><b>' + straatNaam + '</b></div>' + '<div class="col-sm-3">WGS84:</div><div id="wgs" class="col-sm-8" style="text-align: left;">{{WGS84LatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyWGS()"  tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"  ></i></div>' + '<div class="col-sm-3">Lambert:</div><div id="lambert" class="col-sm-8" style="text-align: left;">{{LambertLatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow"  ng-click="CopyLambert()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' + '</div>' + '</div>' + '</div>';
                minwidth = 300;
            } else {
                // html =
                //     '<div class="container container-low-padding">' +
                //     '<div class="row row-no-padding mouse-over">' +
                //     '<div class="col-sm-3">WGS84:</div><div id="wgs" class="col-sm-8 " style="text-align: left;">{{WGS84LatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyWGS()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' +
                //     '<div class="col-sm-3">Lambert:</div><div id="lambert" class="col-sm-8" style="text-align: left;">{{LambertLatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyLambert()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' +
                //     '</div>' +
                //     '</div>';
                html = '<div class="container container-low-padding">' + '<div class="row row-no-padding">' + '<div class="col-sm-3" >' + '<a href="http://maps.google.com/maps?q=&layer=c&cbll=' + latlng.lat + ',' + latlng.lng + '" + target="_blank" >' +
                //  '<img tink-tooltip="Ga naar streetview" tink-tooltip-align="bottom" src="https://maps.googleapis.com/maps/api/streetview?size=100x50&location=' + latlng.lat + ',' + latlng.lng + '&pitch=-0.76" />' +
                '<img tink-tooltip="Ga naar streetview" tink-tooltip-align="bottom" src="https://seeklogo.com/images/G/google-street-view-logo-665165D1A8-seeklogo.com.png" width="70%" height="70%" />' + '</a>' + '</div>' + '<div class="col-sm-8 mouse-over">' + '<div class="col-sm-3">WGS84:</div><div id="wgs" class="col-sm-8" style="text-align: left;">{{WGS84LatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow" ng-click="CopyWGS()"  tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"  ></i></div>' + '<div class="col-sm-3">Lambert:</div><div id="lambert" class="col-sm-8" style="text-align: left;">{{LambertLatLng}}</div><div class="col-sm-1"><i class="fa fa-files-o mouse-over-toshow"  ng-click="CopyLambert()" tink-tooltip="Coördinaten kopieren naar het klembord" tink-tooltip-align="bottom"></i></div>' + '</div>' + '</div>' + '</div>';
                minwidth = 300;
            }
            var linkFunction = $compile(html);
            var newScope = $rootScope.$new();
            newScope.LambertLatLng = convertedxy.x.toFixed(1) + ', ' + convertedxy.y.toFixed(1);
            newScope.CopyLambert = function () {
                copyToClipboard('#lambert');
            };
            newScope.CopyWGS = function () {
                copyToClipboard('#wgs');
            };
            newScope.WGS84LatLng = latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6);
            var domele = linkFunction(newScope)[0];
            var popup = WatIsHierOriginalMarker.bindPopup(domele, { minWidth: minwidth, closeButton: true }).openPopup();
            popup.on('popupclose', function () {
                _data.CleanWatIsHier();
            });
        };
        var copyToClipboard = function copyToClipboard(element) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(element).text()).select();
            document.execCommand("copy");
            $temp.remove();
        };
        _data.CreateDot = function (loc) {
            _data.CleanWatIsHier();
            var dotIcon = L.icon({
                iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABKVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUJ5OrAAAAYnRSTlMAAQIEBQYICgsNDg8QERITFxgaGyAhJSYoKS8wMTU2ODk7QkRPVFVXXV5fYWJkZ2lrbHF3eHyAg4aMjpSXmJ6jpqirra+wsrS3ucDByszP0dPc3uDi5Obo6evt7/P19/n7/fGWhfoAAAERSURBVBgZXcGHIoJhGIbh5+uXZO+sZK/slZ0tMwkhwn3+B+HtrxTXpapgKOj0n4slC8DX+binWrEcFe8T+uV2qXXhqcSdYvYGmurD/Ylv4M6TLwGk21QSugROVBQBjgKqcFvAmMwNPHiqclfwEpC6gB4VRdeWumQagai0CLcy7hwzK7MPe9IFzMjE8XVKisGr9AyDMhl8C5LagYA+ISLzhm9VUjPgKQvDMtv4hiR1Ak5JWJFpyGPOZMYhI03Bo4oadvKZuJNJwabUDIyqVjfQK+kICmFV1T1BWqYVuA+rIpgCIiqaBD5GVNKXAzZUso7JLkcjQ3NpzIFT2RS11lTVdkzFdbf+aJk+zH4+n813qOwHxGRbFJ0DoNgAAAAASUVORK5CYII=',
                iconSize: [24, 24]
            });
            WatIsHierMarker = L.marker([loc.x, loc.y], { icon: dotIcon }).addTo(map);
        };
        _data.CleanSearch = function () {
            ResultsData.CleanSearch();
            var bufferitem = null;
            for (var x = 0; x < _data.VisibleFeatures.length; x++) {
                if (!_data.VisibleFeatures[x].isBufferedItem) {
                    map.removeLayer(_data.VisibleFeatures[x]);
                } else {
                    bufferitem = _data.VisibleFeatures[x];
                }
            }
            _data.VisibleFeatures.length = 0;
            if (bufferitem) {
                _data.VisibleFeatures.push(bufferitem);
            }
        };
        _data.PanToPoint = function (loc) {
            map.setView(L.latLng(loc.x, loc.y), 12);
        };
        _data.PanToFeature = function (feature) {
            console.log("PANNING TO FEATURE");
            var featureBounds = feature.getBounds();
            map.fitBounds(featureBounds);
        };
        _data.PanToItem = function (item) {
            var geojsonitem = item.toGeoJSON();
            if (geojsonitem.features) {
                geojsonitem = geojsonitem.features[0];
            }
            if (geojsonitem.geometry.type == 'Point') {
                _data.PanToPoint({ x: geojsonitem.geometry.coordinates[1], y: geojsonitem.geometry.coordinates[0] });
            } else {
                _data.PanToFeature(item);
            }
        };
        _data.GoToLastClickBounds = function () {
            map.fitBounds(_data.LastIdentifyBounds, { paddingTopLeft: L.point(0, 0), paddingBottomRight: L.point(0, 0) });
        };
        _data.SetZIndexes = function () {
            var counter = _data.Themes.length + 3;
            _data.Themes.forEach(function (theme) {
                theme.MapData.ZIndex = counter;
                if (theme.Type == ThemeType.ESRI) {
                    if (theme.MapData._currentImage) {
                        theme.MapData._currentImage._image.style.zIndex = counter;
                    }
                } else {
                    // WMS
                    theme.MapData.bringToFront();
                    theme.MapData.setZIndex(counter);
                }
                counter--;
            });
        };
        var tempFeatures = [];
        _data.AddTempFeatures = function (featureCollection) {
            featureCollection.features.forEach(function (feature) {
                var mapItem = L.geoJson(feature, { style: Style.DEFAULT }).addTo(map);
                _data.PanToFeature(mapItem);
                tempFeatures.push(mapItem);
            });
        };
        _data.processedFeatureArray = [];
        _data.AddFeatures = function (features, theme, layerId, featureCount) {

            if (!features || features.features.length == 0) {
                ResultsData.EmptyResult = true;
            } else {
                ResultsData.EmptyResult = false;
                if (featureCount) {
                    var featureArray = _data.GetResultsData(features, theme, layerId, featureCount);
                } else {
                    var featureArray = _data.GetResultsData(features, theme, layerId, features.features.length);
                }
                if (_data.ExtendedType == null) {
                    // else we don t have to clean the map!
                    featureArray.forEach(function (featureItem) {
                        ResultsData.JsonFeatures.push(featureItem);
                    });
                } else {
                    _data.processedFeatureArray = featureArray.concat(_data.processedFeatureArray);
                    // add them to processedFeatureArray for later ConfirmExtendDialog
                }
            }
            $rootScope.$applyAsync();
        };
        _data.ConfirmExtendDialog = function () {
            var featureArray = _data.processedFeatureArray;
            if (featureArray.length == 0) {
                _data.TempExtendFeature = [];
                _data.ExtendedType = null;
                _data.CleanDrawingExtendedObject();
                swal({
                    title: 'Oeps!',
                    text: "Geen resultaten met de nieuwe selectie",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Ok',
                    closeOnConfirm: true
                });
            } else {
                var dialogtext = "Selectie verwijderen?";
                if (_data.ExtendedType == "add") {
                    dialogtext = "Selectie toevoegen?";
                }
                swal({
                    title: dialogtext,
                    cancelButtonText: 'Ja',
                    confirmButtonText: 'Nee',
                    showCancelButton: true,
                    confirmButtonColor: '#b9b9b9',
                    customClass: 'leftsidemodal',
                    closeOnConfirm: true
                }, function (isConfirm) {
                    if (!isConfirm) {
                        // since we want left ja and right no...
                        if (_data.ExtendedType == "add") {
                            _data.TempExtendFeatures.forEach(function (x) {
                                var item = x.setStyle(Style.DEFAULT);
                                _data.VisibleFeatures.push(item);
                            });
                            featureArray.forEach(function (featureItem) {
                                ResultsData.JsonFeatures.push(featureItem);
                            });
                        } else if (_data.ExtendedType == "remove") {
                            featureArray.forEach(function (featureItem) {
                                SearchService.DeleteFeature(featureItem);
                                var itemIndex = _data.VisibleFeatures.findIndex(function (x) {
                                    return x.toGeoJSON().features[0].id == featureItem.id && x.toGeoJSON().features[0].layerName == featureItem.layerName;
                                });
                                if (itemIndex > -1) {
                                    _data.VisibleFeatures.splice(itemIndex, 1);
                                }
                            });
                            _data.TempExtendFeatures.forEach(function (x) {
                                map.removeLayer(x);
                            });
                        }
                    } else {
                        _data.TempExtendFeatures.forEach(function (x) {
                            map.removeLayer(x);
                        });
                    }
                    _data.TempExtendFeatures = [];
                    _data.ExtendedType = null;
                    _data.processedFeatureArray = [];
                    _data.CleanDrawingExtendedObject();
                });
            }
        };
        _data.SetDisplayValue = function (featureItem, layer) {
            featureItem.displayValue = featureItem.properties[layer.displayField];
            if (!featureItem.displayValue) {
                var displayFieldProperties = layer.fields.find(function (x) {
                    return x.name == layer.displayField;
                });
                if (displayFieldProperties) {
                    if (featureItem.properties[displayFieldProperties.alias]) {
                        featureItem.displayValue = featureItem.properties[displayFieldProperties.alias];
                    } else {
                        featureItem.displayValue = 'LEEG';
                    }
                } else {
                    featureItem.displayValue = 'LEEG';
                }
            }
            if (featureItem.displayValue.toString().trim() == '') {
                featureItem.displayValue = 'LEEG';
            }
        };
        _data.SetFieldsData = function (featureItem, layer) {
            var aliasDifferentThanName = false;
            layer.fields.forEach(function (field) {
                if (field.name != field.alias && featureItem.properties[field.alias] == null) {
                    aliasDifferentThanName = true;
                }
                if (featureItem.properties[field.name] == null && featureItem.properties[field.alias] == null) {
                    featureItem.properties[field.name] = "";
                }
                if (field.type == 'esriFieldTypeDate' && typeof featureItem.properties[field.name] == 'number') {
                    var date = new Date(featureItem.properties[field.name]);
                    var date_string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(); // "2013-9-23"
                    featureItem.properties[field.name] = date_string;
                }
            });
            if (aliasDifferentThanName) {
                featureItem.properties = setAliasAsDisplayName(featureItem, layer);
            }
            _data.SetDisplayValue(featureItem, layer);
        };

        var setAliasAsDisplayName = function setAliasAsDisplayName(featureItem, layer) {
            var newProperties = {};
            layer.fields.forEach(function (field) {
                newProperties[field.alias] = featureItem.properties[field.name];
            });
            return newProperties;
        };

        _data.GetResultsData = function (features, theme, layerId, featureCount) {
            var buffereditem = _data.VisibleFeatures.find(function (x) {
                return x.isBufferedItem;
            });
            var resultArray = [];
            // _data.TempExtendFeatures = []; //make sure it is empty
            for (var x = 0; x < features.features.length; x++) {
                var featureItem = features.features[x];

                var layer = {};
                if (featureItem.layerId != null) {
                    layer = theme.AllLayers.find(function (x) {
                        return x.id === featureItem.layerId;
                    });
                } else if (layerId != null) {
                    layer = theme.AllLayers.find(function (x) {
                        return x.id === layerId;
                    });
                } else {
                    console.log('NO LAYER ID WAS GIVEN EITHER FROM FEATURE ITEM OR FROM PARAMETER');
                }
                featureItem.theme = theme;
                featureItem.layerName = layer.name;
                if (theme.Type === ThemeType.ESRI) {
                    var checkforitem = function checkforitem() {
                        if (!layer.fields) {
                            $timeout(checkforitem, 100);
                        } else {
                            _data.SetFieldsData(featureItem, layer);
                        }
                    };
                    checkforitem();
                    var thestyle = Style.DEFAULT;
                    if (_data.ExtendedType == "add") {
                        thestyle = Style.ADD;
                        var alreadyexists = _data.VisibleFeatures.some(function (x) {
                            return x.toGeoJSON().features[0].id == featureItem.id && x.toGeoJSON().features[0].layerName == featureItem.layerName;
                        });
                        if (!alreadyexists) {
                            var mapItem = L.geoJson(featureItem, { style: thestyle }).addTo(map);
                            _data.TempExtendFeatures.push(mapItem);
                            featureItem.mapItem = mapItem;
                            resultArray.push(featureItem);
                        }
                    } else if (_data.ExtendedType == "remove") {
                        thestyle = Style.REMOVE;
                        var alreadyexists = _data.VisibleFeatures.some(function (x) {
                            return x.toGeoJSON().features[0].id == featureItem.id && x.toGeoJSON().features[0].layerName == featureItem.layerName;
                        });
                        if (alreadyexists) {
                            var mapItem = L.geoJson(featureItem, { style: thestyle }).addTo(map);

                            if (featureItem.geometry.type == 'Point') {
                                var myicon = L.AwesomeMarkers.icon({
                                    icon: 'fa-dot-circle-o',
                                    markerColor: 'red'
                                });
                                _data.SetStyle(mapItem, Style.HIGHLIGHT, myicon);
                            }
                            _data.TempExtendFeatures.push(mapItem);
                            featureItem.mapItem = mapItem;
                            resultArray.push(featureItem);
                        }
                    } else {

                        if (buffereditem) {
                            var bufferid = buffereditem.toGeoJSON().features[0].id;
                            var bufferlayer = buffereditem.toGeoJSON().features[0].layer;
                            if (bufferid && bufferid == featureItem.id && bufferlayer == featureItem.layer) {
                                featureItem.mapItem = buffereditem;
                            } else {
                                var mapItem = L.geoJson(featureItem, { style: Style.DEFAULT }).addTo(map);
                                featureItem.mapItem = mapItem;
                                _data.VisibleFeatures.push(mapItem);
                            }
                        } else {
                            var mapItem = L.geoJson(featureItem, { style: thestyle });
                            featureItem.mapItem = mapItem;
                            if (featureCount <= 1000 || featureCount == null) {
                                _data.VisibleFeatures.push(mapItem);
                                mapItem.addTo(map);
                            }
                        }
                        resultArray.push(featureItem);
                    }
                } else {
                    resultArray.push(featureItem);

                    featureItem.displayValue = featureItem.properties[Object.keys(featureItem.properties)[0]];
                }
            }
            return resultArray;
        };

        return _data;
    };
    module.$inject = ['ResultsData', 'FeatureService', 'SearchService'];
    module.factory('MapData', mapData);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var mapEvents = function mapEvents(map, MapService, MapData, UIService, $rootScope) {
        var _mapEvents = {};
        map.on('draw:drawstart', function (event) {
            console.log('draw started');
            MapData.IsDrawing = true;
            // MapData.CleanDrawings();
        });

        map.on('draw:drawstop', function (event) {
            console.log('draw stopped');
            MapData.IsDrawing = false;
            $rootScope.$applyAsync(function () {
                MapData.DrawingType = DrawingOption.GEEN;
            });
            // MapData.CleanDrawings();
        });
        var berekendAfstand = function berekendAfstand(arrayOfPoints) {
            var totalDistance = 0.00000;
            for (var x = 0; x != arrayOfPoints.length - 1; x++) {
                // do min 1 because we the last point don t have to calculate distance to the next one
                var currpoint = arrayOfPoints[x];
                var nextpoint = arrayOfPoints[x + 1];
                totalDistance += currpoint.distanceTo(nextpoint);
            }
            return totalDistance.toFixed(2);
        };
        var berkenOmtrek = function berkenOmtrek(arrayOfPoints) {
            var totalDistance = 0.00000;
            for (var x = 0; x != arrayOfPoints.length; x++) {
                var currpoint = arrayOfPoints[x];
                if (x == arrayOfPoints.length - 1) {
                    var nextpoint = arrayOfPoints[0]; // if it is the last point, check the distance to the first point
                } else {
                    var nextpoint = arrayOfPoints[x + 1];
                }
                totalDistance += currpoint.distanceTo(nextpoint); // from this point to the next point the distance and sum it
            }
            return totalDistance.toFixed(2);
        };

        map.on('zoom', function (event) {
            console.log('Zoomend!!!');
            MapData.UpdateDisplayed();
            MapData.Apply();
        });
        _mapEvents.removeCursorAuto = function () {
            if ($('.leaflet-container').hasClass('cursor-auto')) {
                $('.leaflet-container').removeClass('cursor-auto');
            }
        };
        map.on('click', function (event) {
            if (event.originalEvent instanceof MouseEvent) {
                console.log('click op map! Is drawing: ' + MapData.IsDrawing);
                if (!MapData.IsDrawing) {
                    switch (MapData.ActiveInteractieKnop) {
                        case ActiveInteractieButton.IDENTIFY:
                            MapData.CleanMap();
                            MapData.LastIdentifyBounds = map.getBounds();
                            MapService.Identify(event, 3);
                            UIService.OpenLeftSide();
                            $rootScope.$applyAsync(function () {
                                MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
                            });

                            _mapEvents.removeCursorAuto();
                            break;
                        case ActiveInteractieButton.SELECT:

                            if (MapData.DrawingType != DrawingOption.GEEN && MapData.ExtendedType == null) {
                                if (MapData.DrawingType != DrawingOption.VIERKANT) {
                                    MapData.CleanMap();
                                }
                                MapData.CleanSearch();
                            }
                            if (MapData.DrawingType === DrawingOption.NIETS) {
                                MapService.Select(event);
                                if (MapData.ExtendedType === null) {
                                    MapData.SetDrawPoint(event.latlng);
                                }
                                UIService.OpenLeftSide();
                                _mapEvents.removeCursorAuto();
                                $rootScope.$applyAsync(function () {
                                    MapData.DrawingType = DrawingOption.GEEN;
                                    MapData.ShowDrawControls = false;
                                    MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
                                });
                            }
                            break;
                        case ActiveInteractieButton.WATISHIER:
                            MapData.CleanWatIsHier();
                            MapService.WatIsHier(event);
                            $rootScope.$applyAsync(function () {
                                MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
                                _mapEvents.removeCursorAuto();
                            });
                            break;
                        case ActiveInteractieButton.METEN:
                            break;
                        case ActiveInteractieButton.GEEN:
                            break;
                        default:
                            console.log('MAG NIET!!!!!!!!');
                            break;
                    }
                } else {
                    // MapData.DrawingObject = event;
                    console.log("DrawingObject: ");
                    console.log(MapData.DrawingObject);
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            break;
                        default:
                            console.log("Aant drawen zonder een gekent type!!!!!!");
                            break;
                    }
                }
            }
        });

        map.on('draw:created', function (e) {
            console.log('draw created');
            switch (MapData.ActiveInteractieKnop) {
                case ActiveInteractieButton.SELECT:
                    if (MapData.ExtendedType == null) {
                        MapData.DrawLayer = e.layer; // it is used for buffering etc so we don t want it to be added when we are extending (when extendingtype is add or remove)
                    }
                    MapService.Query(e.layer);
                    UIService.OpenLeftSide();
                    break;
                case ActiveInteractieButton.METEN:
                    switch (MapData.DrawingType) {
                        case DrawingOption.AFSTAND:
                            var afstand = berekendAfstand(e.layer._latlngs);
                            var popup = e.layer.bindPopup('Afstand (m): ' + afstand + ' ');
                            popup.on('popupclose', function (event) {
                                map.removeLayer(e.layer);
                                // MapData.CleanDrawings();
                                // MapData.CleanMap();
                            });
                            e.layer.openPopup();
                            break;
                        case DrawingOption.OPPERVLAKTE:
                            var omtrek = berkenOmtrek(e.layer._latlngs[0]);
                            var popuptekst = '<p>Opp  (m<sup>2</sup>): ' + LGeo.area(e.layer).toFixed(2) + '</p>' + '<p>Omtrek (m): ' + omtrek + ' </p>';
                            var popup = e.layer.bindPopup(popuptekst);
                            popup.on('popupclose', function (event) {
                                map.removeLayer(e.layer);
                                // MapData.CleanDrawings();
                                // MapData.CleanMap();
                            });
                            e.layer.openPopup();
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    console.log('MAG NIET!!!!!!!!');
                    break;
            }
            $rootScope.$applyAsync(function () {
                MapData.DrawingType = DrawingOption.GEEN;
                MapData.ShowDrawControls = false;
                MapData.ShowMetenControls = false;
                MapData.ActiveInteractieKnop = ActiveInteractieButton.GEEN;
            });
            MapData.IsDrawing = false;
        });
        var gpsmarker = null;

        _mapEvents.ClearGPS = function () {
            if (gpsmarker) {
                gpsmarker.removeFrom(map);
            }
        };
        map.on('locationerror', function (e) {
            console.log('LOCATIONERROR', e);
        });

        return _mapEvents;
    };
    module.$inject = ['map', 'MapService', 'MapData', 'UIService', '$rootScope'];

    module.factory('MapEvents', mapEvents);
})();
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }
    var mapService = function mapService($rootScope, MapData, map, ThemeCreater, $q, GISService, ResultsData, GisHelperService, PopupService) {
        var _mapService = {};
        _mapService.MaxFeatures = 1000;
        _mapService.getJsonFromXML = function (data) {
            var json = null;
            if (typeof data != "string") {
                data = JXON.xmlToString(data); // only if not yet string
            }
            data = data.replace(/wfs:/g, '');
            data = data.replace(/gml:/g, '');
            data = data.replace(/dsi:/g, '');
            var returnjson = JXON.stringToJs(data);
            if (returnjson.featureinforesponse) {
                json = returnjson.featureinforesponse.fields;
            }
            if (returnjson.featurecollection) {

                var test = JSON.stringify(returnjson.featurecollection.featuremember);
                // json = returnjson.featurecollection.featuremember;
                for (var key in returnjson.featurecollection.featuremember) {
                    json = returnjson.featurecollection.featuremember[key];
                }
            }
            return json;
        };
        _mapService.getJsonFromPlain = function (data) {
            var json = null;
            var splittedtext = data.trim().split("--------------------------------------------");
            var contenttext = null;
            if (splittedtext.length >= 2) {
                contenttext = splittedtext[1];
                var splittedcontent = contenttext.trim().split(/\n|\r/g);
                if (splittedcontent.length > 0) {
                    //more then 0 lines so lets make an object from the json
                    json = {};
                }
                splittedcontent.forEach(function (line) {
                    var splittedline = line.split("=");
                    json[splittedline[0].trim()] = splittedline[1].trim();
                });
            }
            return json;
        };
        _mapService.Identify = function (event, tolerance) {
            MapData.CleanSearch();
            if (typeof tolerance === 'undefined') {
                tolerance = 3;
            }
            _.each(MapData.Themes, function (theme) {
                // theme.RecalculateVisibleLayerIds();
                var identifOnThisTheme = true;
                // if (theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                if (theme.VisibleLayerIds.length === 0 || theme.VisibleLayerIds.length === 1 && theme.VisibleLayerIds[0] === -1) {
                    identifOnThisTheme = false; // we moeten de layer niet qryen wnnr er geen vis layers zijn
                }
                if (identifOnThisTheme) {
                    switch (theme.Type) {
                        case ThemeType.ESRI:
                            var visanddisplayedlayers = theme.VisibleAndDisplayedLayerIds;
                            var layersVoorIdentify = 'all:' + visanddisplayedlayers;
                            if (visanddisplayedlayers.length == 0) {
                                layersVoorIdentify = 'visible:-1';
                            }
                            ResultsData.RequestStarted++;
                            theme.MapData.identify().on(map).at(event.latlng).layers(layersVoorIdentify).tolerance(tolerance).run(function (error, featureCollection) {
                                ResultsData.RequestCompleted++;
                                MapData.AddFeatures(featureCollection, theme);
                            });
                            break;
                        case ThemeType.WMS:
                            var layersVoorIdentify = theme.VisibleLayerIds;
                            theme.VisibleLayers.forEach(function (lay) {
                                console.log(lay);
                                if (lay.queryable == true) {

                                    ResultsData.RequestStarted++;
                                    theme.MapData.getFeatureInfo(event.latlng, lay.name, theme.GetFeatureInfoType).then(function (data, status, xhr) {
                                        if (data) {
                                            data = GisHelperService.UnwrapProxiedData(data);
                                        }
                                        ResultsData.RequestCompleted++;
                                        var processedjson = null;
                                        switch (theme.GetFeatureInfoType) {
                                            case "text/xml":
                                                processedjson = _mapService.getJsonFromXML(data);
                                                break;
                                            case "text/plain":
                                                processedjson = _mapService.getJsonFromPlain(data);
                                                break;
                                            default:
                                                break;
                                        }

                                        var returnitem = {
                                            type: 'FeatureCollection',
                                            features: []
                                        };
                                        if (processedjson) {
                                            var featureArr = [];
                                            if ((typeof processedjson === 'undefined' ? 'undefined' : _typeof(processedjson)) === 'object') {
                                                featureArr.push(processedjson);
                                            } else {
                                                featureArr = processedjson;
                                            }

                                            featureArr.forEach(function (feat) {
                                                var tmpitem = {
                                                    layerName: lay.name,
                                                    name: lay.name,
                                                    layerId: lay.name,
                                                    properties: feat,
                                                    type: 'Feature'
                                                };
                                                returnitem.features.push(tmpitem);
                                            });
                                            console.log(lay.name + ' item info: ');
                                            console.log(returnitem);
                                            MapData.AddFeatures(returnitem, theme);
                                        } else {
                                            // we must still apply for the loading to get updated
                                            $rootScope.$applyAsync();
                                        }
                                    }).then(function (exception) {
                                        ResultsData.RequestCompleted++;
                                    });
                                }
                            });
                            break;
                        default:
                            console.log('UNKNOW TYPE!!!!:');
                            console.log(Theme.Type);
                            break;
                    }
                }
            });
        };
        _mapService.IdentifyProm = function (theme, latlng, layerids) {

            var promise = new Promise(function (resolve, reject) {
                ResultsData.RequestStarted++;
                theme.MapData.identify().on(map).layers('visible: ' + layerids).at(latlng).run(function (error, featureCollection, response) {
                    ResultsData.RequestCompleted++;
                    resolve({ error: error, featureCollection: featureCollection, response: response });
                });
            });
            return promise;
        };
        _mapService.Select = function (event) {
            // MapData.CleanSearch();
            console.log(event);
            if (MapData.SelectedLayer.id === '') {
                // alle layers selected
                var allproms = [];
                MapData.Themes.filter(function (x) {
                    return x.Type == ThemeType.ESRI;
                }).forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    if (theme.VisibleLayerIds.length !== 0 && theme.VisibleLayerIds[0] !== -1) {
                        // ResultsData.RequestStarted++;
                        var prom = _mapService.IdentifyProm(theme, event.latlng, theme.VisibleLayerIds);
                        allproms.push(prom);-prom.then(function (arg) {
                            MapData.AddFeatures(arg.featureCollection, theme);
                        });
                    }
                });
                if (MapData.ExtendedType != null) {
                    Promise.all(allproms).then(function AcceptHandler(results) {
                        MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                        MapData.processedFeatureArray = [];
                    });
                }
            } else {
                ResultsData.RequestStarted++;
                MapData.SelectedLayer.theme.MapData.identify().on(map).at(event.latlng).layers('visible: ' + MapData.SelectedLayer.id).run(function (error, featureCollection) {
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, MapData.SelectedLayer.theme);
                    if (MapData.ExtendedType != null) {
                        MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                        MapData.processedFeatureArray = [];
                    }
                });
            }
        };
        _mapService.LayerQuery = function (theme, layerid, geometry) {

            var promise = new Promise(function (resolve, reject) {
                ResultsData.RequestStarted++;
                if (geometry.mapItem != undefined) {
                    geometry = geometry.mapItem;
                }
                theme.MapDataWithCors.query().layer(layerid).intersects(geometry).run(function (error, featureCollection, response) {
                    ResultsData.RequestCompleted++;
                    if (featureCollection) {
                        validateFeatureCollectionGeometry(featureCollection.features);
                    }
                    resolve({ error: error, featureCollection: featureCollection, response: response });
                });
            });
            return promise;
        };

        var validateFeatureCollectionGeometry = function validateFeatureCollectionGeometry(features) {
            if (_mapService.MaxFeatures >= features.length) {
                //This might not be necessary as I added 'toFixed(8)' when converting coordinates
                for (var index = 0; index < features.length; index++) {
                    var element = features[index];
                    if (element.geometry == null && element.properties.X != null && element.properties.Y != null) {
                        var search = element.properties.X.toFixed(8) + "," + element.properties.Y.toFixed(8);
                        var lambertCheck = GisHelperService.getLambartCordsFromString(search);
                        var xyWGS84 = GisHelperService.ConvertLambert72ToWSG84({
                            x: lambertCheck.x,
                            y: lambertCheck.y
                        });
                        element.geometry = { coordinates: [xyWGS84.y, xyWGS84.x],
                            type: "Point" };
                    }
                }
            }
        };

        _mapService.LayerQueryCount = function (theme, layerid, geometry) {
            var promise = new Promise(function (resolve, reject) {
                ResultsData.RequestStarted++;
                theme.MapDataWithCors.query().layer(layerid).intersects(geometry).count(function (error, count, response) {
                    ResultsData.RequestCompleted++;
                    resolve({ error: error, count: count, response: response });
                });
            });
            return promise;
        };

        _mapService.AdvancedQueryCount = function (theme, layerid, query) {
            var promise = new Promise(function (resolve, reject) {
                ResultsData.RequestStarted++;
                theme.MapData.query().layer(layerid).where(query).count(function (error, count, response) {
                    ResultsData.RequestCompleted++;
                    resolve({ error: error, count: count, response: response });
                });
            });
            return promise;
        };

        _mapService.AdvancedLayerQuery = function (theme, layerid, query) {
            var promise = new Promise(function (resolve, reject) {
                ResultsData.RequestStarted++;
                theme.MapData.query().layer(layerid).where(query).run(function (error, featureCollection, response) {
                    ResultsData.RequestCompleted++;
                    if (featureCollection != null) {
                        validateFeatureCollectionGeometry(featureCollection.features);
                    }
                    resolve({ error: error, featureCollection: featureCollection, response: response });
                });
            });
            return promise;
        };

        _mapService.AdvancedQuery = function (layer, query) {
            if (!layer) {
                PopupService.Warning("Geen geldige laag", "Kon geen laag vinden om in te zoeken");
            } else {
                var prom = _mapService.AdvancedQueryCount(layer.theme, layer.id, query);
                prom.then(function (arg) {
                    if (arg.count > _mapService.MaxFeatures) {
                        PopupService.Warning("U selecteerde " + arg.count + " resultaten.", "Bij meer dan " + _mapService.MaxFeatures + " resultaten kan het laden wat langer duren en zijn de resultaten niet zichtbaar op de kaart en in de lijst. Exporteren naar CSV blijft mogelijk.");
                    }
                    var prom = _mapService.AdvancedLayerQuery(layer.theme, layer.id, query);
                    prom.then(function (arg) {
                        if (arg.error == undefined) {
                            MapData.AddFeatures(arg.featureCollection, layer.theme, layer.id, arg.featureCollection.length);
                            if (MapData.ExtendedType != null) {
                                MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                                MapData.processedFeatureArray = [];
                            }
                        } else {
                            PopupService.ErrorWithException("Fout bij het uitvoeren van de query", "Code: " + arg.error.error.code + "<br/>Message:" + arg.error.error.message + "<br/>Bent u zeker dat u een geldige query opstelde?<br/>");
                        }
                    });
                });
            }
        };

        _mapService.AutoCompleteQuery = function (layer, field, query) {
            if (!layer) {
                PopupService.Warning("Geen geldige laag", "Kon geen laag vinden om in te zoeken");
            } else {
                if (!field) {
                    PopupService.Warning("Geen veld van laag geselecteerd", "Selecteer een veld om autocomplete te kunnen starten");
                } else {
                    var promise = new Promise(function (resolve, reject) {
                        ResultsData.RequestStarted++;
                        layer.theme.MapData.query().layer(layer.id).where(query).returnGeometry(false).fields(field.name).limit(20).run(function (error, featureCollection, response) {
                            ResultsData.RequestCompleted++;
                            resolve({ error: error, featureCollection: featureCollection, response: response });
                        });
                    });
                    console.log(promise);
                    return promise;
                }
            }
        };

        _mapService.startAutoComplete = function (layer, field, query) {
            return this.AutoCompleteQuery(layer, field, query);
        };

        _mapService.Query = function (box, layer) {
            if (!layer) {
                layer = MapData.SelectedLayer;
            }
            if (!layer || layer.id === '') {
                // alle layers selected
                var featureCount = 0;
                var allcountproms = [];
                MapData.Themes.forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(function (lay) {
                            var layerCountProm = _mapService.LayerQueryCount(theme, lay.id, box);
                            layerCountProm.then(function (arg) {
                                featureCount += arg.count;
                            });
                            allcountproms.push(layerCountProm);
                        });
                    }
                });
                Promise.all(allcountproms).then(function AcceptHandler(results) {
                    console.log(results, featureCount);
                    if (featureCount > _mapService.MaxFeatures) {
                        PopupService.Warning("U selecteerde " + featureCount + " resultaten.", "Bij meer dan " + _mapService.MaxFeatures + " resultaten kan het laden wat langer duren en zijn de resultaten niet zichtbaar op de kaart en in de lijst. Exporteren naar CSV blijft mogelijk.");
                    }
                    var allproms = [];
                    MapData.Themes.forEach(function (theme) {
                        // dus doen we de qry op alle lagen.
                        if (theme.Type === ThemeType.ESRI) {
                            theme.VisibleLayers.forEach(function (lay) {
                                var prom = _mapService.LayerQuery(theme, lay.id, box);
                                allproms.push(prom);
                                prom.then(function (arg) {
                                    MapData.AddFeatures(arg.featureCollection, theme, lay.id, featureCount);
                                });
                            });
                        }
                    });
                    if (MapData.ExtendedType != null) {
                        Promise.all(allproms).then(function AcceptHandler(results) {
                            MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                            MapData.processedFeatureArray = [];
                        });
                    }
                });
            } else {
                var prom = _mapService.LayerQueryCount(layer.theme, layer.id, box);
                prom.then(function (arg) {
                    if (arg.count > _mapService.MaxFeatures) {
                        PopupService.Warning("U selecteerde " + arg.count + " resultaten.", "Bij meer dan " + _mapService.MaxFeatures + " resultaten kan het laden wat langer duren en zijn de resultaten niet zichtbaar op de kaart en in de lijst. Exporteren naar CSV blijft mogelijk.");
                    }
                    var prom = _mapService.LayerQuery(layer.theme, layer.id, box);
                    prom.then(function (arg) {
                        MapData.AddFeatures(arg.featureCollection, layer.theme, layer.id, arg.featureCollection.length);
                        if (MapData.ExtendedType != null) {
                            MapData.ConfirmExtendDialog(MapData.processedFeatureArray);
                            MapData.processedFeatureArray = [];
                        }
                    });
                });
            }
        };
        _mapService.WatIsHier = function (event) {
            var prom = GISService.ReverseGeocode(event);
            prom.success(function (data, status, headers, config) {
                MapData.CleanWatIsHier();
                if (data.length > 0) {
                    var converted = GisHelperService.ConvertLambert72ToWSG84(data[0].xy);
                    MapData.CreateDot(converted);
                    MapData.CreateOrigineleMarker(event.latlng, true, data[0].straatnm.split('_')[0] + ' ' + data[0].huisnr + ' (' + data[0].postcode + ' ' + data[0].district + ')');
                } else {
                    MapData.CreateOrigineleMarker(event.latlng, false);
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        };
        //"Lro_Stad"
        //percelen
        //CAPAKEY
        //11810K1905/00B002
        //.FindAdvanced("Lro_Stad", "percelen", "CAPAKEY", "11810K1905/00B002");
        _mapService.FindAdvanced = function (themeName, layerName, field, parameter) {
            var prom = $q.defer();
            var theme = MapData.Themes.find(function (x) {
                return x.Naam == themeName;
            });
            if (!theme) {
                throw "No loaded theme found with the name: " + themeName;
            }
            var layer = theme.AllLayers.find(function (x) {
                return x.name == layerName;
            });
            if (!layer) {
                throw "No layer found with the name: " + layerName + " on the theme with name: " + themeName;
            }
            ResultsData.RequestStarted++;
            theme.MapData.find().fields(field).layers(layer.id).text(parameter).run(function (error, featureCollection, response) {
                if (error) {
                    prom.reject(error);
                } else {
                    prom.resolve(featureCollection, response);
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, theme, layer.id);
                }
            });
            return prom.promise;
        };
        _mapService.Find = function (query) {
            MapData.CleanSearch();
            if (MapData.SelectedFindLayer && MapData.SelectedFindLayer.id === '') {
                // alle layers selected
                MapData.Themes.forEach(function (theme) {
                    // dus doen we de qry op alle lagen.
                    if (theme.Type === ThemeType.ESRI) {
                        theme.VisibleLayers.forEach(function (lay) {
                            ResultsData.RequestStarted++;
                            theme.MapData.find().fields(lay.displayField).layers(lay.id).text(query).run(function (error, featureCollection, response) {
                                ResultsData.RequestCompleted++;
                                MapData.AddFeatures(featureCollection, theme, lay.id);
                            });
                        });
                    }
                });
            } else {
                ResultsData.RequestStarted++;
                MapData.SelectedFindLayer.theme.MapData.find().fields(MapData.SelectedFindLayer.displayField).layers(MapData.SelectedFindLayer.id).text(query).run(function (error, featureCollection, response) {
                    ResultsData.RequestCompleted++;
                    MapData.AddFeatures(featureCollection, MapData.SelectedFindLayer.theme, MapData.SelectedFindLayer.id);
                });
            }
        };

        return _mapService;
    };
    module.$inject = ['$rootScope', 'MapData', 'map', 'ThemeCreater', '$q', 'GISService', 'ResultsData', 'GisHelperService', 'PopupService'];
    module.factory('MapService', mapService);
})();
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'tink.modal']); //'leaflet-directive'
    }

    var popupService = function popupService() {
        var _popupService = {};
        _popupService.Init = function () {
            toastr.options.timeOut = 0; // How long the toast will display without user interaction, when timeOut and extendedTimeOut are set to 0 it will only close after user has clocked the close button
            toastr.options.extendedTimeOut = 0; // How long the toast will display after a user hovers over it
            toastr.options.closeButton = true;
        }();
        _popupService.popupGenerator = function (type, title, message, callback, options) {
            var messagetype = type.toLowerCase().trim();
            if (messagetype != 'error' && messagetype != 'warning' && messagetype != 'info' && messagetype != 'success') {
                throw "Invalid toastr type(info, error, warning,  success): " + messagetype;
            }
            if (!options) {
                options = {};
            }
            if (!options.timeOut) {
                options.timeOut = 3000;
            }
            if (!options.extendedTimeOut) {
                options.extendedTimeOut = 0;
            }
            if (callback) {
                options.onclick = callback;
            }
            toastr[messagetype](message, title, options);
        };
        _popupService.ExceptionFunc = function (exception) {
            console.log(exception);
        };
        _popupService.ErrorWithException = function (title, message, exception, options) {
            var callback = function callback() {
                _popupService.ExceptionFunc(exception);
            };
            _popupService.Error(title, message, callback, options);
        };
        _popupService.ErrorFromHttp = function (data, status, url) {
            _popupService.ErrorFromHTTP(data, status, url);
        };
        _popupService.ErrorFromHTTP = function (data, status, url) {
            if (!status) {
                // if no status code is given, it is most likely in the body of data
                status = data.code;
            }

            var title = 'HTTP error (' + status + ')';
            var baseurl = url.split('/').slice(0, 3).join('/');
            var message = 'Fout met het navigeren naar url: ' + baseurl;
            var exception = { url: url, status: status, data: data };
            var callback = function callback() {
                _popupService.ExceptionFunc(exception);
            };

            if (status == -1 && url.includes("reversedgeocode-p.antwerpen.be")) {
                title = "ReversedGeocoding Error (status " + status + ")";
                message = "Er is geen adres binnen Antwerpen in de buurt van deze coördinaten.";
            }

            if (baseurl == "https://metadata.geopunt.be") {
                title = "Geopunt Error (status " + status + ")";
                message = "De geopunt service(s) die u probeert te bevragen zijn (tijdelijk) niet bereikbaar.";
            }
            if (status == 403) {
                title = "Onvoldoende rechten";
                if (url.includes("service")) {}
                message = "U hebt geen rechten om het thema " + url + " te raadplegen";
                callback = function callback() {
                    var win = window.open('https://um.antwerpen.be/main.aspx', '_blank');
                    win.focus();
                };
                var options = {};
                options.timeOut = 10000;
                _popupService.popupGenerator('Warning', title, message, callback, options);
            } else {
                _popupService.Error(title, message, callback);
            }
        };
        _popupService.Error = function (title, message, callback, options) {
            _popupService.popupGenerator('Error', title, message + "\nKlik hier om te melden.", callback, options);
        };
        _popupService.Warning = function (title, message, callback, options) {
            _popupService.popupGenerator('Warning', title, message, callback, options);
        };
        _popupService.Info = function (title, message, callback, options) {
            _popupService.popupGenerator('Info', title, message, callback, options);
        };
        _popupService.Success = function (title, message, callback, options) {
            if (!options) {
                options = {};
            }
            if (!options.closeButton) {
                options.closeButton = false;
            }
            _popupService.popupGenerator('Success', title, message, callback, options);
        };
        return _popupService;
    };
    module.factory('PopupService', popupService);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service(map, ThemeCreater, MapData, GISService) {
        var _service = {};
        _service.AddAndUpdateThemes = function (themesBatch) {
            console.log('Themes batch for add and updates...');
            console.log(themesBatch);
            themesBatch.forEach(function (theme) {
                var existingTheme = MapData.Themes.find(function (x) {
                    return x.cleanUrl == theme.cleanUrl;
                });
                console.log('addorupdate or del theme, ', theme, theme.status);
                switch (theme.status) {
                    case ThemeStatus.NEW:
                        if (theme.Type == ThemeType.ESRI) {
                            GISService.GetAditionalLayerInfo(theme);
                            theme.UpdateDisplayed(MapData.GetScale());
                        }
                        _service.AddNewTheme(theme);
                        break;
                    case ThemeStatus.DELETED:
                        _service.DeleteTheme(existingTheme);
                        break;
                    case ThemeStatus.UNMODIFIED:
                        // niets doen niets veranderd!
                        break;
                    case ThemeStatus.UPDATED:
                        _service.UpdateTheme(theme, existingTheme);
                        _service.UpdateThemeVisibleLayers(existingTheme);
                        break;
                    default:
                        console.log('Er is iets fout, status niet bekend!!!: ' + theme.status);
                        break;
                }
                //Theme is proccessed, now make it unmodified again
                theme.status = ThemeStatus.UNMODIFIED;
            });
            // console.log('refresh of sortableThemes');
            $('#sortableThemes').sortable('refresh');

            MapData.SetZIndexes();
        };
        _service.UpdateThemeVisibleLayers = function (theme) {
            MapData.ResetVisibleLayers();
            theme.UpdateMap(map);
        };
        _service.UpdateTheme = function (updatedTheme, existingTheme) {
            //lets update the existingTheme
            for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
                var updatedLayer = updatedTheme.AllLayers[x];
                var existingLayer = existingTheme.AllLayers[x];

                //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
                if (updatedLayer.enabled && updatedLayer.visible) {
                    //eerst checken dat ze nog niet bestaan!.
                    if (existingTheme.Type == ThemeType.ESRI && MapData.VisibleLayers.indexOf(existingLayer) == -1) {
                        MapData.VisibleLayers.push(existingLayer);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
                        existingTheme.VisibleLayers.push(existingLayer);
                    }
                } else {
                    //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
                    if (existingTheme.Type == ThemeType.ESRI && MapData.VisibleLayers.indexOf(existingLayer) != -1) {
                        MapData.VisibleLayers.splice(MapData.VisibleLayers.indexOf(existingLayer), 1);
                    }
                    if (existingTheme.VisibleLayers.indexOf(existingLayer) != -1) {
                        existingTheme.VisibleLayers.splice(existingTheme.VisibleLayers.indexOf(existingLayer), 1);
                    }
                }
                existingLayer.enabled = updatedLayer.enabled;
                existingLayer.visible = updatedLayer.visible;
            }
            // existingTheme.RecalculateVisibleLayerIds();
        };
        _service.AddNewTheme = function (theme) {
            MapData.Themes.unshift(theme);
            if (theme.Type == ThemeType.ESRI) {
                MapData.VisibleLayers = MapData.VisibleLayers.concat(theme.VisibleLayers);
            }
            switch (theme.Type) {
                case ThemeType.ESRI:
                    var visLayerIds = theme.VisibleLayerIds;
                    if (visLayerIds.length == 0) {
                        visLayerIds.push(-1);
                    }
                    if (theme.Opacity === null || theme.Opacity === undefined) {
                        theme.Opacity = 1;
                    }
                    theme.MapData = L.esri.dynamicMapLayer({
                        maxZoom: 20,
                        minZoom: 0,
                        url: theme.cleanUrl,
                        opacity: theme.Opacity,
                        layers: visLayerIds,
                        continuousWorld: true,
                        useCors: false,
                        f: 'image'
                    }).addTo(map);
                    // theme.SetOpacity(theme.Opacity);
                    theme.MapDataWithCors = L.esri.dynamicMapLayer({
                        maxZoom: 20,
                        minZoom: 0,
                        url: theme.cleanUrl,
                        opacity: 1,
                        layers: visLayerIds,
                        continuousWorld: true,
                        useCors: true,
                        f: 'image'
                    });
                    theme.MapData.on('authenticationrequired', function (e) {
                        debugger;
                        serverAuth(function (error, response) {
                            debugger;
                            e.authenticate(response.token);
                        });
                    });
                    theme.MapData.on('load', function (e) {
                        if (theme.MapData._currentImage) {
                            theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log('Zindex on ' + theme.Naam + ' set to ' + theme.MapData.ZIndex);
                        }
                    });

                    break;
                case ThemeType.WMS:
                    theme.MapData = L.tileLayer.betterWms(theme.cleanUrl, {
                        maxZoom: 20,
                        minZoom: 0,
                        format: 'image/png',
                        layers: theme.VisibleLayerIds.join(','),
                        transparent: true,
                        continuousWorld: true,
                        useCors: true
                    }).addTo(map);

                    theme.MapData.on('load', function (e) {
                        console.log('LOAD VAN ' + theme.Naam);
                        console.log(theme.MapData);
                        if (theme.MapData._container.childNodes) {
                            [].slice.call(theme.MapData._container.childNodes).forEach(function (imgNode) {
                                imgNode.style.zIndex = theme.MapData.ZIndex;
                            });
                            // theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
                            console.log('Zindex on ' + theme.Naam + ' set to ' + theme.MapData.ZIndex);
                        }
                    });
                    break;
                default:
                    console.log('UNKNOW TYPE');
                    break;
            }
        };
        _service.CleanThemes = function () {
            while (MapData.Themes.length != 0) {
                console.log('DELETING THIS THEME', MapData.Themes[0]);
                _service.DeleteTheme(MapData.Themes[0]);
            }
        };

        _service.DeleteTheme = function (theme) {
            map.removeLayer(theme.MapData); // this one works with ESRI And leaflet
            var themeIndex = MapData.Themes.indexOf(theme);
            if (themeIndex > -1) {
                MapData.Themes.splice(themeIndex, 1);
            }
            theme.VisibleLayers.forEach(function (visLayer) {
                var visLayerIndex = MapData.VisibleLayers.indexOf(visLayer);
                if (visLayerIndex > -1) {
                    MapData.VisibleLayers.splice(visLayerIndex, 1);
                }
            });
            MapData.CleanSearch();
        };

        return _service;
    };
    module.$inject = ['map', 'ThemeCreater', 'MapData', 'GISService'];
    module.factory('ThemeService', service);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var typeAheadService = function typeAheadService(map, GISService, MapData, GisHelperService) {
        var _typeAheadService = {};
        _typeAheadService.districts = [];
        _typeAheadService.lastData = [];
        _typeAheadService.lastStreetNameId = null;
        _typeAheadService.lastStreetName = "";
        _typeAheadService.numbers = null;

        //Hardcoded districtcodes + names
        _typeAheadService.districts.push({ postcode: 2000, district: "Antwerpen" });
        _typeAheadService.districts.push({ postcode: 2018, district: "Antwerpen" });
        _typeAheadService.districts.push({ postcode: 2020, district: "Antwerpen" });
        _typeAheadService.districts.push({ postcode: 2030, district: "Antwerpen" });
        _typeAheadService.districts.push({ postcode: 2040, district: "Berendrecht" });
        _typeAheadService.districts.push({ postcode: 2050, district: "Antwerpen" });
        _typeAheadService.districts.push({ postcode: 2060, district: "Antwerpen" });
        _typeAheadService.districts.push({ postcode: 2100, district: "Deurne" });
        _typeAheadService.districts.push({ postcode: 2140, district: "Borgerhout" });
        _typeAheadService.districts.push({ postcode: 2170, district: "Merksem" });
        _typeAheadService.districts.push({ postcode: 2180, district: "Ekeren" });
        _typeAheadService.districts.push({ postcode: 2600, district: "Berchem" });
        _typeAheadService.districts.push({ postcode: 2610, district: "Wilrijk" });
        _typeAheadService.districts.push({ postcode: 2660, district: "Hoboken" });

        _typeAheadService.init = function () {

            L.control.typeahead({
                minLength: 3,
                highlight: true,
                classNames: {
                    open: 'is-open',
                    empty: 'is-empty'
                }
            }, {
                async: true,
                limit: 99,
                display: 'name',
                displayKey: 'name',
                source: function source(query, syncResults, asyncResults) {
                    if (query.replace(/[^0-9]/g, '').length < 6) {
                        // if less then 6 numbers then we just search
                        var splitquery = query.split(' ');
                        var numbers = splitquery.filter(function (x) {
                            return isCharDigit(x[0]);
                        });
                        var notnumbers = splitquery.filter(function (x) {
                            return !isCharDigit(x[0]);
                        });
                        _typeAheadService.numbers = numbers.length;
                        if (query.length == 3) {
                            //FIXES BUG SIK-496
                            _typeAheadService.lastStreetNameId = null;
                        }
                        if (numbers.length == 1 && notnumbers.length >= 1) {
                            var huisnummer = numbers[0];
                            var strnmid = [];
                            var count = 0;
                            _typeAheadService.lastData.forEach(function (street) {
                                var notnumberscombined = '';
                                notnumbers.forEach(function (n) {
                                    notnumberscombined += ' ' + n;
                                });
                                notnumberscombined = notnumberscombined.trim();
                                if (_typeAheadService.lastStreetName.trim() != notnumberscombined) {
                                    typeAheadService.lastStreetNameId = null;
                                }
                                if (street.streetNameId) {
                                    strnmid.push(street.streetNameId);
                                }
                                if (_typeAheadService.lastStreetNameId != null) {
                                    strnmid = [];
                                    strnmid.push(_typeAheadService.lastStreetNameId);
                                }
                                if (!street.name.toLowerCase().trim().contains(notnumberscombined.toLowerCase())) {
                                    strnmid = [];
                                }
                            });
                            var straatnaam = encodeURIComponent(notnumbers.join(' '));
                            if (strnmid.length != 0) {
                                GISService.QueryCrab(strnmid, huisnummer).then(function (data) {
                                    console.log(data);
                                    var features = data.features.map(function (feature) {
                                        var obj = {};
                                        obj.straatnaam = feature.attributes.STRAATNM;
                                        obj.huisnummer = feature.attributes.HUISNR;
                                        // obj.busnummer = feature.attributes.BUSNR;
                                        obj.id = feature.attributes.OBJECTID;
                                        obj.x = feature.geometry.x;
                                        obj.y = feature.geometry.y;
                                        obj.name = (obj.straatnaam.split('_')[0] + " " + obj.huisnummer).trim();
                                        obj.postcode = feature.attributes.POSTCODE;
                                        _typeAheadService.districts.forEach(function (district) {
                                            if (district.postcode == obj.postcode) {
                                                obj.district = district.district;
                                            }
                                        });
                                        if (obj.straatnaam.split('_')[1]) {
                                            obj.name = obj.straatnaam.split('_')[0] + " " + obj.huisnummer + ", " + obj.postcode + " " + obj.district;
                                        } else {
                                            obj.name = obj.straatnaam + " " + obj.huisnummer + ", " + obj.postcode + " " + obj.district;
                                        }
                                        return obj;
                                    }).slice(0, 10);
                                    asyncResults(features);
                                });
                            } else {
                                GISService.QueryCrabName(straatnaam, huisnummer).then(function (data) {
                                    console.log(data);
                                    var features = data.features.map(function (feature) {
                                        var obj = {};
                                        obj.straatnaam = feature.attributes.STRAATNM;
                                        obj.huisnummer = feature.attributes.HUISNR;
                                        // obj.busnummer = feature.attributes.BUSNR;
                                        obj.id = feature.attributes.OBJECTID;
                                        obj.x = feature.geometry.x;
                                        obj.y = feature.geometry.y;
                                        obj.name = (obj.straatnaam.split('_')[0] + " " + obj.huisnummer).trim();
                                        obj.postcode = feature.attributes.POSTCODE;
                                        _typeAheadService.districts.forEach(function (district) {
                                            if (district.postcode == obj.postcode) {
                                                obj.district = district.district;
                                            }
                                        });
                                        if (obj.straatnaam.split('_')[1]) {
                                            obj.name = obj.straatnaam.split('_')[0] + " " + obj.huisnummer + ", " + obj.postcode + " " + obj.district;
                                        } else {
                                            obj.name = obj.straatnaam + " " + obj.huisnummer + ", " + obj.postcode + " " + obj.district;
                                        }
                                        return obj;
                                    }).slice(0, 10);
                                    asyncResults(features);
                                });
                            }
                        } else {
                            GISService.QuerySOLRLocatie(query.trim()).then(function (data) {
                                var arr = data.response.docs;
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
                'typeahead:select': function typeaheadSelect(ev, suggestion) {
                    MapData.CleanWatIsHier();
                    MapData.CleanTempFeatures();
                    if (suggestion.streetNameId) {
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
                        var idsplitted = suggestion.id.split("/");
                        var layerid = idsplitted[3];
                        QueryForTempFeatures(layerid, 'ObjectID=' + suggestion.key);
                    }
                }

            }).addTo(map);
            $('.typeahead').on('keyup', function (e) {
                if (e.which == 13 && $('.tt-suggestion').length == 1) {
                    var firstsug = $(".tt-suggestion:first-child");
                    firstsug.trigger('click');
                    if (_typeAheadService.numbers > 0) {
                        _typeAheadService.lastStreetNameId = null;
                    }
                }
            });
        };

        var zoekXY = function zoekXY(search) {
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
        var QueryForTempFeatures = function QueryForTempFeatures(layerid, where) {
            locatieMapData.query().layer(layerid).where(where).run(function (error, featureCollection, response) {
                if (!error) {
                    console.log(error, featureCollection, response);
                    MapData.AddTempFeatures(featureCollection);
                } else {
                    console.log("ERRRORRRRRRRRRRR", error);
                }
            });
        };
        var locatieMapData = L.esri.dynamicMapLayer({
            maxZoom: 20,
            minZoom: 0,
            url: Gis.LocatieUrl,
            opacity: 1,
            layers: 0,
            continuousWorld: true,
            useCors: false
        });
        var isCharDigit = function isCharDigit(n) {
            return n != ' ' && n > -1;
        };
        var suggestionfunc = function suggestionfunc(item) {
            if (item.districts) {
                var output = '<div>' + item.name + ' (' + item.districts[0] + ')';
            } else {
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
            output += '</div>';
            return output;
        };
        var setViewAndPutDot = function setViewAndPutDot(loc) {
            MapData.PanToPoint(loc);
            MapData.CreateDot(loc);
        };
        return _typeAheadService;
    };

    module.factory('TypeAheadService', typeAheadService);
})();
;'use strict';

(function () {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter', 'tink.pagination']); //'leaflet-directive'
    }
    var service = function service() {
        var _service = {};
        _service.OpenLeftSide = function () {
            var html = $('html');
            if (!html.hasClass('nav-left-open')) {
                html.addClass('nav-left-open');
            }
        };
        _service.CloseLeftSide = function () {
            var html = $('html');
            if (html.hasClass('nav-left-open')) {
                html.removeClass('nav-left-open');
            }
        };
        _service.OpenRightSide = function () {
            var html = $('html');
            if (!html.hasClass('nav-right-open')) {
                html.addClass('nav-right-open');
            }
        };
        _service.CloseRightSide = function () {
            var html = $('html');
            if (html.hasClass('nav-right-open')) {
                html.removeClass('nav-right-open');
            }
        };

        return _service;
    };
    module.factory('UIService', service);
})();
;//http://proj4js.org/
'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($http, GisHelperService, $q, PopupService) {
        var _service = {};
        _service.GetThemeData = function (url) {
            var fullurl = url + '?request=GetCapabilities&service=WMS';
            var proxiedurl = GisHelperService.CreateProxyUrl(fullurl);
            var prom = $http({
                method: 'GET',
                url: proxiedurl,
                timeout: 10000,
                transformResponse: function transformResponse(data) {
                    if (data) {
                        data = GisHelperService.UnwrapProxiedData(data);
                        if (data.listOfHttpError) {} else {
                            data = JXON.stringToJs(data).wms_capabilities;
                        }
                    }
                    return data;
                }
            }).success(function (data, status, headers, config) {
                // console.dir(data);  // XML document object
            }).error(function (data, status, headers, config) {
                PopupService.ErrorFromHttp(data, status, fullurl);
            });
            return prom;
        };
        return _service;
    };
    module.$inject = ['$http', 'GisHelperService', '$q', 'PopupService'];
    module.factory('WMSService', service);
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    module.controller('BufferController', ['$scope', '$modalInstance', 'MapData', function ($scope, $modalInstance, MapData) {
        var vm = this;
        $scope.buffer = MapData.LastBufferedDistance;
        $scope.SelectableLayers = angular.copy(MapData.VisibleLayers);
        $scope.SelectableLayers.shift(); // remove the alllayers for buffer
        var bufferDefault = MapData.LastBufferedLayer || MapData.DefaultLayer;
        if (bufferDefault) {
            var selectedLayer = $scope.SelectableLayers.find(function (x) {
                return x.name == bufferDefault.name;
            });
            if (selectedLayer) {
                $scope.selectedLayer = selectedLayer;
            } else {
                $scope.selectedLayer = $scope.SelectableLayers[0];
            }
        } else {
            $scope.selectedLayer = $scope.SelectableLayers[0];
        }
        $scope.ok = function () {
            MapData.LastBufferedDistance = $scope.buffer;
            MapData.LastBufferedLayer = $scope.selectedLayer;
            $modalInstance.$close({ buffer: $scope.buffer, layer: $scope.selectedLayer }); // return the themes.
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed'); // To close the controller with a dismiss message
        };
    }]);
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var theController = module.controller('searchAdvancedController', ['$scope', '$modalInstance', 'SearchAdvancedService', 'MapData', 'GISService', 'UIService', 'ResultsData', function ($scope, $modalInstance, SearchAdvancedService, MapData, GISService, UIService, ResultsData) {
        $scope.editor = false;
        $scope.selectedLayer = null;
        $scope.operations = [];
        if ($scope.query == undefined) $scope.query = null;

        $scope.openQueryEditor = function () {
            $scope.editor = true;
            if ($scope.selectedLayer) {
                SearchAdvancedService.BuildQuery($scope.selectedLayer.name);
            }
        };

        $scope.SelectedLayers = function () {
            //display only usable layers
            var layers = MapData.VisibleLayers.filter(function (data) {
                return data.name !== "Alle lagen";
            });
            if (layers.length == 1) {
                $scope.selectedLayer = layers[0];
                SearchAdvancedService.UpdateFields($scope.selectedLayer);
            }
            return layers;
        };

        $scope.updateFields = function () {
            if ($scope.selectedLayer != null && $scope.selectedLayer != undefined) {
                SearchAdvancedService.UpdateFields($scope.selectedLayer);
            }
        };

        $scope.$on('queryBuild', function (event, data) {
            $scope.query = data;
        });

        $scope.$on('queryOperationUpdated', function (event, data) {
            $scope.query = data;
            $scope.editor = false;
        });

        $scope.$on('deleteOperation', function () {
            $scope.editor = false;
        });

        $scope.addOperation = function () {
            $scope.editor = false;
            SearchAdvancedService.newAddOperation();
        };

        $scope.orOperation = function () {
            $scope.editor = false;
            SearchAdvancedService.newOrOperation();
        };

        $scope.ok = function () {
            $modalInstance.$close();
        };
        $scope.cancel = function () {
            $modalInstance.$dismiss('cancel is pressed');
        };

        $scope.QueryAPI = function () {
            if (!$scope.editor) {
                SearchAdvancedService.BuildQuery($scope.selectedLayer);
                var query = SearchAdvancedService.TranslateOperations($scope.operations);
                var result = SearchAdvancedService.ExecuteQuery($scope.selectedLayer, query);
            } else {
                var rawQueryResult = SearchAdvancedService.MakeNewRawQuery($scope.query);
                SearchAdvancedService.UpdateQuery($scope.query);
                if (rawQueryResult.layer != null) {
                    var result = SearchAdvancedService.ExecuteQuery(rawQueryResult.layer, rawQueryResult.query);
                }
            }

            UIService.OpenLeftSide();
            $modalInstance.$close();
        };

        if ($scope.query != null && $scope.query != "") {
            $scope.openQueryEditor();
        }
    }]);

    theController.$inject = ['$scope', '$modalInstance', 'SearchAdvancedService', 'MapData', 'UIService', 'GISService', 'ResultsData'];
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchController', function ($scope, ResultsData, map, $interval) {
        var vm = this;
        vm.features = ResultsData.JsonFeatures;
        vm.EmptyResult = ResultsData.EmptyResult;
        vm.LoadingCompleted = true;
        vm.loadingPercentage = 100;

        var percentageupdater = $interval(function () {
            vm.loadingPercentage = ResultsData.GetRequestPercentage();
            vm.LoadingCompleted = vm.loadingPercentage >= 100;
        }, 333);
        vm.asidetoggle = function () {
            if (L.Browser.mobile) {
                var html = $('html');
                if (html.hasClass('nav-right-open')) {
                    html.removeClass('nav-right-open');
                }
            }
        };
    });
    theController.$inject = ['$scope', 'ResultsData', 'map', '$interval'];
})();
;'use strict';

(function (module) {
    var module;
    try {
        module = angular.module('tink.gis');
    } catch (e) {
        module = angular.module('tink.gis', ['tink.accordion', 'tink.tinkApi', 'ui.sortable', 'tink.modal', 'angular.filter']); //'leaflet-directive'
    }
    var theController = module.controller('searchOperationsController', ['$scope', 'SearchAdvancedService', 'MapService', function ($scope, SearchAdvancedService, MapService) {

        $scope.attributes = null;['Straat', 'Postcode', 'nummer']; //ophalen vanaf API
        $scope.operators = ['=', '<>', '<', '>', '<=', '>=', 'LIKE', 'NOT LIKE'];
        $scope.operator = '=';
        $scope.selectedAttribute = null;
        $scope.value = null;
        $scope.layer = null;
        $scope.autoCompleteActive = false;
        $scope.autoComplete = [{ collection: [], element: null }];
        $scope.index = null;

        //initial value to build the form
        $scope.operations = [{ addition: null, attribute: null, operator: '=', value: null }];

        $scope.updateOperation = function (index) {
            $scope.index = index;
            $scope.autoCompleteActive = false;
            $scope.changeoperation();

            var op = $scope.operations[index];

            if (document.activeElement != document.getElementById('input_waarde_' + index) && op.attribute != null) {
                var prom = ExecuteEmptyAutoCompleteQuery();

                prom.then(function (arg) {
                    if (arg && arg.error == undefined && arg.featureCollection.features != null) {
                        var result = GetAutoCompleteValue(arg.featureCollection.features);
                        $scope.autoComplete[$scope.index].collection = result.filter(onlyUnique);
                    } else {
                        $scope.autoComplete[$scope.index].collection = [];
                    }
                    refreshTypeahead();
                });
            }
        };

        $scope.$on('updateFields', function (event, data) {
            $scope.attributes = data.fields;
            for (var index = 0; index < $scope.attributes.length; index++) {
                var element = $scope.attributes[index];
                if (element.name.toLowerCase() != element.alias.toLowerCase()) {
                    element.displayName = element.name + " (" + element.alias + ")";
                } else {
                    element.displayName = element.name;
                }
            }
        });

        $scope.$on('addOperation', function () {
            $scope.operations.push({ addition: 'AND', attribute: '', operator: '=', value: '' });
            $scope.autoComplete.push({ collection: [], element: null });
            $scope.changeoperation();
        });

        $scope.$on('orOperation', function () {
            $scope.operations.push({ addition: 'OR', attribute: '', operator: '=', value: '' });
            $scope.autoComplete.push({ collection: [], element: null });
            $scope.changeoperation();
        });

        $scope.delete = function (index) {
            if (index !== 0) {
                $scope.operations.splice(index, 1);
                $scope.autoComplete.splice(index, 1);
            }
            $scope.changeoperation();
        };

        $scope.up = function (index) {

            var op = $scope.operations[index];
            var ac = $scope.autoComplete[index];
            if (index == 1) {
                op.addition = null;
                $scope.operations[0].addition = "AND";
            }
            $scope.operations.splice(index, 1);
            $scope.operations.splice(index - 1, 0, op);

            $scope.autoComplete.splice(index, 1);
            $scope.autoComplete.splice(index - 1, 0, ac);
            $scope.changeoperation();
        };

        $scope.down = function (index) {
            var op = $scope.operations[index];
            var ac = $scope.autoComplete[index];
            if (index == 0) {
                op.addition = "AND";
                $scope.operations[1].addition = null;
            }

            $scope.operations.splice(index, 1);
            $scope.operations.splice(index + 1, 0, op);

            $scope.autoComplete.splice(index, 1);
            $scope.autoComplete.splice(index + 1, 0, ac);
            $scope.changeoperation();
        };

        $scope.changeoperation = function () {
            $scope.$emit('addedOperation', $scope.operations);
            setTimeout(function () {
                var op = $scope.operations[$scope.index];
                if (op.attribute != null && (op.value == null || op.value == '')) {
                    initializeTypeahead();
                }
            }, 100);
        };

        $scope.valueChanged = function (index) {
            $scope.index = index;
        };

        var ExecuteEmptyAutoCompleteQuery = function ExecuteEmptyAutoCompleteQuery() {
            var queryParams = SearchAdvancedService.BuildAutoCompleteQuery('', $scope.index);
            return MapService.startAutoComplete(queryParams.layer, queryParams.attribute, queryParams.query);
        };

        var FillAutoComplete = function FillAutoComplete(query, syncResults, asyncResults) {
            var docId = document.activeElement.id.replace("input_waarde_", '');
            if (parseInt(docId) !== $scope.index) {
                $scope.index = parseInt(docId);
                query = document.activeElement.value;
                var element = document.getElementById("input_waarde_" + docId);
                element.value = document.activeElement.value;
            }
            if ($scope.index != null) {
                var queryParams = SearchAdvancedService.BuildAutoCompleteQuery(query, $scope.index);
                MapService.startAutoComplete(queryParams.layer, queryParams.attribute, queryParams.query).then(function (arg) {
                    if (arg && arg.error == undefined && arg.featureCollection.features != null) {
                        var result = GetAutoCompleteValue(arg.featureCollection.features);
                        $scope.autoComplete[$scope.index].collection = result.filter(onlyUnique);
                    } else {
                        $scope.autoComplete[$scope.index].collection = [];
                    }
                    asyncResults($scope.autoComplete[$scope.index].collection);
                });
            } else {
                syncResults($scope.autoComplete[$scope.index].collection);
            }
        };

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        var GetAutoCompleteValue = function GetAutoCompleteValue(collection) {
            var returnCollection = [];
            var op = $scope.operations[$scope.index];
            collection.forEach(function (element) {
                if (op.attribute.type == 'esriFieldTypeDate') {
                    returnCollection.push(FormatTimestamp(element.properties[op.attribute.name]));
                } else {
                    returnCollection.push(element.properties[op.attribute.name]);
                }
            });
            return returnCollection;
        };

        var FormatTimestamp = function FormatTimestamp(timestamp) {
            var date = new Date(timestamp);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            if (month < 10) {
                return year + '-0' + month + '-' + day;
            }

            return year + '-' + month + '-' + day;
        };

        var suggestionfunc = function suggestionfunc(item) {
            return "<div>" + item + "</div>";
        };

        var initializeTypeahead = function initializeTypeahead() {
            if ($scope.index == null) $scope.index = 0;

            if ($scope.autoComplete[$scope.index].element == null) {
                createTypeahead();
            }
        };

        var refreshTypeahead = function refreshTypeahead() {
            $('#input_waarde_' + $scope.index).typeahead('destroy');
            createTypeahead();
        };

        var createTypeahead = function createTypeahead() {
            var acElement = $('#input_waarde_' + $scope.index);
            acElement.typeahead({
                minLength: 0
            }, {
                async: true,
                name: 'autoComplete',
                limit: 10,
                source: FillAutoComplete,
                templates: {
                    suggestion: suggestionfunc,
                    notFound: ['<div class="empty-message"><b>Geen resultaten gevonden</b></div>']
                }
            });

            acElement.on('focus', function (ev) {
                console.log(acElement[0].value);
                acElement.typeahead('val', acElement[0].value);
            });
            acElement.bind('typeahead:select', function (ev, suggestion) {
                $scope.operations[$scope.index].value = suggestion;
            });
            $scope.autoComplete[$scope.index].element = acElement;
        };

        setTimeout(function () {
            initializeTypeahead();
        }, 100);
    }]);
    theController.$inject = ['$scope', 'SearchAdvancedService', 'MapService'];
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchResultsController', function ($scope, ResultsData, map, SearchService, MapData, FeatureService, $modal, GeometryService) {
        var vm = this;
        vm.features = ResultsData.JsonFeatures;
        vm.featureLayers = null;
        vm.selectedResult = null;
        vm.layerGroupFilter = 'geenfilter';
        vm.collapsestatepergroup = {};
        vm.drawLayer = null;
        $scope.$watchCollection(function () {
            return ResultsData.JsonFeatures;
        }, function (newValue, oldValue) {
            vm.featureLayers = _.uniq(_.map(vm.features, 'layerName'));
            vm.featureLayers.forEach(function (lay) {
                if (vm.collapsestatepergroup[lay] === undefined || vm.collapsestatepergroup[lay] === null) {
                    vm.collapsestatepergroup[lay] = false; // at start, we want the accordions open, so we set collapse on false
                }
            });
            vm.layerGroupFilter = 'geenfilter';
        });
        $scope.$watch(function () {
            return ResultsData.SelectedFeature;
        }, function (newVal, oldVal) {
            vm.selectedResult = newVal;
        });
        $scope.$watch(function () {
            return MapData.DrawLayer;
        }, function (newdrawobject, oldVal) {
            if (newdrawobject) {
                vm.drawLayer = newdrawobject;
            } else {
                vm.drawLayer = null;
            }
        });
        vm.mobile = L.Browser.mobile;
        vm.zoom2Drawing = function () {
            MapData.PanToItem(vm.drawLayer);
        };
        vm.deleteDrawing = function () {
            MapData.CleanDrawings();
        };
        vm.bufferFromDrawing = function () {
            MapData.ExtendedType = null;
            MapData.CleanBuffer();
            var bufferInstance = $modal.open({
                templateUrl: 'templates/search/bufferTemplate.html',
                controller: 'BufferController',
                resolve: {
                    backdrop: false,
                    keyboard: true
                }
            });
            bufferInstance.result.then(function (returnobj) {
                if (vm.drawLayer.toGeoJSON().features) {
                    vm.drawLayer.toGeoJSON().features.forEach(function (feature) {
                        GeometryService.Buffer(feature, returnobj.buffer, returnobj.layer);
                    });
                } else {
                    GeometryService.Buffer(vm.drawLayer.toGeoJSON(), returnobj.buffer, returnobj.layer);
                }
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
        vm.extendedType = null;
        $scope.$watch(function () {
            return MapData.ExtendedType;
        }, function (newValue, oldValue) {
            vm.extendedType = newValue;
        });
        vm.addSelection = function () {
            if (vm.extendedType != "add") {
                MapData.ActiveInteractieKnop = ActiveInteractieButton.SELECT;
                MapData.DrawingType = DrawingOption.NIETS;
                MapData.ShowDrawControls = true;
                MapData.ShowMetenControls = false;
                vm.extendedType = "add";
                MapData.ExtendedType = "add";
            } else {
                vm.extendedType = null;
                MapData.ExtendedType = null;
            }
        };
        vm.removeSelection = function () {
            if (vm.extendedType != "remove") {
                MapData.ActiveInteractieKnop = ActiveInteractieButton.SELECT;
                MapData.DrawingType = DrawingOption.NIETS;
                MapData.ShowDrawControls = true;
                MapData.ShowMetenControls = false;
                vm.extendedType = "remove";
                MapData.ExtendedType = "remove";
            } else {
                vm.extendedType = null;
                MapData.ExtendedType = null;
            }
        };
        vm.deleteFeature = function (feature) {
            SearchService.DeleteFeature(feature);
        };
        vm.aantalFeaturesMetType = function (type) {
            return vm.features.filter(function (x) {
                return x.layerName == type;
            }).length;
        };
        vm.isOpenGroup = function (type) {
            return vm.features.filter(function (x) {
                return x.layerName == type;
            });
        };
        vm.deleteFeatureGroup = function (featureGroupName) {
            vm.collapsestatepergroup[featureGroupName] = undefined; // at start, we want the accordions open, so we set collapse on false
            SearchService.DeleteFeatureGroup(featureGroupName);
        };
        vm.showDetails = function (feature) {
            // if (feature.theme.Type !== 'wms') {
            var alreadyexists = MapData.VisibleFeatures.some(function (x) {
                return x.toGeoJSON().features[0].id == feature.id && x.toGeoJSON().features[0].layerName == feature.layerName;
            });
            if (!alreadyexists) {
                var mapItem = L.geoJson(feature, { style: Style.DEFAULT }).addTo(map);
                MapData.TempExtendFeatures.push(mapItem);
                feature.mapItem = mapItem;
            }
            // }
            ResultsData.SelectedFeature = feature;
        };
        vm.exportToCSV = function () {
            SearchService.ExportToCSV();
        };
        vm.exportToCSVButtonIsEnabled = FeatureService.exportToCSVButtonIsEnabled;
        $scope.$watch(function () {
            return FeatureService.exportToCSVButtonIsEnabled;
        }, function (newValue, oldValue) {
            vm.exportToCSVButtonIsEnabled = newValue;
        });
        $scope.$watch(function () {
            return FeatureService.extraResultButtonIsEnabled;
        }, function (newValue, oldValue) {
            vm.extraResultButtonIsEnabled = FeatureService.extraResultButtonIsEnabled;
            vm.extraResultButton = FeatureService.extraResultButtonCallBack;
            vm.resultButtonText = FeatureService.resultButtonText;
        });

        $scope.$watch(function () {
            return FeatureService.extraResultButtonConditionCallBack();
        }, function (newValue, oldValue) {
            // console.log(newValue, oldValue, "ZZZZZZZZZZZZZZZZZZZZZ");
            vm.extraResultButtonIsEnabled = newValue;
        });
        vm.extraResultButtonIsEnabled = FeatureService.extraResultButtonIsEnabled;
        vm.extraResultButton = FeatureService.extraResultButtonCallBack;
        vm.resultButtonText = FeatureService.resultButtonText;
    });
    theController.$inject = ['$scope', 'ResultsData', 'map', 'SearchService', 'MapData', 'FeatureService', '$modal', 'GeometryService'];
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    var theController = module.controller('searchSelectedController', function ($scope, ResultsData, MapData, SearchService, GeometryService, $modal, FeatureService, map) {
        var vm = this;
        vm.selectedResult = null;
        vm.prevResult = null;
        vm.nextResult = null;
        vm.props = [];
        vm.mobile = L.Browser.mobile;

        $scope.$watch(function () {
            return ResultsData.SelectedFeature;
        }, function (newVal, oldVal) {
            if (oldVal && oldVal != newVal && oldVal.mapItem) {
                // there must be an oldval and it must not be the newval and it must have an mapitem (to dehighlight)
                if (oldVal.mapItem.isBufferedItem) {
                    MapData.SetStyle(oldVal.mapItem, Style.COREBUFFER, L.AwesomeMarkers.icon({ icon: 'fa-circle-o', markerColor: 'lightgreen' }));
                } else {
                    var myicon = L.icon({
                        iconUrl: 'bower_components/leaflet/dist/images/marker-icon.png',
                        iconRetinaUrl: 'bower_components/leaflet/dist/images/marker-icon-2x.png',
                        shadowUrl: 'bower_components/leaflet/dist/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        tooltipAnchor: [16, -28],
                        shadowSize: [41, 41]
                    });
                    if (oldVal.theme.Type !== 'wms') {
                        MapData.SetStyle(oldVal.mapItem, Style.DEFAULT, myicon);
                    }
                }
            }
            if (newVal) {
                if (newVal.mapItem && newVal.theme.Type !== 'wms') {
                    var myicon = L.AwesomeMarkers.icon({
                        icon: 'fa-dot-circle-o',
                        markerColor: 'red'
                    });
                    MapData.SetStyle(newVal.mapItem, Style.HIGHLIGHT, myicon);
                }
                vm.selectedResult = newVal;
                var item = Object.getOwnPropertyNames(newVal.properties).map(function (k) {
                    return { key: k, value: newVal.properties[k] };
                });
                if (newVal.theme.Type !== 'wms') {
                    var geo = Object.getOwnPropertyNames(newVal.geometry).map(function (k) {
                        return { key: k, value: newVal.geometry[k] };
                    });
                }

                vm.props = item;
                if (newVal.theme.Type !== 'wms') {
                    //Pushing both seperately
                    vm.props.push(geo[0]);
                    vm.props.push(geo[1]);
                }
                vm.prevResult = SearchService.GetPrevResult();
                vm.nextResult = SearchService.GetNextResult();
            } else {
                vm.selectedResult = null;
                vm.prevResult = null;
                vm.nextResult = null;
            }
        });
        vm.toonFeatureOpKaart = function () {
            if (vm.selectedResult.theme.Type === 'esri') {
                MapData.PanToFeature(vm.selectedResult.mapItem);
            } else {
                // wms we go to the last identifybounds
                MapData.GoToLastClickBounds();
            }
        };
        vm.volgende = function () {
            console.log(ResultsData.SelectedFeature);
            ResultsData.SelectedFeature = vm.nextResult;
        };
        vm.vorige = function () {
            ResultsData.SelectedFeature = vm.prevResult;
        };
        vm.buffer = 1;
        vm.doordruk = function () {
            MapData.ExtendedType = null;
            console.log(ResultsData.SelectedFeature);
            ResultsData.SelectedFeature.mapItem.toGeoJSON().features.forEach(function (feature) {
                GeometryService.Doordruk(feature);
            });
        };
        vm.buffer = function () {
            MapData.ExtendedType = null;
            MapData.CleanDrawings();
            MapData.CleanBuffer();
            MapData.SetDrawLayer(ResultsData.SelectedFeature.mapItem);
            var bufferInstance = $modal.open({
                templateUrl: 'templates/search/bufferTemplate.html',
                controller: 'BufferController',
                resolve: {
                    backdrop: false,
                    keyboard: true
                }
            });
            bufferInstance.result.then(function (returnobj) {
                ResultsData.SelectedFeature.mapItem.toGeoJSON().features.forEach(function (feature) {
                    GeometryService.Buffer(feature, returnobj.buffer, returnobj.layer);
                });
            }, function (obj) {
                console.log('Modal dismissed at: ' + new Date()); // The contoller is closed by the use of the $dismiss call
            });
        };
        vm.exportToCSV = function () {
            SearchService.ExportOneToCSV(vm.selectedResult);
        };
        vm.delete = function () {
            var prev = SearchService.GetPrevResult();
            var next = SearchService.GetNextResult();
            SearchService.DeleteFeature(vm.selectedResult);
            if (next) {
                ResultsData.SelectedFeature = next;
            } else if (prev) {
                ResultsData.SelectedFeature = prev;
            } else {
                ResultsData.SelectedFeature = null;
            }
        };
        vm.close = function (feature) {
            vm.selectedResult = null;
            vm.prevResult = null;
            vm.nextResult = null;
            ResultsData.SelectedFeature = null;
        };
        vm.exportToCSVButtonIsEnabled = FeatureService.exportToCSVButtonIsEnabled;
        $scope.$watch(function () {
            return FeatureService.exportToCSVButtonIsEnabled;
        }, function (newValue, oldValue) {
            vm.exportToCSVButtonIsEnabled = newValue;
        });
    });
    theController.$inject = ['$scope', 'ResultsData', 'GeometryService', '$modal', 'FeatureService', 'map'];
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchAdvanced', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchAdvancedTemplate.html',
            controller: 'searchAdvancedController',
            controllerAs: 'srchadvctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearch', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchTemplate.html',
            controller: 'searchController',
            controllerAs: 'srchctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('searchOperations', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchOperationsTemplate.html',
            controller: 'searchOperationsController',
            controllerAs: 'srchoprnctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchResults', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchResultsTemplate.html',
            controller: 'searchResultsController',
            controllerAs: 'srchrsltsctrl'
        };
    });
})();
;'use strict';

(function (module) {
    module = angular.module('tink.gis');
    module.directive('tinkSearchSelected', function () {
        return {
            // restrict: 'E',
            replace: true,
            templateUrl: 'templates/search/searchSelectedTemplate.html',
            controller: 'searchSelectedController',
            controllerAs: 'srchslctdctrl'
        };
    });
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var data = function data() {
        var _data = {};
        _data.SelectedFeature = null;
        _data.JsonFeatures = [];
        _data.RequestCompleted = 0;
        _data.RequestStarted = 0;
        _data.GetRequestPercentage = function () {
            var percentage = Math.round(_data.RequestCompleted / _data.RequestStarted * 100);
            if (isNaN(percentage)) {
                percentage = 100; // if something went wrong there is no point in sending back 0 lets just send back 100
            }
            return percentage;
        };
        _data.EmptyResult = false;
        _data.CleanSearch = function () {
            _data.SelectedFeature = null;
            _data.JsonFeatures.length = 0;
            _data.RequestStarted = _data.RequestStarted - _data.RequestCompleted;
            _data.RequestCompleted = 0;
        };
        return _data;
    };
    module.factory('ResultsData', data);
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service($rootScope, MapData, MapService, PopupService, $q, UIService) {
        var _service = {};
        $rootScope.attribute = null;
        $rootScope.operations = [];
        $rootScope.query = "";
        $rootScope.selectedLayer = null;
        $rootScope.operators = ['=', '<>', '<', '>', '<=', '>=', 'LIKE', 'NOT LIKE']; //Misschien betere oplossing? Doorgeven?
        $rootScope.autoComplete = [];

        _service.newOrOperation = function () {
            $rootScope.$broadcast('orOperation');
        };

        _service.newAddOperation = function () {
            $rootScope.$broadcast('addOperation');
        };

        $rootScope.$on('addedOperation', function (event, data) {
            $rootScope.operations = data;
            $rootScope.$broadcast('queryOperationUpdated', $rootScope.operations);
        });

        $rootScope.$on('deleteOperation', function () {
            $rootScope.$emit('deleteOperation');
        });

        $rootScope.$on('alteredOperation', function () {
            $rootScope.$emit('alteredOperation');
        });

        _service.UpdateFields = function (layer) {
            $rootScope.selectedLayer = layer;
            $rootScope.$broadcast('updateFields', layer);
        };

        var checkOperator = function checkOperator(value) {
            var returnValue = "";
            if (value.operator == 'LIKE' || value.operator == 'NOT LIKE') {
                returnValue += value.operator + " \'%" + value.value + "%\' ";
            } else {
                returnValue += value.operator + " \'" + value.value + "\' ";
            }
            return returnValue;
        };

        _service.BuildQuery = function (layer) {
            $rootScope.query = ""; //init
            $rootScope.query += "FROM " + layer; //always remains the same

            angular.forEach($rootScope.operations, function (value, key) {
                if (value.addition == null) {
                    $rootScope.query += " WHERE " + value.attribute.name + " " + checkOperator(value);
                } else {
                    $rootScope.query += value.addition + " " + value.attribute.name + " " + checkOperator(value);
                }
            });

            $rootScope.$broadcast('queryBuild', $rootScope.query);
        };

        _service.UpdateQuery = function (query) {

            $rootScope.query = query;

            $rootScope.$broadcast('queryBuild', $rootScope.query);
        };

        _service.ExecuteQuery = function (layer, query) {
            MapService.AdvancedQuery(layer, query);
            MapData.ShowDrawControls = false;
            MapData.ActiveInteractieKnop = ActiveInteractieButton.NIETS;
        };

        _service.TranslateOperations = function (operations) {
            var query = '';
            operations.forEach(function (operation) {
                if (operation.addition != null) {
                    query += ' ' + operation.addition + ' (';
                }
                query += operation.attribute.name + ' ';
                query += _service.HandleOperator(operation);
                if (operation.addition != null) {
                    query += ')';
                }
            });
            return query;
        };

        _service.HandleOperator = function (operation) {
            if (operation.value.toString().contains("'")) {
                operation.value = operation.value.toString().substring(1).slice(0, -1);
            }
            switch (operation.operator) {
                case 'LIKE' || 'NOT LIKE':
                    if (!operation.value.contains('%')) {
                        return operation.operator + ' \'%' + operation.value + '%\'';
                    }
                default:
                    return operation.operator + ' \'' + operation.value + '\'';
            }
        };

        _service.MakeNewRawQuery = function (rawQuery) {
            var whereIndex = rawQuery.indexOf("WHERE");
            var beforeWhere = rawQuery.substring(0, whereIndex);
            this.GetLayerIdIfValid(beforeWhere);
            var newQuery = rawQuery.substring(whereIndex);
            newQuery = newQuery.replace("WHERE ", "");
            return { layer: $rootScope.selectedLayer,
                query: newQuery
            };
        };

        _service.GetLayerIdIfValid = function (layerstring) {
            $rootScope.selectedLayer = null;
            MapData.VisibleLayers.forEach(function (layer) {
                if (layerstring.contains(layer.name)) {
                    $rootScope.selectedLayer = layer;
                }
            });
            if (!$rootScope.selectedLayer) {
                PopupService.Warning("Laag niet gevonden", "Kijk na of u de laag juist heeft geschreven of deze laag in de selectie van lagen zit");
            }
            return $rootScope.selectedLayer;
        };

        _service.IsLayerField = function (currentLayer, fieldname) {
            var isLayerField = false;
            currentLayer.fields.forEach(function (field) {
                if (field.name == fieldname) {
                    isLayerField = true;
                }
            });
            return isLayerField;
        };

        _service.GetLayerField = function (currentLayer, fieldname, line) {
            var selectedField = null;

            currentLayer.fields.forEach(function (field) {
                if (field.name == fieldname) {
                    selectedField = field;
                    selectedField.$$hashKey = currentLayer.$$hashKey;
                }
            });
            if (selectedField == null) {
                var tmpOp = $rootScope.operations[line];
                return tmpOp.attribute;
            }
            return selectedField;
        };

        _service.BuildAutoCompleteQuery = function (val, index) {
            if ($rootScope.operations.length != 0) {
                var op = $rootScope.operations[index];
                var query = "";
                if (val == "") {
                    query = op.attribute.name + " is not null";
                } else {
                    query = op.attribute.name + " like '%" + val + "%'";
                }
                return { layer: $rootScope.selectedLayer,
                    attribute: op.attribute,
                    query: query
                };
            } else {
                return {};
            }
        };

        _service.IsOperator = function (element) {
            var isOperator = false;
            $rootScope.operators.forEach(function (operator) {
                if (operator == element) {
                    isOperator = true;
                }
            });
            return isOperator;
        };

        return _service;
    };
    module.factory("SearchAdvancedService", service);
    module.$inject = ['$rootScope', 'MapService', 'PopupService', '$q', 'UIService'];
})();
;'use strict';

(function () {
    var module = angular.module('tink.gis');
    var service = function service(ResultsData, map) {
        var _service = {};
        _service.DeleteFeature = function (feature) {
            var featureOfArray = ResultsData.JsonFeatures.find(function (x) {
                return x.layerName == feature.layerName && x.id == feature.id;
            });
            var featureIndex = ResultsData.JsonFeatures.indexOf(featureOfArray);
            if (featureIndex > -1) {
                if (featureOfArray.mapItem) {
                    map.removeLayer(featureOfArray.mapItem);
                }
                ResultsData.JsonFeatures.splice(featureIndex, 1);
            }
        };
        _service.DeleteFeatureGroup = function (featureGroupName) {
            var toDelFeatures = [];
            ResultsData.JsonFeatures.forEach(function (feature) {
                if (feature.layerName === featureGroupName) {
                    toDelFeatures.push(feature);
                }
            });
            toDelFeatures.forEach(function (feat) {
                _service.DeleteFeature(feat);
            });
        };
        _service.ExportToCSV = function () {
            var csvContent = "",
                dataString = "",
                layName = "";
            csvContent += 'sep=;\n';
            csvContent += 'Laag;\n';
            _.sortBy(ResultsData.JsonFeatures, function (x) {
                return x.layerName;
            }).forEach(function (feature, index) {
                if (layName !== feature.layerName) {
                    layName = feature.layerName.replace(';', ',');
                    var tmparr = [];
                    for (var name in feature.properties) {
                        tmparr.push(name.replace(';', ','));
                    }
                    //adding geometry fields
                    tmparr.push("TYPE");
                    tmparr.push("Geometry");
                    var layfirstline = tmparr.join(";");

                    csvContent += layName + ";" + layfirstline + '\n';
                }
                var infoArray = _.values(feature.properties);
                //adding geometry field values
                infoArray.push(feature.geometry.type);
                infoArray.push(feature.geometry.coordinates);
                infoArray.unshift(layName);
                dataString = infoArray.join(";");
                console.log(dataString);
                // csvContent += dataString + "\n";
                csvContent += index < ResultsData.JsonFeatures.length ? dataString + '\n' : dataString;
            });
            var a = document.createElement('a');
            a.href = 'data:attachment/csv,' + escape(csvContent);
            a.target = '_blank';
            a.download = 'exportsik.csv';

            document.body.appendChild(a);
            a.click();
        };
        _service.ExportOneToCSV = function (result) {
            var props = Object.getOwnPropertyNames(result.properties).map(function (k) {
                return { key: k, value: result.properties[k] };
            });
            var geo = Object.getOwnPropertyNames(result.geometry).map(function (k) {
                return { key: k, value: result.geometry[k] };
            });
            //Pushing both seperately
            props.push(geo[0]);
            props.push(geo[1]);
            var csvContent = "",
                dataString = "",
                layName = "";
            csvContent += 'sep=;\n';
            csvContent += 'Laag;' + result.layerName + '\n';
            props.forEach(function (prop) {
                if (prop.key) {
                    prop.key = prop.key.toString().replace(';', ',');
                }
                if (prop.value) {
                    prop.value = prop.value.toString().replace(';', ',');
                }
                csvContent += prop.key + ';' + prop.value + '\n';
            });
            var a = document.createElement('a');
            a.href = 'data:attachment/csv,' + escape(csvContent);
            a.target = '_blank';
            a.download = 'exportsik.csv';

            document.body.appendChild(a);
            a.click();
        };
        _service.GetNextResult = function () {
            var index = ResultsData.JsonFeatures.indexOf(ResultsData.SelectedFeature);
            var layerName = ResultsData.SelectedFeature.layerName;
            if (index < ResultsData.JsonFeatures.length - 1) {
                // check for nextResult exists
                var nextItem = ResultsData.JsonFeatures[index + 1];
                if (nextItem.layerName === layerName) {
                    return nextItem;
                }
            }
            return null;
        };
        _service.GetPrevResult = function () {
            var index = ResultsData.JsonFeatures.indexOf(ResultsData.SelectedFeature);
            var layerName = ResultsData.SelectedFeature.layerName;
            if (index > 0) {
                // check or prevResult exists
                var prevItem = ResultsData.JsonFeatures[index - 1];
                if (prevItem.layerName === layerName) {
                    return prevItem;
                }
            }
            return null;
        };

        return _service;
    };
    module.factory("SearchService", service);
})();
;// (function() {
//
//     'use strict';
//
//     var componentName = "ErrorHandler";
//     var theComponent = function(appService) {
//
//         function _handle(errorResponse) {
//
//             // ToDo : vervang onderstaande door eigen error handling, indien gewenst
//
//             var message = "fout bij call naar " + errorResponse.config.url + " (" + errorResponse.config.method + ") - " + errorResponse.status + " ";
//             if (errorResponse.data) {
//                 if (errorResponse.data.message)
//                     message += errorResponse.data.message;
//                 else
//                     message += errorResponse.statusText;
//             } else {
//                 message += errorResponse.statusText;
//             }
//             appService.logger.error(message);
//         }
//
//         function _getErrorMessage(errorResponse, defaultMessage) {
//             defaultMessage = defaultMessage || "unknown error";
//             if (errorResponse.data) {
//                 if (errorResponse.data.listOfHttpError) {
//                     if (errorResponse.data.listOfHttpError.message) {
//                         return errorResponse.data.listOfHttpError.message;
//                     } else {
//                         if (errorResponse.statusText)
//                             return errorResponse.statusText;
//                         else
//                             return defaultMessage;
//                     }
//                 } else {
//                     if (errorResponse.data.message) {
//                         return errorResponse.data.message;
//                     } else {
//                         if (errorResponse.statusText)
//                             return errorResponse.statusText;
//                         else
//                             return defaultMessage;
//                     }
//                 }
//             } else {
//                 if (errorResponse.statusText)
//                     return errorResponse.statusText;
//                 else
//                     return defaultMessage;
//             }
//         }
//
//         /* +++++ public interface +++++ */
//
//         appService.logger.creation(componentName);
//
//         return {
//             handle: _handle,
//             getErrorMessage: _getErrorMessage,
//         };
//
//     };
//
//     theComponent.$inject = ['AppService'];
//
//     angular.module('tink.gis').factory(componentName, theComponent);
//
// })();
"use strict";
;'use strict';

L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

    // onAdd: function(map) {
    //     // Triggered when the layer is added to a map.
    //     //   Register a click listener, then do all the upstream WMS things
    //     L.TileLayer.WMS.prototype.onAdd.call(this, map);
    //     map.on('click', this.getFeatureInfo, this);
    // },

    // onRemove: function(map) {
    //     // Triggered when the layer is removed from a map.
    //     //   Unregister a click listener, then do all the upstream WMS things
    //     L.TileLayer.WMS.prototype.onRemove.call(this, map);
    //     map.off('click', this.getFeatureInfo, this);
    // },

    getFeatureInfo: function getFeatureInfo(latlng, layers, requestype) {
        // Make an AJAX request to the server and hope for the best
        var GisHelperService = angular.element(document.body).injector().get('GisHelperService');
        var url = this.getFeatureInfoUrl(latlng, layers, requestype);
        url = GisHelperService.CreateProxyUrl(url);

        var prom = $.ajax({
            url: url,
            transformResponse: function transformResponse(data) {
                if (data) {
                    // data = GisHelperService.UnwrapProxiedData(data);
                }
                return data;
            },
            success: function success(data, status, xhr) {
                // console.log(returnjson);
            },
            error: function error(xhr, status, _error) {
                // showResults(error);
            }
        });
        return prom;
    },

    getFeatureInfoUrl: function getFeatureInfoUrl(latlng, layers, requestype) {
        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: this.wmsParams.styles,
            transparent: this.wmsParams.transparent,
            version: this.wmsParams.version,
            format: this.wmsParams.format,
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: layers,
            query_layers: layers,
            buffer: 100,
            info_format: requestype
        };

        params[params.version === '1.3.0' ? 'i' : 'x'] = Math.floor(point.x);
        params[params.version === '1.3.0' ? 'j' : 'y'] = Math.floor(point.y);

        return this._url + L.Util.getParamString(params, this._url, true);
    }

    // showGetFeatureInfo: function(err, latlng, content) {
    //     if (err) { console.log(err); return; } // do nothing if there's an error

    //     // Otherwise show the content in a popup, or something.
    //     L.popup({ maxWidth: 800 })
    //         .setLatLng(latlng)
    //         .setContent(content)
    //         .openOn(this._map);
    // }
});

L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);
};
;'use strict';

L.drawVersion = '0.3.0-dev';

L.drawLocal = {
    draw: {
        toolbar: { actions: {
                title: 'Tekenen annuleren',
                text: 'Annuleren'
            },
            finish: {
                title: 'Tekenen beëindigen',
                text: 'Tekenen beëindigen'
            },
            undo: {
                title: 'Verwijder laatst getekende punt',
                text: 'Verwijder laatste punt'
            },
            buttons: {
                polyline: 'Teken een lijn',
                polygon: 'Teken een veelhoek',
                rectangle: 'Teken een rechthoek',
                circle: 'Teken een cirkel',
                marker: 'Teken een markering'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: 'Klik en sleep om een cirkel te tekenen.'
                },
                radius: 'Straal'
            },
            marker: {
                tooltip: {
                    start: 'Klik om een markering te plaatsen.'
                }
            },
            polygon: {
                tooltip: {
                    start: 'Klik om een veelhoek  te tekenen.',
                    cont: 'Klik om de veelhoek verder te tekenen.',
                    end: 'Klik op het eerste punt om de veelhoek te sluiten.'
                }
            },
            polyline: {
                error: '<strong>Error:</strong> figuur randen mogen niet kruisen!',
                tooltip: {
                    start: 'Klik om een lijn te tekenen.',
                    cont: 'Klik om de lijn verder te tekenen.',
                    end: 'Klik op het laatste punt om de lijn af te sluiten.'
                }
            },
            rectangle: {
                tooltip: {
                    start: 'Klik en sleep om een rechthoek te tekenen.'
                }
            },
            simpleshape: {
                tooltip: {
                    end: 'Laat de muis los om het tekenen te beëindigen.'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Aanpassingen bewaren.',
                    text: 'Bewaren'
                },
                cancel: {
                    title: 'Tekenen annuleren, aanpassingen verwijderen.',
                    text: 'Annuleren'
                }
            },
            buttons: {
                edit: 'Lagen bewerken.',
                editDisabled: 'Geen lagen om te bewerken.',
                remove: 'Lagen verwijderen.',
                removeDisabled: 'Geen lagen om te verwijderen.'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Versleep ankerpunt of markering om het object aan te passen.',
                    subtext: 'Klink Annuleer om de aanpassingen ongedaan te maken.'
                }
            },
            remove: {
                tooltip: {
                    text: 'Klik op object om te verwijderen'
                }
            }
        }
    }
};
;'use strict';

(function (module) {

    module = angular.module('tink.gis');
    module.factory('RecursionHelper', ['$compile', function ($compile) {
        return {
            /**
             * Manually compiles the element, fixing the recursion loop.
             * @param element
             * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
             * @returns An object containing the linking functions.
             */
            compile: function compile(element, link) {
                // Normalize the link parameter
                if (angular.isFunction(link)) {
                    link = { post: link };
                }

                // Break the recursion loop by remosving the contents
                var contents = element.contents().remove();
                var compiledContents;
                return {
                    pre: link && link.pre ? link.pre : null,
                    /**
                     * Compiles and re-adds the contents
                     */
                    post: function post(scope, element) {
                        // Compile the contents
                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }
                        // Re-add the compiled contents to the element
                        compiledContents(scope, function (clone) {
                            element.append(clone);
                        });

                        // Call the post-linking function, if any
                        if (link && link.post) {
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }]);
})();
;angular.module('tink.gis').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/external/streetView.html',
    "<html>\n" +
    "<head>\n" +
    "<meta charset=utf-8>\n" +
    "<title>Street View side-by-side</title>\n" +
    "<style>\n" +
    "html, body {\r" +
    "\n" +
    "        height: 100%;\r" +
    "\n" +
    "        margin: 0;\r" +
    "\n" +
    "        padding: 0;\r" +
    "\n" +
    "      }\r" +
    "\n" +
    "      #map,  {\r" +
    "\n" +
    "        float: left;\r" +
    "\n" +
    "        height: 0%;\r" +
    "\n" +
    "        width: 0%;\r" +
    "\n" +
    "      }\r" +
    "\n" +
    "       #pano {\r" +
    "\n" +
    "        float: left;\r" +
    "\n" +
    "        height: 100%;\r" +
    "\n" +
    "        width: 100%;\r" +
    "\n" +
    "      }\n" +
    "</style>\n" +
    "</head>\n" +
    "<body>\n" +
    "<div id=map></div>\n" +
    "<div id=pano></div>\n" +
    "<script>\n" +
    "function initialize() {\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        var urlLat = parseFloat((location.search.split('lat=')[1]||'').split('&')[0]);\r" +
    "\n" +
    "        var urlLng = parseFloat((location.search.split('lng=')[1]||'').split('&')[0]);\r" +
    "\n" +
    "        var fenway = {lat:urlLat, lng: urlLng};\r" +
    "\n" +
    "        var map = new google.maps.Map(document.getElementById('map'), {\r" +
    "\n" +
    "          center: fenway,\r" +
    "\n" +
    "          zoom: 14\r" +
    "\n" +
    "        });\r" +
    "\n" +
    "        var panorama = new google.maps.StreetViewPanorama(\r" +
    "\n" +
    "            document.getElementById('pano'), {\r" +
    "\n" +
    "              position: fenway,\r" +
    "\n" +
    "              pov: {\r" +
    "\n" +
    "                heading: 34,\r" +
    "\n" +
    "                pitch: 10\r" +
    "\n" +
    "              }\r" +
    "\n" +
    "            });\r" +
    "\n" +
    "        map.setStreetView(panorama);\r" +
    "\n" +
    "      }\n" +
    "</script>\n" +
    "<script async defer src=\"https://maps.googleapis.com/maps/api/js?callback=initialize\">\n" +
    "</script>\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('templates/layermanagement/geoPuntTemplate.html',
    "<div class=\"gepoPuntTemplate row relative-container flex-grow-1\">\n" +
    "<div class=\"col-xs-4 flex-column flex-grow-1 margin-top margin-bottom border-right\">\n" +
    "<div ng-show=\"loading == false\" class=\"overflow-wrapper flex-grow-1 list-selectable margin-top margin-bottom\">\n" +
    "<div ng-if=\"geopuntError === true\">\n" +
    "<p>De geopunt service(s) die u probeert te bevragen zijn (tijdelijk) niet bereikbaar.</p>\n" +
    "<p>Indien dit probleem zich blijft voordoen, gelieve dit <a href=# ng-click=reportError()>hier</a> te melden.</p>\n" +
    "</div>\n" +
    "<div ng-if=!searchIsUrl ng-repeat=\"theme in availableThemes\">\n" +
    "<dl ng-class=\"{active: isActive(theme)}\" ng-class=\"{'not-allowed': theme.Type != 'wms' &&  theme.Type != 'esri'}\">\n" +
    "<a href=# class=theme-layer ng-click=geopuntThemeChanged(theme)>\n" +
    "<dt>{{theme.Naam}}</dt>\n" +
    "</a>\n" +
    "<i ng-if=\"theme.Added == true\" class=\"fa fa-check-circle\"></i>\n" +
    "<i ng-if=\"theme.Added == null\" class=\"fa fa-check-circle-o\"></i>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"loading == false\">\n" +
    "<tink-pagination ng-hide=\"numberofrecordsmatched <= 5\" tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div ng-if=\"loading == true\" class=loader>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-8 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<preview-layer ng-show=\"themeloading == false\" class=margin-top ng-if=copySelectedTheme addorupdatefunc=AddOrUpdateTheme() theme=copySelectedTheme>\n" +
    "</preview-layer>\n" +
    "<div ng-if=error>\n" +
    "{{error}}\n" +
    "</div>\n" +
    "<div class=loader ng-show=\"themeloading == true\"></div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/layermanagement/layerManagerTemplate.html',
    "<div class=\"layermanagerTemplate modal-header\">\n" +
    "<div class=\"row margin-bottom\">\n" +
    "<div class=col-xs-10>\n" +
    "<h4>Zoeken in geodata</h4>\n" +
    "</div>\n" +
    "<div class=col-xs-2>\n" +
    "<button class=\"close pull-right\" type=button data-ng-click=cancel()></button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-body height-lg width-lg flex-column flex-grow-1\">\n" +
    "<div class=\"row margin-top margin-bottom\">\n" +
    "<div class=\"col-xs-12 col-sm-6\">\n" +
    "<form>\n" +
    "<input auto-focus type=search ng-keydown=\"$event.keyCode === 13 && enterPressed()\" ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 100}\" placeholder=\"Geef een trefwoord in (minimum 3 tekens)\">\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "<ul class=nav-tabs>\n" +
    "<li role=presentation ng-class=\"{'active': active=='solr'}\"><a href=\"\" ng-click=\"active='solr'\">Stad <span ng-if=\"solrLoading==true\" class=loader></span><span ng-if=\"solrLoading==false && solrCount != null\">({{solrCount}})</span></a></li>\n" +
    "<li ng-show=!mobile role=presentation ng-class=\"{'active': active=='geopunt'}\"><a href=\"\" ng-click=\"active='geopunt'\">GeoPunt <span ng-if=\"geopuntLoading==true\" class=loader></span><span ng-if=\"geopuntLoading==false && geopuntCount != null\">({{geopuntCount}})</span></a></li>\n" +
    "<li role=presentation class=pull-right ng-class=\"{'active': active=='beheer'}\"><a href=\"\" ng-click=\"active='beheer'\">Lagenbeheer</a></li>\n" +
    "<li ng-show=!mobile role=presentation class=pull-right ng-class=\"{'active': active=='wmsurl'}\"><a href=\"\" ng-click=\"active='wmsurl'\">URL ingeven</a></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<solr-gis ng-show=\"active=='solr'\"></solr-gis>\n" +
    "<geo-punt ng-show=\"active=='geopunt'\"></geo-punt>\n" +
    "<wms-url ng-show=\"active=='wmsurl'\"></wms-url>\n" +
    "<layers-management ng-if=\"active=='beheer'\"></layers-management></div>"
  );


  $templateCache.put('templates/layermanagement/layersManagementTemplate.html',
    "<div class=\"layersManagementTemplate row relative-container flex-grow-1\">\n" +
    "<div class=\"col-xs-4 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<div class=\"overflow-wrapper flex-grow-1 list-selectable margin-top margin-bottom border-right\">\n" +
    "<div ng-repeat=\"theme in availableThemes | filter:{name: searchTerm}\">\n" +
    "<dl ng-class=\"{active: isActive(theme)}\">\n" +
    "<a href=# class=theme-layer ng-click=ThemeChanged(theme)>\n" +
    "<dt>{{theme.name}}<button class=\"trash pull-right\" prevent-default ng-click=delTheme(theme)></button>\n" +
    "</dt>\n" +
    "</a>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-8 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<preview-layer ng-if=copySelectedTheme theme=copySelectedTheme addorupdatefunc=AddOrUpdateTheme()>\n" +
    "</preview-layer>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/layermanagement/managementLayerTemplate.html',
    "<div ng-if=lyrctrl.layer.hasLayers>\n" +
    "<div class=\"layercontroller-checkbox managementLayerTemplate\">\n" +
    "<div class=can-open ng-class=\"{'open': showLayer}\">\n" +
    "<input indeterminate-checkbox child-list=lyrctrl.layer.AllLayers property=enabled type=checkbox ng-model=lyrctrl.layer.enabled id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>\n" +
    "<label for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}> {{lyrctrl.layer.title | limitTo: 99}}</label>\n" +
    "<span class=show-layer ng-click=\"showLayer = !showLayer\"></span>\n" +
    "</div>\n" +
    "<div ng-show=showLayer ng-repeat=\"lay in lyrctrl.layer.Layers\">\n" +
    "<tink-managementlayer layer=lay>\n" +
    "</tink-managementlayer>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=!lyrctrl.layer.hasLayers>\n" +
    "<div class=\"layercontroller-checkbox managementLayerTemplate\">\n" +
    "<input type=checkbox ng-model=\"lyrctrl.layer.enabled \" id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>\n" +
    "<label for=\"{{lyrctrl.layer.name}}{{lyrctrl.layer.id}} \"> {{lyrctrl.layer.title | limitTo: 99}}</label>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/layermanagement/previewLayerTemplate.html',
    "<div class=\"previewLayerTemplate flex-column flex-grow-1\">\n" +
    "<div class=margin-top>\n" +
    "<p>{{theme.Description}}</p>\n" +
    "<p><small><a ng-href={{theme.cleanUrl}} target=_blank>Details</a></small></p>\n" +
    "</div>\n" +
    "<div class=\"layercontroller-checkbox overflow-wrapper margin-bottom flex-grow-1\">\n" +
    "<input indeterminate-checkbox child-list=theme.AllLayers property=enabled type=checkbox ng-model=theme.enabled id={{theme.name}}>\n" +
    "<label for={{theme.name}}>{{theme.name}}</label>\n" +
    "<div ng-repeat=\"mainlayer in theme.Layers\">\n" +
    "<tink-managementlayer layer=mainlayer></tink-managementlayer>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=text-align-right ng-show=\"theme !== null\">\n" +
    "<button class=\"btn-sm btn-primary\" ng-if=\"theme.Added == false\" ng-disabled=!theme.enabled ng-click=addorupdatefunc()>Toevoegen</button>\n" +
    "<button class=btn-sm ng-if=\"theme.Added != false\" ng-click=addorupdatefunc()>Bijwerken</button>\n" +
    "<button class=btn-sm ng-if=\"theme.Added != false\" ng-click=delTheme()>Verwijderen</button>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/layermanagement/solrGISTemplate.html',
    "<div class=\"solrGISTemplate row relative-container flex-grow-1\">\n" +
    "<div class=\"col-xs-5 flex-column flex-grow-1\">\n" +
    "<div class=\"overflow-wrapper flex-grow-1 list-selectable margin-top margin-bottom border-right\">\n" +
    "<div ng-show=\"loading == false\" ng-repeat=\"theme in availableThemes\">\n" +
    "<dl ng-class=\"{active: isActive(theme)}\">\n" +
    "<dt>\n" +
    "<a href=# class=theme-layer ng-click=solrThemeChanged(theme)>\n" +
    "{{theme.name}} <i ng-if=\"theme.cleanUrl.toLowerCase().includes('p_sik')\" class=\"fa fa-key\" aria-hidden=true tink-tooltip=\"Secured mapservice\" tink-tooltip-align=right></i>\n" +
    "</a>\n" +
    "</dt>\n" +
    "<dd ng-repeat=\"layer in theme.layers\">\n" +
    "<a href=# class=theme-layer ng-click=\"solrThemeChanged(theme, layer.naam)\">\n" +
    "<span>{{layer.naam}}\n" +
    "<span ng-show=\"layer.featuresCount > 0\"> ({{layer.featuresCount}})</span>\n" +
    "</span>\n" +
    "<div class=featureinsolr>\n" +
    "{{layer.features.join(', ')}}\n" +
    "</div>\n" +
    "</a>\n" +
    "</dd>\n" +
    "</dl>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-show=\"loading == false\">\n" +
    "<tink-pagination ng-hide=\"numberofrecordsmatched <= 5\" tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div ng-if=\"loading == true\" class=loader>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-7 flex-column flex-grow-1\">\n" +
    "<preview-layer ng-if=copySelectedTheme theme=copySelectedTheme addorupdatefunc=AddOrUpdateTheme()>\n" +
    "</preview-layer>\n" +
    "<div ng-if=error>\n" +
    "{{error}}\n" +
    "</div>\n" +
    "<div class=loader ng-show=\"themeloading == true\"></div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/layermanagement/wmsUrlTemplate.html',
    "<div class=\"wmsUrlTemplate row relative-container\">\n" +
    "<div class=\"col-xs-6 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<div>\n" +
    "<input class=searchbox ng-model=url ng-change=urlChanged() placeholder=\"Geef een wms url in\" style=width:100%>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-6 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<div>\n" +
    "<button ng-disabled=!urlIsValid ng-click=laadUrl()>Laad url</button>\n" +
    "</div>\n" +
    "<preview-layer ng-show=\"themeloading == false\" class=margin-top ng-if=copySelectedTheme addorupdatefunc=AddOrUpdateTheme() theme=copySelectedTheme>\n" +
    "</preview-layer>\n" +
    "<div ng-if=error>\n" +
    "{{error}}\n" +
    "</div>\n" +
    "<div class=loader ng-show=\"themeloading == true\"></div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/other/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" id=rightaside data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\">\n" +
    "<aside class=\"flex-column flex-grow-1\">\n" +
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>Lagenoverzicht</p>\n" +
    "</div>\n" +
    "<button ng-click=lyrsctrl.asidetoggle class=nav-right-toggle data-tink-sidenav-collapse=asideNavRight>\n" +
    "<a href=# title=\"Open menu\"><span class=sr-only>Open right menu</span></a>\n" +
    "</button>\n" +
    "<div class=\"flex-column flex-grow-1\">\n" +
    "<div class=layer-management ng-if=lyrsctrl.layerManagementButtonIsEnabled>\n" +
    "<div class=\"col-xs-12 margin-top margin-bottom\">\n" +
    "<button class=\"btn btn-primary btn-layermanagement center-block\" ng-click=lyrsctrl.Lagenbeheer()>Lagenbeheer</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"overflow-wrapper flex-grow-1 extra-padding\">\n" +
    "<ul class=ul-level id=sortableThemes ui-sortable=lyrsctrl.sortableOptions ng-model=lyrsctrl.themes>\n" +
    "<li class=li-item ng-repeat=\"theme in lyrsctrl.themes\">\n" +
    "<tink-theme theme=theme layercheckboxchange=lyrsctrl.updatethemevisibility(theme) hidedelete=!lyrsctrl.deleteLayerButtonIsEnabled>\n" +
    "</tink-theme>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</aside>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/other/layerTemplate.html',
    "<div ng-class=\"{'hidden-print': lyrctrl.layer.IsEnabledAndVisible == false}\">\n" +
    "<div ng-if=lyrctrl.layer.hasLayers>\n" +
    "<li class=\"li-item toc-item-without-icon can-open\" ng-class=\"{'open': showLayer}\">\n" +
    "<div>\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}{{lyrctrl.layer.theme.Naam}} ng-model=lyrctrl.layer.visible ng-change=layercheckboxchange(lyrctrl.layer.theme)>\n" +
    "<label title={{lyrctrl.layer.name}} for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}{{lyrctrl.layer.theme.Naam}}>{{lyrctrl.layer.name}}</label>\n" +
    "</div>\n" +
    "<div>\n" +
    "<span class=show-layer ng-click=\"showLayer = !showLayer\"></span>\n" +
    "</div>\n" +
    "</li>\n" +
    "<ul ng-show=showLayer ng-repeat=\"layer in lyrctrl.layer.Layers | filter :  { enabled: true }\">\n" +
    "<tink-layer layer=layer layercheckboxchange=layercheckboxchange(layer.theme)>\n" +
    "</tink-layer>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<li class=\"li-item toc-item-with-icon\" ng-if=!lyrctrl.layer.hasLayers>\n" +
    "<img class=layer-icon ng-if=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length===1\" class=layer-icon ng-src=\"{{lyrctrl.layer.legend[0].fullurl}} \">\n" +
    "<div class=can-open ng-class=\"{'open': showLayer2 || showMultiLegend}\">\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox ng-model=lyrctrl.layer.visible ng-change=layercheckboxchange(lyrctrl.layer.theme) id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}{{lyrctrl.layer.theme.Naam}}>\n" +
    "<label ng-class=\"{ 'greytext': lyrctrl.layer.displayed==false} \" for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}{{lyrctrl.layer.theme.Naam}} title={{lyrctrl.layer.title}}>{{lyrctrl.layer.title}}\n" +
    "<span class=\"hidden-print greytext\" ng-show=\"lyrctrl.layer.theme.Type=='wms' && lyrctrl.layer.queryable\"> <i class=\"fa fa-info\"></i></span>\n" +
    "</label>\n" +
    "<span style=color:#76b9f4 class=show-layer ng-show=\"lyrctrl.layer.theme.Type=='wms'\" ng-click=\"showLayer2 = !showLayer2\"></span>\n" +
    "<span style=color:#76b9f4 class=show-layer ng-show=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length>1\" ng-click=\"showMultiLegend = !showMultiLegend\"></span>\n" +
    "<ul ng-show=\"showMultiLegend && lyrctrl.layer.legend.length>1\" ng-repeat=\"legend in lyrctrl.layer.legend\" ng-class=\"{'open': showMultiLegend}\">\n" +
    "<img class=layer-icon ng-src=\"{{legend.fullurl}} \"><span>{{legend.label}}</span>\n" +
    "</ul>\n" +
    "<img class=normal-size ng-src={{lyrctrl.layer.legendUrl}} onerror=\"this.style.display='none'\" ng-show=showLayer2>\n" +
    "</div>\n" +
    "</li>\n" +
    "<ul class=li-item ng-if=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length>1\" ng-show=showLayer>\n" +
    "<li ng-repeat=\"legend in lyrctrl.layer.legend\">\n" +
    "<img style=\"width:20px; height:20px\" ng-src=\"{{legend.fullurl}} \"><span title={{legend.label}}>{{legend.label}}</span>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/mapTemplate.html',
    "<div class=tink-map>\n" +
    "<div class=\"margin-print-content hidden-print\">\n" +
    "</div>\n" +
    "<div class=print-content>\n" +
    "<div class=print-content-header>\n" +
    "<div class=col-xs-12>\n" +
    "<h4>Stad in kaart</h4>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=print-map>\n" +
    "<tink-search class=tink-search></tink-search>\n" +
    "<div id=map class=leafletmap>\n" +
    "<div class=map-buttons-left>\n" +
    "<div class=\"ll drawingbtns\" ng-show=mapctrl.showDrawControls>\n" +
    "<div class=btn-group>\n" +
    "<button ng-click=mapctrl.selectpunt() ng-class=\"{active: mapctrl.drawingType==''}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een punt\" tink-tooltip-align=bottom><i class=\"fa fa-circle\" style=\"font-size: 0.75em\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('lijn')\" ng-class=\"{active: mapctrl.drawingType=='lijn'}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een lijn\" tink-tooltip-align=bottom><i class=\"fa fa-minus\"></i></button>\n" +
    "<button ng-hide=mapctrl.mobile ng-click=\"mapctrl.drawingButtonChanged('vierkant')\" ng-class=\"{active: mapctrl.drawingType=='vierkant'}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een rechthoek\" tink-tooltip-align=bottom><i class=\"fa fa-square-o\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('polygon')\" ng-class=\"{active: mapctrl.drawingType=='polygon'}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een veelhoek\" tink-tooltip-align=bottom><i class=\"fa fa-star-o\"></i></button>\n" +
    "<button ng-click=mapctrl.selectAdvanced() ng-class=\"{active: mapctrl.drawingType=='zoeken'}\" type=button class=btn prevent-default-map tink-tooltip=\"Geavanceerde opzoeking\" tink-tooltip-align=bottom><i class=\"fa fa-search\"></i></button>\n" +
    "</div>\n" +
    "<div class=select>\n" +
    "<select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers()\" ng-model=mapctrl.selectedLayer ng-show=\"mapctrl.SelectableLayers().length > 1 && !mapctrl.mobile\" ng-change=mapctrl.layerChange() prevent-default-map></select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"btn-group btn-group-vertical ll interactiebtns\">\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('identify')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" tink-tooltip=Identificeren tink-tooltip-align=bottom prevent-default-map><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('select')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" tink-tooltip=Selecteren tink-tooltip-align=bottom prevent-default-map><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('meten')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='meten'}\" tink-tooltip=Meten tink-tooltip-align=bottom prevent-default-map>\n" +
    "<svg class=\"icon icon-sik-ruler\"><use xlink:href=#icon-sik-ruler></use></svg>\n" +
    "</button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('watishier')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='watishier'}\" tink-tooltip=\"Wat is hier\" tink-tooltip-align=bottom prevent-default-map>\n" +
    "<i class=\"fa fa-thumb-tack\"></i>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll kaarttypes\">\n" +
    "<button class=btn ng-class=\"{active: mapctrl.IsBaseMap1==true && mapctrl.IsBaseMapGeen==false}\" ng-click=mapctrl.toonBaseMap1() prevent-default-map>{{mapctrl.baseMap1Naam()}}</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.IsBaseMap2==true && mapctrl.IsBaseMapGeen==false}\" ng-click=mapctrl.toonBaseMap2() prevent-default-map>{{mapctrl.baseMap2Naam()}}</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll metenbtns\" ng-show=mapctrl.showMetenControls>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('afstand')\" ng-class=\"{active: mapctrl.drawingType=='afstand'}\" type=button tink-tooltip=\"Meten afstand\" tink-tooltip-align=bottom class=btn prevent-default-map>\n" +
    "<svg class=\"icon icon-sik-measure-line\"><use xlink:href=#icon-sik-measure-line></use></svg>\n" +
    "</button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('oppervlakte')\" ng-class=\"{active: mapctrl.drawingType=='oppervlakte'}\" type=button tink-tooltip=\"Meten oppervlakte en omtrek\" tink-tooltip-align=bottom class=btn prevent-default-map>\n" +
    "<svg class=\"icon icon-sik-measure-shape\"><use xlink:href=#icon-sik-measure-shape></use></svg>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll searchbtns\">\n" +
    "<button type=button class=\"btn tooltip-margin-left\" ng-class=\"{active: mapctrl.ZoekenOpLocatie==true}\" ng-click=mapctrl.fnZoekenOpLocatie() tink-tooltip=\"Zoeken naar locatie\" tink-tooltip-align=bottom prevent-default-map>\n" +
    "<svg class=\"icon icon-sik-location-search\"><use xlink:href=#icon-sik-location-search></use></svg>\n" +
    "</button>\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==false}\" ng-click=mapctrl.ZoekenInLagen() tink-tooltip=\"Zoeken binnen lagen\" tink-tooltip-align=bottom prevent-default-map>\n" +
    "<svg class=\"icon icon-sik-layers-search\"><use xlink:href=#icon-sik-layers-search></use></svg>\n" +
    "</button>\n" +
    "</div>\n" +
    "<form id=zoekbalken class=\"form-force-inline ll zoekbalken\">\n" +
    "<select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers()\" ng-model=mapctrl.selectedFindLayer ng-show=\"mapctrl.SelectableLayers().length > 1 && mapctrl.SelectableLayers()\" ng-change=mapctrl.findLayerChange() prevent-default-map></select>\n" +
    "<input type=search ng-show=\"mapctrl.ZoekenOpLocatie == false\" placeholder=\"Geef een zoekterm\" prevent-default-map ng-keyup=\"$event.keyCode == 13 && mapctrl.zoekLaag(mapctrl.laagquery)\" ng-model=mapctrl.laagquery>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=map-buttons-right>\n" +
    "<div class=\"btn-group btn-group-vertical ll viewbtns\">\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomIn() tink-tooltip=\"Zoom in\" tink-tooltip-align=left prevent-default-map>\n" +
    "<i class=\"fa fa-plus\"></i>\n" +
    "</button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomOut() tink-tooltip=\"Zoom uit\" tink-tooltip-align=left prevent-default-map>\n" +
    "<i class=\"fa fa-minus\"></i>\n" +
    "</button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomToGps() ng-class=\"{active: mapctrl.gpstracking==true}\" tink-tooltip=\"Huidige locatie\" tink-tooltip-align=left prevent-default-map>\n" +
    "<i class=\"fa fa-crosshairs\"></i>\n" +
    "</button>\n" +
    "</div>\n" +
    "<div class=\"ll loading\" ng-show=\"mapctrl.Loading > 0\">\n" +
    "<div class=loader></div> {{mapctrl.MaxLoading - mapctrl.Loading}}/ {{mapctrl.MaxLoading}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<tink-layers class=tink-layers></tink-layers>\n" +
    "</div>\n" +
    "<div class=print-content-footer>\n" +
    "<div class=col-xs-2>\n" +
    "<img class=print-corner-image src=https://www.antwerpen.be/assets/aOS/gfx/gui/a-logo.svg alt=\"Antwerpen logo\">\n" +
    "</div>\n" +
    "<div class=col-xs-8>\n" +
    "Voorbehoud: De kaart is een reproductie zonder juridische waarde. Zij bevat kaartmateriaal en info afkomstig van het stadsbestuur Antwerpen, IV, AAPD, Provinciebesturen en mogelijk nog andere organisaties.\n" +
    "</div>\n" +
    "<div class=col-xs-2>\n" +
    "<img class=\"print-corner-image pull-right\" src=http://images.vectorhq.com/images/previews/111/north-arrow-orienteering-137692.png alt=\"Noord pijl oriëntatielopen\">\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"margin-print-content hidden-print\">\n" +
    "</div>\n" +
    "<svg style=\"position: absolute; width: 0; height: 0; overflow: hidden\" version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink>\n" +
    "<defs>\n" +
    "<symbol id=icon-sik-file-csv viewBox=\"0 0 32 32\">\n" +
    "<title>sik-file-csv</title>\n" +
    "<path d=\"M4 0c-0.476 0-0.881 0.167-1.214 0.5s-0.5 0.738-0.5 1.214v28.571c0 0.476 0.167 0.881 0.5 1.214s0.738 0.5 1.214 0.5h24c0.476 0 0.881-0.167 1.214-0.5s0.5-0.738 0.5-1.214v-20.571c0-0.476-0.119-1-0.357-1.571s-0.524-1.024-0.857-1.357l-5.571-5.571c-0.333-0.333-0.786-0.619-1.357-0.857s-1.095-0.357-1.571-0.357h-16zM4.571 2.286h13.714v7.429c0 0.476 0.167 0.881 0.5 1.214s0.738 0.5 1.214 0.5h7.429v18.286h-22.857v-27.429zM20.571 2.429c0.345 0.119 0.589 0.25 0.732 0.393l5.589 5.589c0.143 0.143 0.274 0.387 0.393 0.732h-6.714v-6.714zM9.363 18.845c-0.995 0-1.798 0.328-2.409 0.984-0.611 0.653-0.916 1.57-0.916 2.753 0 1.118 0.304 2 0.911 2.646 0.607 0.643 1.383 0.964 2.326 0.964 0.762 0 1.391-0.187 1.885-0.562 0.498-0.378 0.853-0.955 1.066-1.73l-1.391-0.441c-0.12 0.52-0.317 0.901-0.591 1.144s-0.603 0.363-0.984 0.363c-0.517 0-0.937-0.191-1.26-0.572s-0.485-1.021-0.485-1.919c0-0.846 0.163-1.459 0.489-1.837 0.33-0.378 0.758-0.567 1.284-0.567 0.381 0 0.704 0.107 0.969 0.32 0.268 0.213 0.444 0.504 0.528 0.872l1.42-0.339c-0.162-0.569-0.404-1.005-0.727-1.309-0.543-0.514-1.249-0.771-2.118-0.771zM15.93 18.845c-0.546 0-1.013 0.082-1.401 0.247-0.384 0.165-0.68 0.405-0.887 0.722-0.204 0.313-0.305 0.651-0.305 1.013 0 0.562 0.218 1.039 0.654 1.43 0.31 0.278 0.85 0.512 1.619 0.703 0.598 0.149 0.981 0.252 1.149 0.31 0.246 0.087 0.417 0.191 0.514 0.31 0.1 0.116 0.15 0.258 0.15 0.426 0 0.262-0.118 0.491-0.354 0.688-0.233 0.194-0.58 0.291-1.042 0.291-0.436 0-0.783-0.11-1.042-0.33-0.255-0.22-0.425-0.564-0.509-1.032l-1.396 0.136c0.094 0.795 0.381 1.401 0.863 1.817 0.481 0.414 1.171 0.62 2.069 0.62 0.617 0 1.132-0.086 1.546-0.257 0.414-0.174 0.733-0.439 0.96-0.795s0.339-0.737 0.339-1.144c0-0.449-0.095-0.825-0.286-1.129-0.187-0.307-0.449-0.548-0.785-0.722-0.333-0.178-0.848-0.349-1.546-0.514s-1.137-0.323-1.318-0.475c-0.142-0.12-0.213-0.263-0.213-0.431 0-0.184 0.076-0.331 0.228-0.441 0.236-0.171 0.562-0.257 0.979-0.257 0.404 0 0.706 0.081 0.906 0.242 0.204 0.158 0.336 0.42 0.397 0.785l1.435-0.063c-0.023-0.653-0.26-1.174-0.712-1.565-0.449-0.391-1.12-0.586-2.011-0.586zM19.346 18.967l2.54 7.105h1.531l2.544-7.105h-1.522l-1.74 5.258-1.798-5.258h-1.556z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-measure-shape viewBox=\"0 0 32 32\">\n" +
    "<title>sik-measure-shape</title>\n" +
    "<path d=\"M18.533 0.018c-0.526 0-0.975 0.187-1.348 0.56s-0.56 0.823-0.56 1.348v2.955l-5.695 2.445c-0.080-0.33-0.249-0.623-0.506-0.881-0.373-0.373-0.823-0.56-1.348-0.56h-5.513c-0.526 0-0.975 0.187-1.348 0.56s-0.56 0.823-0.56 1.348v5.513c0 0.526 0.187 0.975 0.56 1.348s0.823 0.56 1.348 0.56h0.658l-0.99 7.437h-0.626c-0.526 0-0.975 0.187-1.348 0.56s-0.56 0.823-0.56 1.348v5.513c0 0.526 0.187 0.975 0.56 1.348s0.823 0.56 1.348 0.56h5.513c0.526 0 0.975-0.187 1.348-0.56s0.56-0.823 0.56-1.348v-1.134l12.198-4.496c0.090 0.277 0.246 0.528 0.469 0.751 0.373 0.373 0.823 0.56 1.348 0.56h5.513c0.526 0 0.975-0.187 1.348-0.56s0.56-0.823 0.56-1.348v-5.513c0-0.526-0.187-0.975-0.56-1.348s-0.823-0.56-1.348-0.56h-2.342l-2.353-7.254c0.193-0.092 0.371-0.22 0.535-0.383 0.373-0.373 0.56-0.823 0.56-1.348v-5.513c0-0.526-0.187-0.975-0.56-1.348s-0.823-0.56-1.348-0.56h-5.513zM19.63 1.874h3.319c0.317 0 0.587 0.112 0.812 0.337s0.337 0.495 0.337 0.812v3.319c0 0.316-0.112 0.587-0.337 0.812s-0.495 0.337-0.812 0.337h-3.319c-0.317 0-0.587-0.112-0.812-0.337s-0.337-0.495-0.337-0.812v-3.319c0-0.317 0.112-0.587 0.337-0.812s0.495-0.337 0.812-0.337zM16.625 7.471c0.008 0.512 0.194 0.95 0.56 1.316 0.373 0.373 0.823 0.56 1.348 0.56h3.808l2.296 7.078h-0.595c-0.526 0-0.975 0.187-1.348 0.56s-0.56 0.823-0.56 1.348v3.562l-12.108 4.463v-1.797c0-0.526-0.187-0.975-0.56-1.348s-0.823-0.56-1.348-0.56h-2.373l0.99-7.437h2.341c0.526 0 0.975-0.187 1.348-0.56s0.56-0.823 0.56-1.348v-3.414l5.641-2.422zM4.66 7.742h3.319c0.316 0 0.587 0.112 0.812 0.337s0.337 0.495 0.337 0.812v3.319c0 0.316-0.112 0.587-0.337 0.812s-0.495 0.337-0.812 0.337h-3.319c-0.316 0-0.587-0.112-0.812-0.337s-0.337-0.495-0.337-0.812v-3.319c0-0.316 0.112-0.587 0.337-0.812s0.495-0.337 0.812-0.337zM25.139 18.281h3.319c0.317 0 0.587 0.112 0.812 0.337s0.337 0.495 0.337 0.812v3.319c0 0.317-0.112 0.587-0.337 0.812s-0.495 0.337-0.812 0.337h-3.319c-0.316 0-0.587-0.112-0.812-0.337s-0.337-0.495-0.337-0.812v-3.319c0-0.316 0.112-0.587 0.337-0.812s0.495-0.337 0.812-0.337zM3.702 24.509h3.319c0.316 0 0.587 0.112 0.812 0.337s0.337 0.495 0.337 0.812v3.319c0 0.317-0.112 0.587-0.337 0.812s-0.495 0.337-0.812 0.337h-3.319c-0.317 0-0.587-0.112-0.812-0.337s-0.337-0.495-0.337-0.812v-3.319c0-0.317 0.112-0.587 0.337-0.812s0.495-0.337 0.812-0.337z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-measure-line viewBox=\"0 0 32 32\">\n" +
    "<title>sik-measure-line</title>\n" +
    "<path d=\"M24.752 0.172c-0.512 0-0.95 0.182-1.314 0.546s-0.546 0.802-0.546 1.314v5.371c0 0.055 0.002 0.109 0.006 0.162l-15.22 15.22c-0.137-0.031-0.28-0.047-0.43-0.047h-5.371c-0.512 0-0.95 0.182-1.314 0.546s-0.546 0.802-0.546 1.314v5.371c0 0.512 0.182 0.95 0.546 1.314s0.802 0.546 1.314 0.546h5.371c0.512 0 0.95-0.182 1.314-0.546s0.546-0.802 0.546-1.314v-5.371c0-0.005-0-0.009-0-0.013l15.345-15.345c0.097 0.015 0.197 0.022 0.3 0.022h5.371c0.512 0 0.95-0.182 1.314-0.546s0.546-0.802 0.546-1.314v-5.371c0-0.512-0.182-0.95-0.546-1.314s-0.802-0.546-1.314-0.546h-5.371zM25.82 1.98h3.234c0.308 0 0.572 0.11 0.791 0.328s0.328 0.483 0.328 0.791v3.234c0 0.308-0.109 0.572-0.328 0.791s-0.483 0.328-0.791 0.328h-3.234c-0.308 0-0.572-0.109-0.791-0.328s-0.328-0.483-0.328-0.791v-3.234c0-0.308 0.11-0.572 0.328-0.791s0.483-0.328 0.791-0.328zM2.946 24.547h3.234c0.308 0 0.572 0.11 0.791 0.328s0.328 0.483 0.328 0.791v3.234c0 0.308-0.109 0.572-0.328 0.791s-0.483 0.328-0.791 0.328h-3.234c-0.308 0-0.572-0.109-0.791-0.328s-0.328-0.483-0.328-0.791v-3.234c0-0.308 0.109-0.572 0.328-0.791s0.483-0.328 0.791-0.328z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-ruler viewBox=\"0 0 32 32\">\n" +
    "<title>sik-ruler</title>\n" +
    "<path d=\"M25.28 0.018c-0.698 0-1.295 0.249-1.794 0.747l-22.721 22.721c-0.498 0.498-0.747 1.096-0.747 1.794s0.249 1.295 0.747 1.794l3.588 3.588c0.001 0.001 0.001 0.001 0.002 0.002l0.572 0.572c0.498 0.498 1.096 0.747 1.794 0.747s1.296-0.249 1.794-0.747l22.721-22.721c0.498-0.498 0.747-1.096 0.747-1.794s-0.249-1.295-0.747-1.794l-4.161-4.161c-0.498-0.498-1.096-0.747-1.794-0.747zM25.243 2.374c0.48-0.001 0.882 0.161 1.206 0.485l2.67 2.67c0.371 0.371 0.529 0.843 0.475 1.417s-0.306 1.085-0.755 1.533l-20.458 20.458c-0.449 0.449-0.96 0.7-1.534 0.755s-1.046-0.104-1.417-0.475l-2.67-2.67c-0.371-0.371-0.529-0.843-0.475-1.417s0.306-1.085 0.755-1.534l0.289-0.289 2.215 2.215c0.055 0.055 0.122 0.081 0.202 0.077s0.149-0.034 0.208-0.093l0.426-0.426c0.059-0.059 0.090-0.128 0.093-0.208s-0.023-0.147-0.077-0.202l-2.215-2.215 2.212-2.212 2.215 2.215c0.055 0.055 0.122 0.081 0.202 0.077s0.149-0.034 0.208-0.093l0.426-0.426c0.059-0.059 0.090-0.129 0.093-0.208s-0.023-0.147-0.077-0.202l-2.215-2.215 2.212-2.212 3.436 3.436c0.080 0.080 0.168 0.126 0.265 0.141s0.175-0.008 0.234-0.067l0.426-0.426c0.059-0.059 0.082-0.137 0.067-0.234s-0.061-0.185-0.141-0.265l-3.436-3.436 2.212-2.212 2.215 2.215c0.055 0.055 0.122 0.081 0.202 0.077s0.149-0.034 0.208-0.093l0.426-0.426c0.059-0.059 0.090-0.129 0.093-0.208s-0.023-0.147-0.077-0.202l-2.215-2.215 2.212-2.212 2.215 2.215c0.055 0.055 0.122 0.081 0.202 0.077s0.149-0.034 0.208-0.093l0.426-0.426c0.059-0.059 0.090-0.129 0.093-0.208s-0.023-0.147-0.077-0.202l-2.215-2.215 2.212-2.212 3.436 3.436c0.080 0.080 0.168 0.126 0.265 0.141s0.175-0.008 0.234-0.067l0.426-0.426c0.059-0.059 0.082-0.137 0.067-0.234s-0.061-0.185-0.141-0.265l-3.436-3.436 2.212-2.212 2.215 2.215c0.055 0.055 0.122 0.081 0.202 0.077s0.149-0.034 0.208-0.093l0.426-0.426c0.059-0.059 0.090-0.129 0.093-0.208s-0.023-0.147-0.077-0.202l-2.215-2.215 0.938-0.938c0.449-0.449 0.96-0.7 1.534-0.755 0.072-0.007 0.142-0.010 0.21-0.010z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-layers-search viewBox=\"0 0 32 32\">\n" +
    "<title>sik-layers-search</title>\n" +
    "<path d=\"M16.105 1.196c-0.725 0-1.341 0.152-1.85 0.456l-12.581 7.525c-0.509 0.304-0.763 0.673-0.763 1.107s0.254 0.802 0.763 1.107l12.581 7.525c0.509 0.304 1.126 0.704 1.85 0.704s1.341-0.4 1.85-0.704l12.581-7.525c0.509-0.304 0.763-0.673 0.763-1.107s-0.254-0.802-0.763-1.107l-12.581-7.525c-0.509-0.304-1.126-0.456-1.85-0.456zM16.105 2.448c0.146 0 0.27 0.030 0.37 0.090l12.581 7.525c0.1 0.060 0.15 0.134 0.15 0.221s-0.050 0.162-0.15 0.221l-12.499 7.443c-0.1 0.060-0.306 0.172-0.453 0.172s-0.352-0.113-0.453-0.172l-12.499-7.443c-0.1-0.060-0.15-0.134-0.15-0.221s0.050-0.161 0.15-0.221l12.581-7.525c0.1-0.060 0.224-0.090 0.37-0.090zM3.524 13.383l-1.85 1.107c-0.509 0.304-0.763 0.673-0.763 1.107s0.254 0.802 0.763 1.107l12.581 7.525c0.509 0.304 1.126 0.622 1.85 0.622 0.093 0 0.184-0.005 0.273-0.015-0.032-0.238-0.052-0.515-0.056-0.797 0-0.246 0.013-0.486 0.037-0.722-0.087 0.056-0.179 0.076-0.255 0.076-0.146 0-0.352-0.071-0.453-0.131l-12.499-7.443c-0.1-0.060-0.15-0.134-0.15-0.221s0.050-0.161 0.15-0.221l1.85-1.107-1.48-0.885zM28.687 13.383l-1.48 0.885 1.85 1.107c0.1 0.060 0.15 0.134 0.15 0.221s-0.050 0.162-0.15 0.221l-3.214 1.914c0.572 0.248 1.064 0.544 1.512 0.895l3.181-1.923c0.509-0.304 0.763-0.673 0.763-1.107s-0.254-0.802-0.763-1.107l-1.85-1.107zM23.284 18.403c-0.756 0-1.479 0.147-2.169 0.44s-1.285 0.69-1.784 1.189c-0.5 0.5-0.896 1.094-1.19 1.784s-0.44 1.413-0.44 2.169c0 0.756 0.147 1.479 0.44 2.169s0.69 1.285 1.19 1.784c0.5 0.5 1.094 0.896 1.784 1.189s1.413 0.44 2.169 0.44c1.163 0 2.218-0.328 3.164-0.983l2.72 2.712c0.19 0.201 0.428 0.301 0.714 0.301 0.275 0 0.513-0.1 0.714-0.301s0.301-0.439 0.301-0.714c0-0.28-0.098-0.518-0.293-0.714l-2.72-2.72c0.656-0.946 0.983-2.001 0.983-3.164 0-0.756-0.147-1.479-0.44-2.169s-0.69-1.285-1.19-1.784c-0.5-0.5-1.094-0.896-1.784-1.189s-1.413-0.44-2.169-0.44zM3.535 18.677l-1.85 1.107c-0.509 0.304-0.763 0.673-0.763 1.107s0.254 0.802 0.763 1.107l12.581 7.525c0.509 0.304 1.126 0.622 1.85 0.622s1.341-0.317 1.85-0.622l0.647-0.387c-0.389-0.349-0.733-0.734-1.030-1.155l-1.015 0.574c-0.1 0.060-0.306 0.131-0.453 0.131s-0.352-0.072-0.453-0.131l-12.499-7.443c-0.1-0.060-0.15-0.134-0.15-0.221s0.050-0.161 0.15-0.221l1.85-1.107-1.48-0.885zM28.698 18.677l-0.759 0.454c0.486 0.472 0.9 1.014 1.228 1.61 0.021 0.040 0.024 0.045 0.027 0.051 0.259 0.472 0.474 1.019 0.616 1.594l0.738-0.389c0.509-0.304 0.763-0.673 0.763-1.107s-0.254-0.802-0.763-1.107l-1.85-1.107zM23.284 20.433c0.978 0 1.815 0.348 2.51 1.043s1.043 1.532 1.043 2.51c0 0.978-0.348 1.814-1.043 2.51s-1.532 1.043-2.51 1.043c-0.978 0-1.815-0.348-2.51-1.043s-1.043-1.532-1.043-2.51c0-0.978 0.348-1.814 1.043-2.51s1.532-1.043 2.51-1.043z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-location-search viewBox=\"0 0 32 32\">\n" +
    "<title>sik-location-search</title>\n" +
    "<path d=\"M15.299 0.018c-2.941 0-5.452 1.040-7.533 3.122s-3.122 4.592-3.122 7.533c0 1.512 0.229 2.754 0.687 3.725l7.596 16.107c0.208 0.458 0.531 0.819 0.968 1.082s0.905 0.395 1.405 0.395c0.499 0 0.968-0.132 1.405-0.395s0.767-0.624 0.988-1.082l0.555-1.18c-1.416-1.328-2.3-3.21-2.303-5.298 0-0.001 0-0.001 0-0.001 0-4.018 3.258-7.276 7.276-7.276 0 0 0 0 0 0 0.324 0.003 0.639 0.026 0.949 0.069l1.098-2.42c0.458-0.971 0.687-2.213 0.687-3.725 0-2.941-1.041-5.452-3.122-7.533s-4.592-3.122-7.533-3.122zM15.299 5.345c1.471 0 2.726 0.52 3.767 1.561s1.561 2.296 1.561 3.767c0 1.471-0.52 2.726-1.561 3.767s-2.296 1.561-3.767 1.561c-1.471 0-2.726-0.52-3.767-1.561s-1.561-2.296-1.561-3.767c0-1.471 0.52-2.726 1.561-3.767s2.296-1.561 3.767-1.561zM23.276 18.352c-0.762 0-1.49 0.148-2.186 0.444s-1.295 0.695-1.798 1.199c-0.503 0.503-0.903 1.103-1.199 1.798s-0.444 1.424-0.444 2.186c0 0.762 0.148 1.49 0.444 2.186s0.695 1.295 1.199 1.798c0.503 0.503 1.103 0.903 1.798 1.199s1.424 0.444 2.186 0.444c1.172 0 2.235-0.33 3.189-0.991l2.741 2.733c0.192 0.202 0.431 0.304 0.719 0.304 0.277 0 0.517-0.101 0.719-0.304s0.304-0.442 0.304-0.719c0-0.282-0.099-0.522-0.296-0.719l-2.741-2.741c0.661-0.954 0.991-2.016 0.991-3.189 0-0.762-0.148-1.49-0.444-2.186s-0.695-1.295-1.199-1.798c-0.503-0.503-1.103-0.903-1.798-1.199s-1.424-0.444-2.186-0.444zM23.276 20.397c0.986 0 1.829 0.35 2.529 1.051s1.051 1.544 1.051 2.529c0 0.986-0.35 1.829-1.051 2.529s-1.544 1.051-2.529 1.051c-0.986 0-1.829-0.35-2.529-1.051s-1.051-1.544-1.051-2.529c0-0.986 0.35-1.829 1.051-2.529s1.544-1.051 2.529-1.051z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-buffer viewBox=\"0 0 32 32\">\n" +
    "<title>sik-buffer</title>\n" +
    "<path d=\"M6.538 0.018c-1.801 0-3.341 0.639-4.62 1.918s-1.918 2.819-1.918 4.62v18.888c0 1.801 0.639 3.341 1.918 4.62s2.819 1.918 4.62 1.918h18.888c1.801 0 3.341-0.639 4.62-1.918s1.918-2.819 1.918-4.62v-18.888c0-1.801-0.639-3.341-1.918-4.62s-2.819-1.918-4.62-1.918h-18.888zM6.538 2.924h18.888c0.999 0 1.854 0.356 2.565 1.067s1.067 1.566 1.067 2.565v18.888c0 0.999-0.356 1.854-1.067 2.565s-1.566 1.067-2.565 1.067h-18.888c-0.999 0-1.854-0.356-2.565-1.067s-1.067-1.566-1.067-2.565v-18.888c0-0.999 0.356-1.854 1.067-2.565s1.566-1.067 2.565-1.067zM9.696 5.091c-1.199 0-2.224 0.426-3.075 1.277s-1.277 1.876-1.277 3.075v12.573c0 1.199 0.426 2.224 1.277 3.075s1.876 1.277 3.075 1.277h12.573c1.199 0 2.224-0.426 3.075-1.277s1.277-1.876 1.277-3.075v-12.573c0-1.199-0.426-2.224-1.277-3.075s-1.876-1.277-3.075-1.277h-12.573zM9.696 7.025h12.573c0.665 0 1.234 0.237 1.708 0.71s0.71 1.043 0.71 1.708v12.573c0 0.665-0.237 1.234-0.71 1.708s-1.043 0.71-1.708 0.71h-12.573c-0.665 0-1.234-0.237-1.708-0.71s-0.71-1.043-0.71-1.708v-12.573c0-0.665 0.237-1.234 0.71-1.708s1.043-0.71 1.708-0.71z\"></path>\n" +
    "</symbol>\n" +
    "<symbol id=icon-sik-press-through viewBox=\"0 0 32 32\">\n" +
    "<title>sik-press-through</title>\n" +
    "<path d=\"M6.556 0.018c-1.801 0-3.341 0.639-4.62 1.918s-1.918 2.819-1.918 4.62v18.888c0 1.801 0.639 3.341 1.918 4.62s2.819 1.918 4.62 1.918h18.888c1.801 0 3.341-0.639 4.62-1.918s1.918-2.819 1.918-4.62v-18.888c0-1.801-0.639-3.341-1.918-4.62s-2.819-1.918-4.62-1.918h-18.888zM6.556 2.924h18.888c0.999 0 1.854 0.356 2.565 1.067s1.067 1.566 1.067 2.565v18.888c0 0.999-0.356 1.854-1.067 2.565s-1.566 1.067-2.565 1.067h-18.888c-0.999 0-1.854-0.356-2.565-1.067s-1.067-1.566-1.067-2.565v-18.888c0-0.999 0.356-1.854 1.067-2.565s1.566-1.067 2.565-1.067zM9.714 5.091c-1.199 0-2.224 0.426-3.075 1.277s-1.277 1.876-1.277 3.075v12.573c0 1.199 0.426 2.224 1.277 3.075s1.876 1.277 3.075 1.277h12.573c1.199 0 2.224-0.426 3.075-1.277s1.277-1.876 1.277-3.075v-12.573c0-1.199-0.426-2.224-1.277-3.075s-1.876-1.277-3.075-1.277h-12.573zM9.714 7.025h4.953l-7.371 7.371v-4.953c0-0.665 0.237-1.234 0.71-1.708s1.043-0.71 1.708-0.71zM18.777 7.025h3.51c0.168 0 0.33 0.015 0.486 0.046l-15.423 15.473c-0.036-0.169-0.054-0.345-0.054-0.529v-3.51l11.481-11.481zM24.7 9.288c0.003 0.051 0.005 0.103 0.005 0.155v3.96l-11.031 11.030h-3.96c-0.089 0-0.176-0.004-0.262-0.013l15.248-15.133zM24.704 17.512v4.503c0 0.665-0.237 1.234-0.71 1.708s-1.043 0.71-1.708 0.71h-4.503l6.921-6.921z\"></path>\n" +
    "</symbol>\n" +
    "</defs>\n" +
    "</svg>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/other/themeTemplate.html',
    "<div>\n" +
    "<div style=display:flex>\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox id=chk{{thmctrl.theme.Naam}} ng-model=thmctrl.theme.Visible ng-change=layercheckboxchange(thmctrl.theme)>\n" +
    "<label for=chk{{thmctrl.theme.Naam}} title={{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}}\n" +
    "<span class=\"label-info hidden-print\" ng-show=\"thmctrl.theme.Type=='esri'\">ArcGIS</span>\n" +
    "<span class=\"label-info hidden-print\" ng-hide=\"thmctrl.theme.Type=='esri'\">{{thmctrl.theme.Type}}</span>\n" +
    "</label>\n" +
    "<button ng-hide=\"hidedelete == true\" style=\"flex-grow: 2\" class=\"trash hidden-print pull-right\" ng-click=thmctrl.deleteTheme()></button>\n" +
    "</div>\n" +
    "<div style=display:flex class=hidden-print ng-show=\"thmctrl.theme.Type=='esri'\">\n" +
    "<rzslider class=\"custom-slider hidden-print\" rz-slider-model=thmctrl.transpSlider.value rz-slider-options=thmctrl.transpSlider.options></rzslider>\n" +
    "</div>\n" +
    "<ul class=\"ul-level no-theme-layercontroller-checkbox\" ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\">\n" +
    "<tink-layer layer=layer layercheckboxchange=layercheckboxchange(layer.theme)>\n" +
    "</tink-layer>\n" +
    "</ul>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/bufferTemplate.html',
    "<div class=modal-header>\n" +
    "<div class=\"row margin-bottom\">\n" +
    "<div class=col-xs-10>\n" +
    "<h4>Buffer instellen</h4>\n" +
    "</div>\n" +
    "<div class=col-xs-2>\n" +
    "<button class=\"close pull-right\" type=button data-ng-click=cancel()></button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-body width-sm flex-column flex-grow-1\">\n" +
    "<div class=\"row margin-top\">\n" +
    "<div class=col-xs-12>\n" +
    "<div class=form-group>\n" +
    "<label for=select>Selecteer de laag:</label>\n" +
    "<div class=select>\n" +
    "<select ng-options=\"layer as layer.name for layer in SelectableLayers\" ng-keydown=\"$event.keyCode === 13 && ok()\" ng-model=selectedLayer prevent-default></select>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "<div class=form-group>\n" +
    "<label for=input-number>Geef de bufferafstand (m):</label>\n" +
    "<input type=number ng-keydown=\"$event.keyCode === 13 && ok()\" class=hide-spin-button ng-model=buffer auto-focus>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "<div class=text-right>\n" +
    "<button type=submit data-ng-click=ok()>Klaar</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/search/searchAdvancedTemplate.html',
    "<div class=\"searchAdvancedTemplate modal-header\">\n" +
    "<div class=\"row margin-bottom\">\n" +
    "<div class=col-xs-10>\n" +
    "<h4>Geavanceerd zoeken</h4>\n" +
    "</div>\n" +
    "<div class=col-xs-2>\n" +
    "<button class=\"close pull-right\" type=button data-ng-click=cancel()></button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-body width-lg flex-column flex-grow-1\">\n" +
    "<div class=\"row margin-top\">\n" +
    "<div class=col-xs-12>\n" +
    "<h4>Query Builder</h4>\n" +
    "</div>\n" +
    "<div class=\"form-group col-xs-3 margin-top\">\n" +
    "<select ng-model=selectedLayer ng-options=\"layer as layer.name for layer in SelectedLayers()\" ng-change=updateFields()></select>\n" +
    "</div>\n" +
    "<div class=col-xs-9>\n" +
    "<search-operations></search-operations>\n" +
    "</div>\n" +
    "<div class=\"margin-top margin-bottom col-xs-12\">\n" +
    "<button ng-click=addOperation()>AND</button>\n" +
    "<button ng-click=orOperation()>OR</button>\n" +
    "<button class=pull-right ng-click=openQueryEditor()>Query Genereren</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row margin-top\" ng-show=editor>\n" +
    "<span class=\"empty-message col-xs-12\">* Opgelet! Aanpassingen in de editor zijn niet omkeerbaar naar de Query Builder *</span>\n" +
    "<div class=col-xs-12>\n" +
    "<h4>Editor</h4>\n" +
    "</div>\n" +
    "<div class=col-xs-12>\n" +
    "<textarea rows=4 ng-model=query ng-change=updateQuery()>{{query}}</textarea>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"searchAdvancedTemplate modal-footer\">\n" +
    "<div class=margin-top>\n" +
    "<button type=button class=\"btn btn-info\" ng-click=QueryAPI()>Pas toe</button>\n" +
    "<button type=button class=btn ng-click=cancel()> Annuleer</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/searchOperationsTemplate.html',
    "<div>\n" +
    "<div class=form-group ng-repeat=\"operation in operations track by $index\">\n" +
    "<div class=\"formgroup col-xs-4\">\n" +
    "<div ng-show=\"operation.addition != null && !$first\" class=andOr>{{operation.addition}}</div>\n" +
    "<select ng-model=operation.attribute ng-change=updateOperation($index) ng-options=\"attr as attr.displayName for attr in attributes\" value={{operation.attribute}}></select>\n" +
    "</div>\n" +
    "<div class=\"form-group col-xs-2\" ng-class=\"{'col-xs-4': operations.length == 1}\">\n" +
    "<select ng-model=operation.operator ng-options=\"x for x in operators\" ng-change=updateOperation($index)></select>\n" +
    "</div>\n" +
    "<div class=\"form-group col-xs-4 querybuild\">\n" +
    "<input class=typeaheadsearchoperations ng-class=waarde_$index type=search value={{operation.value}} placeholder=Waarde ng-model=operation.value ng-change=updateOperation($index) ng-click=valueChanged($index) ng-model-options=\"{ debounce: 500 }\" id=input_waarde_{{$index}}>\n" +
    "</div>\n" +
    "<div class=\"form-group col-xs-2\">\n" +
    "<button type=button class=up ng-show=!$first ng-click=up($index)></button>\n" +
    "<button type=button class=down ng-show=!$last ng-click=down($index)></button>\n" +
    "<button type=button class=closetransparant ng-show=!$first ng-click=delete($index)></button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/search/searchResultsTemplate.html',
    "<div class=\"SEARCHRESULT flex-column\">\n" +
    "<div class=flex-column ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length == 0\">\n" +
    "<div class=\"col-xs-12 flex-grow-1 margin-top\">\n" +
    "Geen resultaten.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"flex-column flex-grow-1 margin-top\" ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length > 0\">\n" +
    "<div class=\"row extra-padding\">\n" +
    "<div class=\"col-xs-12 margin-bottom text-right\">\n" +
    "<button class=btn tink-tooltip=\"Exporteer naar CSV\" tink-tooltip-align=top ng-if=srchrsltsctrl.exportToCSVButtonIsEnabled ng-click=srchrsltsctrl.exportToCSV()>\n" +
    "<svg class=\"icon icon-sik-file-csv\"><use xmlns:xlink=http://www.w3.org/1999/xlink xlink:href=#icon-sik-file-csv></use></svg>\n" +
    "</button>\n" +
    "<button class=btn ng-class=\"{active: srchrsltsctrl.extendedType =='add'}\" tink-tooltip=\"Selectie toevoegen\" tink-tooltip-align=top ng-click=srchrsltsctrl.addSelection()>\n" +
    "<i class=\"fa fa-plus\" aria-hidden=true></i>\n" +
    "</button>\n" +
    "<button class=btn ng-class=\"{active: srchrsltsctrl.extendedType=='remove'}\" tink-tooltip=\"Selectie verwijderen\" tink-tooltip-align=top ng-click=srchrsltsctrl.removeSelection()>\n" +
    "<i class=\"fa fa-minus\" aria-hidden=true></i>\n" +
    "</button>\n" +
    "<button class=btn-sm ng-if=srchrsltsctrl.extraResultButtonIsEnabled ng-click=srchrsltsctrl.extraResultButton()>{{srchrsltsctrl.resultButtonText}}</button>\n" +
    "</div>\n" +
    "<div class=col-xs-12>\n" +
    "<select ng-model=srchrsltsctrl.layerGroupFilter>\n" +
    "<option value=geenfilter selected>Geen filter ({{srchrsltsctrl.features.length}})</option>\n" +
    "<option ng-repeat=\"feat in srchrsltsctrl.featureLayers\" value={{feat}}>{{feat}} ({{srchrsltsctrl.aantalFeaturesMetType(feat)}})</option>\n" +
    "</select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"overflow-wrapper margin-top\">\n" +
    "<ul ng-repeat=\"layerGroupName in srchrsltsctrl.featureLayers\">\n" +
    "<tink-accordion ng-if=\"srchrsltsctrl.layerGroupFilter=='geenfilter' || srchrsltsctrl.layerGroupFilter==layerGroupName \" data-one-at-a-time=false>\n" +
    "<div class=\"tink-accordion-panel xl-panel\" ng-show=\"srchrsltsctrl.aantalFeaturesMetType(layerGroupName) >= 1000\">\n" +
    "<data-header>\n" +
    "<p class=nav-aside-title style=\"pointer-events: none; align-content: center\">{{layerGroupName}} ({{srchrsltsctrl.aantalFeaturesMetType(layerGroupName)}})\n" +
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=\"trash pull-right trash-xl\" style=pointer-events:all></button>\n" +
    "</p>\n" +
    "</data-header>\n" +
    "<data-content ng-show=\"srchrsltsctrl.aantalFeaturesMetType(layerGroupName) <= 1000\">\n" +
    "<li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>\n" +
    "<div class=mouse-over>\n" +
    "<a tink-tooltip={{feature.displayValue}} tink-tooltip-align=top ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue| limitTo : 40 }}\n" +
    "</a>\n" +
    "<button class=\"trash pull-right mouse-over-toshow\" prevent-default ng-click=srchrsltsctrl.deleteFeature(feature)></button>\n" +
    "</div>\n" +
    "</li>\n" +
    "</data-content>\n" +
    "</div>\n" +
    "<tink-accordion-panel data-is-collapsed=srchrsltsctrl.collapsestatepergroup[layerGroupName] ng-show=\"srchrsltsctrl.aantalFeaturesMetType(layerGroupName) <= 1000\">\n" +
    "<data-header>\n" +
    "<p class=nav-aside-title>{{layerGroupName}} ({{srchrsltsctrl.aantalFeaturesMetType(layerGroupName)}})\n" +
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=\"trash pull-right\"></button>\n" +
    "</p>\n" +
    "</data-header>\n" +
    "<data-content ng-show=\"srchrsltsctrl.aantalFeaturesMetType(layerGroupName) <= 1000\">\n" +
    "<li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>\n" +
    "<div class=mouse-over>\n" +
    "<a tink-tooltip={{feature.displayValue}} tink-tooltip-align=top ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue| limitTo : 40 }}\n" +
    "</a>\n" +
    "<button class=\"trash pull-right mouse-over-toshow\" prevent-default ng-click=srchrsltsctrl.deleteFeature(feature)></button>\n" +
    "</div>\n" +
    "</li>\n" +
    "</data-content>\n" +
    "</tink-accordion-panel>\n" +
    "</tink-accordion>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/searchSelectedTemplate.html',
    "<div class=\"SEARCHSELECTED flex-column flex-grow-1 extra-padding\" ng-if=srchslctdctrl.selectedResult>\n" +
    "<div class=\"margin-top margin-bottom\">\n" +
    "<div class=\"col-xs-12 text-right\">\n" +
    "<button class=btn tink-tooltip=Doordruk tink-tooltip-align=top ng-click=srchslctdctrl.doordruk() ng-hide=\"srchslctdctrl.selectedResult.theme.Type != 'esri' || srchslctdctrl.mobile\">\n" +
    "<svg class=\"icon icon-sik-press-through\"><use xlink:href=#icon-sik-press-through></use></svg>\n" +
    "</button>\n" +
    "<button class=btn tink-tooltip=Buffer tink-tooltip-align=top ng-click=srchslctdctrl.buffer() ng-hide=\"srchslctdctrl.selectedResult.theme.Type != 'esri' || srchslctdctrl.mobile\">\n" +
    "<svg class=\"icon icon-sik-buffer\"><use xlink:href=#icon-sik-buffer></use></svg>\n" +
    "</button>\n" +
    "<button class=btn tink-tooltip=\"Exporteer naar CSV\" tink-tooltip-align=top ng-if=srchslctdctrl.exportToCSVButtonIsEnabled ng-click=srchslctdctrl.exportToCSV()>\n" +
    "<svg class=\"icon icon-sik-file-csv\"><use xlink:href=#icon-sik-file-csv></use></svg>\n" +
    "</button>\n" +
    "<button class=btn tink-tooltip=Verwijderen tink-tooltip-align=top ng-click=srchslctdctrl.delete()>\n" +
    "<i class=\"fa fa-trash-o\"></i>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12 overflow-wrapper flex-grow-1\">\n" +
    "<dl ng-repeat=\"prop in srchslctdctrl.props\">\n" +
    "<dt>{{ prop.key}}</dt>\n" +
    "<div ng-if=\"prop.value.toLowerCase() != 'null'\">\n" +
    "<a ng-if=\"prop.value.indexOf('https://')==0 || prop.value.indexOf( 'http://')==0 \" ng-href={{prop.value}} target=_blank>% Link</a>\n" +
    "<dd ng-if=\"prop.value.indexOf('https://') !=0 && prop.value.indexOf( 'http://') !=0 \"><pre>{{ prop.value }}</pre></dd>\n" +
    "</div>\n" +
    "</dl>\n" +
    "</div>\n" +
    "<div class=margin-top>\n" +
    "<div class=col-xs-12>\n" +
    "<div class=btn-group>\n" +
    "<button type=button class=btn ng-disabled=!srchslctdctrl.prevResult ng-click=srchslctdctrl.vorige()>\n" +
    "<i class=\"fa fa-chevron-left\"></i>\n" +
    "</button>\n" +
    "<button type=button class=btn ng-disabled=!srchslctdctrl.nextResult ng-click=srchslctdctrl.volgende()>\n" +
    "<i class=\"fa fa-chevron-right\"></i>\n" +
    "</button>\n" +
    "</div>\n" +
    "<button class=\"btn-primary pull-right\" ng-hide=\"srchslctdctrl.selectedResult.theme.Type != 'esri'\" ng-click=srchslctdctrl.toonFeatureOpKaart()>Tonen</button>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12 margin-top margin-bottom\">\n" +
    "<a class=pull-right ng-click=srchslctdctrl.close(srchslctdctrl.selectedResult)>Terug naar resultaten</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/search/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" id=leftaside data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\">\n" +
    "<aside class=\"flex-column flex-grow-1\">\n" +
    "<div class=buffer-panel ng-show=\"srchrsltsctrl.drawLayer && !srchrsltsctrl.selectedResult\">\n" +
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>\n" +
    "Selectievorm\n" +
    "</p>\n" +
    "</div>\n" +
    "<div class=\"row extra-padding margin-top\">\n" +
    "<div class=\"col-xs-12 text-right\">\n" +
    "<button ng-click=srchrsltsctrl.deleteDrawing() tink-tooltip=\"Verwijder de selectievorm\" tink-tooltip-align=right class=btn><i class=\"fa fa-trash\" aria-hidden=true></i></button>\n" +
    "<button ng-hide=srchrsltsctrl.mobile class=btn ng-click=srchrsltsctrl.bufferFromDrawing() tink-tooltip=\"Buffer rond selectievorm\" tink-tooltip-align=right>\n" +
    "<svg class=\"icon icon-sik-buffer\"><use xlink:href=#icon-sik-buffer></use></svg>\n" +
    "</button>\n" +
    "<button class=\"btn btn-primary\" ng-click=srchrsltsctrl.zoom2Drawing()>Tonen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>Resultaten</p>\n" +
    "</div>\n" +
    "<button ng-click=srchctrl.asidetoggle class=nav-left-toggle data-tink-sidenav-collapse=asideNavLeft>\n" +
    "<a href=# title=\"Open menu\"><span class=sr-only>Open left menu</span></a>\n" +
    "</button>\n" +
    "<div class=\"flex-column flex-grow-1\" ng-show=srchctrl.LoadingCompleted>\n" +
    "<tink-search-results></tink-search-results>\n" +
    "<tink-search-selected></tink-search-selected>\n" +
    "</div>\n" +
    "<div class=\"loader-advanced center-block margin-top margin-bottom\" ng-show=\"srchctrl.LoadingCompleted == false\">\n" +
    "<span class=loader></span>\n" +
    "<span class=loader-percentage>{{srchctrl.loadingPercentage}}%</span>\n" +
    "</div>\n" +
    "</aside>\n" +
    "</div>\n"
  );

}]);
;'use strict';

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
            _classCallCheck(this, Layer);

            var _this = _possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).apply(this, arguments));

            _this.parent = null;
            _this.Layers = [];
            _this.UpdateDisplayed = function (currentScale) {
                if (_this.maxScale > 0 || _this.minScale > 0) {
                    if (currentScale >= _this.maxScale && currentScale <= _this.minScale) {
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

        function wmslayer(layerData, parenttheme) {
            _classCallCheck(this, wmslayer);

            var _this2 = _possibleConstructorReturn(this, (wmslayer.__proto__ || Object.getPrototypeOf(wmslayer)).call(this));

            Object.assign(_this2, layerData);
            _this2.visible = true;
            _this2.enabled = false;
            _this2.displayed = true;
            _this2.theme = parenttheme;
            _this2.queryable = layerData.queryable;
            _this2.id = _this2.name;
            return _this2;
        }

        _createClass(wmslayer, [{
            key: 'legendUrl',
            get: function get() {
                return this.theme.cleanUrl + '?Service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + this.id;
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

        function arcgislayer(layerData, parenttheme) {
            _classCallCheck(this, arcgislayer);

            var _this3 = _possibleConstructorReturn(this, (arcgislayer.__proto__ || Object.getPrototypeOf(arcgislayer)).call(this));

            Object.assign(_this3, layerData);
            _this3.visible = layerData.defaultVisibility;
            _this3.enabled = false;
            _this3.title = layerData.name;
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
;"use strict";

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
;'use strict';

var TinkGis;
(function (TinkGis) {
    (function () {
        var module = angular.module('tink.gis');
        var service = function service() {
            var ThemeCreater = {};
            ThemeCreater.createARCGISThemeFromJson = function (rawdata, themeData) {
                var theme = new TinkGis.ArcGIStheme(rawdata, themeData);
                return theme;
            };
            ThemeCreater.createWMSThemeFromJSON = function (data, url) {
                var wms = new TinkGis.wmstheme(data, url);
                return wms;
            };
            return ThemeCreater;
        };
        module.factory('ThemeCreater', service);
    })();
})(TinkGis || (TinkGis = {}));
