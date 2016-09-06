var app = app || {};


app.ViewModel = function() {
    var self = this;

    self.cafes = ko.observableArray(app.model.locations);
    self.showFilter = ko.observable(true);
    self.currentFilter = ko.observableArray(["hollys","tomntoms","coffeesmith","individual"]);
    self.filteredCafes = ko.observableArray();

    self.classes = ko.observableArray([
        {class: 'hollys'},
        {class: 'tomntoms'},
        {class: 'coffeesmith'},
        {class: 'individual'}]);

    self.focusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.markers[index].setAnimation(google.maps.Animation.BOUNCE);
    };

    self.unfocusList = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.markers[index].setAnimation(null);
    };

    self.openInfoWindow = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.populateInfoWindow(app.mv.markers[index], app.mv.infoWindow);
    };

    self.findMarkerIndex = function(place) {
        return self.cafes.indexOf(place);
    };

    self.toggleFilter = function() {
        self.showFilter(!self.showFilter());
    };

    self.activateFilter = function(){
        self.showCafes();
        return true;
    };

    self.showCafes = function(){
        var result = [];

        if (self.currentFilter().length === 4){
            app.mv.markers.forEach(function(marker){
                marker.setVisible(true);
            });
            return self.cafes();
        } else {
            console.log(self.currentFilter());
            self.currentFilter().forEach(function(filter){
                console.log(filter);
                for (var i = 0; i < self.cafes().length; i++){
                    app.mv.markers[i].setVisible(false);
                    var cafe = self.cafes()[i];
                    if (cafe.class === filter){
                        self.filteredCafes.push(cafe);
                        result.push(i);
                    }
                }
            });

            result.forEach(function(i){
                app.mv.markers[i].setVisible(true);
            });

            return self.filteredCafes();
        }


    };
};
