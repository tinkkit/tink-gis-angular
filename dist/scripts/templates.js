angular.module('tink.gis').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/external/streetView.html',
    "<html>\n" +
    "<head>\n" +
    "<meta charset=utf-8>\n" +
    "<title>Street View side-by-side</title>\n" +
    "<style>\n" +
    "html, body {\n" +
    "        height: 100%;\n" +
    "        margin: 0;\n" +
    "        padding: 0;\n" +
    "      }\n" +
    "      #map,  {\n" +
    "        float: left;\n" +
    "        height: 0%;\n" +
    "        width: 0%;\n" +
    "      }\n" +
    "       #pano {\n" +
    "        float: left;\n" +
    "        height: 100%;\n" +
    "        width: 100%;\n" +
    "      }\n" +
    "</style>\n" +
    "</head>\n" +
    "<body>\n" +
    "<div id=map></div>\n" +
    "<div id=pano></div>\n" +
    "<script>\n" +
    "function initialize() {\n" +
    "        \n" +
    "        var urlLat = parseFloat((location.search.split('lat=')[1]||'').split('&')[0]);\n" +
    "        var urlLng = parseFloat((location.search.split('lng=')[1]||'').split('&')[0]);\n" +
    "        var fenway = {lat:urlLat, lng: urlLng};\n" +
    "        var map = new google.maps.Map(document.getElementById('map'), {\n" +
    "          center: fenway,\n" +
    "          zoom: 14\n" +
    "        });\n" +
    "        var panorama = new google.maps.StreetViewPanorama(\n" +
    "            document.getElementById('pano'), {\n" +
    "              position: fenway,\n" +
    "              pov: {\n" +
    "                heading: 34,\n" +
    "                pitch: 10\n" +
    "              }\n" +
    "            });\n" +
    "        map.setStreetView(panorama);\n" +
    "      }\n" +
    "</script>\n" +
    "<script async defer src=\"https://maps.googleapis.com/maps/api/js?callback=initialize\">\n" +
    "</script>\n" +
    "</body>\n" +
    "</html>"
  );


  $templateCache.put('templates/layermanagement/geoPuntTemplate.html',
    "<div class=row>\n" +
    "<div class=\"col-md-4 scrollable\">\n" +
    "<input class=searchbox ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 500}\" placeholder=\"Geef een trefwoord of een url in\">\n" +
    "<input disabled value=https://geodata.antwerpen.be/arcgissql/services/P_SiK/Groeninventaris/MapServer/WMSServer>\n" +
    "<div ng-if=!searchIsUrl ng-repeat=\"theme in availableThemes\">\n" +
    "<div ng-click=geopuntThemeChanged(theme) ng-class=\"{'greytext': theme.Type != 'wms' &&  theme.Type != 'esri'}\">\n" +
    "{{theme.Naam}}\n" +
    "<i ng-if=\"theme.Added == true\" class=\"fa fa-check-circle\"></i>\n" +
    "<i ng-if=\"theme.Added == null\" class=\"fa fa-check-circle-o\"></i>\n" +
    "</div>\n" +
    "</div>\n" +
    "<tink-pagination ng-hide=\"numberofrecordsmatched <= 5\" tink-items-per-page-values=[5] tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div class=\"col-md-8 scrollable\">\n" +
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
    "</div>\n" +
    "<button ng-if=\"copySelectedTheme.Added == false\" data-ng-click=AddOrUpdateTheme()>Toevoegen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/layermanagement/layerManagerTemplate.html',
    "<div>\n" +
    "<div class=modal-header>\n" +
    "<button type=button style=float:right data-ng-click=cancel()><i class=\"fa fa-times\"></i></button>\n" +
    "<h4 class=model-title>Laag toevoegen\n" +
    "</h4></div>\n" +
    "<div class=modal-body>\n" +
    "<ul class=nav-tabs>\n" +
    "<li role=presentation ng-class=\"{'active': active=='solr'}\"><a href=\"\" ng-click=\"active='solr'\">Stad</a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='geopunt'}\"><a href=# ng-click=\"active='geopunt'\">GeoPunt</a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='Beheer'}\"><a href=\"\" ng-click=\"active='beheer'\">Beheer</a></li>\n" +
    "</ul>\n" +
    "<solr-gis ng-show=\"active=='solr'\"></solr-gis>\n" +
    "<geo-punt ng-show=\"active=='geopunt'\"></geo-punt>\n" +
    "</div>\n" +
    "<div class=modal-footer>\n" +
    "<button data-ng-click=ok()>Klaar</button>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/layermanagement/managementLayerTemplate.html',
    "<div ng-if=lyrctrl.layer.hasLayers>\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input indeterminate-checkbox child-list=lyrctrl.layer.AllLayers property=enabled type=checkbox ng-model=lyrctrl.layer.enabled id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>\n" +
    "<label for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}> {{lyrctrl.layer.title | limitTo: 99}}</label>\n" +
    "<div ng-repeat=\"lay in lyrctrl.layer.Layers\">\n" +
    "<tink-managementlayer layer=lay>\n" +
    "</tink-managementlayer>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=!lyrctrl.layer.hasLayers>\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input type=checkbox ng-model=\"lyrctrl.layer.enabled \" id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>\n" +
    "<label for=\"{{lyrctrl.layer.name}}{{lyrctrl.layer.id}} \"> {{lyrctrl.layer.title | limitTo: 99}}</label>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/layermanagement/solrGISTemplate.html',
    "<div class=\"row set-height\">\n" +
    "<div class=\"col-md-4 scrollable\">\n" +
    "<input class=searchbox ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 250}\" placeholder=\"Geef een trefwoord\">\n" +
    "<div ng-repeat=\"theme in availableThemes\">\n" +
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
    "<tink-pagination ng-hide=\"numberofrecordsmatched <= 5\" tink-items-per-page-values=[5] tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div class=\"col-md-8 scrollable\">\n" +
    "<div ng-if=\"copySelectedTheme !== null\">\n" +
    "<button ng-if=\"copySelectedTheme.Added != false\" data-ng-click=AddOrUpdateTheme()>Update</button>\n" +
    "<p>{{copySelectedTheme.Description}}</p>\n" +
    "<p><small><a ng-href={{copySelectedTheme.CleanUrl}} target=_blank>Details</a></small></p>\n" +
    "<div class=layercontroller-checkbox>\n" +
    "<input indeterminate-checkbox child-list=copySelectedTheme.AllLayers property=enabled type=checkbox ng-model=copySelectedTheme.enabled id={{copySelectedTheme.name}}>\n" +
    "<label for={{copySelectedTheme.name}}> {{copySelectedTheme.name | limitTo: 99}}</label>\n" +
    "<div ng-repeat=\"mainlayer in copySelectedTheme.Layers\">\n" +
    "<tink-managementlayer layer=mainlayer>\n" +
    "</tink-managementlayer>\n" +
    "</div>\n" +
    "</div>\n" +
    "<button ng-if=\"copySelectedTheme.Added == false\" data-ng-click=AddOrUpdateTheme()>Toevoegen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/other/layerTemplate.html',
    "<div class=layercontroller-checkbox ng-class=\"{'hidden-print': lyrctrl.layer.IsEnabledAndVisible == false}\">\n" +
    "<div ng-if=lyrctrl.layer.hasLayers>\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}} ng-model=lyrctrl.layer.visible ng-change=layercheckboxchange(lyrctrl.layer.theme)>\n" +
    "<label for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>{{lyrctrl.layer.name}}</label>\n" +
    "<div ng-repeat=\"layer in lyrctrl.layer.Layers | filter :  { enabled: true }\">\n" +
    "<tink-layer layer=layer layercheckboxchange=layercheckboxchange(layer.theme)>\n" +
    "</tink-layer>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-if=!lyrctrl.layer.hasLayers>\n" +
    "<img style=\"width:20px; height:20px\" ng-if=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length==1\" ng-src=\"{{lyrctrl.layer.legend[0].fullurl}} \">\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox ng-model=lyrctrl.layer.visible ng-change=layercheckboxchange(lyrctrl.layer.theme) id=\"{{lyrctrl.layer.name}}{{lyrctrl.layer.id}} \">\n" +
    "<label ng-class=\"{ 'greytext': lyrctrl.layer.displayed==false} \" for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}> {{lyrctrl.layer.title}}<span class=hidden-print ng-show=\"lyrctrl.layer.theme.Type=='wms' && lyrctrl.layer.queryable \">(i)</span></label>\n" +
    "<img ng-if=\"lyrctrl.layer.theme.Type=='wms' \" ng-src={{lyrctrl.layer.legendUrl}}><img>\n" +
    "<div ng-if=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length> 1\" ng-repeat=\"legend in lyrctrl.legends\">\n" +
    "<img style=\"width:20px; height:20px\" ng-src={{legend.url}}><img><span>²{{legend.label}}</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/other/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" id=rightaside data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\">\n" +
    "<aside>\n" +
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>Lagenoverzicht</p>\n" +
    "</div>\n" +
    "<button class=nav-right-toggle data-tink-sidenav-collapse=asideNavRight>\n" +
    "<a href=# title=\"Open menu\"><span class=sr-only>Open right menu</span></a>\n" +
    "</button>\n" +
    "<div>\n" +
    "<button class=\"btn btn-primary addlayerbtn\" ng-click=lyrsctrl.Lagenbeheer()>Lagenbeheer</button>\n" +
    "</div>\n" +
    "<div class=nav-aside-padding>\n" +
    "<ul id=sortableThemes ui-sortable=lyrsctrl.sortableOptions ng-model=lyrsctrl.themes>\n" +
    "<div ng-repeat=\"theme in lyrsctrl.themes\">\n" +
    "<tink-theme theme=theme layercheckboxchange=lyrsctrl.updatethemevisibility(theme) hidedelete=false>\n" +
    "</tink-theme>\n" +
    "</div>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</aside>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/other/mapTemplate.html',
    "<div class=tink-map>\n" +
    "<div class=printpart>\n" +
    "<div class=row>\n" +
    "<h4 class=col-xs-6>Stad in kaart</h4>\n" +
    "<div class=col-xs-6>\n" +
    "<div class=\"btn-group pull-right\">\n" +
    "<button type=button class=\"btn hidden-print\" ng-click=mapctrl.print()>Print</button>\n" +
    "<button type=button class=\"btn hidden-print\" ng-click=mapctrl.cancelPrint()>Annuleer</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group pull-right\" style=\"margin-right: 5px\">\n" +
    "<button type=button class=\"btn hidden-print\" ng-class=\"{active: mapctrl.printStyle=='portrait'}\" ng-click=mapctrl.portrait()>Staand</button>\n" +
    "<button type=button class=\"btn hidden-print\" ng-class=\"{active: mapctrl.printStyle=='landscape'}\" ng-click=mapctrl.landscape()>Liggend</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=mappart>\n" +
    "<tink-search class=tink-search></tink-search>\n" +
    "<div id=map class=leafletmap>\n" +
    "<div class=map-buttons-left>\n" +
    "<div class=\"btn-group ll drawingbtns\" ng-show=mapctrl.showDrawControls>\n" +
    "<button ng-click=mapctrl.selectpunt() ng-class=\"{active: mapctrl.drawingType==''}\" type=button class=btn prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('lijn')\" ng-class=\"{active: mapctrl.drawingType=='lijn'}\" type=button class=btn prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('vierkant')\" ng-class=\"{active: mapctrl.drawingType=='vierkant'}\" type=button class=btn prevent-default><i class=\"fa fa-square-o\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('polygon')\" ng-class=\"{active: mapctrl.drawingType=='polygon'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group btn-group-vertical ll interactiebtns\">\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('identify')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('select')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('meten')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='meten'}\" prevent-default><i class=\"fa fa-expand\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('watishier')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='watishier'}\" prevent-default><i class=\"fa fa-thumb-tack\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll kaarttypes\">\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==true}\" ng-click=mapctrl.toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.kaartIsGetoond==false}\" ng-click=mapctrl.toonLuchtfoto() prevent-default>Luchtfoto</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll metenbtns\" ng-show=mapctrl.showMetenControls>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('afstand')\" ng-class=\"{active: mapctrl.drawingType=='afstand'}\" type=button class=btn prevent-default><i class=\"fa fa-arrows-h\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('oppervlakte')\" ng-class=\"{active: mapctrl.drawingType=='oppervlakte'}\" type=button class=btn prevent-default><i class=\"fa fa-star-o\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll searchbtns\">\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==true}\" ng-click=\"mapctrl.ZoekenOpLocatie=true\" prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==false}\" ng-click=\"mapctrl.ZoekenOpLocatie=false\" prevent-default><i class=\"fa fa-download\"></i></button>\n" +
    "</div>\n" +
    "<div id=zoekbalken class=\"ll zoekbalken\">\n" +
    "<input id=locatiezoek class=\"zoekbalk typeahead\" ng-show=\"mapctrl.ZoekenOpLocatie == true\" placeholder=\"Geef een X,Y / locatie of POI in.\" prevent-default>\n" +
    "<input type=search class=zoekbalk ng-show=\"mapctrl.ZoekenOpLocatie == false\" placeholder=\"Geef een zoekterm\" prevent-default ng-keyup=\"$event.keyCode == 13 && mapctrl.zoekLaag(mapctrl.laagquery)\" ng-model=mapctrl.laagquery>\n" +
    "<select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers()\" ng-model=mapctrl.selectedLayer ng-show=\"mapctrl.activeInteractieKnop=='select' && mapctrl.SelectableLayers().length > 1\" ng-change=mapctrl.layerChange() prevent-default></select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=map-buttons-right>\n" +
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
    "</div>\n" +
    "<tink-layers class=tink-layers></tink-layers>\n" +
    "</div>\n" +
    "<div class=printpart>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-2>\n" +
    "<img class=\"float-left print-corner-image\" src=https://www.antwerpen.be/assets/aOS/gfx/gui/a-logo.svg alt=\"Antwerpen logo\">\n" +
    "</div>\n" +
    "<div class=col-xs-8>Voorbehoud: De kaart is een reproductie zonder juridische waarde. Zij bevat kaartmateriaal en info afkomstig van het stadsbestuur Antwerpen, AGIV, AAPD, Provinciebesturen en mogelijk nog andere organisaties.\n" +
    "</div>\n" +
    "<div class=col-xs-2>\n" +
    "<img class=\"float-right print-corner-image\" src=http://images.vectorhq.com/images/previews/111/north-arrow-orienteering-137692.png alt=\"Noord pijl oriëntatielopen\">\n" +
    "</div>\n" +
    "</div>\n" +
    "</div></div>"
  );


  $templateCache.put('templates/other/themeTemplate.html',
    "<div>\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox id=chk{{thmctrl.theme.Naam}} ng-model=thmctrl.theme.Visible ng-change=layercheckboxchange(thmctrl.theme)>\n" +
    "<label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} <span class=hidden-print ng-show=\"thmctrl.theme.Type=='esri'\">(stad)</span><span class=hidden-print ng-hide=\"thmctrl.theme.Type=='esri'\">({{thmctrl.theme.Type}})</span></label>\n" +
    "<button ng-hide=\"hidedelete == true\" class=\"trash pull-right\" ng-click=thmctrl.deleteTheme()></button>\n" +
    "<div class=layercontroller-checkbox ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\">\n" +
    "<tink-layer layer=layer layercheckboxchange=layercheckboxchange(layer.theme)>\n" +
    "</tink-layer>\n" +
    "</div>\n" +
    "</div>\n"
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
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=\"trash pull-right\"></button>\n" +
    "</p>\n" +
    "</data-header>\n" +
    "<data-content>\n" +
    "<li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>\n" +
    "<a ng-if=!feature.hoverEdit ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue | limitTo : 23}}</a>\n" +
    "<div ng-if=feature.hoverEdit>\n" +
    "<a ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue}}\n" +
    "</a>\n" +
    "<button class=\"trash pull-right\" prevent-default ng-click=srchrsltsctrl.deleteFeature(feature)></button>\n" +
    "</div>\n" +
    "</li>\n" +
    "</data-content>\n" +
    "</tink-accordion-panel>\n" +
    "</tink-accordion>\n" +
    "</ul>\n" +
    "<button class=\"btn-sm margin-left margin-top\" ng-click=srchrsltsctrl.exportToCSV()>Exporteer naar CSV</button>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/search/searchSelectedTemplate.html',
    "<div ng-if=srchslctdctrl.selectedResult class=nav-aside-padding>\n" +
    "<div class=\"row margin-top margin-bottom\">\n" +
    "<div class=col-xs-12>\n" +
    "<div class=btn-group>\n" +
    "<button type=button class=btn ng-if=srchslctdctrl.prevResult ng-click=srchslctdctrl.vorige()>Vorige</button>\n" +
    "<button type=button class=btn ng-if=srchslctdctrl.nextResult ng-click=srchslctdctrl.volgende()>Volgende</button>\n" +
    "</div>\n" +
    "<button class=\"srchbtn btn pull-right\" ng-click=srchslctdctrl.delete()>Verwijderen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<dl ng-repeat=\"prop in srchslctdctrl.props\">\n" +
    "<dt>{{ prop.key}}</dt>\n" +
    "<div ng-if=\"prop.value.toLowerCase() != 'null'\">\n" +
    "<a ng-if=\" prop.value.indexOf( 'https://')==0 || prop.value.indexOf( 'http://')==0 \" ng-href={{prop.value}} target=_blank>% Link</a>\n" +
    "<dd ng-if=\"prop.value.indexOf( 'https://') !=0 && prop.value.indexOf( 'http://') !=0 \">{{ prop.value }}</dd>\n" +
    "</div>\n" +
    "</dl>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-4>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "<button class=\"btn-primary srchbtn\" ng-click=srchslctdctrl.toonFeatureOpKaart()>Tonen</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=col-xs-8>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-6>\n" +
    "<button class=\"srchbtn pull-right\" ng-click=srchslctdctrl.buffer()>Zone</button>\n" +
    "</div>\n" +
    "<div class=col-xs-6>\n" +
    "<button class=\"srchbtn pull-right\" ng-click=srchslctdctrl.buffer()>Buffer</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"row margin-top margin-bottom\">\n" +
    "<div class=col-xs-4>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=col-xs-8>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "<a class=\"srchbtn pull-right\" ng-click=srchslctdctrl.close(srchslctdctrl.selectedResult)>Terug naar resultaten</a>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/search/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" id=leftaside data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\">\n" +
    "<aside>\n" +
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>Resultaten</p>\n" +
    "</div>\n" +
    "<button class=nav-left-toggle data-tink-sidenav-collapse=asideNavLeft>\n" +
    "<a href=# title=\"Open menu\"><span class=sr-only>Open left menu</span></a>\n" +
    "</button>\n" +
    "<div ng-show=\"srchctrl.Loading == 0\">\n" +
    "<tink-search-results></tink-search-results>\n" +
    "<tink-search-selected></tink-search-selected>\n" +
    "</div>\n" +
    "<div ng-show=\"srchctrl.Loading > 0\">\n" +
    "<div class=loader></div> {{srchctrl.LoadedCount()}} / {{srchctrl.MaxLoading}}\n" +
    "</div>\n" +
    "</aside>\n" +
    "</div>\n"
  );

}]);
