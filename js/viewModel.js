var app = app || {};


app.ViewModel = function() {
    var self = this;

    self.cafes = ko.observableArray(app.model.locations);
    self.showFilter = ko.observable(true);
    self.buttonClass = ko.observable(false);
    self.currentFilter = ko.observableArray(["hollys","tomntoms","angelinus","coffeesmith"]);

    self.classes = ko.observableArray([
        {class: 'hollys'},
        {class: 'tomntoms'},
        {class: 'angelinus'},
        {class: 'coffeesmith'}]);

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
        // infowindow.close();

        self.showCafes();


        return true;
    };

    self.changeClass = function(){
        self.buttonClass(!self.buttonClass());
    };

    self.eliminateDuplicates = function(arr) {
      var i,
          len=arr.length,
          out=[],
          obj={};

      for (i=0;i<len;i++) {
        obj[arr[i]]=0;
      }
      for (i in obj) {
        out.push(i);
      }
      return out;
    };

    self.showCafes = function(){
        var result = [],
            filteredCafes = [];

        if (self.currentFilter().length === 4){
            app.mv.markers.forEach(function(marker){
                marker.setVisible(true);
            });
            return self.cafes();
        } else {
            self.currentFilter().forEach(function(filter){
                for (var i = 0; i < self.cafes().length; i++){
                    app.mv.markers[i].setVisible(false);
                    var cafe = self.cafes()[i];
                    if (cafe.class === filter){
                        filteredCafes.push(cafe);
                        result.push(i);
                    }
                }
            });

            self.eliminateDuplicates(result).forEach(function(i){
                app.mv.markers[i].setVisible(true);
            });

            app.mv.infoWindow.close();

            return filteredCafes;
        }


    };
};
