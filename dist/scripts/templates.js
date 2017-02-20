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
    "<div class=\"gepoPuntTemplate row relative-container\">\n" +
    "<div class=\"col-md-4 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<div ng-show=\"loading == false\" class=\"overflow-wrapper flex-grow-1 list-selectable margin-top margin-bottom\">\n" +
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
    "<tink-pagination ng-hide=\"numberofrecordsmatched <= 5\" tink-items-per-page-values=[5] tink-current-page=currentPage tink-change=pageChanged(page,perPage,next) tink-total-items=numberofrecordsmatched tink-items-per-page=recordsAPage></tink-pagination>\n" +
    "</div>\n" +
    "<div ng-if=\"loading == true\" class=loader>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-md-8 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
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
    "\n" +
    "<div class=\"layermanagerTemplate modal-header\">\n" +
    "<div class=\"row margin-bottom\">\n" +
    "<div class=col-xs-10>\n" +
    "<h4 class=model-title>Lagenbeheer\n" +
    "</h4></div>\n" +
    "<div class=col-xs-2>\n" +
    "<button class=pull-right type=button data-ng-click=cancel()><i class=\"fa fa-times\"></i></button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"modal-body flex-column flex-grow-1\">\n" +
    "<div class=\"row margin-top margin-bottom\">\n" +
    "<div class=\"col-xs-12 col-sm-6\">\n" +
    "<form>\n" +
    "<input type=search ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 250}\" placeholder=\"Geef een trefwoord of een url in\">\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=row>\n" +
    "<div class=col-xs-12>\n" +
    "<ul class=nav-tabs>\n" +
    "<li role=presentation ng-class=\"{'active': active=='solr'}\"><a href=\"\" ng-click=\"active='solr'\">Stad <span ng-if=\"solrLoading==true\" class=loader></span><span ng-if=\"solrLoading==false && solrCount != null\">({{solrCount}})</span></a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='geopunt'}\"><a href=\"\" ng-click=\"active='geopunt'\">GeoPunt <span ng-if=\"geopuntLoading==true\" class=loader></span><span ng-if=\"geopuntLoading==false && geopuntCount != null\">({{geopuntCount}})</span></a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='wmsurl'}\"><a href=\"\" ng-click=\"active='wmsurl'\">Url</a></li>\n" +
    "<li role=presentation ng-class=\"{'active': active=='beheer'}\"><a href=\"\" ng-click=\"active='beheer'\">Beheer</a></li>\n" +
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<solr-gis ng-show=\"active=='solr'\"></solr-gis>\n" +
    "<geo-punt ng-show=\"active=='geopunt'\"></geo-punt>\n" +
    "<wms-url ng-show=\"active=='wmsurl'\"></wms-url>\n" +
    "<layers-management ng-if=\"active=='beheer'\"></layers-management>\n" +
    "</div>"
  );


  $templateCache.put('templates/layermanagement/layersManagementTemplate.html',
    "<div class=\"layersManagementTemplate row relative-container flex-grow-1\">\n" +
    "<div class=\"col-md-4 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
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
    "<div class=\"col-md-8 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<preview-layer ng-if=copySelectedTheme theme=copySelectedTheme addorupdatefunc=AddOrUpdateTheme()>\n" +
    "</preview-layer>\n" +
    "</div>\n" +
    "</div>"
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
    "<p><small><a ng-href={{theme.CleanUrl}} target=_blank>Details</a></small></p>\n" +
    "</div>\n" +
    "<div class=\"layercontroller-checkbox overflow-wrapper margin-bottom flex-grow-1\">\n" +
    "<input indeterminate-checkbox child-list=theme.AllLayers property=enabled type=checkbox ng-model=theme.enabled id={{theme.name}}>\n" +
    "<label for={{theme.name}}>{{theme.name}}</label>\n" +
    "<div ng-repeat=\"mainlayer in theme.Layers\">\n" +
    "<tink-managementlayer layer=mainlayer></tink-managementlayer>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=text-align-right ng-show=\"theme !== null\">\n" +
    "<button class=\"btn-sm btn-primary\" ng-if=\"theme.Added == false\" ng-click=addorupdatefunc()>Toevoegen</button>\n" +
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
    "<a href=# class=theme-layer ng-click=solrThemeChanged(theme)>\n" +
    "<dt>{{theme.name}}</dt>\n" +
    "</a>\n" +
    "<dd ng-repeat=\"layer in theme.layers\">\n" +
    "<span>{{layer.naam}}\n" +
    "<span ng-show=\"layer.featuresCount > 0\"> ({{layer.featuresCount}})</span>\n" +
    "</span>\n" +
    "<div class=featureinsolr>\n" +
    "{{layer.features.join(', ')}}\n" +
    "</div>\n" +
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
    "<div class=\"col-md-4 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<div>\n" +
    "<input class=searchbox ng-model=url ng-change=urlChanged() placeholder=\"Geef een url in\">\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-md-8 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
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
    "</div>"
  );


  $templateCache.put('templates/other/layerTemplate.html',
    "<div ng-class=\"{'hidden-print': lyrctrl.layer.IsEnabledAndVisible == false}\">\n" +
    "<div ng-if=lyrctrl.layer.hasLayers>\n" +
    "<li class=\"li-item toc-item-without-icon can-open\" ng-class=\"{'open': showLayer}\">\n" +
    "<div>\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox id={{lyrctrl.layer.name}}{{lyrctrl.layer.id}} ng-model=lyrctrl.layer.visible ng-change=layercheckboxchange(lyrctrl.layer.theme)>\n" +
    "<label for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}>{{lyrctrl.layer.name}}</label>\n" +
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
    "<img class=layer-icon ng-if=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length==1\" ng-src=\"{{lyrctrl.layer.legend[0].fullurl}} \">\n" +
    "<div class=can-open ng-class=\"{'open': showLayer2}\">\n" +
    "<input class=\"visible-box hidden-print\" type=checkbox ng-model=lyrctrl.layer.visible ng-change=layercheckboxchange(lyrctrl.layer.theme) id=\"{{lyrctrl.layer.name}}{{lyrctrl.layer.id}} \">\n" +
    "<label ng-class=\"{ 'greytext': lyrctrl.layer.displayed==false} \" for={{lyrctrl.layer.name}}{{lyrctrl.layer.id}}> {{lyrctrl.layer.title}}\n" +
    "<span class=\"hidden-print greytext\" ng-show=\"lyrctrl.layer.theme.Type=='wms' && lyrctrl.layer.queryable\"> <i class=\"fa fa-info\"></i></span>\n" +
    "</label>\n" +
    "<span class=show-layer ng-show=\"lyrctrl.layer.theme.Type=='wms' && lyrctrl.layer.queryable \" ng-click=\"showLayer2 = !showLayer2\"></span>\n" +
    "<img class=normal-size ng-src={{lyrctrl.layer.legendUrl}} ng-show=showLayer2>\n" +
    "</div>\n" +
    "</li>\n" +
    "<ul class=li-item ng-if=\"lyrctrl.layer.theme.Type=='wms'\" ng-show=showLayer>\n" +
    "<li ng-if=\"lyrctrl.layer.theme.Type=='esri' && lyrctrl.layer.legend.length> 1\" ng-repeat=\"legend in lyrctrl.legends\">\n" +
    "<img style=\"width:20px; height:20px\" ng-src={{legend.url}}><img><span>²{{legend.label}}</span>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/other/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" id=rightaside data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\">\n" +
    "<aside class=\"flex-column flex-grow-1\">\n" +
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>Lagenoverzicht</p>\n" +
    "</div>\n" +
    "<button class=nav-right-toggle data-tink-sidenav-collapse=asideNavRight>\n" +
    "<a href=# title=\"Open menu\"><span class=sr-only>Open right menu</span></a>\n" +
    "</button>\n" +
    "<div class=\"flex-column flex-grow-1\">\n" +
    "<div ng-if=lyrsctrl.layerManagementButtonIsEnabled>\n" +
    "<div class=\"col-xs-12 margin-top margin-bottom\">\n" +
    "<button class=\"btn btn-primary center-block\" ng-click=lyrsctrl.Lagenbeheer()>Lagenbeheer</button>\n" +
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
    "<div class=\"ll drawingbtns\" ng-show=mapctrl.showDrawControls>\n" +
    "<div class=btn-group>\n" +
    "<button ng-click=mapctrl.selectpunt() ng-class=\"{active: mapctrl.drawingType==''}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een punt\" tink-tooltip-align=bottom><i class=\"fa fa-circle\" style=\"font-size: 0.75em\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('lijn')\" ng-class=\"{active: mapctrl.drawingType=='lijn'}\" type=button class=btn prevent-default-map><i class=\"fa fa-minus\" tink-tooltip=\"Selecteer met een lijn\" tink-tooltip-align=bottom></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('vierkant')\" ng-class=\"{active: mapctrl.drawingType=='vierkant'}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een vierkant\" tink-tooltip-align=bottom><i class=\"fa fa-square-o\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('polygon')\" ng-class=\"{active: mapctrl.drawingType=='polygon'}\" type=button class=btn prevent-default-map tink-tooltip=\"Selecteer met een veelhoek\" tink-tooltip-align=bottom><i class=\"fa fa-star-o\"></i></button>\n" +
    "</div>\n" +
    "<div class=select>\n" +
    "<select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers()\" ng-model=mapctrl.selectedLayer ng-show=\"mapctrl.SelectableLayers().length > 1\" ng-change=mapctrl.layerChange() prevent-default-map></select>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"btn-group btn-group-vertical ll interactiebtns\">\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('identify')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='identify'}\" tink-tooltip=Identificeren tink-tooltip-align=right prevent-default-map><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('select')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='select'}\" tink-tooltip=Selecteren tink-tooltip-align=right prevent-default-map><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('meten')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='meten'}\" tink-tooltip=Meten tink-tooltip-align=right prevent-default-map><i class=\"fa fa-expand\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"mapctrl.interactieButtonChanged('watishier')\" ng-class=\"{active: mapctrl.activeInteractieKnop=='watishier'}\" tink-tooltip=\"Wat is hier?\" tink-tooltip-align=right prevent-default-map><i class=\"fa fa-thumb-tack\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll kaarttypes\">\n" +
    "<button class=btn ng-class=\"{active: mapctrl.IsBaseMap1==true}\" ng-click=mapctrl.toonBaseMap1() prevent-default-map>{{mapctrl.baseMap1Naam()}}</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.IsBaseMap1==false}\" ng-click=mapctrl.toonBaseMap2() prevent-default-map>{{mapctrl.baseMap2Naam()}}</button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll metenbtns\" ng-show=mapctrl.showMetenControls>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('afstand')\" ng-class=\"{active: mapctrl.drawingType=='afstand'}\" type=button tink-tooltip=\"Meten afstand\" tink-tooltip-align=bottom class=btn prevent-default-map><i class=\"fa fa-arrows-h\"></i></button>\n" +
    "<button ng-click=\"mapctrl.drawingButtonChanged('oppervlakte')\" ng-class=\"{active: mapctrl.drawingType=='oppervlakte'}\" type=button tink-tooltip=\"Meten oppervlakte en omtrek\" tink-tooltip-align=bottom class=btn prevent-default-map><i class=\"fa fa-star-o\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"btn-group ll searchbtns\">\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==true}\" ng-click=mapctrl.fnZoekenOpLocatie() tink-tooltip=\"Zoeken op locatie\" tink-tooltip-align=bottom prevent-default-map><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: mapctrl.ZoekenOpLocatie==false}\" ng-click=mapctrl.ZoekenInLagen() tink-tooltip=\"Zoeken binnen lagen\" tink-tooltip-align=bottom prevent-default-map><i class=\"fa fa-download\"></i></button>\n" +
    "</div>\n" +
    "<form id=zoekbalken class=\"form-force-inline ll zoekbalken\">\n" +
    "<select ng-options=\"layer as layer.name for layer in mapctrl.SelectableLayers()\" ng-model=mapctrl.selectedFindLayer ng-show=\"mapctrl.SelectableLayers().length > 1\" ng-change=mapctrl.findLayerChange() prevent-default-map></select>\n" +
    "<input type=search ng-show=\"mapctrl.ZoekenOpLocatie == false\" placeholder=\"Geef een zoekterm\" prevent-default-map ng-keyup=\"$event.keyCode == 13 && mapctrl.zoekLaag(mapctrl.laagquery)\" ng-model=mapctrl.laagquery>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=map-buttons-right>\n" +
    "<div class=\"btn-group btn-group-vertical ll viewbtns\">\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomIn() prevent-default-map tink-tooltip=Inzoomen tink-tooltip-align=bottom><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomOut() prevent-default-map tink-tooltip=Uitzoomen tink-tooltip-align=bottom><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=mapctrl.zoomToGps() ng-class=\"{active: mapctrl.gpstracking==true}\" prevent-default-map tink-tooltip=\"Je locatie weergeven\" tink-tooltip-align=bottom><i class=\"fa fa-crosshairs\"></i></button>\n" +
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
    "<label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} <span class=\"label-info hidden-print\" ng-show=\"thmctrl.theme.Type=='esri'\">stad</span><span class=\"label-info hidden-print\" ng-hide=\"thmctrl.theme.Type=='esri'\">{{thmctrl.theme.Type}}</span></label>\n" +
    "<button ng-hide=\"hidedelete == true\" class=trash ng-click=thmctrl.deleteTheme()></button>\n" +
    "<ul class=\"ul-level no-theme-layercontroller-checkbox\" ng-repeat=\"layer in thmctrl.theme.Layers | filter: { enabled: true }\">\n" +
    "<tink-layer layer=layer layercheckboxchange=layercheckboxchange(layer.theme)>\n" +
    "</tink-layer>\n" +
    "</ul>\n" +
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
    "<div class=\"SEARCHRESULT flex-column\">\n" +
    "<div class=flex-column ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length == 0\">\n" +
    "<div class=\"col-xs-12 flex-grow-1 margin-top\">\n" +
    "Geen resultaten.\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"flex-column flex-grow-1 margin-top\" ng-if=\"!srchrsltsctrl.selectedResult && srchrsltsctrl.featureLayers.length > 0\">\n" +
    "<div>\n" +
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
    "<tink-accordion-panel data-is-collapsed=srchrsltsctrl.collapsestatepergroup[layerGroupName]>\n" +
    "<data-header>\n" +
    "<p class=nav-aside-title>{{layerGroupName}} ({{srchrsltsctrl.aantalFeaturesMetType(layerGroupName)}})\n" +
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=\"trash pull-right\"></button>\n" +
    "</p>\n" +
    "</data-header>\n" +
    "<data-content>\n" +
    "<li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>\n" +
    "<div class=mouse-over>\n" +
    "<a tink-tooltip={{feature.displayValue}} tink-tooltip-align=bottom ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue| limitTo : 23 }}\n" +
    "</a>\n" +
    "<button class=\"trash pull-right mouse-over-toshow\" prevent-default ng-click=srchrsltsctrl.deleteFeature(feature)></button>\n" +
    "</div>\n" +
    "</li>\n" +
    "</data-content>\n" +
    "</tink-accordion-panel>\n" +
    "</tink-accordion>\n" +
    "</ul>\n" +
    "</div>\n" +
    "<div class=\"margin-top margin-bottom\">\n" +
    "<div class=col-xs-12>\n" +
    "<button class=btn tink-tooltip=\"Exporteer naar CSV\" tink-tooltip-align=top ng-if=srchslctdctrl.exportToCSVButtonIsEnabled ng-click=srchrsltsctrl.exportToCSV()>\n" +
    "<i class=\"fa fa-file-excel-o\"></i>\n" +
    "</button>\n" +
    "<button class=btn ng-if=srchrsltsctrl.extraResultButtonIsEnabled ng-click=srchrsltsctrl.extraResultButton()>{{srchrsltsctrl.resultButtonText}}</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/search/searchSelectedTemplate.html',
    "<div class=\"SEARCHSELECTED flex-column flex-grow-1\" ng-if=srchslctdctrl.selectedResult class=extra-padding>\n" +
    "<div class=\"margin-top margin-bottom\">\n" +
    "<div class=col-xs-12>\n" +
    "<button class=btn tink-tooltip=Doordruk tink-tooltip-align=top ng-click=srchslctdctrl.doordruk()>\n" +
    "<i class=\"fa fa-square-o\"></i>\n" +
    "</button>\n" +
    "<button class=btn tink-tooltip=Buffer tink-tooltip-align=top ng-click=srchslctdctrl.buffer()>\n" +
    "<i class=\"fa fa-square\"></i>\n" +
    "</button>\n" +
    "<button class=btn tink-tooltip=\"Exporteer naar CSV\" tink-tooltip-align=top ng-if=srchslctdctrl.exportToCSVButtonIsEnabled ng-click=srchslctdctrl.exportToCSV()>\n" +
    "<i class=\"fa fa-file-excel-o\"></i>\n" +
    "</button>\n" +
    "<button class=\"btn-transparent trashcan pull-right\" ng-click=srchslctdctrl.delete()>\n" +
    "<i class=\"fa fa-trash-o\"></i>\n" +
    "</button>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-12 overflow-wrapper flex-grow-1\">\n" +
    "<dl ng-repeat=\"prop in srchslctdctrl.props\">\n" +
    "<dt>{{ prop.key}}</dt>\n" +
    "<div ng-if=\"prop.value.toLowerCase() != 'null'\">\n" +
    "<a ng-if=\" prop.value.indexOf( 'https://')==0 || prop.value.indexOf( 'http://')==0 \" ng-href={{prop.value}} target=_blank>% Link</a>\n" +
    "<dd ng-if=\"prop.value.indexOf( 'https://') !=0 && prop.value.indexOf( 'http://') !=0 \">{{ prop.value }}</dd>\n" +
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
    "<button class=\"btn-primary pull-right\" ng-click=srchslctdctrl.toonFeatureOpKaart()>Tonen</button>\n" +
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
    "<div class=nav-aside-section>\n" +
    "<p class=nav-aside-title>Resultaten</p>\n" +
    "</div>\n" +
    "<button class=nav-left-toggle data-tink-sidenav-collapse=asideNavLeft>\n" +
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
    "</div>"
  );

}]);
