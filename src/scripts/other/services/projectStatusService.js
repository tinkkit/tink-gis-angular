("use strict");
(function () {
  var module;
  try {
    module = angular.module("tink.gis");
  } catch (e) {
    module = angular.module("tink.gis", [
      "tink.accordion",
      "tink.tinkApi",
      "tink.modal",
    ]); //'leaflet-directive'
  }
  var projectStatusService = function (PopupService) {
    let toast = null;
    let themes = [];
    var _projectStatusService = {};
    //todo check if we are importing project
    //==> project to import ==> set toast notification that application is loading the project
    //==> hold status if every theme of project is loaded
    //==> if loaded remove the toast that application is loading
    _projectStatusService.SetProject = function (project) {
      if (toast == null && project.themes.length > 0) {
        toast = PopupService.Warning(
          "Laden project",
          "Project wordt geladen...",
          null,
          { timeOut: 0 }
        );
        themes = project.themes;
      }
    };
    _projectStatusService.ThemeLoaded = function () {
      if (themes.length > 0) {
        themes.pop();
        if (themes.length === 0) {
          PopupService.ClearToast(toast);
          toast = null;
        }
      }
    };
    return _projectStatusService;
  };
  module.factory("ProjectStatusService", projectStatusService);
})();
