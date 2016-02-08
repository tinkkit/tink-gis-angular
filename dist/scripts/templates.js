angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/layer.html',
    "<input style=\"opacity: 1;position: relative;z-index:100\" type=checkbox ng-model=layerData.visible ng-change=changeVisibility(layerData.url)>\n" +
    "{{layerData.name}}"
  );


  $templateCache.put('templates/layersTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> Layers <tink-accordion data-start-open=true> <div ng-repeat=\"theme in layers\"> <tink-accordion-panel> <data-header>  </data-header> <data-content>  <tink-accordion data-start-open=true> <div ng-repeat=\"group in theme.groups\"> <tink-accordion-panel> <data-header>  </data-header> <data-content> <div ng-repeat=\"layerhup in layers\"> <layer layer-data=layerhup></layer> </div> </data-content> </tink-accordion-panel> </div> </tink-accordion> </data-content> </tink-accordion-panel> </div> </tink-accordion> </div> </aside> </div>"
  );


  $templateCache.put('templates/mapTemplate.html',
    "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=identify() ng-class=\"{active: activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=select() ng-class=\"{active: activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: activeInteractieKnop=='dunno'}\" prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in Layers track by layer.id\" ng-model=selectedlayer ng-change=layerChange() ng-class=\"{invisible: activeInteractieKnop!='select'}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: kaartIsGetoond==true}\" ng-click=toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: kaartIsGetoond==false}\" ng-click=toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-layers></tink-layers> <tink-search> </tink-search></div>"
  );


  $templateCache.put('templates/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> Zoek <div ng-repeat=\"feature in features \"> layerid: {{feature.layerId}} <pre>{{feature.properties | json }}</pre> </div> </div> </aside> </div>"
  );

}]);
