var Cafe = function(data) {
    this.index = ko.observable(data.index);
    this.class = ko.observable(data.class);
    this.title = ko.observable(data.title);
    this.img = ko.observable(data.img);
    this.contact = ko.observable(data.contact);
    this.location = ko.observable(data.location);
    this.address = ko.observable(data.address);
    this.visible = ko.observable(true);
};


function ViewModel() {

    var self = this;

    self.allCafes = ko.observableArray([]);
    // self.allCafes.extend({ notify: 'always' });
    self.selectedCafe = ko.observableArray([]);

    // self.currentCafe= ko.observable();
    self.currentCafeTitle = ko.observable();
    // self.currentCafeImg = ko.observable();
    // self.currentCafeAddress = ko.observable();
    // self.currentCafeContact = ko.observable();

    for (var i=0; i<locations.length; i++){
        self.allCafes.push(new Cafe(locations[i]));
    }

    self.focusList = function(place) {
        var index = self.findMarkerIndex(place);
        markers[index].setAnimation(google.maps.Animation.BOUNCE);
    };

    self.unfocusList = function(place) {
        var index = self.findMarkerIndex(place);
        markers[index].setAnimation(null);
    };

    self.openInfoWindow = function(place) {
        var index = self.findMarkerIndex(place);
        populateInfoWindow(markers[index], infoWindow);
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
        // self.allCafes()[index].visible(true);
        //
        // self.currentCafeTitle(marker.title);
        // console.log();
        // for ( var i = 0)
        // if (self.currentCafeTitle() === )
        // self.selectedCafe.push();
        // console.log(self.currentCafeTi);


        // self.currentCafeImg(marker.img);
        // self.currentCafeAddress(marker.address);
        // console.log(marker.address);
        // console.log(marker.contact);
        // self.currentCafeContact(marker.contact);
        // self.currentCafeTitle(marker.title);
        // //
        // $(".item").remove();
        // $(".options-box").append('<div class="item"></div>');
        // $(".item").append('<a href="#" class="item-title" data-bind="event: { mouseover: focusList, mouseout: unfocusList}, click: openInfoWindow">' + self.currentCafeTitle()+'</a><hr>');
        // $(".item").append('<div class="item-content"><div class="item-text"></div><img class="item-img" src="' + self.currentCafeImg() + '" alt="Undefined"></div>');
        // $(".item-text").append('<span class="item-address">' + self.currentCafeAddress() + '</span>');
        // $(".item-text").append('<span class="item-contact">' + self.currentCafeContact() + '</span>');
    };




}

var vm = new ViewModel();
