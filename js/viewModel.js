var Cafe = function(data) {
    this.class = ko.observable(data.class);
    this.title = ko.observable(data.title);
    this.img = ko.observable(data.img);
    this.contact = ko.observable(data.contact);
    this.location = ko.observable(data.location);
    this.address = ko.observable(data.address);
};


function ViewModel() {
    var self = this;

    self.cafes = ko.observableArray([]);

    for (var i=0; i<locations.length; i++){
        self.cafes.push(new Cafe(locations[i]));
    }

    self.focusList = function(place) {
        var index = self.cafes.indexOf(place);
        markers[index].setAnimation(google.maps.Animation.BOUNCE);
    };

    self.unfocusList = function(place) {
        var index = self.cafes.indexOf(place);
        markers[index].setAnimation(null);
    };

    self.openInfoWindow = function(place) {
        var index = self.cafes.indexOf(place);
        populateInfoWindow(markers[index], infoWindow);
    };
}
