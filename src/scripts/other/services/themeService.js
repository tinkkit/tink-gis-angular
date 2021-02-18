"use strict";
(function () {
  var module = angular.module("tink.gis");
  var service = function (map, ThemeCreater, MapData, GISService, $q, MapService, PopupService) {
    var _service = {};
    _service.AddAndUpdateThemes = function (themesBatch) {
      console.log("Themes batch for add and updates...");
      console.log(themesBatch);
      themesBatch.forEach((theme) => {
        var existingTheme = MapData.Themes.find((x) => {
          return x.cleanUrl == theme.cleanUrl;
        });
        console.log("addorupdate or del theme, ", theme, theme.status);
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
            console.log(
              "Er is iets fout, status niet bekend!!!: " + theme.status
            );
            break;
        }
        //Theme is proccessed, now make it unmodified again
        theme.status = ThemeStatus.UNMODIFIED;
      });
      // console.log('refresh of sortableThemes');
      $("#sortableThemes").sortable("refresh");

      MapData.SetZIndexes();
    };
    _service.UpdateThemeVisibleLayers = function (theme) {
      MapData.ResetVisibleLayers();
      theme.UpdateMap(map);
    };

    _service.updateQueryVisibility = function (index, showQuery) {
      let queryLayer = MapData.QueryLayers[index];
      if (queryLayer.showLayer === true) {
        map.addLayer(queryLayer.layer.mapData);
      } else {
        map.removeLayer(queryLayer.layer.mapData);
      }

      //updates the visible layers
      MapData.ResetVisibleLayers();
    };
    _service.UpdateTheme = function (updatedTheme, existingTheme) {
      //lets update the existingTheme
      for (var x = 0; x < updatedTheme.AllLayers.length; x++) {
        var updatedLayer = updatedTheme.AllLayers[x];
        var existingLayer = existingTheme.AllLayers[x];

        //laten we alle Visible Layers nu terug toevoegen meteen juiste ref etc uit de geupdate theme.
        if (updatedLayer.enabled && updatedLayer.visible) {
          //eerst checken dat ze nog niet bestaan!.
          if (
            existingTheme.Type == ThemeType.ESRI &&
            MapData.VisibleLayers.indexOf(existingLayer) == -1
          ) {
            MapData.VisibleLayers.push(existingLayer);
          }
          if (existingTheme.VisibleLayers.indexOf(existingLayer) == -1) {
            existingTheme.VisibleLayers.push(existingLayer);
          }
        } else {
          //Anders halen we hem ook moest hij bij VisLayers aanwezig zijn er van af!
          if (
            existingTheme.Type == ThemeType.ESRI &&
            MapData.VisibleLayers.indexOf(existingLayer) != -1
          ) {
            MapData.VisibleLayers.splice(
              MapData.VisibleLayers.indexOf(existingLayer),
              1
            );
          }
          if (existingTheme.VisibleLayers.indexOf(existingLayer) != -1) {
            existingTheme.VisibleLayers.splice(
              existingTheme.VisibleLayers.indexOf(existingLayer),
              1
            );
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
        MapData.VisibleLayers = MapData.VisibleLayers.concat(
          theme.VisibleLayers
        );
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
          theme.MapData = L.esri
            .dynamicMapLayer({
              maxZoom: 20,
              minZoom: 0,
              url: theme.cleanUrl,
              opacity: theme.Opacity,
              layers: visLayerIds,
              continuousWorld: true,
              useCors: false,
              f: "image",
            })
            .addTo(map);
          // theme.SetOpacity(theme.Opacity);
          theme.MapDataWithCors = L.esri.dynamicMapLayer({
            maxZoom: 20,
            minZoom: 0,
            url: theme.cleanUrl,
            opacity: 1,
            layers: visLayerIds,
            continuousWorld: true,
            useCors: true,
            f: "image",
          });
          theme.MapData.on("authenticationrequired", function (e) {
            debugger;
            serverAuth(function (error, response) {
              debugger;
              e.authenticate(response.token);
            });
          });
          theme.MapData.on("load", function (e) {
            if (theme.MapData._currentImage) {
              theme.MapData._currentImage._image.style.zIndex =
                theme.MapData.ZIndex;
              console.log(
                "Zindex on " + theme.Naam + " set to " + theme.MapData.ZIndex
              );
            }
          });

          break;
        case ThemeType.WMS:
          theme.MapData = L.tileLayer
            .betterWms(theme.cleanUrl, {
              maxZoom: 20,
              minZoom: 0,
              format: "image/png",
              layers: theme.VisibleLayerIds.join(","),
              transparent: true,
              continuousWorld: true,
              useCors: true,
            })
            .addTo(map);

          theme.MapData.on("load", function (e) {
            console.log("LOAD VAN " + theme.Naam);
            console.log(theme.MapData);
            if (theme.MapData._container.childNodes) {
              [].slice
                .call(theme.MapData._container.childNodes)
                .forEach((imgNode) => {
                  imgNode.style.zIndex = theme.MapData.ZIndex;
                });
              // theme.MapData._currentImage._image.style.zIndex = theme.MapData.ZIndex;
              console.log(
                "Zindex on " + theme.Naam + " set to " + theme.MapData.ZIndex
              );
            }
          });
          break;
        default:
          console.log("UNKNOW TYPE");
          break;
      }
    };

    _service.AddQueryLayerFromImport = function (name, layerId, query, layerName, theme) {
      // only gets called from externservice.import ==> extra mapData object is necessary to use identify call on dynamicmaplayer, is not available on featurelayer
      theme.MapDataWithCors = L.esri.dynamicMapLayer({
        maxZoom: 20,
        minZoom: 0,
        url: theme.cleanUrl,
        opacity: theme.Opacity,
        layers: layerId,
        continuousWorld: true,
        useCors: true,
        f: "image",
      });
      _service.AddQueryLayer(name, layerId, query, layerName, theme, false);
    };

    _service.CheckIfQueryLayerExists = function(themeUrl, layerId, name) {
      return MapData.QueryLayers.find(
        (queryLayer) =>
          queryLayer.layer.baseUrl === themeUrl &&
          queryLayer.layer.layerId === layerId &&
          queryLayer.layer.name === name
      );
    }

    _service.AddQueryLayer = function (name, layerId, query, layerName, theme, count = true) {
      let existingQueryLayer = _service.CheckIfQueryLayerExists(theme.cleanUrl, layerId, name)
        
      // currently only allowed to add 1 querylayer for a specific layer
      if (existingQueryLayer) {
        swal({
          title: 'Updaten querylaag',
          text: `U staat op het punt bestaande querylaag ${existingQueryLayer.layer.name} bij te werken.`,
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: "Annuleer",
          confirmButtonColor: '#149142',
          confirmButtonText: 'Update',
          closeOnConfirm: true,
          reverseButtons: false
          
      }, function (isConfirm) { 
        if (existingQueryLayer.layer.mapData) {
          if (count) {
            _service.QueryLayerCount(theme, layerId, query)
          }
          existingQueryLayer.layer.mapData.setWhere(query);
          existingQueryLayer.layer.query = query;
        }
      })
      } else {
        //maximum number of queryLayers for performance reasons is 5
        if (MapData.QueryLayers.length === 5) {
          PopupService.Error("Het maximum aantal toegelaten query lagen is gelimiteerd tot 5. Dit omwille de impact van een query laag op de performantie van SIK.");
        } else {
          if (count) {
            _service.QueryLayerCount(theme, layerId, query)
          }
          let queryLayer = {
            layer: {
              baseUrl: theme.cleanUrl,
              name: name,
              layerName: layerName,
              layerId: layerId,
              query: query,
              legend: [],
            },
            showLayer: true,
          };
  
          var promLegend = GISService.GetLegendData(queryLayer.layer.baseUrl);
          var promLayerInfo = GISService.GetLayerSpecification(
            queryLayer.layer.baseUrl + "/" + queryLayer.layer.layerId
          );
  
          var allpromises = $q.all([promLegend, promLayerInfo]);
  
          allpromises.then(function (data) {
            var layerInfo = data[0].layers.find((x) => x.layerId == layerId);
            if (layerInfo && layerInfo.legend && layerInfo.legend.length > 0) {
              queryLayer.layer.legend = layerInfo.legend.map((x) => {
                var layer = x;
                layer.fullurl = `data:${x.contentType};base64, ${x.imageData}`;
                return layer;
              });
            }
  
            if (data[1].geometryType !== "esriGeometryPoint") {
              // check if multiple colors are defined
              if (data[1].drawingInfo.renderer.uniqueValueInfos) {
                queryLayer.layer.colors = data[1].drawingInfo.renderer.uniqueValueInfos.map(
                  (uniqueValue) => {
                    let fillColor = "";
                    let color = "";
                    let fill = false;
                    let weight = 1;
                    switch (data[1].geometryType) {
                      case "esriGeometryPolyline":
                        color = _service.RGBToHex(
                          uniqueValue.symbol.color[0],
                          uniqueValue.symbol.color[1],
                          uniqueValue.symbol.color[2]
                        );
                        weight = uniqueValue.symbol.width;
                        break;
                      case "esriGeometryPolygon":
                        if (uniqueValue.symbol.color) {
                          fillColor = this.RGBToHex(
                            uniqueValue.symbol.color[0],
                            uniqueValue.symbol.color[1],
                            uniqueValue.symbol.color[2]
                          );
                          fill = uniqueValue.symbol.color[3] > 0 ? true : false;
                        }
                        color = this.RGBToHex(
                          uniqueValue.symbol.outline.color[0],
                          uniqueValue.symbol.outline.color[1],
                          uniqueValue.symbol.outline.color[2]
                        );
                        weight = uniqueValue.symbol.outline.width;
                        break;
                      default:
                        break;
                    }
                    return {
                      values: uniqueValue.value.split(","),
                      weight,
                      color,
                      fillColor,
                      fill,
                    };
                  }
                );
              } else {
                  // get color from renderer
                  if (data[1].drawingInfo.renderer.symbol) {
                      let fillColor = "";
                      let color = "";
                      let fill = false;
                      let weight = 1;
                      let drawingSymbol = data[1].drawingInfo.renderer.symbol;
                      switch(data[1].geometryType) {
                          case 'esriGeometryPolyline':
                              color = _service.RGBToHex(drawingSymbol.color[0], drawingSymbol.color[1], drawingSymbol.color[2]);
                              weight = drawingSymbol.width;
                              break;
                          case 'esriGeometryPolygon':
                              fillColor = _service.RGBToHex(drawingSymbol.color[0], drawingSymbol.color[1], drawingSymbol.color[2]);
                              color = _service.RGBToHex(drawingSymbol.outline.color[0], drawingSymbol.outline.color[1], drawingSymbol.outline.color[2]);
                              fill = (drawingSymbol.color[0] > 0 || drawingSymbol.color[1] > 0 || drawingSymbol.color[2] > 0) ? true : false;
                              weight = drawingSymbol.outline.width;
                              break;
                          default:
                              break;
                      }
  
                      queryLayer.layer.colors = [{
                          values: '',
                          weight,
                          color,
                          fillColor,
                          fill,
                          fillOpacity: 1
                      }];
                  }
              }
            }
  
            queryLayer.layer.mapData = L.esri
              .featureLayer({
                maxZoom: 20,
                minZoom: 0,
                url: `${queryLayer.layer.baseUrl}/${queryLayer.layer.layerId}/query`,
                where: query,
                continuousWorld: true,
                useCors: false,
                f: "image",
                style: (feature, layer) => {
                  // //is used to style polygon and polyline
                  if (queryLayer.layer.colors) {
                    const colorValue = feature.properties[data[1].drawingInfo.renderer.field1];
                    if (colorValue) {
                      return queryLayer.layer.colors.find((x) =>
                          x.values.includes(colorValue)
                      );
                    } else {
                        return queryLayer.layer.colors.find((x) => x.values.includes('')) ? queryLayer.layer.colors.find((x) => x.values.includes('')): queryLayer.layer.colors[0];
                    }
                  }
                },
                pointToLayer: (feature, latlng) => {
                  //is usesd to style points
                  const legendValue =
                    feature.properties[data[1].drawingInfo.renderer.field1];
                  const legendItem = queryLayer.layer.legend.find(
                    (x) => x.values && x.values.includes(legendValue)
                  );
                  let iconUrl = legendItem
                    ? legendItem.fullurl
                    : queryLayer.layer.legend[0].fullurl;
                  return MapData.CreateFeatureLayerMarker(latlng, iconUrl);
                },
              })
              .addTo(map);
  
            queryLayer.theme = theme;
            MapData.QueryLayers.push(queryLayer);
            MapData.VisibleLayers = MapData.VisibleLayers.concat(
              {
                name: `${queryLayer.layer.name} (query)`,
                isQueryLayer: true,
                layer: queryLayer
              }
            );
          });
        }
      }
    };

    _service.DeleteAllQueryLayers = function () {
      _.each(MapData.QueryLayers, function (queryLayer) {
        //remove all querylayers, foreach remove the first index
        _service.DeleteQueryLayer(0);
      });
    };

    _service.DeleteQueryLayer = function (index) {
      if (index > -1) {
        let queryLayer = MapData.QueryLayers[index];
        if (queryLayer) {
          map.removeLayer(queryLayer.layer.mapData);
          MapData.QueryLayers.splice(index, 1);
          //remove querylayer from visiblelayers
          var visLayer = MapData.VisibleLayers.find(x => x.isQueryLayer === true & x.layer === queryLayer);
          if (visLayer) {
            MapData.VisibleLayers.splice(MapData.VisibleLayers.indexOf(visLayer), 1);
          }
        }
      }
    };

    _service.CleanThemes = function () {
      while (MapData.Themes.length != 0) {
        console.log("DELETING THIS THEME", MapData.Themes[0]);
        _service.DeleteTheme(MapData.Themes[0]);
      }
    };

    _service.DeleteTheme = function (theme) {
      map.removeLayer(theme.MapData); // this one works with ESRI And leaflet
      var themeIndex = MapData.Themes.indexOf(theme);
      if (themeIndex > -1) {
        MapData.Themes.splice(themeIndex, 1);
      }
      theme.VisibleLayers.forEach((visLayer) => {
        var visLayerIndex = MapData.VisibleLayers.indexOf(visLayer);
        if (visLayerIndex > -1) {
          MapData.VisibleLayers.splice(visLayerIndex, 1);
        }
      });
      MapData.CleanSearch();
    };

    _service.QueryLayerCount = function(theme, layerId, query) {
      var prom = MapService.AdvancedQueryCount(theme, layerId, query);
      prom.then(function(arg) {
      if (arg.count > 1000) {
        PopupService.Warning("U selecteerde " + arg.count + " resultaten.", "Bij meer dan 1000 resultaten kan het laden wat langer duren en heeft dit een negatieve impact op de performantie van SIK.");
      }});
    }

    _service.RGBToHex = function (red, green, blue) {
      return (
        "#" +
        _service.ComponentToHex(red) +
        _service.ComponentToHex(green) +
        _service.ComponentToHex(blue)
      );
    };

    _service.ComponentToHex = function (c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };

    return _service;
  };
  module.$inject = ["map", "ThemeCreater", "MapData", "GISService", "MapService", "PopupService"];
  module.factory("ThemeService", service);
})();
