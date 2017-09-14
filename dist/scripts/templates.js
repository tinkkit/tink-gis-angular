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
    "<div class=\"gepoPuntTemplate row relative-container flex-grow-1\">\n" +
    "<div class=\"col-xs-4 flex-column flex-grow-1 margin-top margin-bottom border-right\">\n" +
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
    "<input auto-focus type=search ng-keydown=\"$event.keyCode === 13 && enterPressed()\" ng-model=searchTerm ng-change=searchChanged() ng-model-options=\"{debounce: 350}\" placeholder=\"Geef een trefwoord in (minimum 3 tekens)\">\n" +
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
    "<div class=\"col-xs-4 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
    "<div>\n" +
    "<input class=searchbox ng-model=url ng-change=urlChanged() placeholder=\"Geef een wms url in\">\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-8 flex-column flex-grow-1 margin-top margin-bottom\">\n" +
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
    "<button class=btn ng-class=\"{active: mapctrl.IsBaseMap1==true}\" ng-click=mapctrl.toonBaseMap1() prevent-default-map>{{mapctrl.baseMap1Naam()}}</button>\n" +
    "<button class=btn ng-class=\"{active: mapctrl.IsBaseMap1==false}\" ng-click=mapctrl.toonBaseMap2() prevent-default-map>{{mapctrl.baseMap2Naam()}}</button>\n" +
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
    "<label for=chk{{thmctrl.theme.Naam}}> {{thmctrl.theme.Naam}} <span class=\"label-info hidden-print\" ng-show=\"thmctrl.theme.Type=='esri'\">ArcGIS</span><span class=\"label-info hidden-print\" ng-hide=\"thmctrl.theme.Type=='esri'\">{{thmctrl.theme.Type}}</span>\n" +
    "</label>\n" +
    "<button ng-hide=\"hidedelete == true\" style=\"flex-grow: 2\" class=\"trash hidden-print pull-right\" ng-click=thmctrl.deleteTheme()></button>\n" +
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
    "<tink-accordion-panel data-is-collapsed=srchrsltsctrl.collapsestatepergroup[layerGroupName]>\n" +
    "<data-header>\n" +
    "<p class=nav-aside-title>{{layerGroupName}} ({{srchrsltsctrl.aantalFeaturesMetType(layerGroupName)}})\n" +
    "<button prevent-default ng-click=srchrsltsctrl.deleteFeatureGroup(layerGroupName) class=\"trash pull-right\"></button>\n" +
    "</p>\n" +
    "</data-header>\n" +
    "<data-content>\n" +
    "<li ng-repeat=\"feature in srchrsltsctrl.features | filter: { layerName:layerGroupName } :true\" ng-mouseover=srchrsltsctrl.HoverOver(feature)>\n" +
    "<div class=mouse-over>\n" +
    "<a tink-tooltip={{feature.displayValue}} tink-tooltip-align=top ng-click=srchrsltsctrl.showDetails(feature)>{{ feature.displayValue| limitTo : 23 }}\n" +
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
