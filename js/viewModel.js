

var Cafe = function(data) {
    this.class = ko.observable(data.class);
    this.title = ko.observable(data.title);
    this.img = ko.observable(data.img);
    this.contact = ko.observable(data.contact);
    this.location = ko.observable(data.location);
    this.address = ko.observable(data.address);
};


function ViewModel() {
    "use strict";
    // Data
    var self = this;

    self.cafes = ko.observableArray([]);

    for (var i=0; i<locations.length; i++){
        // console.log(cafe);
        self.cafes.push(new Cafe(locations[i]));
    }

}

ko.applyBindings(new ViewModel());
