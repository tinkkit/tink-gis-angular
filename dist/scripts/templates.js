angular.module('tink.gis').run(['$templateCache', function($templateCache) {
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
    "<div class=row>\n" +
    "<div class=col-md-4>\n" +
    "<input class=searchbox ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 500}\" placeholder=\"Geef een trefwoord of een url in\">\n" +
    "<input disabled value=https://geodata.antwerpen.be/arcgissql/services/P_SiK/Groeninventaris/MapServer/WMSServer>\n" +
    "<div ng-if=!searchIsUrl ng-repeat=\"theme in availableThemes\">\n" +
    "<div ng-click=geopuntThemeChanged(theme) ng-class=\"{'greytext': theme.Type != 'wms' &&  theme.Type != 'esri'}\">\n" +
    "{{theme.Naam}}\n" +
    "<i ng-if=\"theme.Added == true\" class=\"fa fa-check-circle\"></i>\n" +
    "<i ng-if=\"theme.Added == null\" class=\"fa fa-check-circle-o\"></i>\n" +
    "</div>\n" +
    "</div>\n" +
    "<tink-pagination ng-hide=\"numberofrecordsmatched == 0\" tink-items-per-page-values=[5] tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div class=col-md-8>\n" +
    "<div ng-if=searchIsUrl>\n" +
    "<button ng-click=laadUrl()>Laad url</button>\n" +
    "</div>\n" +
    "<div ng-if=\"copySelectedTheme !== null\">\n" +
    "<button ng-if=\"copySelectedTheme.Added != false\" data-ng-click=AddOrUpdateTheme()>Update</button>\n" +
    "<p>{{copySelectedTheme.Description}}</p>\n" +
    "<p><small><a ng-href={{copySelectedTheme.CleanUrl}} target=_blank>Details</a></small></p>\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input indeterminate-checkbox child-list=copySelectedTheme.AllLayers property=enabled type=checkbox ng-model=copySelectedTheme.enabled id={{copySelectedTheme.name}}>\n" +
    "<label for={{copySelectedTheme.name}}> {{copySelectedTheme.name | limitTo: 99}}</label>\n" +
    "<div ng-repeat=\"mainlayer in copySelectedTheme.Layers\">\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input type=checkbox ng-model=mainlayer.enabled id={{mainlayer.name}}{{mainlayer.id}}>\n" +
    "<label for={{mainlayer.name}}{{mainlayer.id}}> {{mainlayer.title | limitTo: 99}}</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"groupLayer in copySelectedTheme.Groups\">\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input indeterminate-checkbox child-list=groupLayer.Layers property=enabled type=checkbox ng-model=groupLayer.enabled id={{groupLayer.name}}{{groupLayer.id}}>\n" +
    "<label for={{groupLayer.name}}{{groupLayer.id}}> {{groupLayer.title | limitTo: 99}}</label>\n" +
    "<div ng-repeat=\"layer in groupLayer.Layers\">\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input type=checkbox ng-model=layer.enabled ng-change=layer.chkChanged() id={{layer.name}}{{layer.id}}>\n" +
    "<label for={{layer.name}}{{layer.id}}> {{layer.title | limitTo: 99}}</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<button ng-if=\"copySelectedTheme.Added == false\" data-ng-click=AddOrUpdateTheme()>Toevoegen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/layermanagement/layerManagerTemplate.html',
    "<div>\n" +
    "<div class=modal-header>\n" +
    "<button type=button style=float:right data-ng-click=cancel()><i class=\"fa fa-times\"></i></button>\n" +
    "<h4 class=model-title>Laag toevoegen\n" +
    "</h4></div>\n" +
    "<div class=modal-content>\n" +
    "<ul class=nav-tabs>\n" +
    "<li role=presentation ng-class=\"{'active': active=='geopunt'}\"><a href=# ng-click=\"active='geopunt'\">GeoPunt</a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='solr'}\"><a href=\"\" ng-click=\"active='solr'\">SOLR</a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='url'}\"><a href=\"\" ng-click=\"active='url'\">Url</a></li>\n" +
    "</ul>\n" +
    "<geo-punt ng-show=\"active=='geopunt'\"></geo-punt>\n" +
    "<solr-gis ng-show=\"active=='solr'\"></solr-gis>\n" +
    "</div>\n" +
    "<div class=modal-footer>\n" +
    "<button data-ng-click=ok()>Klaar</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/layermanagement/solrGISTemplate.html',
    "<div class=row>\n" +
    "<div class=col-md-4>\n" +
    "<input class=searchbox ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 250}\" placeholder=\"Geef een trefwoord of een url in\">\n" +
    "<input disabled value=https://geodata.antwerpen.be/arcgissql/services/P_SiK/Groeninventaris/MapServer/WMSServer>\n" +
    "<div ng-if=!searchIsUrl ng-repeat=\"theme in availableThemes\">\n" +
    "<div ng-click=solrThemeChanged(theme) class=greytext>\n" +
    "{{theme.name}}\n" +
    "<div style=\"margin-left: 20px\" ng-repeat=\"layer in theme.layers\">\n" +
    "<span ng-class=\"{'blacktext': layer.isMatch}\">{{layer.naam}}<span ng-show=\"layer.featuresCount > 0\"> ({{layer.featuresCount}})</span> </span>\n" +
    "<div class=\"blacktext featureinsolr\">\n" +
    "{{layer.features.join(', ')}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<tink-pagination ng-hide=\"numberofrecordsmatched == 0\" tink-items-per-page-values=[5] tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div class=col-md-8>\n" +
    "<div ng-if=searchIsUrl>\n" +
    "<button ng-click=laadUrl()>Laad url</button>\n" +
    "</div>\n" +
    "<div ng-if=\"copySelectedTheme !== null\">\n" +
    "<button ng-if=\"copySelectedTheme.Added != false\" data-ng-click=AddOrUpdateTheme()>Update</button>\n" +
    "<p>{{copySelectedTheme.Description}}</p>\n" +
    "<p><small><a ng-href={{copySelectedTheme.CleanUrl}} target=_blank>Details</a></small></p>\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input indeterminate-checkbox child-list=copySelectedTheme.AllLayers property=enabled type=checkbox ng-model=copySelectedTheme.enabled id={{copySelectedTheme.name}}>\n" +
    "<label for={{copySelectedTheme.name}}> {{copySelectedTheme.name | limitTo: 99}}</label>\n" +
    "<div ng-repeat=\"mainlayer in copySelectedTheme.Layers\">\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input type=checkbox ng-model=mainlayer.enabled id={{mainlayer.name}}{{mainlayer.id}}>\n" +
    "<label for={{mainlayer.name}}{{mainlayer.id}}> {{mainlayer.title | limitTo: 99}}</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat=\"groupLayer in copySelectedTheme.Groups\">\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input indeterminate-checkbox child-list=groupLayer.Layers property=enabled type=checkbox ng-model=groupLayer.enabled id={{groupLayer.name}}{{groupLayer.id}}>\n" +
    "<label for={{groupLayer.name}}{{groupLayer.id}}> {{groupLayer.title | limitTo: 99}}</label>\n" +
    "<div ng-repeat=\"layer in groupLayer.Layers\">\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input type=checkbox ng-model=layer.enabled ng-change=layer.chkChanged() id={{layer.name}}{{layer.id}}>\n" +
    "<label for={{layer.name}}{{layer.id}}> {{layer.title | limitTo: 99}}</label>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<button ng-if=\"copySelectedTheme.Added == false\" data-ng-click=AddOrUpdateTheme()>Toevoegen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/groupLayerTemplate.html',
    "<div class=layercontroller-checkbox>\n" +
    "<input class=visible-box type=checkbox id={{grplyrctrl.grouplayer.name}}{{grplyrctrl.grouplayer.id}} ng-model=grplyrctrl.grouplayer.visible ng-change=grplyrctrl.chkChanged()>\n" +
    "<label for={{grplyrctrl.grouplayer.name}}{{grplyrctrl.grouplayer.id}}>{{grplyrctrl.grouplayer.name}}</label>\n" +
    "<div ng-repeat=\"layer in grplyrctrl.grouplayer.Layers | filter :  { enabled: true }\">\n" +
    "<tink-layer layer=layer>\n" +
    "</tink-layer>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/layerTemplate.html',
    "<div class=layercontroller-checkbox>\n" +
    "<img style=\"width:20px; height:20px\" ng-if=\"lyrctrl.layer.theme.Type == 'esri' && lyrctrl.layer.legend.length == 1\" ng-src={{lyrctrl.layer.legend[0].fullurl}}>\n" +
    "<input class=visible-box type=checkbox ng-model=lyrctrl.layer.visible ng-change=lyrctrl.chkChanged() id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>\n" +
    "<label ng-class=\"{'greytext': lyrctrl.layer.displayed == false}\" for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}> {{lyrctrl.layer.title | limitTo: 23}}<span ng-show=\"lyrctrl.layer.theme.Type == 'wms' && lyrctrl.layer.queryable\">(i)</span></label>\n" +
    "<img ng-if=\"lyrctrl.layer.theme.Type == 'wms'\" ng-src=\"{{layer.theme.CleanUrl}}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER={{lyrctrl.layer.id}}\"><img>\n" +
    "<div ng-if=\"lyrctrl.layer.theme.Type == 'esri' && lyrctrl.layer.legend.length > 1\" ng-repeat=\"legend in lyrctrl.layer.legend\">\n" +
    "<img style=\"width:20px; height:20px\" ng-src={{legend.fullurl}}><img><span> {{legend.label}}</span>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" id=rightaside data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\">\n" +
    "<aside>\n" +
    "<div class=nav-aside-section>\n" +
    "<ul id=sortableThemes ui-sortable=lyrsctrl.sortableOptions ng-model=lyrsctrl.themes>\n" +
    "<div ng-repeat=\"theme in lyrsctrl.themes\">\n" +
    "<tink-theme theme=theme>\n" +
    "</tink-theme>\n" +
    "</div>\n" +
    "</ul>\n" +
    "<button class=\"btn btn-primary addlayerbtn\" ng-click=lyrsctrl.AddLayers()>Voeg laag toe</button>\n" +
    "</div>\n" +
    "</aside>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/mapTemplate.html',
    "<div class=tink-map>\n" +
    "<div id=map class=leafletmap>\n" +
    "<div class=\"btn-group ll searchbtns\">\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==true}\" ng-click=\"mapctrl.ZoekenOpLocatie=true\" prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==false}\" ng-click=\"mapctrl.ZoekenOpLocatie=false\" prevent-default><i class=\"fa fa-download\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"ll zoekbalken\">\n" +
    "<input type=search class=zoekbalk ng-show=\"mapctrl.ZoekenOpLocatie == true\" placeholder=\"Geef een X,Y / locatie of POI in.\" ng-change=mapctrl.zoekLocChanged(mapctrl.zoekLoc) ng-keyup=\"$event.keyCode == 13 && mapctrl.zoekLocatie(mapctrl.zoekLoc)\" ng-model=mapctrl.zoekLoc prevent-default>\n" +
    "<input type=search class=zoekbalk ng-show=\"mapctrl.ZoekenOpLocatie == false\" placeholder=\"Geef een zoekterm\" prevent-default ng-keyup=\"$event.keyCode == 13 && mapctrl.zoekLaag(mapctrl.laagquery)\" ng-model=mapctrl.laagquery>\n" +
    "<select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers\" ng-model=mapctrl.selectedLayer ng-show=\"mapctrl.ZoekenOpLocatie == false\" ng-change=mapctrl.layerChange() ng-class=\"{invisible: mapctrl.SelectableLayers.length<=1}\" prevent-default></select>\n" +
    "</div>\n" +
    "<div class=\"btn-group btn-group-vertical ll interactiebtns\">\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('identify')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('select')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('meten')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='meten'}\" prevent-default><i class=\"fa fa-expand\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('watishier')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='watishier'}\" prevent-default><i class=\"fa fa-thumb-tack\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll metenbtns\" ng-show=mapctrl.showMetenControls>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('afstand')\" ng-class=\"{active: mapctrl.drawingType=='afstand'}\" type=button class=btn prevent-default><i class=\"fa fa-arrows-h\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('oppervlakte')\" ng-class=\"{active: mapctrl.drawingType=='oppervlakte'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll drawingbtns\" ng-show=mapctrl.showDrawControls>\n" +
    "<button ng-click=mapctrl.selectpunt() ng-class=\"{active: mapctrl.drawingType==''}\" type=button class=btn prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('lijn')\" ng-class=\"{active: mapctrl.drawingType=='lijn'}\" type=button class=btn prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('vierkant')\" ng-class=\"{active: mapctrl.drawingType=='vierkant'}\" type=button class=btn prevent-default><i class=\"fa fa-square-o\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('polygon')\" ng-class=\"{active: mapctrl.drawingType=='polygon'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"ll btn-group kaarttypes\">\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==true}\" ng-click=mapctrl.toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==false}\" ng-click=mapctrl.toonLuchtfoto() prevent-default>Luchtfoto</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group btn-group-vertical ll viewbtns\">\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.fullExtent() prevent-default><i class=\"fa fa-home\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group btn-group-vertical ll localiseerbtn\">\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"ll loading\" ng-show=\"mapctrl.Loading > 0\">\n" +
    "<div class=loader></div> {{mapctrl.MaxLoading - mapctrl.Loading}}/ {{mapctrl.MaxLoading}}\n" +
    "</div>\n" +
    "</div>\n" +
    "<tink-search></tink-search>\n" +
    "<tink-layers></tink-layers>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/themeTemplate.html',
    "<div>\n" +
    "<input class=visible-box type=checkbox id=chk{{thmctrl.theme.Naam}} ng-model=thmctrl.theme.Visible ng-change=thmctrl.chkChanged()>\n" +
    "<label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} <span ng-show=\"thmctrl.theme.Type=='esri'\">(stad)</span><span ng-hide=\"thmctrl.theme.Type=='esri'\">({{thmctrl.theme.Type}})</span></label><i class=\"fa fa-trash pull-right\" ng-click=thmctrl.deleteTheme()></i>\n" +
    "<div class=layercontroller-checkbox ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\">\n" +
    "<tink-layer layer=layer>\n" +
    "</tink-layer>\n" +
    "</div>\n" +
    "<div class=layercontroller-checkbox ng-repeat=\"group in thmctrl.theme.Groups | filter: { enabled: true }\">\n" +
    "<tink-grouplayer grouplayer=group>\n" +
    "</tink-grouplayer>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/bufferTemplate.html',
    "<div>\n" +
    "<div class=modal-header>\n" +
    "<button type=button style=float:right data-ng-click=cancel()><i class=\"fa fa-times\"></i></button>\n" +
    "<h4 class=model-title>Buffer instellen</h4>\n" +
    "</div>\n" +
    "<div class=modal-content>\n" +
    "Selecteer de laag:\n" +
    "<select ng-options=\"layer as layer.name for layer in SelectableLayers\" ng-model=selectedLayer prevent-default></select> Geef de bufferafstand:\n" +
    "<input type=number ng-model=buffer>\n" +
    "</div>\n" +
    "<div class=modal-footer>\n" +
    "<button data-ng-click=ok()>Klaar</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/searchResultsTemplate.html',
    "<div ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length > 0\">\n" +
    "<select ng-model=srchrsltsctrl.layerGroupFilter>\n" +
    "<option value=geenfilter selected>Geen filter ({{srchrsltsctrl.features.length}})</option>\n" +
    "<option ng-repeat=\"feat in srchrsltsctrl.featureLayers\" value={{feat}}>{{feat}} ({{srchrsltsctrl.aantalFeaturesMetType(feat)}})</option>\n" +
    "</select>\n" +
    "<ul ng-repeat=\"layerGroupName in srchrsltsctrl.featureLayers\">\n" +
    "<tink-accordion ng-if=\"srchrsltsctrl.layerGroupFilter=='geenfilter' || srchrsltsctrl.layerGroupFilter==layerGroupName \" data-start-open=true data-one-at-a-time=false>\n" +
    "<tink-accordion-panel>\n" +
    "<data-header>\n" +
    "<p class=nav-aside-title>{{layerGroupName}} ({{srchrsltsctrl.aantalFeaturesMetType(layerGroupName)}})\n" +
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=pull-right><i class=\"fa fa-trash\"></i></button>\n" +
    "</p>\n" +
    "</data-header>\n" +
    "<data-content>\n" +
    "<li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>\n" +
    "<a ng-if=!feature.hoverEdit ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue | limitTo : 23}}</a>\n" +
    "<div ng-if=feature.hoverEdit>\n" +
    "<a ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue}}\n" +
    "</a>\n" +
    "<a class=pull-right prevent-default ng-click=srchrsltsctrl.deleteFeature(feature)><i class=\"fa fa-trash\"></i></a>\n" +
    "</div>\n" +
    "</li>\n" +
    "</data-content>\n" +
    "</tink-accordion-panel>\n" +
    "</tink-accordion>\n" +
    "</ul>\n" +
    "<p></p><a ng-click=srchrsltsctrl.exportToCSV()>Export to CSV</a><p></p>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/searchSelectedTemplate.html',
    "<div ng-if=srchslctdctrl.selectedResult>\n" +
    "<div class=row>\n" +
    "<div class=col-md-4>\n" +
    "<button class=\"pull-left srchbtn\" ng-if=srchslctdctrl.prevResult ng-click=srchslctdctrl.vorige()>Vorige</button>\n" +
    "</div>\n" +
    "<div class=col-md-4>\n" +
    "<button class=srchbtn ng-click=srchslctdctrl.delete()>Delete</button>\n" +
    "</div>\n" +
    "<div class=col-md-4>\n" +
    "<button class=\"pull-right srchbtn\" ng-if=srchslctdctrl.nextResult ng-click=srchslctdctrl.volgende()>Volgende</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=row ng-repeat=\"prop in srchslctdctrl.props\">\n" +
    "<div class=col-md-5> {{ prop.key}} </div>\n" +
    "<div class=col-md-7 ng-if=\"prop.value.toLowerCase() != 'null'\">\n" +
    "<a ng-if=\" prop.value.indexOf( 'https://')==0 || prop.value.indexOf( 'http://')==0 \" ng-href={{prop.value}} target=_blank>Link</a>\n" +
    "<div ng-if=\"prop.value.indexOf( 'https://') !=0 && prop.value.indexOf( 'http://') !=0 \">{{ prop.value }}</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=row>\n" +
    "<div class=col-md-6>\n" +
    "<button class=\"pull-left srchbtn\" ng-click=srchslctdctrl.toonFeatureOpKaart()>Tonen</button>\n" +
    "</div>\n" +
    "<div class=col-md-6>\n" +
    "<button class=\"pull-left srchbtn\" ng-click=srchslctdctrl.doordruk()>Doordruk</button>\n" +
    "<button class=\"pull-left srchbtn\" ng-click=srchslctdctrl.buffer()>Buffer</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<button class=srchbtn ng-click=\"srchslctdctrl.close(srchslctdctrl.selectedResult) \">Terug naar resultaten</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/search/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" id=leftaside data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\">\n" +
    "<aside>\n" +
    "<div class=nav-aside-section ng-show=\"srchctrl.Loading == 0\">\n" +
    "<tink-search-results></tink-search-results>\n" +
    "<tink-search-selected></tink-search-selected>\n" +
    "</div>\n" +
    "<div class=nav-aside-section ng-show=\"srchctrl.Loading > 0\">\n" +
    "<div class=loader></div> {{srchctrl.MaxLoading - srchctrl.Loading}}/ {{srchctrl.MaxLoading}}\n" +
    "</div>\n" +
    "</aside>\n" +
    "</div>"
  );

}]);
