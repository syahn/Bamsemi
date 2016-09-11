var app = app || {};


app.MapView = function() {
    "use strict";

    var self = this;

    // This function nitialize the map
    self.initMap = function() {
        self.markers = [];
        self.placeMarkers = [];
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 37.566535,
                lng: 126.977969
            }, //default location: Seoul
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
        self.setMarkers(self.map, app.model.locations);

        // Add the search box.
        self.addSearchBox(self.map);

        // Add geolocation icon on the map.
        self.addYourLocationButton(self.map);

        // Initialize the markers on the landing-page.
        self.showListings();

    };


    // This function adds the searchbox.
    self.addSearchBox = function(map) {
        // Create a searchbox in order to execute a places search
        var searchBox = new google.maps.places.SearchBox(
            document.getElementById('places-search'));

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
        self.hideMarkers(self.placeMarkers);

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
            } else {
                window.alert('We did not find any places matching that search!');
            }
        });
    };

    self.createMarkersForPlaces = function(places) {
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            self.placeMarkers.push(new google.maps.Marker({
                map: self.map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        self.map.fitBounds(bounds);
    };

    //This function renders markers.
    self.setMarkers = function(map, cafes) {
        // The following group uses the location array to create an array of markers on initialize.

        cafes.forEach(function(cafe) {
            var cafeClass = cafe.class;
            var cafeLogo = app.model.logos[cafeClass];

            cafe.marker.setPosition(new google.maps.LatLng(cafe.lat, cafe.lng));
            cafe.marker.setTitle(cafe.name);
            cafe.marker.setIcon(self.makeMarkerIcon(cafeLogo));
            cafe.marker.setAnimation(google.maps.Animation.DROP);
            cafe.marker.setVisible(true);
            cafe.marker.setDraggable(false);

            // Push the marker to our array of markers.
            self.markers.push(cafe.marker);

            // Create an onclick event to open an infowindow at each marker.
            cafe.marker.addListener('mousedown', function() {
                self.populateInfoWindow(this, self.infoWindow, cafe);
            });

            cafe.marker.addListener('mouseup', function() {
                this.setAnimation(google.maps.Animation.BOUNCE);
            });

            cafe.marker.addListener('mouseout', function() {
                this.setAnimation(null);
            });
        });

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
    self.populateInfoWindow = function(marker, infowindow, cafe) {
        console.log(cafe);
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== marker) {
            infowindow.marker = marker;

            this.urlFoursquare = "https://api.foursquare.com/v2/venues/explore";
            this.urlFoursquare += '?' + $.param({
                'client_id': 'T51K4CHANN5MBOX5DA2ANBWHRUS54LYEKTQY2KO3U4GSRFDP',
                'client_secret': 'SXWDCUMXYS2EDYVYHSTXWCVLOAGW0MWQTX4WBAO2F2KVNQ5C',
                'll': marker.position.toUrlValue(),
                'v': '20140806'
            });

            $.ajax({
                url: this.urlFoursquare,
                dataType: "json"
            }).done(function(data) {
                var element = data.response.groups[0].items[0];
                var venue = element.venue.name;
                var tip = element.tips[0].text;
                var url = element.tips[0].canonicalUrl;

                infowindow.setContent('<div><strong>' + cafe.name + '</strong></div><p>' + cafe.time + '</p><div><p>' + cafe.address + '</p>' + cafe.contact + '</div>' +
                    '<div><hr><span>Nearby hot place by</span><img src="image/logo_foursquare.png" alt="Oops!"><br><span><strong>' + venue +
                    '</strong></span><p>' + tip + '</p><a href="' + url + '">Link</a></div>');

                infowindow.open(self.map, marker);
            }).fail(function() {
                alert("Somethings went wrong. Please, reload it.");
            });

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });

            // Deactivate infowindow when show listing button get clicked.
            document.getElementById('show-listings').addEventListener('click', function() {
                infowindow.close();
            });
        }
    };

    // This function will loop through the markers array and display them all.
    self.showListings = function() {
        // Close infowindow which is already opened.
        self.infoWindow.marker = null;

        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker

        self.markers.forEach(function(marker) {
            marker.setMap(self.map);
            bounds.extend(marker.position);
        });
        self.map.fitBounds(bounds);
    };

    // This function will loop through the listings and hide them all.
    self.hideMarkers = function(markers) {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
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

        // google.maps.event.addListener(self.map, 'dragend', function() {
        //     $('#you_location_img').css('background-position', '0px 0px');
        // });

        firstChild.addEventListener('click', function() {
            var imgX = '0';
            var animationInterval = setInterval(function() {
                if (imgX == '-18') imgX = '0';
                else imgX = '-18';
                document.getElementById('you_location_img').style['background-position'] = imgX + 'px 0px';
            }, 500);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.map.setCenter(latlng);
                    self.map.setZoom(15);
                    clearInterval(animationInterval);
                    document.getElementById('you_location_img').style['background-position'] = '-144px 0px';
                });
            } else {
                clearInterval(animationInterval);
                document.getElementById('you_location_img').style['background-position'] = '0px 0px';
            }
        });

        controlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
    };
};