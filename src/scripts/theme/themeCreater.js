'use strict';
var TinkGis;
(function (TinkGis) {
    (function () {
        var module = angular.module('tink.gis');
        var service = function () {
            var ThemeCreater = {};
            ThemeCreater.createARCGISThemeFromJson = function (rawdata, themeData) {
                let theme = new TinkGis.ArcGIStheme(rawdata, themeData);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWVDcmVhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGhlbWVDcmVhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQVUsT0FBTyxDQW1CaEI7QUFuQkQsV0FBVSxPQUFPO0lBRWIsQ0FBQztRQUNHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEMsSUFBSSxPQUFPLEdBQUc7WUFDVixJQUFJLFlBQVksR0FBUSxFQUFFLENBQUM7WUFDM0IsWUFBWSxDQUFDLHlCQUF5QixHQUFHLFVBQVUsT0FBTyxFQUFFLFNBQVM7Z0JBQ2pFLElBQUksS0FBSyxHQUFHLElBQUksUUFBQSxXQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFBO2dCQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztZQUNGLFlBQVksQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLElBQUksRUFBRSxHQUFHO2dCQUNyRCxJQUFJLEdBQUcsR0FBRyxJQUFJLFFBQUEsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNULENBQUMsRUFuQlMsT0FBTyxLQUFQLE9BQU8sUUFtQmhCIn0=