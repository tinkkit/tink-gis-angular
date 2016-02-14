angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/groupLayerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=grouplayer.visible ng-change=visChanged()>{{grouplayer.name}} <div ng-repeat=\"layer in grouplayer.Layers\"> <tink-layer layer=layer> </tink-layer> </div> </div>"
  );


  $templateCache.put('templates/layerTemplate.html',
    "<div class=layercontroller-checkbox> <input class=visible-box type=checkbox ng-model=layer.visible ng-change=visChanged()>{{layer.name | limitTo: 20}} </div>"
  );


  $templateCache.put('templates/layerstemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <ul ui-sortable ng-model=themes> <div ng-repeat=\"theme in themes\"> <tink-theme theme=theme> </tink-theme> </div> </ul> </div> </aside> </div>"
  );


  $templateCache.put('templates/maptemplate.html',
    "<div class=tink-map> <div id=map class=leafletmap> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn prevent-default><i class=\"fa fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=btn ng-click=identify() ng-class=\"{active: activeInteractieKnop=='identify'}\" prevent-default><i class=\"fa fa-info\"></i></button>\n" +
    "<button type=button class=btn ng-click=select() ng-class=\"{active: activeInteractieKnop=='select'}\" prevent-default><i class=\"fa fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn ng-class=\"{active: activeInteractieKnop=='dunno'}\" prevent-default><i class=\"fa fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input class=zoekbalk placeholder=\"Welke locatie of adres zoek je?\" prevent-default> <select ng-options=\"layer as layer.name for layer in SelectableLayers track by layer.id\" ng-model=selectedLayer ng-change=layerChange() ng-class=\"{invisible: activeInteractieKnop!='select'}\" prevent-default></select> </div> <div class=\"ll btn-group kaarttypes\"> <button class=btn ng-class=\"{active: kaartIsGetoond==true}\" ng-click=toonKaart() prevent-default>Kaart</button>\n" +
    "<button class=btn ng-class=\"{active: kaartIsGetoond==false}\" ng-click=toonLuchtfoto() prevent-default>Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn ng-click=zoomIn() prevent-default><i class=\"fa fa-plus\"></i></button>\n" +
    "<button type=button class=btn ng-click=zoomOut() prevent-default><i class=\"fa fa-minus\"></i></button>\n" +
    "<button type=button class=btn ng-click=\"\" prevent-default><i class=\"fa fa-crosshairs\"></i></button>\n" +
    "<button type=button class=btn ng-click=fullExtent() prevent-default><i class=\"fa fa-home\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll localiseerbtn\"> <button type=button class=btn prevent-default><i class=\"fa fa-male\"></i></button> </div> </div> <tink-layers></tink-layers> <tink-search></tink-search> </div>"
  );


  $templateCache.put('templates/searchTemplate.html',
    "<div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavLeft class=\"nav-aside nav-left\"> <aside> <div class=nav-aside-section> Zoek\n" +
    "<button ng-click=vm.test()>test</button> <div ng-repeat=\"feature in vm.features \"> test layerid: {{feature.layerId}} <pre>{{feature.properties | json }}</pre> </div> </div> </aside> </div>"
  );


  $templateCache.put('templates/themeTemplate.html',
    "<div><input class=visible-box type=checkbox ng-model=theme.Visible ng-change=visChanged()>{{theme.Naam}} <div class=layercontroller-checkbox ng-repeat=\"layer in theme.Layers\"> <tink-layer layer=layer> </tink-layer> </div> <div class=layercontroller-checkbox ng-repeat=\"group in theme.Groups\"> <tink-grouplayer grouplayer=group> </tink-grouplayer> </div> </div>"
  );

}]);
