var app = app || {};


app.ViewModel = function() {
    var self = this;

    self.Cafe = function(data) {
        this.index = ko.observable(data.index);
        this.class = ko.observable(data.class);
        this.title = ko.observable(data.title);
        this.img = ko.observable(data.img);
        this.contact = ko.observable(data.contact);
        this.location = ko.observable(data.location);
        this.address = ko.observable(data.address);
        this.visible = ko.observable(true);
    };

    self.allCafes = ko.observableArray([]);
    self.selectedCafe = ko.observableArray([]);
    self.currentCafeTitle = ko.observable();

    app.locations.forEach(function(cafe){
        self.allCafes.push(new self.Cafe(cafe));
    });

    self.focusList = function(place) {
        console.log(app.markers);
        var index = self.findMarkerIndex(place);
        console.log(index);
        app.markers[index].setAnimation(google.maps.Animation.BOUNCE);
    };

    self.unfocusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.markers[index].setAnimation(null);
    };

    self.openInfoWindow = function(place) {
        var index = self.findMarkerIndex(place);
        app.populateInfoWindow(app.markers[index], app.infoWindow);
    };

    self.findMarkerIndex = function(place) {
        return self.allCafes.indexOf(place);
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
