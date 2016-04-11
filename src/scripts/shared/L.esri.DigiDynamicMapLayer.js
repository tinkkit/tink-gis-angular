'use strict'
L.esri.DigiDynamicMapLayer = L.esri.Layers.DynamicMapLayer.extend({

    // blabla: this.on('load', function(dsg) {
    //     console.log("BLALBLBAAA");
    // }
    // _renderImage: function(params) {
    //     console.log("IMAGE GERENDERED");
    //     // this._super(params);
    //     if (this._map) {
    //         // create a new image overlay and add it to the map
    //         // to start loading the image
    //         // opacity is 0 while the image is loading
    //         var image = new L.ImageOverlay(url, bounds, {
    //             opacity: 0
    //         }).addTo(this._map);

    //         // once the image loads
    //         image.once('load', function(e) {
    //             var newImage = e.target;
    //             var oldImage = this._currentImage;

    //             // if the bounds of this image matches the bounds that
    //             // _renderImage was called with and we have a map with the same bounds
    //             // hide the old image if there is one and set the opacity
    //             // of the new image otherwise remove the new image
    //             if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
    //                 this._currentImage = newImage;

    //                 if (this.options.position === 'front') {
    //                     this.bringToFront();
    //                 } else {
    //                     this.bringToBack();
    //                 }

    //                 if (this._map && this._currentImage._map) {
    //                     this._currentImage.setOpacity(this.options.opacity);
    //                 } else {
    //                     this._currentImage._map.removeLayer(this._currentImage);
    //                 }

    //                 if (oldImage && this._map) {
    //                     this._map.removeLayer(oldImage);
    //                 }

    //                 if (oldImage && oldImage._map) {
    //                     oldImage._map.removeLayer(oldImage);
    //                 }
    //             } else {
    //                 this._map.removeLayer(newImage);
    //             }

    //             this.fire('load', {
    //                 bounds: bounds
    //             });

    //         }, this);

    //         this.fire('loading', {
    //             bounds: bounds
    //         });
    //     }
    // }

});

L.esri.digiDynamicMapLayer = function(options) {
    return new L.esri.DigiDynamicMapLayer(options);
};