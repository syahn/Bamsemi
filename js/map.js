var app = app || {};


app.MapView = function(){
    "use strict";

    var self = this;

    // This function nitialize the map
    self.initMap = function() {
        self.markers = [];
        self.placeMarkers = [];
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 37.566535, lng: 126.977969}, //default location: Seoul
            zoom: 12,
            mapTypeControl: false,
            streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
            }

        });

        // Initiate infoWindow object.
        self.infoWindow = new google.maps.InfoWindow();

        // Activate markers and infowindow.
        self.setMarkers(self.map);

        // Add the search box.
        self.addSearchBox(self.map);

        // Add geolocation icon on the map.
        self.addYourLocationButton(self.map);

        // Initialize the markers on the landing-page.
        self.showListings();

        // Listen for the event fired when the user selects a prediction and clicks
        // "go" more details for that place.
        document.getElementById('go-places').addEventListener('click', self.textSearchPlaces);
        document.getElementById('show-listings').addEventListener('click', self.showListings);
        document.getElementById('hide-listings').addEventListener('click', function() {
            self.hideMarkers(self.markers);
        });
    };


    // This function adds the searchbox.
    self.addSearchBox = function(map) {
        // Create a searchbox in order to execute a places search
        var searchBox = new google.maps.places.SearchBox(
            document.getElementById('places-search'));

        // Bias the searchbox to within the bounds of the map.
        searchBox.setBounds(map.getBounds());

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(this.getBounds());
        });

        // Listen for the event fired when the user selects a prediction from the
        // picklist and retrieve more details for that place.
        searchBox.addListener('places_changed', function() {
            self.searchBoxPlaces(this);
        });
    };

    // This function fires when the user selects a searchbox picklist item.
    // It will do a nearby search using the selected query string or place.
    self.searchBoxPlaces = function(searchBox) {
        self.hideMarkers(placeMarkers);
        var places = searchBox.getPlaces();
        if (places.length === 0) {
            window.alert('We did not find any places matching that search!');
        } else {
            // For each place, get the icon, name and location.
            self.createMarkersForPlaces(places);
        }
    };

    // This function firest when the user select "go" on the places search.
    // It will do a nearby search using the entered query string or place.
    self.textSearchPlaces = function() {
        var bounds = self.map.getBounds();

        var placesService = new google.maps.places.PlacesService(self.map);

        placesService.textSearch({
            query: document.getElementById('places-search').value,
            bounds: bounds

        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                self.createMarkersForPlaces(results);
            }
        });
    };

    // This function populates markers when searbox value returned.
    self.createMarkersForPlaces = function(places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            var icon = {
                url: place.icon,
                size: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                id: place.place_id
            });

            self.placeMarkers.push(marker);
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        }
        self.map.fitBounds(bounds);
    };


    //This function renders markers.
    self.setMarkers = function(map) {
        // The following group uses the location array to create an array of markers on initialize.

        var cafes = app.model.locations;
        for (var i = 0; i < cafes.length; i++){

            // Get the information from the location array.
            var position = new google.maps.LatLng(cafes[i].lat, cafes[i].lng);
            var name = cafes[i].name;
            var contact = cafes[i].contact;
            var img = cafes[i].img;
            var address = cafes[i].address;
            var cafeClass = cafes[i].class;
            var cafeLogo = app.model.logos[cafeClass];
            var defaultIcon = self.makeMarkerIcon(cafeLogo);

            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: name,
                icon: defaultIcon,
                animation: google.maps.Animation.DROP,
                contact: contact,
                address: address,
                img: img
            });
            // Push the marker to our array of markers.
            self.markers.push(marker);

            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                self.populateInfoWindow(this, self.infoWindow);
            });

            marker.addListener('mouseover', function() {
                this.setAnimation(google.maps.Animation.BOUNCE);
            });

            marker.addListener('mouseout', function() {
                this.setAnimation(null);
            });


        }
    };

    // This function renders default marker icon accoring to cafe class
    self.makeMarkerIcon = function(logo) {
        var markerImage = new google.maps.MarkerImage(
            logo,
            new google.maps.Size(32, 32),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(32, 32));
        return markerImage;
    };

    // This function populates the infowindow when the marker is clicked.
    self.populateInfoWindow = function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;

            // Request Foursquare information first.
            var $titleElem = $('#titleFourSquare');
            var $tipElem = $('#tipFourSquare');
            var $urlElem = $('#urlFourSquare');

            this.urlFoursquare = "https://api.foursquare.com/v2/venues/explore";
            this.urlFoursquare += '?' + $.param({
                'client_id': 'T51K4CHANN5MBOX5DA2ANBWHRUS54LYEKTQY2KO3U4GSRFDP',
                'client_secret': 'SXWDCUMXYS2EDYVYHSTXWCVLOAGW0MWQTX4WBAO2F2KVNQ5C',
                'll': marker.position.toUrlValue(),
                'v': '20140806'
            });

            $.ajax({
                url: this.urlFoursquare,
                dataType: 'json',
                success: function(data) {
                    var element = data.response.groups[0].items[0];
                    var venue = element.venue.name;
                    var tip = element.tips[0].text;
                    var url = element.tips[0].canonicalUrl;

                    infowindow.setContent('<div><strong>' + marker.title + '</strong></div><div>' + marker.contact + '</div>' +
                        '<img id="image-marker" src="' + marker.img + '"><div><hr><span>Nearby hot place by</span><img src="image/logo_foursquare.png" alt="Oops!"><br><span><strong>' + venue +
                        '</strong></span><p>' + tip + '</p><a href="' + url + '">Link</a></div>');

                    $titleElem.html(venue);
                    $tipElem.text = tip;
                    $tipElem.attr("href", url);

                    infowindow.open(self.map, marker);
                }
            }).fail(function() {
                alert("Somethings went wrong. Please, reload it.");
            });

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });

            // Deactivate infowindow when show listing button get clicked.
            document.getElementById('show-listings').addEventListener('click', function(){
                infowindow.close();
            });
        }
    };

    // This function will loop through the markers array and display them all.
    self.showListings =function() {
        // Close infowindow which is already opened.
        self.infoWindow.marker = null;

        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(self.map);
            bounds.extend(self.markers[i].position);
        }
        self.map.fitBounds(bounds);
    };

    // This function will loop through the listings and hide them all.
    self.hideMarkers = function(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };


    //This function activate button to find user's location
    self.addYourLocationButton = function(map) {
        var controlDiv = document.createElement('div');

        var firstChild = document.createElement('button');
        firstChild.style.backgroundColor = '#fff';
        firstChild.style.border = 'none';
        firstChild.style.outline = 'none';
        firstChild.style.width = '28px';
        firstChild.style.height = '28px';
        firstChild.style.borderRadius = '2px';
        firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        firstChild.style.cursor = 'pointer';
        firstChild.style.margin = '15px 0 0 10px';
        firstChild.style.padding = '0px';
        firstChild.title = 'Your Location';
        controlDiv.appendChild(firstChild);

        var secondChild = document.createElement('div');
        secondChild.style.margin = '5px';
        secondChild.style.width = '18px';
        secondChild.style.height = '18px';
        secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
        secondChild.style.backgroundSize = '180px 18px';
        secondChild.style.backgroundPosition = '0px 0px';
        secondChild.style.backgroundRepeat = 'no-repeat';
        secondChild.id = 'you_location_img';
        firstChild.appendChild(secondChild);

        google.maps.event.addListener(self.map, 'dragend', function() {
            $('#you_location_img').css('background-position', '0px 0px');
        });

        firstChild.addEventListener('click', function() {
            var imgX = '0';
            var animationInterval = setInterval(function() {
                if (imgX == '-18') imgX = '0';
                else imgX = '-18';
                $('#you_location_img').css('background-position', imgX + 'px 0px');
            }, 500);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.map.setCenter(latlng);
                    self.map.setZoom(15);
                    clearInterval(animationInterval);
                    $('#you_location_img').css('background-position', '-144px 0px');
                });
            } else {
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '0px 0px');
            }
        });

        controlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
    };
};
