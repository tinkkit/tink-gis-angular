angular.module('tink.gis.angular').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/tinkmaptemplate.html',
    "<div class=tink-map> <div data-tink-nav-aside=\"\" data-auto-select=true data-toggle-id=asideNavRight class=\"nav-aside nav-right\"> <aside> <div class=nav-aside-section> <p class=nav-aside-title>Section title</p> <ul> <li> <a href=#> <span>Menu item</span> </a> </li> <li> <a href=#> <span>Menu item with badge</span>\n" +
    "<span class=badge>2</span> </a> </li> <li> <a href=#> <span>Menu item with submenu items</span> </a> <ul> <li> <a href=#> <span>Submenu item</span> </a> </li> <li> <a href=#> <span>Submenu item with badge</span>\n" +
    "<span class=badge>8</span> </a> </li> </ul> </li> <li> <a href=#> <i class=\"fa fa-fw fa-cogs\"></i>\n" +
    "<span>Menu item with icon</span> </a> </li> </ul> </div> </aside> </div> <leaflet class=leafletmap center=center layers=layers controls defaults=defaults> <div class=\"btn-group ll searchbtns\"> <button type=button class=btn><i class=\"fa fa-fw fa-map-marker\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-fw fa-download\"></i></button> </div> <div class=\"btn-group btn-group-vertical ll interactiebtns\"> <button type=button class=\"btn active\"><i class=\"fa fa-fw fa-info\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-fw fa-mouse-pointer\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-fw fa-download\"></i></button> </div> <div class=\"ll zoekbalken\"> <input id=zoekbalk1 placeholder=\"Welke locatie of adres zoek je?\">\n" +
    "<input class=invisible placeholder=\"Welke locatie of adres zoek je?\"> </div> <div class=\"ll btn-group ll kaarttypes\"> <button class=\"btn btn-xs active\" ng-click=\"changeBaseLayer('kaart')\">Kaart</button>\n" +
    "<button class=\"btn btn-xs\" ng-click=\"changeBaseLayer('luchtfoto')\">Luchtfoto</button> </div> <div class=\"btn-group btn-group-vertical ll viewbtns\"> <button type=button class=btn><i class=\"fa fa-fw fa-plus\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-fw fa-minus\"></i></button>\n" +
    "<button type=button class=btn><i class=\"fa fa-fw fa-crosshairs\"></i></button> </div> <div class=\"ll localiseerbtn\"> <button type=button class=btn><i class=\"fa fa-fw fa-male\"></i></button> </div> </leaflet> </div>"
  );

}]);
