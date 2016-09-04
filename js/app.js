var app = app || {};


app.init = function() {
    "use strict";

    app.model = new app.Model();
    app.vm = new app.ViewModel();
    app.mv = new app.MapView();

    app.model.init();
};


app.errorHandler = function() {
    alert("Sorry, map could not be loaded");
};
