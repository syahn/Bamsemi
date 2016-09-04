var app = app || {};


app.ViewModel = function() {
    var self = this;


    self.cafes = ko.observableArray(app.model.locations);


    self.focusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.markers[index].setAnimation(google.maps.Animation.BOUNCE);
    };

    self.unfocusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.markers[index].setAnimation(null);
    };

    self.openInfoWindow = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.populateInfoWindow(app.markers[index], app.infoWindow);
    };

    self.findMarkerIndex = function(place) {
        return self.cafes.indexOf(place);
    };

    self.disableList = function(){
        for (var i=0; i < self.allCafes().length ; i++){
            self.allCafes()[i].visible(null);
        }
    };

    self.selectMarker = function(marker){
        var index = marker.index;
        self.disableList();
    };
};
