var app = app || {};


app.init = function() {
    "use strict";

    app.mv = new app.MapView();
    app.mv.initMap();
    ko.applyBindings( new app.ViewModel() );
};


app.errorHandler = function() {
    alert("Sorry, map could not be loaded");
};
