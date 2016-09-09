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

    //This function pop up the infowindow once the lists clicked
    self.openInfoWindow = function(place) {
        var index = self.findMarkerIndex(place);
        app.mv.populateInfoWindow(app.mv.markers[index], app.mv.infoWindow);
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
    self.activateFilter = function(){
        self.showCafes();
        return true;
    };

    //This function find duplicated entities in a given array.
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

    //This function contorl markers and lists according to filter value.
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
