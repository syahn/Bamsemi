var app = app || {};


app.init = function() {
    "use strict";

    app.model = new app.Model();
    app.mv = new app.MapView();
    app.vm = new app.ViewModel();

    app.model.init();
};


app.errorHandler = function() {
    alert("Sorry, map could not be loaded");
};