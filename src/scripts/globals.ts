/* global ThemeStatus, LayerType */
var ThemeStatus = { // http://stijndewitt.com/2014/01/26/enums-in-javascript/
    UNMODIFIED: 0,
    NEW: 1,
    UPDATED: 2,
    DELETED: 3
};
var LayerType = {
    LAYER: 0,
    GROUP: 1
};
var ActiveInteractieButton = {
    GEEN: 'geen',
    IDENTIFY: 'identify',
    SELECT: 'select',
    METEN: 'meten',
    WATISHIER: 'watishier'
};
var GAAS = {
    // ReversedGeocodeUrl : ' https://reversedgeocode-p.antwerpen.be/api/' CHANGE BACK BEFORE MTP!!! ONLY FOR TESTING IN ACC 
    // NEEDS TO BE A LINK TO APISTORE AS WELL
    ReversedGeocodeUrl : 'https://reversedgeocoding-app1-p.antwerpen.be/'
    // link to API Store
    // ReversedGeocodeUrl : 'https://api-gw-p.antwerpen.be/gis/reversedgeocoding/v1/'
}
var Gis = {
    Arcgissql: '',
    BaseUrl: 'https://geoint.antwerpen.be/',
    PublicBaseUrl: 'https://geodata.antwerpen.be/',
    LocatieUrl: 'https://geoint-a.antwerpen.be/arcgissql/rest/services/A_DA/Locaties/MapServer',
    GeometryUrl: 'https://geoint.antwerpen.be/arcgissql/rest/services/Utilities/Geometry/GeometryServer/buffer'
}
Gis.Arcgissql = Gis.BaseUrl + 'arcgissql/rest/';
var Solr = {
    BaseUrl: 'https://esb-app1-o.antwerpen.be/v1/'
}
var LocationPicker = {
    BaseUrl: 'https://api-gw-o.antwerpen.be/gis/locationpicker/v2/',
    ApiKey: '04c0f399-9e6a-4655-9b9b-a1b3f567c877'
}
const DrawingOption = {
    GEEN: 'geen',
    NIETS: '',
    AFSTAND: 'afstand',
    OPPERVLAKTE: 'oppervlakte',
    LIJN: 'lijn',
    VIERKANT: 'vierkant',
    POLYGON: 'polygon'
};
var Global = { Mobile : false }
var ThemeType = {
    ESRI: 'esri',
    WMS: 'wms'
};
var Style = {
    DEFAULT: {
        fillOpacity: 0,
        color: 'blue',
        weight: 4
    },
    ADD: {
        fillOpacity: 0,
        color: 'green',
        weight: 5
    },
    REMOVE: {
        fillOpacity: 0,
        color: 'red',
        weight: 5
    },
    HIGHLIGHT: {
        weight: 7,
        color: 'red',
        fillOpacity: 0.5
    },
    COREBUFFER: {
        weight: 7,
        color: 'lightgreen',
        fillOpacity: 0.5
    },
    BUFFER: {
        fillColor: '#00cc00',
        color: '#00cc00',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.3
    }
};

var Scales = [
    250000,
    200000,
    150000,
    100000,
    50000,
    25000,
    20000,
    15000,
    12500,
    10000,
    7500,
    5000,
    2500,
    2000,
    1500,
    1250,
    1000,
    750,
    500,
    250,
    100
];
// (<any>window).Scales = Scales;