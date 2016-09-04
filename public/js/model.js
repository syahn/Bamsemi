var app = app || {};


app.Model = function() {
    "use strict";

    var self = this;

    self.locations = [];
    self.logos = {
        "hollys" : "image/logo_hollys.png",
        "tomntoms" : "image/logo_tomntoms.png"
    };

    self.init = function() {

        var locationRef = firebase.database().ref('/locations');

        locationRef.on('value', function(snapshot) {
            var cafes = snapshot.val();
            for (var cafe in cafes) {
                if (cafes.hasOwnProperty(cafe)) {
                    self.locations.push(cafes[cafe]);
                }
            }

            app.mv.initMap();
            ko.applyBindings(app.vm);
            });
    };
};
