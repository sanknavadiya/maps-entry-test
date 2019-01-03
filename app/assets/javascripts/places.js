function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });

  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'place_id', 'opening_hours']);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    $('#mapDiv').show('slow');
    $('#actions').show('slow');

    var place = autocomplete.getPlace();
      
    infowindow.close();
    marker.setVisible(false);
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      var addressComponents = place.address_components;
      var street            = "";
      var number            = "";
      var city            = "";
      for (var i = 0, i_len = addressComponents.length; i < i_len; i++) {
        var addressType = addressComponents[i].types[0];
        switch(addressType) {
          case "route":
            street = addressComponents[i]["long_name"];
            break;
          case "street_number":
            number = addressComponents[i]["long_name"];
            break;
          case "administrative_area_level_2":
            city = addressComponents[i]["short_name"];
            break;
        }
      }
      // fill_the_form 
      $("#place_place_id").val(place.place_id);
      $("#place_place_name").val(place["name"]);
      $("#place_street").val(street);
      $("#place_street_no").val(number);
      $("#place_city").val(city);
      $("#place_open_hours").val(place["opening_hours"]["weekday_text"]);
      console.log(place["opening_hours"]["weekday_text"])
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  
})
}

// reset the form
$(document).on('click', '#retry', function(event) {
  $('#pac-input').val('');
  $('#mapDiv').hide('slow');
  $('#actions').hide('slow');
  $("form")[0].reset();
});

//validate the form
function validateForm(){
  if ($("#place_place_id").val()) {
    return true;
  }
  else{
    alert("Please Select a place")
    $("#yes").removeAttr('disabled');
    return false;
    }
}