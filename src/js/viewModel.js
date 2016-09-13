var app = app || {};


app.ViewModel = function() {
    "use strict";

    var self = this;

    self.cafes = ko.observableArray(app.model.locations);
    self.showFilter = ko.observable(true);
    self.buttonClass = ko.observable(false);
    self.currentFilter = ko.observableArray(["hollys", "tomntoms", "angelinus", "coffeesmith"]);

    self.classes = ko.observableArray([{
        class: 'tomntoms'
    }, {
        class: 'hollys'
    }, {
        class: 'angelinus'
    }, {
        class: 'coffeesmith'
    }]);

    //This function made markers bounce when connected list get mouseovered.
    self.focusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.markers[index].setAnimation(google.maps.Animation.BOUNCE);

    };

    //This function made markers unbounce when connected list get mouseout.
    self.unfocusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.markers[index].setAnimation(null);
    };

    self.textSearchPlaces = function() {
        return app.mv.textSearchPlaces();
    };

    self.showListings = function() {
        app.mv.infoWindow.close(); // Deactivate infowindow
        return app.mv.showListings();
    };

    self.hideMarkers = function() {
        return app.mv.hideMarkers(app.mv.markers);
    };

    //This function pop up the infowindow once the lists clicked
    self.openInfoWindow = function(place) {
        var index = self.findMarkerIndex(place);
        // app.mv.markers[index].setAnimation(google.maps.Animation.BOUNCE);
        app.mv.populateInfoWindow(app.mv.markers[index], app.mv.infoWindow, app.model.locations[index]);
    };

    //This function returns the index of corresponding marker.
    self.findMarkerIndex = function(place) {
        return self.cafes.indexOf(place);
    };

    //This function toggles the filter button.
    self.toggleFilter = function() {
        self.showFilter(!self.showFilter());
    };

    //This function get activated when filter button clicked to activate
    // marker control function.
    self.activateFilter = function() {
        self.showCafes();
        return true;
    };

    //This function find duplicated entities in a given array.
    self.eliminateDuplicates = function(arr) {
        var i,
            len = arr.length,
            out = [],
            obj = {};

        for (i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    };

    //This function contorl markers and lists according to filter value.
    self.showCafes = function() {
        var result = [],
            filteredCafes = [];

        //If any filter doesn't get applied,
        if (self.currentFilter().length === 4) {
            app.mv.markers.forEach(function(marker) {
                marker.setVisible(true);
            });
            return self.cafes();
            //If any filter get applied,
        } else if (self.currentFilter().length === 0) {
            app.mv.markers.forEach(function(marker) {
                marker.setVisible(false);
            });
        } else {
            self.currentFilter().forEach(function(filter) {
                for (var i = 0; i < self.cafes().length; i++) {
                    app.mv.markers[i].setVisible(false);
                    var cafe = self.cafes()[i];
                    if (cafe.class === filter) {
                        filteredCafes.push(cafe);
                        result.push(i);
                    }
                }
            });

            self.eliminateDuplicates(result).forEach(function(i) {
                app.mv.markers[i].setVisible(true);
            });

            app.mv.infoWindow.close();

            return filteredCafes;
        }
    };
};