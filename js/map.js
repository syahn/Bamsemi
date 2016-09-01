var map;
var markers = [];

// Markers queried
var placeMarkers = [];

function initMap(){
    // "use strict";

    // Constructor creates a new map - only center and zoom are required.
    var pyrmont = {lat: 37.566535, lng: 126.977969};
    // var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12,
        mapTypeControl: false
    });

    // Initiate infoWindow object as global scope
    infoWindow = new google.maps.InfoWindow();

    setMarkers(map, infoWindow);
    addYourLocationButton(map);

    // Initialize the markers on the landing-page
    showListings();


    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
        searchBoxPlaces(this);
    });


    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', function() {
        hideMarkers(markers);
    });

    ko.applyBindings( new ViewModel() );
}


//This function activate button to find user's location
function addYourLocationButton(map) {
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
    firstChild.style.marginRight = '10px';
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

    google.maps.event.addListener(map, 'dragend', function() {
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
                map.setCenter(latlng);
                map.setZoom(15);
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
}

// Style the markers a bit. This will be our listing marker icon.
function setMarkers(map, infowindow) {

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the information from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var contact = locations[i].contact;
        var img = locations[i].img;
        var address = locations[i].address;

        var cafeClass = locations[i].class;
        var cafeLogo = logos[cafeClass];

        var defaultIcon = makeMarkerIcon(cafeLogo);

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            contact: contact,
            address: address,
            img: img,
            id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, infowindow);
            vm.selectMarker(this);
        });
        marker.addListener('mouseover', function() {
            this.setAnimation(google.maps.Animation.BOUNCE);
        });
        marker.addListener('mouseout', function() {
            this.setAnimation(null);
        });
    }
}



// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div><strong>' + marker.title + '</strong></div><div>' + marker.contact + '</div>' + '<img id="image-marker" src="' + marker.img + '">');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

    }
}


// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function makeMarkerIcon(logo) {
    var markerImage = new google.maps.MarkerImage(
        logo,
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(32, 32));
    return markerImage;
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

// This function fires when the user selects a searchbox picklist item.
// It will do a nearby search using the selected query string or place.
function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    if (places.length === 0) {
        window.alert('We did not find any places matching that search!');
    } else {
        // For each place, get the icon, name and location.
        createMarkersForPlaces(places);
    }
}

// This function firest when the user select "go" on the places search.
// It will do a nearby search using the entered query string or place.
function textSearchPlaces() {
    var bounds = map.getBounds();
    // hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: document.getElementById('places-search').value,
        bounds: bounds

    }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
        }
    });
}


function createMarkersForPlaces(places) {
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
        // Create a single infowindow to be used with the place details information
        // so that only one is open at once.
        // var placeInfoWindow = new google.maps.InfoWindow();
        // // If a marker is clicked, do a place details search on it in the next function.
        // marker.addListener('click', function() {
        //     if (placeInfoWindow.marker == this) {
        //         console.log("This infowindow already is on this marker!");
        //     } else {
        //         getPlacesDetails(this, placeInfoWindow);
        //     }
        // });
        placeMarkers.push(marker);
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}
//
// function codeAddress() {
//     var address = document.getElementById('places-search').value;
//     geocoder.geocode( { 'address': address}, function(results, status) {
//       if (status == 'OK') {
//           return results[0].geometry.location;
//         // map.setCenter(results[0].geometry.location);
//         // var marker = new google.maps.Marker({
//         //     map: map,
//         //     position: results[0].geometry.location
//         // });
//       } else {
//         alert('Geocode was not successful for the following reason: ' + status);
//       }
//     });
//   }
