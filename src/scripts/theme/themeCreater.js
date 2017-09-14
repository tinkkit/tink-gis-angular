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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWVDcmVhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGhlbWVDcmVhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQVUsT0FBTyxDQW1CaEI7QUFuQkQsV0FBVSxPQUFPLEVBQUMsQ0FBQztJQUVmLENBQUM7UUFDRyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksT0FBTyxHQUFHO1lBQ1YsSUFBSSxZQUFZLEdBQVEsRUFBRSxDQUFDO1lBQzNCLFlBQVksQ0FBQyx5QkFBeUIsR0FBRyxVQUFVLE9BQU8sRUFBRSxTQUFTO2dCQUNqRSxJQUFJLEtBQUssR0FBRyxJQUFJLG1CQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFBO2dCQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztZQUNGLFlBQVksQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLElBQUksRUFBRSxHQUFHO2dCQUNyRCxJQUFJLEdBQUcsR0FBRyxJQUFJLGdCQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1QsQ0FBQyxFQW5CUyxPQUFPLEtBQVAsT0FBTyxRQW1CaEIifQ==