// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-12-01 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.js',

            'bower_components/angular/angular.js',
            'bower_components/leaflet-dist/leaflet.js',

            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',



            'bower_components/lodash/lodash.js',
            'bower_components/tink-api-javascript/dist/tink-api-javascript.js',
            'bower_components/tink-api-angular/dist/tink-api-angular.js',
            'bower_components/tink-navigation-angular/dist/tink-navigation-angular.js',
            'bower_components/moment/moment.js',
            'bower_components/sprintf/src/sprintf.js',
            'bower_components/angular-logger/dist/angular-logger.min.js',
            'bower_components/leaflet/dist/leaflet-src.js',
            'bower_components/tink-accordion-angular/dist/tink-accordion-angular.js',
            'bower_components/jquery-ui/jquery-ui.js',
            'bower_components/angular-ui-sortable/sortable.js',
            'bower_components/proj4/dist/proj4.js',
            'bower_components/angular-filter/dist/angular-filter.min.js',
            'bower_components/leaflet-draw/dist/leaflet.draw-src.js',
            'bower_components/jxon/index.js',
            'bower_components/sweetalert/dist/sweetalert.min.js',
            'bower_components/ng-lodash/build/ng-lodash.js',
            'bower_components/tink-helper-safe-apply-angular/dist/tink-helper-safe-apply-angular.js',
            'bower_components/tink-pagination-angular/dist/tink-pagination-angular.js',

            'bower_components/leaflet-geodesy/leaflet-geodesy.js',
            'bower_components/esri-leaflet/dist/esri-leaflet.js',
            'bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
            'bower_components/angular-mocks/angular-mocks.js',

            'bower_components/tink-modal-angular/dist/tink-modal-angular.js',

            'bower_components/angular-filter/dist/angular-filter.js',
            'bower_components/Proj4Leaflet/src/proj4leaflet.js',



            'scripts/globals.js',
            'scripts/app.js',

            'scripts/other/directives/mapDirective.js',
            'scripts/other/services/WMSService.js',

            'scripts/other/services/baseLayersService.js',
            'scripts/other/services/mapService.js',
            'scripts/other/services/layersService.js',
            'scripts/other/services/themeHelper.js',
            'scripts/other/services/themeService.js',
            'scripts/other/services/mapData.js',
            'scripts/other/services/GISService.js',
            'scripts/other/services/helperService.js',
            'scripts/other/services/mapEvents.js',
            'scripts/other/services/drawService.js',
            'scripts/other/services/externService.js',


            'scripts/other/controllers/mapController.js',
            'scripts/other/controllers/layersController.js',
            'scripts/other/controllers/layerController.js',
            'scripts/other/controllers/groupLayerController.js',
            'scripts/other/controllers/themeController.js',


            'scripts/other/directives/layerDirective.js',
            'scripts/other/directives/layersDirective.js',
            'scripts/other/directives/groupLayerDirective.js',
            'scripts/other/directives/themeDirective.js',
            'scripts/other/directives/indeterminateCheckbox.js',

            'scripts/layerManagement/services/geopuntService.js',
            'scripts/layerManagement/services/layerManagementService.js',

            'scripts/layerManagement/controllers/layerManagerController.js',
            'scripts/layerManagement/controllers/geoPuntController.js',
            'scripts/layerManagement/controllers/solrGISController.js',
            'scripts/layerManagement/directives/geoPuntDirective.js',
            'scripts/layerManagement/directives/solrGISDirective.js',



            'scripts/search/services/searchService.js',
            'scripts/search/services/resultsData.js',

            'scripts/search/controllers/searchController.js',
            'scripts/search/controllers/searchSelectedController.js',
            'scripts/search/controllers/searchResultsController.js',
            'scripts/search/directives/searchDirective.js',
            'scripts/search/directives/searchResultsDirective.js',
            'scripts/search/directives/searchSelectedDirective.js',


            'scripts/shared/logger.js',
            'scripts/shared/errorhandler.js',
            'scripts/shared/leafletDrawNL.js',

            'test/mock/{,*/}*.js',
            'test/spec/{,*/}*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS2
        // - IE (only Windows)
        browsers: [
            'Chrome'
        ],
        preprocessors: {
            'src/templates/{,*/}*.html': 'html2js'
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: '../templates/',  // <-- change as needed for the project
            // include beforeEach(module('templates')) in unit tests
            moduleName: 'templates'
        },

        // Which plugins to enable
        plugins: [
            'karma-jasmine',
            'karma-phantomjs2-launcher',
            'karma-chrome-launcher',
            'karma-sauce-launcher',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
